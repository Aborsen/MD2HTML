---
title: "Converting Documents with an API: What Makes One Usable"
description: What a document conversion API needs before a script can trust it: an honest request body, real errors, published limits, and a document you can fetch back
date: 2026-08-13
tag: Automation
keywords: document conversion api, markdown to html api, convert documents rest api, file conversion api, api request body file upload, idempotency file conversion, serverless request size limit
---

A conversion that happens in a browser tab is a conversion one person did once. The interesting version is the one that happens on every merge, for every release, for four hundred files at two in the morning, with nobody watching. That version is a request, and requests fail in ways a page never does.

### TL;DR

A document conversion API is usable when four things are true: the request body is the document rather than a wrapper around a wrapper, a broken file comes back as a status code and a sentence a person can read, the limits are published rather than discovered in production, and the result has a URL you can fetch again tomorrow. Send the raw file as the body when the conversion is named in the path or the query, and keep a JSON envelope for the one case where the body would otherwise be ambiguous. Plan for the request-size ceiling before a 6 MB file finds it for you — on a serverless platform that ceiling is around 4.5 MB, and it is enforced above your code, so the error is not yours to word.

The friction is rarely the conversion itself. Parsing Markdown and emitting HTML is a solved problem with half a dozen good libraries behind it. What breaks is everything around the parse: a build step that posts a file and gets back a 200 with an empty body, a nightly job that silently truncates at whatever size the platform happens to refuse, a retry that turns one document into three because the first attempt timed out after it had already succeeded.

The failures have a shape. A client cannot tell a 500 from a 413 if the platform answers before your handler runs. A client cannot tell "your file is not valid JSON" from "our storage is down" if both arrive as the same flat error string. And a client cannot behave well against limits it has to infer from a series of refusals, which is what "contact us for details" means in practice.

So this piece is about the contract rather than the parser. Where a worked example helps, it uses our own `/api/v1`, because it is the one whose source and refusal messages I can quote exactly rather than guess at.

## The request body question, shape by shape

### Quick comparison: the cheat sheet

Every conversion API answers one question first — where does the file go? The seven answers below are the whole space, and the choice decides how large a document can be, how good your error messages can be, and how much code the caller writes before anything converts.

| Shape | The body looks like | Best for | Where it breaks |
| --- | --- | --- | --- |
| Raw file as the body | The file, byte for byte, with `Content-Type` naming it | A named conversion: one file in, one document out | Metadata has nowhere to go but the query string |
| JSON envelope | `{"name": "…", "markdown": "…"}` | Callers with several fields to send | The document has to be escaped into a JSON string; the body is ambiguous when the document is itself JSON |
| `multipart/form-data` | A file part plus text parts | Browser forms, several files at once | Every client needs a multipart encoder; parsing costs memory on the server |
| Base64 inside JSON | `{"file": "PGh0bWw+…"}` | Binary formats through JSON-only clients | Roughly a third larger on the wire, against a fixed body ceiling |
| A URL for the server to fetch | `{"url": "https://…"}` | Documents already on the network | The server becomes an HTTP client pointed at whatever you name, which is a request-forgery hazard |
| Direct upload, then a reference | `{"blob": "uploads/ab12…"}` | Files past the request ceiling | Two round trips, a signed URL to mint, and orphaned uploads to sweep |
| A batch array | `{"documents": [ … ]}` | Hundreds of small files | One bad file in the array forces a partial-failure response shape nobody enjoys writing |

Nothing here is wrong in the abstract. The mistake is picking two of them for the same endpoint and letting the content type decide which, without saying so — a caller posting a `.json` file for conversion, with the honest `Content-Type: application/json`, then gets read as an envelope, found to have no document field in it, and refused for a reason that makes no sense from the outside.

### The raw file as the body

The document is the body. Nothing wraps it, nothing escapes it, and `curl --data-binary @file.md` is the whole client. The name and the options travel in the query string, where they are visible in a log line and easy to change by hand.

| Pros | Cons |
| --- | --- |
| No escaping: a file with backticks, quotes and CRLF lines arrives unchanged | Metadata has to live in the query string, which has its own length limits |
| The smallest possible body, which matters against a fixed ceiling | Only one file per request |
| Debuggable by a person with `curl` and no SDK | The server must not guess the format from the bytes and be wrong |

**Who it is for.** Any caller whose conversion is already named — by the route, or by a query parameter such as `?kind=html-to-markdown`. If the endpoint knows what the body is meant to be, the body has no reason to explain itself.

Ours takes this shape first. `POST /api/v1/documents` reads the request body as the source, takes the file name from `?name=`, and takes the conversion from `?kind=`, which accepts `html-to-markdown`, `csv-to-markdown` and `json-to-markdown`; with no `kind` at all the body is Markdown, which is what every document was before there was more than one conversion.

```bash
curl -fsS \
  -H "Authorization: Bearer $TP_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-binary @README.md \
  "https://transformpipe.com/api/v1/documents?name=README.md&share=link"
```

### The JSON envelope

The document becomes a string field inside an object. This is the shape most API clients reach for by default, because it is the shape everything else in their codebase already uses.

| Pros | Cons |
| --- | --- |
| Several fields without touching the query string | The document must be escaped and re-escaped through every layer |
| One familiar content type for the whole API | A JSON document as the payload collides with the envelope |
| Easy to extend without a breaking change | Larger on the wire once newlines become `\n` |

**Who it is for.** Callers sending more than a file — a name, a title, a theme, a destination — and generating the request from a typed client rather than a shell.

The collision is worth naming, because it is the bug we shipped and then fixed. The envelope was recognised by content type, so posting a JSON file for conversion with `Content-Type: application/json` was read as an envelope, found to contain no `markdown` field, and refused. The rule that fixed it is a rule worth copying: a named conversion owns the body. Only the default conversion reads an envelope, and any request that names what it is converting has its body treated as the source file whatever the content type claims.

### `multipart/form-data`

The shape a browser form produces without help, and therefore the shape a conversion service with a web front end tends to expose.

| Pros | Cons |
| --- | --- |
| Files and fields together, with no escaping | Every non-browser client needs an encoder |
| Several files in one request | Streaming parsers are fiddly; buffering ones are memory-hungry |
| Content type and filename arrive per part | Hard to reproduce by hand when you are debugging at 2am |

**Who it is for.** Endpoints called directly by a page, and clients that genuinely have several files per request. For a scripted single-file conversion it is ceremony with no payoff.

### Base64 inside JSON

The escape hatch for binary formats when the client can only speak JSON. A `.docx` is a zip archive, so it cannot go into a JSON string as text at all — base64 is how it goes anyway.

| Pros | Cons |
| --- | --- |
| Binary through a JSON-only client | Encoding inflates the payload by about a third |
| One content type across text and binary formats | The ceiling arrives sooner: a 3.3 MB file makes a 4.4 MB body |
| Trivial to log and diff, if you like enormous logs | The client cannot tell decoding failures from conversion failures without a good error |

**Who it is for.** Binary inputs that must cross a JSON-only boundary, with a size limit set low enough that the inflation cannot bite.

### A URL for the server to fetch

The caller sends an address; the server downloads the document and converts it. Tempting, and the shape with the sharpest edge on it.

| Pros | Cons |
| --- | --- |
| No upload at all for documents already on the web | The server becomes an HTTP client aimed wherever the caller says |
| Sidesteps the request-body ceiling entirely | Server-side request forgery, unless the fetch is restricted hard |
| Convenient for public READMEs and published pages | Failures multiply: DNS, TLS, redirects, 404s, timeouts, and the conversion itself |

**Who it is for.** Services that need it enough to do the work: an allowlist or a blocklist covering private address ranges, a redirect cap, a byte cap, a timeout, and errors that distinguish "could not fetch" from "could not convert". Anything less is a hole in your network with a JSON interface.

### Direct upload, then a reference

The client asks for a short-lived upload URL, puts the file straight into object storage, and posts the resulting key. The document never travels through the API function.

| Pros | Cons |
| --- | --- |
| The request-body ceiling stops applying | Two round trips and a token-minting endpoint |
| Big files stop being a special case | Uploads with no follow-up request need sweeping |
| Reads can redirect to a signed URL, so responses stay small | More moving parts to get wrong, and more to explain |

**Who it is for.** Any service whose documents routinely pass the platform's body limit. It is the honest answer to "raise the limit" — and it is a change to how documents move, not a bigger number, which is why our own cap sits where the platform put it until that work is done.

### A batch array

Many documents, one request. Attractive against a per-minute rate limit and awkward everywhere else.

| Pros | Cons |
| --- | --- |
| Hundreds of small files without hundreds of requests | Partial failure needs a response shape, and clients must handle it |
| One authentication and one rate-limit slot | The whole batch shares one body ceiling |
| Fewer round trips on a slow link | A long batch flirts with the function timeout |

**Who it is for.** Callers with many small documents and the patience to handle a per-item result array. The alternative, when the documents belong together anyway, is to merge them into one document before posting — [which has its own problems, mostly heading levels and anchor collisions](/blog/merging-many-markdown-files), but it produces one thing a reader can actually read.

## Errors and limits a client should not have to discover

Two tables decide whether a caller can automate against you. The first is what your refusals mean. The second is what your ceilings are. Both belong in documentation, and neither should have to be reverse-engineered from a run of failures in someone's CI log.

An error is useful when it carries three things: a status code that means what the specification says it means, a message a person can act on, and a body shape that is the same every time. A message is not a courtesy. It is the difference between a build failure somebody fixes in a minute and one they escalate.

Here is the full set from our own endpoints, which is small on purpose:

| Status | When | What the body says |
| --- | --- | --- |
| 201 | The document was created | The document, with its id, size, word count and share URL |
| 400 | An unknown `kind`, an empty body, a `share` value that is not `link` or `people`, a CSV with no rows, invalid JSON | The parser's own message, including where it stopped |
| 400 | `kind=word-to-markdown` | Refused by name, with the page that does it in the browser |
| 401 | No credential, or one that is unknown or revoked | Two different sentences, depending on whether an `Authorization` header was sent at all |
| 403 | The account is out of room, or the grant is read-only | Which limit, and what you are using against it |
| 404 | Somebody else's document, or an id that is not a UUID | `Not found`, for both, deliberately |
| 410 | The row exists and its source does not | The source of this document is missing |
| 413 | One document over the per-document cap | The size of the document and the size of the limit |
| 429 | More than 60 requests in a minute | The limit, the seconds to wait, and a `Retry-After` header |
| 502 | The document store could not be reached | That it is ours, and the underlying reason |

Three of those rows exist because of a specific failure worth copying. A malformed id used to reach Postgres, which rejected it, which surfaced as a 500 — so ids are shape-checked and a bad one is simply not found. A missing stored file and an unreachable store used to arrive as the same bare 500; splitting them into 410 and 502 tells the caller whether to give up on that document or retry the request. And returning `Not found` for both "no such document" and "not yours" is not laziness: the alternative confirms the existence of other people's documents to anybody with a UUID generator.

The limits are the second half of the contract:

| Limit | Value | Why it is that number |
| --- | --- | --- |
| Per conversion | 10 MB | The conversion runs in the browser, so this is a judgement about the machine in front of the person, not a platform rule |
| Per kept document | 4 MB | The platform refuses a request or a response body over 4.5 MB; 4 MB leaves room for the name and the JSON around it |
| Per account | 100 MB and 500 documents | A thousand tiny files cost real rows, so both are capped |
| Per caller | 60 requests a minute | Counted per credential, so one runaway script cannot spend a browser session's allowance |

Two properties of that table matter more than the numbers. First, each ceiling names the thing that imposes it, which is how a caller knows whether asking nicely would help. Second, reaching a limit is a refusal rather than a quiet eviction. This app used to delete the oldest document to stay under its cap, which destroyed something its owner had deliberately kept; a refusal that says what to delete instead is worse to receive and better to have received.

## Authentication, and what a key must not reach

A conversion API needs a credential for one reason above all others: the documents are somebody's. Rate limiting, quotas and abuse handling all follow from knowing whose they are.

The bearer key is the baseline, and there are five properties to get right.

**A recognisable prefix.** Ours start with `tp_live_`, which means the server can tell its own key from somebody else's token without a database lookup, and secret scanners can spot one in a commit. A random opaque string does neither.

**Hashed at rest, shown once.** The key is displayed at creation and stored only as a hash. If it can be read back out of an account page, it can be read out of a support ticket, a screenshot and a backup.

**Revocable in one action.** A key you cannot kill in ten seconds is a key you will not rotate.

**Narrower than the account.** A key of ours reaches documents and shares, and never the account, the sign-in or the keys themselves. That is the property that makes a leak survivable: a stolen key cannot mint its replacement or lock the owner out.

**Enforced on the credential, not on one door.** This is the one that bit us. A read-only grant from a connected assistant — the kind of token [an assistant's connector collects when it signs in](/blog/converting-documents-from-an-assistant), rather than a key anybody pasted — was checked in the tool dispatcher rather than on the credential, so the promise on the consent page — that it cannot save, share or delete — was true of the tools and false of the API those tools call. The check now sits in front of every route, as an allowlist of safe methods rather than a list of unsafe ones, so a route added next year is covered by default. A refusal comes back as a 403 with `WWW-Authenticate: Bearer error="insufficient_scope"`, which is the standard way to say "authenticated, but not for this".

Two smaller decisions save real debugging time. Accepting a session cookie as well as a key means the same endpoints can be tried from a signed-in browser, so the documentation is testable without minting a credential. And answering an unauthenticated request differently depending on whether an `Authorization` header arrived at all turns the two most common setup mistakes — no header, and a header the proxy stripped — into two different messages instead of one shrug.

## Rate limits, retries and idempotency

A rate limit is a promise about the worst case, and a client can only cooperate with a promise it can read. Ours is 60 requests a minute per credential, and the 429 carries both the number and a `Retry-After` header, so a client does not have to guess how long to sleep.

Being honest about the mechanism matters too. The counter is one row per caller per minute in Postgres, incremented with an upsert. It is not precise under heavy concurrency — two calls can read the same count — and at this size that is the right trade against running a cache next to the database. A caller who needs an exact allowance should know that; a caller who just needs to not hammer the thing has everything they need.

On the client side, four rules cover almost every case:

- Retry 429, 408 and 5xx. Do not retry any other 4xx: the request is wrong and will stay wrong.
- Back off exponentially with jitter, and respect `Retry-After` when it is present — it is better information than your formula.
- Cap total attempts. A build that retries forever is a build that hangs instead of failing.
- Make the failure loud. `curl` exits zero on a 401 or a 429 unless you pass `-f`, which means a pipeline can write an error body into the file it was supposed to convert and carry on cheerfully. This is the single most common way an API-driven conversion breaks silently, and it has nothing to do with the API.

Which brings up idempotency, and an honest admission. `POST /api/v1/documents` is not idempotent. Post the same file twice and you get two documents, with two ids and two share URLs. Nothing dedupes them.

That is a deliberate choice in one place and an unsolved problem in another. It is deliberate for publishing: [our GitHub Action creates a new document per push](/blog/publish-markdown-from-github-actions) precisely so that a link in an old pull-request comment keeps showing what that commit said, rather than mutating under a reviewer who opened it last week. Overwriting would be tidier and would quietly rewrite history somebody is reading.

It is unsolved for retries. If a request times out after the row was written but before the response came back, the client cannot tell success from failure, and the safe retry creates a duplicate. There are three ways out, and it is worth knowing which one an API you are evaluating has taken:

1. **An idempotency key.** The client sends a unique value in a header — `Idempotency-Key` is the convention payment APIs made familiar — and the server stores the first response against it for some window, replaying that response for any repeat. This is the right answer and it costs a table, an expiry policy, and a decision about what happens when the same key arrives with a different body.
2. **A caller-supplied id.** The client chooses the document id, so a repeat is a conflict rather than a duplicate. Simple, and it hands id generation to callers who may not want it.
3. **Client-side reconciliation.** The caller lists recent documents and matches on name and size before posting. This is what you are doing whether you meant to or not, when the API offers neither of the above.

An API that claims idempotency without saying for how long, or which fields form the key, has told you almost nothing. Ask for the window.

## Files too large for a request body

Every hosted conversion API has a size ceiling, and the ceiling is usually not the service's own opinion. On a serverless platform, the request and the response both pass through infrastructure with its own limits, and on Vercel that limit is 4.5 MB for a request or a response body, refused as a 413 `FUNCTION_PAYLOAD_TOO_LARGE` (checked on vercel.com/docs/functions/limitations, 8 September 2026).

The important part is not the number. It is that the refusal happens above your handler. A 6 MB post never reaches the code that would have said something useful, so the caller gets the platform's bare 413 and an error page written by nobody in particular. From the outside it looks like your API broke.

That is why our per-document cap is 4 MB rather than 4.5 MB: the app has to refuse the request itself, with a sentence naming the size of the document and the size of the limit, before the platform refuses it wordlessly. The half-megabyte of headroom is for the file name and the JSON around the Markdown. And it is why the conversion cap and the storage cap are two different numbers rather than one: converting happens in the browser and can afford 10 MB, keeping the result requires a request and cannot.

The response side of the ceiling is easy to forget. Fetching a document back returns its source, and rendering one returns a whole HTML file; both are response bodies, and both are bound by the same limit. A service that lets you upload a document larger than it can hand back has a trap in it.

If your documents are genuinely bigger than the ceiling, there are four honest options:

| Option | What it costs | When it is right |
| --- | --- | --- |
| Split the document | Several requests, several outputs, and a decision about what links them | Documents that were already several documents |
| Merge and convert once | One large body, so it only helps if merging shrinks the total | Many small files that belong together |
| Convert locally, post the result | A dependency in your pipeline, and version drift to manage | Build steps that already have a runtime available |
| Direct upload to storage | Signed URLs, an orphan sweep, and reads that redirect | A service where big documents are normal rather than exceptional |

The third option is worth taking seriously rather than treating as a defeat. [A local converter on the command line](/blog/markdown-to-html-from-the-command-line) has no size ceiling, no network, no key to rotate and no rate limit; what it has instead is an install to maintain and a version whose behaviour must be pinned or it will drift. A conversion API is not automatically the better half of that trade.

One case is not a size problem at all. A `.docx` is a zip archive full of XML, and reading one needs a zip reader and an element mapper — weight that our function does not carry, so `kind=word-to-markdown` is refused by name with a pointer to the page that does it in the browser. That is a real constraint honestly stated, and the workaround is to [convert the `.docx` first and post the Markdown it produced](/blog/convert-docx-to-markdown). An API that quietly accepted the file and stored it unconverted would be worse in every way.

## Getting the document back out

The last thing that separates a conversion endpoint from a conversion API is whether the result has an address. An endpoint that converts, returns bytes, and forgets has made the caller responsible for storage, naming and sharing — which is fine if the caller wanted a library and unhelpful if they wanted a service.

Three representations of the same document cover almost every use:

| Request | What comes back | Used by |
| --- | --- | --- |
| `GET /api/v1/documents/:id` | JSON: name, kind, size, word count, share state, and the Markdown source | A script deciding what to do next |
| `GET /api/v1/documents/:id.html` | The standalone HTML file, `?theme=dark` optional | A build writing a file to disk |
| `GET /api/v1/documents` | The newest 500, as a list | Reconciliation, cleanup, dashboards |

The standalone HTML deserves a note, because "HTML" is not one thing. What comes back is a complete document — doctype, head, styles inline — rather than a fragment, and it is the same file the app itself downloads, so a script and a person get identical output from identical code. A conversion API that returns a fragment has handed you a job, not a document: opened in a browser it is unstyled text at the window's full width.

Publishing is the other half. `?share=link` on the create call publishes the document and returns its URL in the same response, which is the whole point of an API for a tool like this — publishing a document should be one request rather than three. Revocation has to be real, and it is the part people get wrong: setting a document back to private drops its token, so a link already sent stops working. A share you cannot cancel is not a share, it is a publication.

And a document on the public web carries somebody else's content on your domain, which is a safety question rather than an API question. Shared pages here are served with `script-src 'none'` and `frame-ancestors 'none'`, so an injection that somehow survived [the sanitiser](/blog/sanitising-markdown-safely) still cannot run, and the page cannot be framed as somebody else's. If a conversion API will host the output for you, ask what it sends in the headers before you point it at documents you did not write.

Finally, a usage endpoint sounds like an afterthought and is not. `GET /api/v1/usage` answers "how close am I?" in one request, which is the difference between a client that backs off before it is refused and one that discovers each ceiling by hitting it.

## Where an API is the wrong answer, and what it costs

The obvious answer to "convert this on a schedule" is an API call, and there are four cases where it is the wrong one.

**One file, once.** A key to mint, a secret to store and a client to write, for a job a page does in ten seconds. The API earns its keep on the second occurrence, not the first.

**Documents that must not leave the machine.** A contract, a patient note, an unreleased plan — for these the question is not whether a service is trustworthy but whether the file crossed the network at all. Browser-side conversion answers that with the network tab; a local library answers it with an air gap. An API cannot answer it at all, whatever the privacy policy says.

**A build that must be reproducible.** A service improves, and improvement is drift. If your output has to be byte-identical to last year's, you want a pinned library version in your own lockfile, not somebody else's latest deploy.

**Thousands of files in one run.** Sixty requests a minute is forty README files without noticing and four thousand pages never. At that volume the answer is a local converter, or one merged document, or a batch endpoint if the service has one.

The costs of choosing an API are worth stating plainly, because they are all the same kind of cost: a dependency you do not control.

- **A network hop in your build.** Every conversion can now fail for reasons that have nothing to do with your document — DNS, TLS, a bad deploy at the other end.
- **A secret with a lifecycle.** Keys leak, expire and need rotating, in every environment you run, and a rotation you forget is an outage you scheduled months ago.
- **Someone else's ceilings.** Their size limit, their rate limit and their quota become facts about your pipeline, and they can change without asking you.
- **An audit surface.** Where the document went, who could read it, how long it was retained: all now questions with answers you have to look up rather than answers you wrote.
- **Latency you cannot optimise away.** A local parse is milliseconds. A round trip is tens or hundreds, times the number of files.

None of that argues against a conversion API. It argues for choosing one because the alternative was worse for this job, and knowing which of these you accepted.

## How to judge a document conversion API

1. **Read the error catalogue before the feature list.** If a broken file comes back as a 500 with no message, every failure in your pipeline will cost an hour of somebody's afternoon, because the API has told you nothing you can act on.
2. **Find the size limits in the documentation, not in production.** A limit you discover from a refused request is a limit you discovered during a release, and on a serverless platform the refusal may not even come from the service.
3. **Check whether a retry can duplicate.** Without an idempotency key or a caller-supplied id, every timeout leaves you reconciling by hand — so decide now whether your client dedupes, or accept the duplicates deliberately as a publishing choice.
4. **Check what the credential can reach.** A key that can create keys, change billing or delete the account turns one leaked environment variable into an incident rather than a rotation.
5. **Ask what the response body actually is.** A fragment means you still have to write the wrapper; a complete self-contained file means you can hand the output straight to a person.
6. **Try to cancel a share.** If revoking a link leaves the old URL working, the service's idea of private and yours are different, and you will find out in the worst way.
7. **Convert one real document, then fetch it back.** Not the sample from the documentation — your file, with its tables, its front matter and its odd characters, retrieved through a second request. That single loop exercises the request shape, the limits, the error paths and the storage in one go, and it takes about five minutes.

## Conclusion

A document conversion API is a small piece of infrastructure that either says what it is doing or does not. The parts that decide it are unglamorous: where the file goes in the request, what a bad file comes back as, which ceiling belongs to the service and which to the platform underneath it, whether a retry is safe, and whether the result has a URL. Get those right and the conversion itself is the easy part. If you want to see the same conversion by hand before you automate it, [the converter that sits in front of this API](/) runs in the browser, converts nothing anywhere else, and hands back the same self-contained file the API does — which makes it a reasonable way to check what your script is going to produce before you point it at four hundred files. And when the document you want converted has no file and no repository behind it because an assistant has only just written it, [a connector rather than a client is the shorter route](/blog/converting-documents-from-an-assistant).

## FAQ

### What is a document conversion api?

An HTTP endpoint that takes a document in one format and returns it in another, so the conversion can happen inside a script, a build step or a scheduled job instead of a browser tab. The useful ones also store the result and give it a URL, so the output can be fetched again rather than regenerated.

### Should the file go in the request body or in a JSON field?

Send it as the raw body when the endpoint already knows what the conversion is, from the route or a query parameter — nothing has to be escaped and the body stays as small as it can be. Use a JSON envelope when you have several fields to send, and make sure the API says which shape wins when the document itself is JSON.

### What is the maximum file size for a hosted conversion API?

It depends on the platform more than the service: on a serverless host, request and response bodies are capped, and on Vercel the cap is 4.5 MB, enforced before the application's own code runs. Services that need to accept larger documents move the file out of the request entirely, with a direct upload to storage and a reference posted afterwards.

### How do I stop a retry from creating two documents?

Prefer an API that accepts an idempotency key, so a repeated request replays the first response instead of creating a second document. Where there is none, have the client generate its own marker and check the recent document list before posting, or treat each post as a new version deliberately — which is the right answer when old links should keep showing what they showed.

### Do I need a separate API key for each environment?

Yes, for two reasons: a key per environment can be revoked without stopping everything else, and per-key rate counting means a runaway job in staging cannot spend production's allowance. Keep keys in the secret store your platform already provides, never in the repository, and rotate them on a date you have written down.

### What should a conversion API return when the file is broken?

A 400 with the parser's own message, including where in the file it stopped — that is the only information a caller can act on, and a flat "could not convert" sends somebody hunting through a megabyte by eye. Reserve 5xx for failures that are the service's own, and give the two cases different codes so a client knows whether retrying could possibly help.

### Can I convert a Word document through an API?

Sometimes, and it is worth checking rather than assuming. A `.docx` is a zip archive of XML, so a service has to carry a zip reader and a mapper to accept one; where that weight is not in the function, the conversion is offered in the browser instead and the API takes the Markdown that came out of it.

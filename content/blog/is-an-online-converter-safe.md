---
title: "Is an Online Markdown Converter Safe? How to Check Instead of Trusting"
description: Whether an online converter is safe comes down to four checkable things: if the file is uploaded, how long it is kept, who reads it, and what the terms claim
date: 2026-08-16
tag: Safety
keywords: is markdown converter safe, online converter privacy, does an online converter upload my file, document converter retention policy, convert documents without uploading, online converter terms of service, browser based converter
---

Nobody reads the privacy policy of a file converter. The document is open, the deadline is now, the page says free and no sign-up, and thirty seconds later there is an HTML file in the downloads folder and no memory of having made a decision. A decision was made anyway: about whether that document left the building, who holds a copy of it now, for how long, and under what licence.

### TL;DR

A converter is safe for a particular document when you can answer four questions about it — whether the file is uploaded at all, how long a copy is kept, who else is in the path, and whether the output is sanitised. Three of those are observable in a browser in about five minutes: open the network tab, convert a test file, and watch what leaves; then read the terms for a licence clause rather than the privacy headline. Browser-side conversion uploads nothing and can be verified by turning the network off, server-side conversion has to read your plaintext to do the work at all, and an offline tool involves no network but costs you an install and a supply chain. For contracts, patient notes, credentials, unannounced financials and anything covered by an agreement that names permitted subprocessors, an upload is not a risk to weigh — it is a disclosure.

"Is it safe" is the wrong shape of question, because safety is not a property a converter has. What a converter has is a set of behaviours, most of which you can observe, and a set of promises, all of which you can read. The two are different kinds of evidence and they fail in different ways: behaviour can change on the next deploy, and a promise can be true and still not cover the thing you care about.

The friction is that the checking takes five minutes and the conversion takes thirty seconds, so the checking never happens. It also feels like paranoia until the one time it does not — the release note that names an unannounced customer, the postmortem with the internal hostnames in it, the README whose configuration sample still has a live token. Those are ordinary files. They pass through ordinary converters every day.

What follows is the shortest honest version: what the phrase "online converter" leaves out, how to find out rather than guess, what the three kinds of converter are actually for, and the specific documents where an upload is not a trade-off at all.

## What people check, and what they should

Watch somebody choose a converter and you will see them evaluate four things, none of which bears on the question.

**The padlock.** HTTPS is a claim about transport. It says the bytes were encrypted between your browser and that server, and it says nothing about whether the bytes should have been sent, what the server did with them, how long it kept them, or who it passed them to. Every hosted converter that uploads your file uploads it over HTTPS. So does every one that keeps it forever.

**How professional the site looks.** Design quality correlates with budget, not with data handling. A tidy drag-and-drop area with a progress animation is a front end; the interesting part is the request behind it. Conversely, a plain page with no styling can be doing the whole job locally.

**"No sign-up required."** This means there is no account. It does not mean there is no upload. The two get conflated constantly, because signing up feels like the moment you hand something over, and by then the file has usually already gone.

**A usage claim.** Popularity is not a control. A service used by a great many people has a larger incident surface, not a smaller one, and the number on the home page tells you nothing about retention, subprocessors or what the terms say about your content.

The four questions that do bear on it are duller and answerable:

1. Is the file uploaded at all?
2. If it is, how long is a copy kept, and where?
3. Who else can read it — staff, subprocessors, anyone holding a result link?
4. Is the output sanitised, or does it carry whatever was in the input straight into a browser?

The fourth is the one nobody asks. The first three are about your document's confidentiality. The fourth is about whether the file you are handed back can hurt the person you send it to, and it applies just as much to a converter running entirely on your own machine.

## Five things "online converter" hides

The phrase is doing a lot of work. It has come to mean "runs on somebody's server", but a browser is a runtime like any other, and a converter written to run in it does the work on your machine and uploads nothing. Both are online in the sense that you reached them with a URL. Only one of them is online in the sense people mean.

Here is what the phrase conceals, and how to get at each one.

| What is hidden | How you check it | What a poor answer looks like |
| --- | --- | --- |
| Whether the file is uploaded | Network tab open, convert a test file, watch for an outbound request with your file's size in it | A `POST` carrying `multipart/form-data`, or the page failing to convert with the network off |
| How long a copy is kept | Search the privacy policy for a duration — hours, days, "until you delete it" | Reassurance with no number in it: "we take your privacy seriously" |
| Who else can read it | The subprocessor list, the region, whether results are delivered as a guessable link | No list at all, or a result URL you can share without any credential |
| What the terms claim about your content | Search the terms for licence, royalty-free, sublicensable, perpetual, derivative works | A broad content licence with no purpose limitation and no expiry |
| Whether the output is sanitised | Convert a document containing a script tag and read the HTML that comes back | `<script>`, `onerror=` or `javascript:` still present in the output |

Two of those deserve unpacking now, because they are where the wording does the most damage.

**"We do not store your files" is not "we do not receive your files."** A statement about storage is a statement about what happens after the upload. It concedes the upload. It is also the most common sentence on a converter's home page, and it is usually true — the file really is deleted after processing — which is precisely why it works as a substitute for the stronger claim it resembles. If you want the stronger claim, the wording you are looking for is about transmission: the file is not sent, the conversion happens in your browser, nothing leaves your machine.

**A server-side converter cannot be end-to-end encrypted.** This follows from the work it is doing. To turn Markdown into HTML the converter has to parse the Markdown, which means it has to have the plaintext, which means the encryption ends at their server, not at the far end. TLS protects the journey. It cannot protect the destination from reading what arrived, because reading what arrived is the service. Any converter that advertises end-to-end encryption while doing the conversion server-side is either using the phrase loosely or does not know what it means, and both are reasons to read the rest of the page more slowly.

## Quick comparison: the cheat sheet

There are three honest positions a converter can hold. Everything else is marketing on top of one of them.

| Kind | Where the file is read | What can be retained | Who else is in the path | What the terms can claim | Right for | Wrong for |
| --- | --- | --- | --- | --- | --- | --- |
| Browser-side | Your own machine, by JavaScript the page already loaded | Nothing — there is no copy to keep | Whoever else has a script on that page | Nothing about content it never receives | Anything not already public; quick one-off conversions; verification-minded work | Very large files; formats a browser cannot parse; unattended batches |
| Server-side | The provider's machine, in a region they choose | The upload, the output, logs, and any result link | The provider, its hosting, its subprocessors, anyone with the link | A licence to host, copy and process your content | Exotic formats; heavy conversions; API-driven pipelines; public documents | Contracts, health data, credentials, anything under an NDA naming subprocessors |
| Offline | Your own machine, by software you installed | Whatever the tool writes to disk, under your control | Nobody, once installed — but the install has a supply chain | Nothing; a licence governs the software, not your files | Regulated work; repeatable pipelines; air-gapped environments; bulk jobs | One-off conversions where an install is absurd; machines you cannot install on |

The row that surprises people is the third column of the first row. Browser-side conversion has no retention policy, not because the provider is generous but because there is nothing to have a policy about. That is a different category of answer from "deleted after twenty-four hours", and it is the only one that does not depend on somebody keeping a promise about a copy they hold.

The row that surprises people in the other direction is the last column of the third row. An offline tool is not automatically the safest choice, because installing software is itself a trust decision, and a converter you installed runs with your user account's access to every file you own. The upload you avoided is a narrower exposure than the package you added.

## How to check rather than trust

All of this is checkable. None of it requires special tooling — a browser and ten minutes will settle a converter you are about to rely on, and the same ten minutes will settle it for the whole team.

### The network tab

Open developer tools before you convert anything, not after. In Chrome, Edge or Firefox that is F12; the panel you want is Network. Reload the page with the panel open so you capture the page load too, then convert a file and watch.

What you are looking for is a request that appears at the moment you convert, with a request body roughly the size of your document. Filter to `Fetch/XHR` to cut the noise. Sort by size if the list is long.

```
# A browser-side conversion, after the page has finished loading
(no new rows appear when you press Convert)

# An upload, in the same panel
POST  /api/convert   xhr   multipart/form-data   1.4 MB   312 ms
GET   /api/result/8f3c1e   xhr   application/json   2.1 kB
```

Two refinements make this a much better test.

First, turn the network off and try again. Load the converter, then disconnect — aeroplane mode, or the Offline checkbox in the Network panel — and convert. A browser-side converter carries on working, because the code is already in the page and the file never needed to go anywhere. A server-side one stops. This is the strongest five-second test there is, because it cannot be faked by a request that merely looks small.

Second, look at what else the page talks to. A converter that does not upload your document may still send its filename, its size, or a page event to an analytics endpoint, and that can matter on its own: a filename like `redundancy-list-final.md` is a disclosure even when the contents are not. While you are there, count the third-party scripts. Every script the page loads runs in the same origin as the converter, with the same access to the page and therefore to your document. A browser-side converter with a tag manager, a chat widget and two analytics vendors on it is one supplier away from an upload it did not intend.

### The privacy policy, read for nouns

Read the policy looking for three things and ignore the rest: what is collected, how long it is held, and who it is shared with. Reassurance is not one of the three. A sentence with a duration in it is worth more than three paragraphs about how seriously anybody takes anything.

If you cannot find a retention sentence, the honest conclusion is that the retention period is unknown, and an unknown period is not the same as a short one. Treat the upload accordingly.

### The retention statement, in its own right

The good hosted services state retention plainly, and the statements fall into recognisable shapes: deleted immediately after processing, deleted after a fixed number of hours, kept until you delete it, kept for as long as your account exists. Each is defensible. None is zero.

Two details in the retention statement are worth more attention than they usually get.

The first is what happens when a conversion fails. Several services hold a failed upload longer than a successful one so that support can look at it, which is entirely sensible and means the document you most want to forget about — the one that broke — is the one kept longest.

The second is what the statement covers. Retention usually describes the uploaded file and the converted output. It rarely describes the logs, and logs are where filenames, sizes, IP addresses and timestamps live. Deleting the document and keeping the log line about it is a normal engineering outcome and a partial answer to "is it gone".

### The terms, and the licence clause

This is the check almost nobody performs, and it is the one that occasionally produces a genuine surprise. Open the terms of service and search the text for these words:

```
licence   license   royalty-free   sublicensable   perpetual
irrevocable   worldwide   derivative works   retain   store
third parties   subprocessor   improve our services   training
```

Most services need some licence to your content, and saying so is not sinister: to store a file, copy it between machines and hand it back, a provider needs your permission to store, copy and transmit it. What you are checking is the shape of that permission, and there are four things to look at.

Is it limited by purpose — "solely to provide the service" — or open-ended? Does it end when you delete the file and close the account, or is it perpetual? Is it sublicensable, which extends it to parties you cannot see? And does it reach beyond operating the service into improving it, which in current usage often means training models on what you uploaded?

A purpose-limited, non-sublicensable licence that terminates with your content is normal and fine. A perpetual, worldwide, sublicensable licence to use, adapt and create derivative works from anything you upload, with no purpose limitation, is a clause somebody wrote on purpose. Whether it matters depends entirely on whose document you are converting: for your own notes, not at all; for a client's draft agreement, it is the whole decision, and it may be a decision you are contractually not allowed to make.

### Whether the output is sanitised

Now the other half of safety, the half that has nothing to do with where your file went.

Markdown permits raw HTML by design, so a `.md` file can contain a `<script>` tag, an `onerror` handler or a `javascript:` URL, and a converter that renders faithfully will pass all three to the browser. That is fine for a file you wrote. It is not fine for a README you pulled off the network, a document a client sent, or anything a model generated from material you did not read.

You can test this in a minute. Make a small file with the known-bad shapes in it and convert it:

```markdown
## Sanitiser test

<script>window.__test = 1</script>

<img src=x onerror="window.__test = 2">

[a link](javascript:void 0)

<iframe src="https://example.com"></iframe>

<a href="#" onclick="window.__test = 3">text</a>
```

Then open the HTML the converter gave you in a text editor — not in a browser — and search it. If `<script`, `onerror`, `onclick` or `javascript:` survived, the converter renders faithfully and does not sanitise, and the output is only as safe as the input was. That is a legitimate design choice for a tool aimed at your own files, and it is the wrong tool for anybody else's. [The vectors, the allow-lists and where the filtering has to happen](/blog/sanitising-markdown-safely) is the longer version of this test.

While the file is open in the editor, search it for `http` as well. Every external URL in an exported document is a request the recipient's browser will make when they open it, which tells the other end that the file was opened, when, and from roughly where. A self-contained export has its styles and fonts inline and asks the network for nothing, which is a property worth confirming rather than assuming — the difference between [a file and a link](/blog/share-a-markdown-document-as-a-link) is mostly this.

One more thing about output, because it defeats an intuition: a converter that ran entirely on your machine can still hand you a dangerous file. Local conversion protects your document's confidentiality. It does nothing about the content, and an HTML file opened from your own disk still runs its JavaScript. A script in a local file can reach the network by constructing an image URL, so "it never left my laptop" and "it is safe to open" are unrelated statements.

## The three kinds of converter, and what each is for

### Browser-side — for anything that is not already public

A browser-side converter ships the parser to you. The page loads some JavaScript, that JavaScript reads the file you chose with the file picker, converts it in memory, and offers you the result as a download. No request carries the document, because no request needs to.

| Pros | Cons |
| --- | --- |
| Nothing is uploaded, and you can prove it by pulling the network cable | The claim rests on code you did not read, verified by observation at one point in time |
| No retention policy, because there is no copy to retain | Third-party scripts on the same page share the origin and the access |
| No account, no install, no approval to obtain | The machine is the ceiling: a very large file will exhaust the tab |
| The terms cannot say much about content that never arrives | Formats needing heavy parsing are weaker than a server can manage |

**Who it is for.** Anybody converting a document that is not already public and does not need an install to justify itself: a contract clause, a draft announcement, an incident write-up, a CV, a client's file you are not permitted to send anywhere. It is also the right default for people who want to be able to demonstrate the answer rather than cite it, because the demonstration is a network panel with nothing in it.

**What it does not fix.** Sanitising is a separate decision, taken by the same tool, and worth checking separately with the test above. So is whether the output is a complete document or a fragment — a question of usefulness rather than safety, and covered at length across [the converter comparison](/blog/best-markdown-to-html-converters).

### Server-side — for formats and volumes a browser cannot manage

A hosted converter uploads the file, converts it on its infrastructure, and gives you the output or a link to it. This is what most people mean by an online converter and it is the correct choice for a real set of jobs.

| Pros | Cons |
| --- | --- |
| Handles formats a browser cannot parse well, including legacy office files and PDFs | The document is disclosed to the provider, by definition |
| Converts files far larger than a tab can hold | Retention is a policy, which means a sentence somebody can rewrite |
| An API and a queue, so the work can be unattended and repeatable | Subprocessors, regions and logs extend the list of parties |
| Someone else maintains the parsers, the fonts and the fixes | A result delivered as a URL is a credential that can be forwarded |

**Who it is for.** Public documents, published documentation, marketing copy, anything already on the open web, and any pipeline where the conversion has to happen without a person in a tab. It is also the pragmatic answer when the source format is genuinely difficult, which is often the case coming out of an office suite — the trade-offs specific to that direction are set out in [what a Word file loses on the way to Markdown](/blog/convert-docx-to-markdown).

**The conditions that make it defensible.** A stated retention period with a number in it. A subprocessor list you can read. A purpose-limited content licence. A region you can choose, if you have a transfer obligation. A data processing agreement, if you are handling anyone else's personal data. And a result delivery mechanism that is not a guessable URL. A service that offers all six is a reasonable supplier. A service that offers none of them is not cheaper; it is undocumented, and [the retention and metering differences between the well-known ones](/blog/best-online-document-converters) are the actual comparison.

### Offline — for regulated work and repeatable pipelines

An offline converter is software on your machine: a command line tool, a desktop application, a library in a build. The network is not involved after the install.

| Pros | Cons |
| --- | --- |
| No upload, no retention, no third party, no policy to read | An install, updates, and a package supply chain to trust |
| Runs in an air-gapped or approved environment | Runs with your user's access to every file you own |
| Scriptable, so a hundred files cost the same as one | Version drift between machines produces different output |
| Auditable: the binary and its inputs are yours | Still no sanitising unless the tool does it or you add it |

**Who it is for.** Regulated and contractual work where a documented control matters more than convenience, bulk conversion, and anything that has to run the same way every time in a pipeline. It is the only option on a machine with no route to the internet, and the natural one once the conversion repeats often enough that a person opening a tab is the slow part.

**The cost people underestimate.** Adding a dependency is adding a supplier. A converter pulled from a package registry brings its transitive dependencies with it, and each of those runs with the same access as your shell. Weigh that honestly against the upload you were avoiding, especially for a one-off job on a single file, where the install is the larger change to your machine.

## When an upload is unacceptable

For most documents this is a preference. For some it is not a judgement call at all, because the upload is itself the event: the moment the file reaches a third party, something has been disclosed, and no retention policy undoes it.

| Document | Why the upload is the problem | What to do instead |
| --- | --- | --- |
| Unsigned contracts, term sheets, offers | Names, prices and positions disclosed to a party not in the deal | Browser-side, or an offline tool on a machine you control |
| Health or patient information | Processing anybody else's health data needs a lawful basis and an agreement, not a web form | Offline, inside the approved environment |
| Personal data of identifiable people | You become responsible for a processor you have not assessed, and possibly for a transfer | Browser-side, or a hosted service with a signed agreement |
| Credentials, tokens, private keys, `.env` samples | The secret is now shared, whatever happens to the file | Browser-side or offline, and rotate the secret if it already went |
| Unannounced financials, results, acquisitions | Market-sensitive material handed to an unassessed third party | Offline, under the same controls as the rest of that material |
| Client work under an NDA that lists permitted subprocessors | An upload to an unlisted party can breach the agreement directly | Browser-side or offline, and check the list before choosing |
| Security reviews, postmortems, architecture notes | Hostnames, versions and known weaknesses are exactly the useful parts | Offline, or browser-side with no third-party scripts on the page |
| HR records, disciplinary notes, redundancy lists | Sensitive about people who did not consent, and the filename alone can disclose | Browser-side or offline; rename before touching any tool |

Three of those deserve a sentence more.

**The credentials case is the most common by a distance.** Developer Markdown is full of configuration samples, and configuration samples are full of things that look like placeholders and occasionally are not. If a file containing a live token went to a hosted converter, the correct response is not to check the retention policy; it is to rotate the token. Retention describes when a copy is deleted, not who read it before that.

**The filename is data.** People protect contents and paste names without thinking. `q3-layoffs-final.md`, `patient-4412-notes.md` and `acquisition-northwind.md` each disclose the interesting part before the file is even parsed, and filenames end up in logs, in analytics events and in support tickets far more often than contents do.

**Read the agreement, not the risk appetite.** A great deal of client work sits under terms that specify which third parties may process the material. Where that list exists, the question stops being about probability. Either the converter is on the list or the upload is a breach, and that is a much easier question to answer than whether the provider is trustworthy.

## Where the obvious answer fails, and what it costs

"Use a browser-side converter" is the right default and it is not a complete answer. Four things are wrong with treating it as one.

**It is a claim, verified once.** The network panel showing nothing is real evidence about the code that was running when you looked. A deploy the following week can change it, and nobody re-checks. Browser-side conversion is verifiable in a way that a server-side promise is not — that is a genuine and unusual property — but verifiable is not the same as verified, and the check has a shelf life. For work where this actually matters, re-run the offline test occasionally, and prefer a tool where the conversion working with the network off is a designed property rather than an accident.

**The origin is shared.** A browser-side converter is not a sandbox against its own page. Any script the page loads — analytics, a tag manager, a support widget, an advertisement — runs with full access to the document object model and therefore to whatever the converter has in memory. This is the failure mode most likely to bite in practice, because it does not require the converter's authors to be dishonest, only to have added a vendor. Count the third parties in the network panel; a converter with none is making a stronger claim than one with five.

**It gives you nothing to show an auditor.** This is the cost that catches people out. If you have to evidence how a document was handled, "it was converted locally in a browser and nothing was uploaded" is a true statement with no artefact behind it. A hosted processor with a data processing agreement, a named region, a retention schedule and access logs is, from a compliance point of view, a better-documented control than a claim nobody can produce a record for. Sometimes the right answer is the upload, precisely because it comes with paperwork.

**Signing in changes the model, and that is worth saying plainly.** A browser-side converter that also offers accounts, history and sharing is two products. Signed out, the file stays on your machine. The moment you save a document to an account, it is stored on a server, and everything in the server-side row of the table above applies to it: retention, region, subprocessors, and a link that is a credential. The limits usually change too. In this tool's case conversion is capped at 10 MB, while a document kept in an account is capped at 4 MB, because the function serving it refuses a request or a response body above 4.5 MB. Those numbers are a hosting constraint rather than a policy, and they are a useful reminder that a stored document is a different thing from a converted one.

There is a smaller failure worth naming too. Browser-side tools are weaker on formats that need real parsing work — old binary office files, PDFs whose structure has to be inferred, spreadsheets with formulas. Insisting on a local conversion for those produces a bad conversion, and a bad conversion that you then have to fix by hand has its own cost. Better to know the boundary than to argue with it.

## The checks, in order

1. **Decide how the document would read in a leak before you compare tools at all.** If it is contractual, regulated, market-sensitive or somebody else's, the conversion has to happen on your machine, and the entire hosted market is irrelevant until that is settled — which saves you reading tiers you will never buy.
2. **Convert a test file with the network panel open, then again with the network off.** Nothing appearing in the panel and the conversion still working offline is the only positive evidence available to you; if it stops working offline, the file was going somewhere, whatever the home page implied.
3. **Count the third-party scripts on the page.** Each one runs in the converter's origin with access to your document, so a page with several vendors on it has a wider trust boundary than its privacy statement describes, and no amount of local processing narrows it.
4. **Find the retention sentence and check whether it has a number in it.** A stated duration is a policy you can hold somebody to; reassurance without a duration means the period is unknown, and an unknown period should be treated as indefinite.
5. **Search the terms for a content licence and read its four qualifiers — purpose, duration, sublicensing, improvement.** A purpose-limited licence that ends with your content is ordinary; a perpetual sublicensable one is a decision you may not be allowed to make on a client's behalf.
6. **Test the sanitiser with a document containing a script tag and an `onerror` handler.** If those survive into the output, the converter is only as safe as its input, which is fine for your own files and wrong for anything that arrived from outside.
7. **Open the exported file in a text editor and search it for `http`.** Every external URL is a request the recipient's browser will make, which reports back that the document was opened; a self-contained export has none and behaves the same on a train as on your desk.
8. **Write down which converter you approved, for which class of document, and when you last checked it.** Two lines in a team document prevents the common failure, which is not choosing badly but choosing well once and then never noticing that the tool, the terms or the job changed.

## Conclusion

Safe is not something a converter is; it is something you can establish about a converter in ten minutes, for a particular document, and the checks are dull enough that writing them down once covers a whole team. The important part is that the strongest answer is observable rather than promised: a converter that does the work in your browser has no copy of your file to keep, no policy for you to trust, and no story to tell if it is breached, and you can confirm all three by turning the network off and watching it carry on working. That is what [transformpipe's Markdown to HTML conversion](/) does — signed out, the file is read and converted on your own machine, nothing is uploaded, and the raw HTML in your document goes through a sanitiser before it reaches the page. When the format genuinely needs a server, choose the hosted service by its retention sentence and its subprocessor list rather than its format count, and when the job repeats, install something and stop asking the question weekly. What you should not do is convert a contract in a tab because the page was quick and the padlock was green.

## FAQ

### Is it safe to use an online Markdown to HTML converter?

It depends on whether the converter uploads the file, and that is checkable rather than a matter of trust: open the browser's network panel, convert a test document, and see whether anything leaves. A converter that runs in your browser processes the file on your own machine and has nothing to retain, which makes it a reasonable default for documents that are not already public. A hosted converter is fine for public material and for formats a browser cannot parse, provided you have read its retention statement.

### Does a browser-based converter really not upload my file?

You can test it rather than believe it. Load the page, disconnect from the network, and convert: if the conversion still works, the parser is running locally, because there was nothing to send it to. Watch the network panel during a normal conversion as well, and note how many third-party scripts the page loads, since each of those shares the page's access to your document.

### How long do online converters keep my documents?

The honest hosted services state a period — deleted after processing, deleted after a fixed number of hours, or kept until you delete it — and the period is usually short. Two details get missed: a failed conversion is often held longer than a successful one so support can investigate, and retention statements typically cover the file rather than the logs, where filenames and timestamps live. If you cannot find a sentence with a duration in it, treat the period as unknown.

### Do online converters claim ownership of my content?

Almost never ownership, but most terms include a licence, because a service that stores and returns a file needs permission to store and return it. Read that clause for four qualifiers: whether it is limited to providing the service, whether it ends when you delete your content, whether it can be sublicensed, and whether it extends to improving the service or training models. A purpose-limited licence that expires with your content is ordinary; a perpetual sublicensable one is worth a second look, especially if the document belongs to a client.

### Is HTTPS enough to make a converter safe?

No. HTTPS protects the bytes in transit and says nothing about whether they should have been sent, what the server does with them, or how long it keeps them. It also cannot make a server-side conversion end-to-end encrypted, because the server has to read the plaintext to convert it. Treat the padlock as a minimum requirement rather than evidence of anything.

### I already uploaded something confidential. What should I do?

Deal with the contents first, not the policy. If the file contained a token, key or password, rotate it now, because retention tells you when a copy is deleted and not who read it beforehand. Then use whatever deletion the service offers, keep a note of what was uploaded and when in case you have to report it, and check whether the material was covered by an agreement that limits which third parties may process it.

### Is an offline converter always safer than an online one?

Not automatically. It removes the upload, the retention and the third party, and it adds an install, an update path and a package supply chain that runs with your user's access to every file you own. For regulated work, bulk conversion and repeatable pipelines it is the right answer. For a single file on a machine you would rather not install anything on, a browser-side conversion is the smaller change.

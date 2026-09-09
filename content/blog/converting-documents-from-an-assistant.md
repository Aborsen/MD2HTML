---
title: "MCP Document Converter: Converting and Sharing Documents from a Conversation"
description: How an MCP document converter turns Markdown an assistant just wrote into a page you can send — the eight tools, the sign-in with no key, and the real risks
date: 2026-09-09
tag: Automation
keywords: mcp document converter, mcp server markdown to html, custom connector claude, convert markdown in an assistant, mcp oauth connector, share a document from a conversation
---

An assistant writes Markdown all day. Ask it for release notes, a summary of a meeting, a first draft of a specification, and what comes back is hashes, asterisks and pipe characters in a chat window. It reads correctly there, because the chat window renders it. It reads like nothing anywhere else.

### TL;DR

An MCP document converter is a connector: a small server the assistant can call, so the Markdown it just wrote becomes a converted file or a published page without a person moving text between two tabs. The useful shape is five verbs — convert, save, share, list, fetch back — and the awkward part is not the conversion but the authorisation, which should be an approval you can revoke rather than a long-lived key you pasted. It is genuinely convenient and it is genuinely a standing grant to act on your behalf, which means a document the model reads can try to talk it into using your tools. Use a connector for the document that exists inside a conversation, and an API, a CLI or a build step for everything else.

The usual repair is to copy it out. Select the answer, copy, find a converter, paste, wait, download, rename the file, attach it, notice the table came out as a paragraph of pipes, go back and do it again. Every one of those steps works. The sequence is the problem, and it is the step that keeps breaking — the copy that grabs half a code fence, the paste that arrives with the chat's own formatting attached, the file called `download (3).html`. That friction has its own article: [what actually happens when you move model output into a document](/blog/ai-output-to-a-shareable-page) covers the manual route and what it costs, and this piece does not repeat it.

What is strange about the manual route is that the assistant is already a program that calls other programs. It reads files, runs searches, opens pull requests. The one thing it usually cannot do is hand you the document it just wrote in a form a person can open. Not because that is hard, but because nobody connected the converter.

That is the gap a connector closes, and the rest of this article is about what a good one looks like, what it is allowed to do on your behalf, and the cases where reaching for it is the wrong instinct.

## What MCP is, plainly

The Model Context Protocol is "an open-source standard for connecting AI applications to external systems" (checked on modelcontextprotocol.io, 9 September 2026). That is the whole idea. Before it, every assistant had its own plugin format, and every tool provider wrote the same integration several times over. A shared protocol means a tool is built once and reached from anything that speaks it.

It has a client-server shape, with three named participants rather than two. The host is the AI application; it creates one client per server, and each client holds a dedicated connection to its server, which is "a program that provides context to MCP clients" (checked on modelcontextprotocol.io, 9 September 2026). In practice you can read "host" as the assistant you are typing into, "client" as the piece of it that talks to one particular tool, and "server" as the tool.

| Participant | What it is | In this article |
| --- | --- | --- |
| Host | The AI application, coordinating one or many clients | The assistant you are talking to |
| Client | Holds one connection and obtains context from one server | Created by the host, not something you configure directly |
| Server | A program that provides context and tools | The converter |

A server exposes up to three kinds of thing: tools, which are executable functions the application can invoke to perform actions; resources, which are data sources providing context; and prompts, which are reusable templates (checked on modelcontextprotocol.io, 9 September 2026). A converter is almost entirely tools. Converting is an action with a side effect on the world — a file exists that did not before — which is what a tool is for.

There are two transports. Stdio "uses standard input/output streams for direct process communication between local processes on the same machine", and Streamable HTTP "uses HTTP POST for client-to-server messages with optional Server-Sent Events for streaming capabilities", which "enables remote server communication and supports standard HTTP authentication methods including bearer tokens, API keys, and custom headers", with OAuth recommended for obtaining those tokens (checked on modelcontextprotocol.io, 9 September 2026).

That distinction decides how a connector feels to install. A stdio server is a process on your machine: you install it, it runs when the assistant starts it, and it can reach your filesystem because it is standing in your filesystem. An HTTP server is a URL: nothing is installed, it is the same server for everyone who adds it, and the interesting question becomes how it knows which person is asking. A hosted document converter is the second kind, which is why most of this article is about that question.

Two things MCP deliberately is not. It is not a way of running a model — the protocol "focuses solely on the protocol for context exchange" and does not dictate how applications use models or manage context (checked on modelcontextprotocol.io, 9 September 2026). And it is not a permission system. It carries authorisation, and it defines nothing about whether the model should have called the tool it just called. That judgement stays with the tool's author and with you.

## What a converter is worth as a connector

The case for connecting a document converter is not that conversion is difficult. It is that the document is already in the conversation, and everything you would do next is a separate application.

Five verbs cover almost all of it. Convert, so the Markdown becomes a page. Save, so it has an address instead of living in a scroll-back buffer. Share, so somebody else can open it. List, so the assistant can answer "what have I got". Fetch back, so a document written three weeks ago can be edited rather than rewritten from memory. With those five, the model finishes the job in the conversation rather than handing the reader a wall of asterisks and wishing them luck.

TransformPipe's connector exposes eight tools, and the split is deliberate: two do work, four answer questions, and two change what other people can see or whether a document exists at all.

| Tool | What it is for | What it can cause |
| --- | --- | --- |
| `tp_help` | Answers questions about how the product works, from its documentation rather than from memory | Nothing. It reads documentation sections and returns them |
| `tp_convert_markdown` | Markdown in, sanitised HTML out; optionally the whole self-contained document | Nothing is saved. The output travels back through the conversation, so a long document costs context |
| `tp_save_document` | Saves Markdown to the account, and publishes it in the same call when asked | Writes a document. With a share mode, publishes a page on the public web |
| `tp_list_documents` | What is on the account — names, sizes, dates, whether each is shared — with the id the other tools take | Reads. Reveals the document list to the conversation |
| `tp_get_document` | One document, by id, as its Markdown source or as rendered HTML | Reads. Pulls a whole document into the conversation |
| `tp_share_document` | Changes who may open a document: a link, named addresses, or nobody | Publishes or unpublishes. Revoking breaks a URL already sent |
| `tp_usage` | What the account is using against its limits | Reads. Worth asking when a save was refused |
| `tp_delete_document` | Deletes one document, permanently | Destroys data. Requires an explicit confirmation, and removes exactly one |

Two structural details matter more than the list itself.

The first is that the tools are not a second implementation of anything. Each one calls the application's own public API in process, with the caller's credential forwarded, so a conversation and a script get the same answer from the same code. That sounds like an internal tidiness point and it is not. A tool that queried the database directly would be a second implementation of "whose documents are these", and that is the question you least want two answers to. The same reasoning applies to the conversion itself: the HTML a tool returns is the HTML the browser page produces, sanitised against the same allow-list, because it is the same renderer.

The second is `tp_help`. A model asked how a product works will answer from whatever it absorbed in training, which for any product younger than its cutoff is a confident description of something that does not exist. A documentation tool turns that into a lookup. It is the least glamorous tool in the table and the one that prevents the most wrong answers.

## Adding it, and the sign-in that has no key in it

The address is the deployment plus `/api/mcp`:

```
https://transformpipe.com/api/mcp
```

On claude.ai that goes in Settings → Connectors → Add custom connector. From a terminal:

```
claude mcp add --transport http transformpipe https://transformpipe.com/api/mcp
```

That is the whole of the configuration. There is no key to paste, and the absence is the point.

Under the address, the transport is JSON-RPC over a single POST, with no event stream. Every tool here answers from the database or from blob storage in a single round trip, so the only thing a stream would buy is progress reporting on work that has no intermediate steps to report. A `GET` gets a 405, which is a conforming way to say there is no stream at this address.

### What happens on the first call

The first call carries no token, and what comes back is a 401. The status is the protocol signal, and this is worth stating plainly because it is the most common way a home-made connector fails: a 200 carrying a politely worded error is read as a tool that failed, and it never starts a sign-in. Only the status code does that.

The 401 carries a `WWW-Authenticate` header naming a protected-resource document and the scopes it wants — `documents:read documents:write`. From there the client walks a chain of well-known documents to find out where to sign in, registers itself, and sends the person to a page on the site.

The order of events, which is not obvious from any one part of it:

1. The client POSTs the endpoint with no token and gets a 401 plus a `WWW-Authenticate` header naming the protected-resource document.
2. It reads `/.well-known/oauth-protected-resource` to find the authorisation server, then `/.well-known/oauth-authorization-server` to find that server's endpoints.
3. It registers itself and receives a `client_id`. No secret is issued: a client running on somebody else's machine cannot keep one, which is what PKCE is for.
4. It sends the person to `/authorize` with a PKCE challenge. Not signed in, they are parked and bounced through the application's own sign-in first.
5. They approve — with a POST from a page they actually read, so a link on its own authorises nothing.
6. The client exchanges the code and its verifier for an access token and a refresh token.

The site has to be its own authorisation server for this, rather than handing over the session it already has. The authorisation specification forbids a resource accepting a token issued by anybody else, so the person signs in exactly as they always do, approves a named client on a page they looked at, and the client walks away with a token of the site's own making.

### What the client actually gets

A token that acts as that person, for their documents, and reaches nothing else. Not the account. Not the sign-in that the account is attached to. Not the API keys, which are a separate credential for a separate purpose. Access tokens are minted with a thirty-day life and refresh tokens with a hundred and eighty, so a connector you use keeps working and a connector you forget about eventually stops.

Revoking is in the account menu, under API keys, and it takes effect on the next call rather than at the end of some cache window.

Two details on the consent page exist because of specific attacks rather than good taste. The page names the address the client is about to act as, because "approve" with no subject is not consent. And the client's own name is stripped of control characters and bidirectional overrides before it is displayed, because a client can otherwise register itself as something ending in a right-to-left override and have the page render a lie — a problem that escaping HTML does nothing about.

### Why this shape rather than a key

A connector holding a long-lived API key you pasted is a credential in a place you will forget about. It sits in a configuration file, or in a hosted assistant's settings, and it is as strong as the key you happened to paste — which, if you pasted the one you already had, is the same key your deployment scripts use. Rotating it breaks both. Auditing it tells you a key was used, not which client used it.

An approved client is a different object. It has a name you can read, a scope narrower than the account, its own expiry, and a revoke button that does not break anything else you own. When you look at the list in six months and do not recognise an entry, you can remove that entry alone. That is the whole argument, and it is worth the extra page in the flow.

## The two tools shaped for the trouble they can cause

Six of the eight tools are ordinary. Two are not, and they are written differently on purpose.

**Sharing publishes a page on the public web.** There are three modes, and the transition between them is the part people get wrong.

| Mode | Who can open it | The consequence worth knowing |
| --- | --- | --- |
| `private` | The owner only | Revokes an existing link entirely, so a URL already sent stops working |
| `link` | Anyone holding the URL | It is on the public web. A URL is not a password, and links travel |
| `people` | Only the addresses given | The address list is replaced, not appended — send the whole list every time |

Saving can publish in the same call, which is convenient and is exactly why the server's own instructions to the model say to share a document only when the person asked for it. A tool that both stores and publishes in one step is a tool that can turn "keep this" into "post this" through a single misread sentence. The mitigation is not clever: the description says what it does in the first line, the mode is an explicit enumeration rather than a boolean called `public`, and the reply to the model says which mode the document is now in and what its URL is, so the assistant's summary to you is a statement you can check.

**Deleting takes an explicit confirmation and removes exactly one document.** `confirm: true` is required, and without it the tool refuses and tells the model to go and ask. There is no undo and no trash. And there is no tool that deletes several — no glob, no "delete all shared documents", no date range. That is a deliberate absence rather than a missing feature. A bulk delete is the one tool where a single misunderstood instruction destroys work that cannot be recovered, and a connector that cannot express the instruction cannot carry it out.

The confirmation is a real mitigation and a partial one, which is the theme of the next section. It stops an accidental deletion, because an accident does not usually include a confirmation flag. It does not stop a deletion the model was talked into, because a model that has been convinced to delete something will pass `confirm: true` as readily as it passes the id.

## Where a connector fails, and what that costs

A connector is a standing grant to act on your behalf. That is not a caveat at the bottom of the page; it is what the thing is. Once it is added, the assistant can call those tools whenever it judges them relevant, in a conversation you are not necessarily reading closely, on the basis of text you did not necessarily write.

**A model can be talked into using your tools by the document it is reading.** This is prompt injection, and it is not hypothetical for a document converter, because reading documents is the entire job. Somebody sends you a Markdown file. You ask the assistant to convert it and publish it. Somewhere in the middle of that file, in a comment or a code block or white-on-white text, is a paragraph addressed to the model rather than to you. The model is now processing instructions from a stranger while holding a token that acts as you.

The mitigations are real, and they are partial. Stating them honestly means stating both halves.

| Mitigation | What it genuinely prevents | What it does not |
| --- | --- | --- |
| A token scoped to one product's data | Reaching your email, your repositories, your other accounts, or the API keys on the same account | Anything inside the scope: reading, publishing and deleting your documents |
| An explicit confirmation on the destructive tool | Accidental deletion, and casual deletion the person never asked about | A deletion the model was persuaded to make and confirms itself |
| Sharing being visible and revocable | A publication staying secret from you, or being permanent | The window between publishing and your noticing. A copied page stays copied |
| No bulk operations | One instruction destroying many documents | Repeated single calls, if nobody is watching the transcript |
| The person reading what the assistant says it did | Most of it, in practice, if the person actually reads it | Anything in a conversation nobody reviewed, which is most long conversations |

That last row is doing more work than the others, and it is the least reliable. The honest summary is that a connector's safety currently rests on a narrow scope plus a person paying attention, and the second half of that decays with exactly the workload that makes a connector worth having.

There are three further costs that are not about injection at all.

**It is another service holding your documents.** Signed out, the browser conversion on this site sends nothing anywhere: the file is read, converted and rendered on your own machine, and you can watch the network tab stay empty while it happens. A connector is the opposite arrangement by necessity. Saving a document means an account, an account means storage, and storage means a company holding text you wrote. For a README that is irrelevant. For a contract, a patient note or an unreleased plan it is the whole question, and the right answer may be to convert in the browser and never save at all.

**The document goes into the conversation.** `tp_convert_markdown` returns the converted output through the same channel as everything else, which means a long document is now part of a transcript held by whoever hosts the assistant. The tool clips returned text at forty thousand characters and says how much it dropped, rather than truncating silently — silent truncation reads as completeness, which is worse than a visible gap — but clipping is a context-window mercy, not a privacy control. For anything long, saving it and sharing the link is both cheaper and less exposed.

**Sanitising is still your problem to understand, not to perform.** Raw HTML in a Markdown source goes through a sanitiser with a fixed allow-list before it reaches a page, so a `<script>` tag in a file somebody sent you does not survive the conversion. That is a property of the converter rather than of the connector, and it is worth reading [how sanitising works and where it has to happen](/blog/sanitising-markdown-safely) if you are converting files you did not write. What the sanitiser cannot do is tell you that the prose itself was addressed to your assistant.

## The limits, and why one of them is 4 MB

The connector is not a separate product with separate ceilings. The same numbers apply whether a document arrives from a browser tab, a script or a conversation, which is the only arrangement that does not produce support tickets.

| Limit | Value | Why it is that number |
| --- | --- | --- |
| Per conversion | 10 MB | The conversion runs in the browser, so this is a judgement about the machine in front of the person rather than a platform rule. Several files dropped together count as the one document they become |
| Per kept document | 4 MB | Not a policy. The platform refuses a request or a response body over 4.5 MB before any of the application's code runs, so a larger document could be neither saved nor read back |
| Per account | 100 MB, 500 documents | Bytes and rows are capped separately: a thousand tiny files cost real rows |
| Per caller | 60 calls a minute | A caller that trips this is looping, not working |
| Returned text | 40,000 characters | A tool reply has to travel through the conversation, and a document should not eat it |

The 4 MB figure is the one worth understanding, because it is the only limit that is not a choice. It is set below the platform's own 4.5 MB rather than at it, so that the refusal arrives from the application with both sizes named in it rather than as a bare rejection from underneath — which is the difference between a model that can tell you what to do next and a model that reports a failure it cannot explain. A document over that size still converts, still previews and still downloads — the conversion runs in your browser, where no request body is involved — it just stays out of the stored history, and the application says so rather than reporting a save that did not happen. A connector inherits that exactly: `tp_convert_markdown` will handle a file `tp_save_document` refuses.

If a save is refused, `tp_usage` is the tool that says why, in the form of bytes and documents held against the ceiling on each. It exists because "it did not save" is a sentence a model will otherwise interpret creatively.

One more property that is easy to miss: the export is a complete file rather than a fragment. Doctype, head, styles inline, no external requests. That is what makes a converted document survive being emailed, opened offline, or read on a machine that has never seen the site — and it is [a specific property with specific trade-offs](/blog/self-contained-html-explained) rather than a marketing line.

## When a connector is the wrong tool

A connector is for the document that exists inside a conversation. That is a narrower case than it first appears, and reaching for it outside that case produces the worst of both arrangements: a person in the loop, plus a non-deterministic step in the middle.

| The job | The right tool | Why not a connector |
| --- | --- | --- |
| A script converts documents as part of something larger | The [REST API](/blog/converting-documents-with-an-api) | A script does not need a model to decide anything. It needs a status code and a body |
| A folder of files, converted now | The [command line](/blog/markdown-to-html-from-the-command-line) | A hundred files is a loop, not a hundred tool calls. It is faster, cheaper and repeatable |
| A repository publishes on every push | The [GitHub Action](/blog/publish-markdown-from-github-actions) | The trigger is a commit, and there is nobody in the conversation to ask |
| A document you already have on disk, once | The browser page | Adding a connector to convert one file is more configuration than the task |

The test is where the document is at the moment you want it converted. If it is on disk, in a repository, or in a variable, a program should convert it. If it only exists as text a model just produced, then moving it out to be converted and back in to be discussed is the copy-paste problem again, wearing a different hat.

For context, the reference MCP servers published alongside the protocol show what the local, stdio-shaped case looks like: Filesystem, "secure file operations with configurable access controls"; Git, "tools to read, search, and manipulate Git repositories"; Fetch, "web content fetching and conversion for efficient LLM usage"; plus Memory, Time, Sequential Thinking and an Everything test server (checked on github.com/modelcontextprotocol/servers, 9 September 2026). Note the division of labour. Filesystem and Git already reach your disk and your repository, so a document that lives in either does not need a hosted converter to fetch it — it needs one to convert what those tools handed over, or nothing at all.

## How to judge a document connector

1. **Check whether it can be revoked without breaking something else.** A connector that reuses your existing API key means rotating that key kills your deploy scripts too, and you will find that out at the worst moment; a connector that holds its own approval can be removed on a hunch with no consequences.
2. **Read the destructive tool's description before you add it.** If deleting takes no confirmation, or if there is a tool that deletes more than one thing at a time, then one misread instruction in a long conversation is unrecoverable data loss rather than an annoying mistake.
3. **Find out whether sharing is a separate step or a flag on saving.** Either is defensible, but a save that publishes in the same call needs the mode named explicitly in the reply, otherwise "saved it" and "posted it on the internet" are the same sentence to the person reading the summary.
4. **Ask what the tools return through the conversation.** A tool that hands back whole documents will fill the context window and put your text in the transcript, so a connector that returns a URL for anything long is doing you a favour that shows up as lower cost and less exposure.
5. **Confirm the limits match the rest of the product.** A connector with its own quieter ceilings will refuse something the website accepted, and the failure arrives as a model apologising vaguely rather than as an error you can act on.
6. **Decide, before you add it, which documents you are prepared to have stored.** A connector that saves is a service holding your text, and the only version of that decision that survives contact with a busy week is one you made in advance, not one you make while pasting.

## Conclusion

A connector earns its place when the document is already inside the conversation and every alternative involves a person moving text between two windows. What makes it worth adding rather than merely clever is the boring part: a token that covers one product's documents and nothing else, an approval with a name on it and a revoke button that breaks nothing, a destructive tool that asks, and a share that says out loud what it just published. Those are the properties to check on any connector, not only this one. If you would rather keep the document on your own machine, the same conversion runs in the browser with [nothing uploaded when you are signed out](/) — and if the job is a script, a folder or a repository, use the API, the CLI or the Action instead, and leave the conversation for the documents that only exist there.

## FAQ

### What is an MCP document converter?

It is a document converter exposed as an MCP server, so an assistant can call it as a tool instead of a person converting the file by hand. In practice it means the model can turn Markdown it just wrote into HTML, save it, publish it as a page and read it back later, all inside the conversation where the text already is.

### Do I need an API key to add the connector?

No. The first call comes back unauthorised, the assistant follows that to a page on the site, and you sign in with the account you already use and approve a named client. The client receives a token good for your documents and nothing else, and you revoke it from the account menu under API keys.

### Can an assistant publish my document without asking?

It can, which is why the tools are shaped the way they are: saving can publish in the same call, and the server's instructions tell the model to share only when the person asked. Sharing is visible in your document list and revocable, and setting a document back to private stops an already-sent link from opening — but a page that was copied while public stays copied.

### What happens if my document is larger than the limit?

Conversion is capped at 10 MB and a stored document at 4 MB, so a file between those sizes converts and downloads but cannot be kept on the account. That second limit is the platform's rather than a policy: a function refuses a request or response body over 4.5 MB before any of the application's code runs, so the document could be neither saved nor read back.

### Is a connector safer than pasting into an online converter?

They fail in different ways. Pasting risks the copy itself — half a code fence, a mangled table, the wrong tab — while a connector risks a standing grant being used on the strength of text you did not write, which is prompt injection. Converting in the browser while signed out uploads nothing at all, and for a document you cannot afford to store anywhere, that remains the strongest option.

### Does an MCP connector only work with one assistant?

No. MCP is an open standard supported across many clients, so a remote server reached over HTTP works with anything that speaks the protocol and can complete the sign-in. What differs between applications is where you paste the address and how they present the approval step, not the server.

### What should I do if the connector stops working?

Check the approval first: a revoked client, or a refresh token past its life, produces exactly the same unauthorised response as a brand new connector, and re-approving fixes it. If it authorises and then refuses to save, ask the assistant to call the usage tool, which reports bytes and documents held against the account ceiling instead of leaving the model to guess.

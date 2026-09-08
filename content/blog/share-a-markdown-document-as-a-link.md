---
title: How to share a Markdown file with someone who does not use Markdown
description: The honest ways to share a Markdown file with a reader who will not install anything — attachment, Gist, repository, HTML file, link — and what revoking takes
date: 2026-09-05
tag: Publishing
keywords: share markdown file, publish markdown online, markdown to shareable link, host markdown file, read only document link, send markdown to a client
---

You have a `.md` file. You wrote it, or you saved [an answer a chat assistant gave you in Markdown](/blog/ai-output-to-a-shareable-page); from here it makes no difference. Someone needs to read it: a client, a manager, a lawyer, a builder quoting on your kitchen. They will not install a Markdown editor, they will not clone a repository, and they should not have to. Every way of getting the document in front of them fails somewhere, and the trick is knowing where, before you press send.

### TL;DR

Pick by what happens to the file after it arrives, not by what is quickest for you. If the reader will edit it and send it back, attach the source and say what it is. If they need to read it once, on a phone, in a meeting, convert it to a **self-contained HTML file** and attach that, or publish it as a **read-only link** — either way they get a document rather than source. A link is worth using only if it asks the reader for nothing: no account, no install, no script. And a link is only revocable if revoking kills the address itself, immediately, without the reader's cooperation — which no attachment can ever do, because an attachment is a copy.

## What the reader's machine does with your file

The friction is not Markdown. Markdown is a text file with punctuation in it, and it was designed so that the punctuation stays readable when nothing renders it. The friction is that operating systems, mail clients and phones each make a different guess about a file extension they have no application for, and every one of those guesses is wrong in a way you cannot see from your end.

There are three separate questions hiding in "can you read this?" The first is whether the file opens at all. The second is whether it opens as a document or as source code. The third is whether what opens is the version you meant them to see, today and in six months. Pasting text answers the first and fails the second. Attaching the source can fail the first outright. A repository link answers the first two and quietly fails the third, because the address points at a branch that moves.

The last question matters more than people expect. Most sharing goes wrong after the moment of sending. The client forwards it. The manager comes back to the link a quarter later. Legal asks for the version that was current on the eleventh. Whatever you choose has to survive being read by somebody you did not send it to, at a time you did not choose.

## Quick comparison: the cheat sheet

| Option | Best for | Key capability | Price |
| --- | --- | --- | --- |
| Paste the text into the message | A short note with no tables or images | Works in every client; nothing to open | Free |
| Attach the `.md` file | A reader who will edit it and send it back | Lossless — the exact bytes you have | Free |
| A Gist | A snippet or note for someone technical | Renders GFM at a URL, keeps revisions | Free, needs a GitHub account to create |
| A file in a repository | A document that belongs beside the code | Renders in place, versioned with the project | Free for public repositories |
| A cloud storage link | A file you already keep in Drive, Dropbox or OneDrive | One link, access controlled by account | Free tier; paid plans priced by storage |
| A self-contained HTML attachment | A finished document that must open offline | One file, styles inline, asks the network for nothing | Free |
| A read-only published link | Someone reading once, on a phone, with no account | An address that needs no install, and can be withdrawn | Free |
| A PDF | Print, signature, a fixed record | Every reader sees identical pages | Free through the browser's print dialog |
| Static hosting or Pages | A set of documents that link to each other | Navigation, custom domain, search | Free for public repositories; a build step to maintain |

## The ways to share a Markdown file

### Paste the text into the message

The fastest option, and the one that works everywhere. Copy the file into the email, the chat message or the ticket, and the reader has it without opening anything.

| Pros | Cons |
| --- | --- |
| No attachment, no link, no install — it is already in front of them | The syntax arrives as punctuation, not formatting |
| Quotable and searchable inside their own mail client | Tables, images and code are lost or mangled |
| Nothing to revoke, because nothing was hosted | Long documents are unreadable as a wall of message text |
| Works when attachments are stripped by a mail filter | Every client applies its own partial Markdown rules |

**Price:** free.

**What actually happens to the text**

- Headings arrive as `## Scope`, because no mail client parses ATX headings
- Slack has no heading or table syntax, so both come through as literal characters, while `*Scope*` comes out bold — a single asterisk is bold there, not italic
- [Tables fare worst](/blog/markdown-tables-that-survive-conversion): the dashed alignment row means nothing to a tool that does not parse it, so the reader gets a paragraph of pipes
- Images are the raw `![alt](path)` line, and relative paths were never going to resolve in somebody else's client anyway
- Some clients auto-format as you paste, which is worse than none: half the document renders and half does not, and you cannot tell which half from the sent folder

**Who should use it?** Anybody sending something short, final and mostly prose — a paragraph of status, a decision, three bullet points. Anything longer than a screen, or with a table in it, wants one of the options below.

### Attach the `.md` file

Honest and lossless. The recipient gets exactly the bytes you have, which is the only option on this page that lets them change a word and send it back.

| Pros | Cons |
| --- | --- |
| Byte-for-byte, so it round-trips through editing | Nothing on a standard machine is registered for `.md` |
| Small, plain text, and diffable | On a phone it usually opens as nothing at all |
| No hosting, no account, no service in the middle | The reader who does open it is reading source, not a document |
| The right choice when the file is the deliverable | You cannot withdraw it, ever |

**Price:** free.

**What actually happens on the reader's machine**

- A double-click on Windows or macOS gets a code editor, a "choose an app" dialog, or nothing — the extension has no default handler
- Mail clients frequently preview it inline as plain text, which is the best outcome and entirely out of your control
- Some mail filters treat unfamiliar extensions as suspicious, so the attachment can be quarantined without either of you being told
- Renaming it to `.txt` fixes opening and loses the association with Markdown, which matters if they will edit it
- If they do open it, images and relative links point at files they do not have, so the document has holes in it

If the reader is willing but stuck, [opening an `.md` file](/blog/how-to-open-md-file) covers what works on a machine with nothing special installed. Say what the file is when you send it. "This is a text file — open it in Notepad or TextEdit, or just read it in the preview" is one sentence that prevents most of the confusion.

**Who should use it?** Anybody whose reader is going to edit the document, and anybody whose reader is technical enough that source is not an insult. It is the wrong choice for a client who asked to see a proposal.

### A Gist

A Gist is a small hosted document with a URL. It renders GitHub Flavored Markdown, so the address of the Gist is already a readable page, and it keeps a revision history because a Gist is a Git repository underneath.

| Pros | Cons |
| --- | --- |
| Renders GFM properly — tables, task lists, fenced code | The reader lands inside a developer interface |
| One short URL, no install for the reader | Creating one needs a GitHub account, even though reading does not |
| Revisions are kept, so you can point at a specific version | A secret Gist is unlisted, not private: anyone with the URL can read it |
| Editable after the fact, in the browser | Deleting is the only withdrawal, and it is permanent |

**Price:** free. Reading needs no account; creating one needs a GitHub account, which is free.

**What a non-developer sees**

- A page with your document in the middle and a toolbar of Raw, Blame, History and a fork button around it
- A "clone this" box offering an HTTPS and an SSH address, both of which mean nothing to them
- Comment fields underneath, which look like an invitation to a conversation you may not want
- Your GitHub avatar and username as the byline, which is fine for a README and odd on a quote for building work
- On a phone, the interface chrome takes a fair share of the screen before the document starts

**Who should use it?** Somebody sending a snippet, a configuration file, a bug report or a note to another developer. It is a good tool used constantly for the wrong audience: the rendering is right and the surroundings are wrong for anybody who does not already live on GitHub. And "secret" is the word that catches people out — it means the URL is not indexed or listed, not that access is controlled.

### A file in a repository

If the document belongs to a project, put it next to the code. GitHub, GitLab and Bitbucket all render Markdown in the file view, so the URL of the file is already a page.

| Pros | Cons |
| --- | --- |
| Versioned with the code it describes | A private repository asks the reader to sign in |
| Reviewable — changes arrive through a pull request | A public one shows your text inside an interface built for developers |
| Renders GFM, including tables and task lists | The link points at a branch, so it moves |
| Free, and already part of the workflow | History keeps every earlier version, including the one you regret |

**Price:** free for public repositories; private repositories are included in the free tiers of all three, with limits and paid tiers described on their own pricing pages.

**The details that decide it**

- The default link is `/blob/main/doc.md`, which resolves to whatever `main` says today rather than what it said when you sent the link
- Pressing `y` on GitHub rewrites the address to pin the commit, which fixes the moving target but not the interface around it
- The Raw view serves the file as plain text, so it is a download or a wall of source, not a document
- Relative image and link paths do resolve inside the repository view, which is exactly why they break the moment the file is read anywhere else, in an email or a converted page alike
- Deleting the file removes it from the current tree and not from the history, so it is not a withdrawal in any sense a lawyer would accept

**Who should use it?** Teams. This is the right home for [documentation that lives in the repo](/blog/documentation-that-lives-in-the-repo), where the audience already has an account and the version history is the point. It is the wrong home for a quote you sent a client last Tuesday.

### A cloud storage link

You already keep files in Drive, Dropbox or OneDrive, and each of them will hand you a share link for anything in the folder. It is the path of least resistance, and what the reader gets at the other end is less predictable than the other options here.

| Pros | Cons |
| --- | --- |
| No new tool: the file is already there | What the preview does with `.md` varies by provider and changes without notice |
| Access control by account, which is real access control | "Anyone with the link" and "specific people" are easy to confuse and easy to misclick |
| Revoking the link genuinely works | A sign-in prompt in front of a document you meant anyone to read |
| Expiry and passwords exist on some plans | Often the reader just gets a download button |

**Price:** free tier with every consumer account. Paid plans are priced by storage, and link controls such as expiry and passwords sit on paid tiers with some providers — check the provider's own pricing page before you promise a client an expiring link.

**What to check before you send one**

- Open the link in a private window. That is the only way to find out whether your reader meets a sign-in wall, because your own browser is already authenticated
- Confirm whether the preview renders the Markdown, shows the source as plain text, or offers a download — all three behaviours exist, and none of them is announced
- Check whether the link permits editing. The default is not always view-only, and the difference matters on a document with a price in it
- Remember that the file keeps living in your folder. Renaming or moving it can break the link you already sent

**Who should use it?** Anybody sharing with a named group inside an organisation that already uses that provider, where sign-in is not an obstacle and access lists are the point. For a stranger reading once on a phone, it is more friction than the job needs.

### A self-contained HTML file as an attachment

Convert the Markdown to a single HTML file with its styles inline, and attach that. The reader double-clicks and gets a finished document in the browser they already have, and [what one file has to contain to behave that way, what inlining costs in bytes, and how to prove it fetches nothing](/blog/self-contained-html-explained) is worth knowing before you rely on the format.

| Pros | Cons |
| --- | --- |
| Opens on any machine, with no install and no account | It is still an attachment, so mail filters still apply |
| Works with the network off, on a train, in a basement | Larger than the source, because the styling travels with it |
| Prints and exports to PDF through the browser's own dialog | You cannot withdraw it — the reader has a copy |
| Nothing is hosted, so nothing can go down or be revoked out from under them | Not editable in any way they will enjoy |

**Price:** free.

**Why "self-contained" is the load-bearing word**

- A complete document means doctype, `<head>`, and an inline `<style>` block — not a fragment of `<h1>` and `<p>` tags, which renders as unstyled black text at the full width of the window
- No external requests: no CDN stylesheet, no web font, no analytics. A file that fetches its styling looks broken offline and tells whoever opens it something about where it has been
- Images have to be embedded rather than linked, or the document arrives with holes in it on a machine that does not have your folder
- Raw HTML is legal in Markdown, so a converted file can carry a `<script>` tag that came in with the source. If the Markdown was not written by you, [sanitising is not optional](/blog/sanitising-markdown-safely) before you send the result to somebody else
- The file is the whole record. Six months later it opens exactly as it did the day you sent it, which is the property no link has

**Who should use it?** Anybody whose reader needs a document rather than a page, and anybody who wants the send to be final. Proposals, handover notes, meeting minutes, anything that will be filed. It is also the answer when the recipient's organisation blocks unknown domains but happily opens attachments.

### A read-only published link

Render the Markdown once, host it, and pass on the address. Nothing to download, nothing to install, and it reads as a document on a phone in a lift.

| Pros | Cons |
| --- | --- |
| Zero friction for the reader: tap and read | The document depends on a service being up |
| You can correct a typo after sending | The reader has no copy, so nothing survives revocation |
| Revocable, if the link is built to be | Forwarding is trivial and invisible to you |
| Renders properly on a small screen | An organisation's mail filter may rewrite or block the URL |

**Price:** free.

**What the mechanism has to do**

- Serve the rendered document, not the Markdown source, and not a viewer that needs a plug-in
- Carry an unguessable token in the address, and stay out of search indexes
- Work signed out, on a first visit, on a phone, on a corporate laptop with an aggressive browser policy
- Render server-side or ship the finished HTML, so a reader with scripts blocked still sees the document
- Let you kill the address on your own, without asking the reader to do anything

transformpipe does both shapes of this. Drop the `.md` file on transformpipe.com and take the download for a self-contained file; sign in and publish it for a read-only page at `/s/<token>`. Revoking drops the token, so a link you already sent stops working. From a terminal it is one command:

```bash
node cli/tp.mjs login tp_live_…        # once, with an API key
node cli/tp.mjs push proposal.md --share link
```

**Who should use it?** Anybody sending a document to somebody who will read it once and never file it. Also anybody who expects to revise: the address stays the same while the content improves, which is the one thing an attachment cannot do.

### A PDF

Convert to HTML, open it, print to PDF. It is two steps rather than one, and it buys a property none of the other options has: every reader sees the same pages in the same order.

| Pros | Cons |
| --- | --- |
| Universally openable, including on phones | Fixed page width, so it reads badly on a small screen |
| Pagination, which matters for signature and citation | Reflow is gone: long tables break across pages awkwardly |
| Accepted by processes that will not accept a link | Editing it is a different tool and a worse experience |
| A fixed record: page 4 is page 4 for everybody | Larger than the HTML it came from |

**Price:** free through the browser's own print dialog, which every modern browser includes.

**Details worth knowing**

- The print stylesheet decides the result. A document that looks right on screen can lose its code block borders and table rules on paper
- Links survive as clickable annotations in most browsers' PDF output, and footers can add the source URL, which is either useful or noise depending on the document
- Headings usually become PDF bookmarks only if the converter emits them deliberately; the browser print path generally does not
- Text stays selectable, so the document is searchable and quotable — a screenshot is not a substitute

**Who should use it?** Anybody sending something into a process: a contract, an invoice, a submission, anything that will be signed or archived. Not the right answer for a document you expect to revise twice next week.

### Static hosting or Pages

GitHub Pages, GitLab Pages and every static site generator convert Markdown to HTML and put it on the web with navigation and a custom domain. None of them is a way to share one file.

| Pros | Cons |
| --- | --- |
| Navigation, search and cross-links across many documents | A configuration file, a theme and a build step to maintain |
| A custom domain, which reads as yours rather than a vendor's | Public by default: access control needs paid tiers or a proxy in front |
| Fast, cached, and free to serve | Publishing is a deploy, so a typo fix is a commit and a wait |
| Well documented and widely deployed | Unpublishing means another deploy, not a switch |

**Price:** free for public repositories on the major hosts; publishing from a private repository requires one of their paid plans, described on their own pricing pages.

**Who should use it?** Anybody publishing a set of documents that link to each other and expect to be found. If you have one file and one person to send it to, the overhead is enormous and the access model is wrong — a static host publishes to everybody, and you wanted to publish to one reader.

## What a share link should and should not ask of the reader

Most disappointment with sharing comes from links that ask the reader for something. You send an address expecting a document to appear, and what appears is a form. From your side it looked fine, because your browser was already signed in.

A read-only link should:

- [x] open in any browser, with no account, no app and no extension
- [x] show the rendered document, not the Markdown source
- [x] be readable on a phone, at a sensible measure, without pinching
- [x] work with scripts blocked, because plenty of corporate browsers block them
- [x] be revocable by you alone, at any time, without the reader's help
- [x] carry an address that cannot be guessed and is not indexed

It should not:

- [ ] put a sign-in wall in front of a document you meant anyone to read
- [ ] collect an email address before showing anything
- [ ] require a specific browser, or an app for a "better experience"
- [ ] pull fonts, styles or analytics from other hosts, which tells third parties who is reading what
- [ ] break when the reader forwards it to a colleague, which they will

There is a middle case worth naming. When a document really is confidential, an address list is the right control: only the named readers can open it, and they sign in to prove who they are. That is a different mechanism, not a stricter link. A link anyone can open suits a proposal, a spec or meeting notes; an address list suits anything you would be unhappy to see forwarded. Deciding which one you need takes ten seconds and prevents the failure where a "private" link turns out to be a public one nobody has found yet.

## What revoking has to do to be worth calling revoking

Every service with a share button says the link can be revoked. Most mean something weaker than you assume. Revoking is only revoking if all of the following hold.

**It kills the address, not the listing.** Removing a document from your own list of shared items while the URL still resolves is housekeeping, not revocation. Test it by opening the address in a private window after you revoke; if the document appears, nothing happened.

**It takes effect now.** A cached copy served for another hour is a document still readable for another hour. Ask what the cache lifetime is, and treat "eventually" as a different feature.

**It needs nothing from the reader.** Any mechanism that depends on the recipient deleting a file, emptying a folder or clicking "remove access" is not revocation — it is a request.

**It cannot be undone by anyone else.** If a colleague with access to the same folder can re-share the file, the address you killed comes back under a different name.

**It says what it does not cover.** Revoking cannot recall a copy. Anything downloaded, printed, screenshotted, forwarded as an attachment or pulled into a search index is out of reach permanently. A link revoked yesterday can still exist in a caching proxy inside somebody's employer.

That last point is the honest limit of the whole idea. Revocation controls future readings by people who kept the link; it controls nothing about people who kept the document. If the requirement is "this must stop existing", no share mechanism on this page delivers it, and you should not tell a client otherwise.

## Where the obvious choice fails and what it costs

The obvious choice, once you know a link is possible, is to always send a link. It is one tap for the reader and it can be corrected after sending. Here is what it costs.

**A link is a dependency.** The document is readable for as long as a service is up, a domain is renewed and an account is in good standing. An attachment has no such condition attached. For anything with a long life — a contract, a specification somebody will cite in two years — the copy is the safer artefact, and the link is the convenience.

**A link makes the document a moving target.** The ability to fix a typo after sending is the same ability to change a number after agreement. If the document is a record, that is a defect rather than a feature, and the fix is a pinned version or an attachment.

**A link fails inside other people's infrastructure.** Corporate mail systems rewrite URLs for scanning, chat clients unfurl them into previews you did not ask for, and some filters simply refuse unknown domains. None of that is visible from the sending end. Attachments have their own filter problems, but they fail loudly.

**A link leaks the reading.** Any hosted document can tell its owner when it was opened. That is sometimes exactly what you want and sometimes a thing you would not want done to you. If the service also loads fonts or analytics from elsewhere, the reader's visit is disclosed to parties neither of you chose.

**A link is not a document for the reader.** They cannot file it, annotate it, or find it in three months by searching their mail. Plenty of readers, given a link, immediately try to save the page as a file — badly. Send the file if that is what they are going to do with it.

The mirror-image failure is worth naming too. Always attaching a converted file means every correction is a new email, no reader is ever sure which version is current, and the document is out of your hands the moment it lands. The two failure modes are symmetrical, which is why the answer is to look at the document rather than to pick a favourite.

## How to choose

1. **Start from what happens after it arrives.** If they will edit it, attach the source; anything else and they are editing a rendering, which they will do badly and send back. If they will file it, send a file. If they will read it once, send a link.
2. **Count what the reader has to do.** Every install, account and dialog between the address and the document loses some fraction of your readers, and the fraction is highest with exactly the people who did not want to read it in the first place. Zero steps is achievable, so treat one step as a cost.
3. **Decide whether the document is allowed to change.** A link that stays current is right for a living document and wrong for a record. If somebody may need to prove what it said on a given day, send an attachment or pin a version, because "I updated it since" is not an answer.
4. **Check whether you would be unhappy to see it forwarded.** If the answer is yes, an unguessable URL is not the control you need — an address list is. Choosing this correctly at the start is far cheaper than discovering it from a screenshot in somebody else's thread.
5. **Open your own share in a private window before you send it.** This catches the sign-in wall, the download-only preview, the missing image and the broken relative link, all in under a minute, and it is the only way to see what your reader sees rather than what your authenticated session shows you.

## Conclusion

Sharing a Markdown file is not a conversion problem, it is a question about the reader. When the answer is "they want to print it", [the PDF routes are here](/blog/markdown-to-pdf). The question: what their machine will do with the thing you send, and what they will do with it afterwards. Short and final, paste it. Meant to be edited, attach the source and say what it is. Part of a project, commit it beside the code. Meant to be read once by somebody who has never heard of Markdown, convert it to a self-contained HTML file and attach it, or publish it as a read-only link and be honest with yourself about what revoking that link can and cannot undo. [transformpipe converts Markdown to a complete HTML document in the browser](/), free, with nothing uploaded when you are signed out — and then, once you have the link or the file, open it in a private window and read it as your reader will.

## FAQ

### How do I share a Markdown file with someone who has no Markdown editor?

Do not send them Markdown. Convert it to a self-contained HTML file and attach that, or publish it as a read-only link — both give them a rendered document in the browser they already have. Send the `.md` source only when they need to edit it and return it.

### Can I share a `.md` file as a link without creating an account?

You can convert without an account, and hosting generally needs one. Browser-side conversion produces the HTML file with no sign-up at all, and that file can be attached to an email immediately. Publishing a URL means something has to host it, which is where an account comes in — but the reader still needs none.

### Is a Gist a good way to share a document with a non-developer?

It renders the Markdown correctly and surrounds it with a developer interface: Raw, Blame, History, a clone box and comment fields. For a colleague who uses GitHub daily that is invisible; for a client it is confusing. Also remember that a secret Gist is unlisted rather than private, so anyone holding the URL can read it.

### Is it safe to send somebody a converted HTML file?

It is, provided the conversion sanitised the source. Markdown allows raw HTML, so a `.md` file you did not write can carry a `<script>` tag or an `onerror` handler straight through into the converted page. For your own notes it does not matter; for a file that arrived from somewhere else, check that the converter sanitises before you forward the result.

### What actually happens when I revoke a share link?

At minimum, the address should stop resolving immediately, for everybody, without the reader doing anything. It does not recall copies: anything downloaded, printed, screenshotted or cached by an intermediary stays readable. Revocation controls future visits from people who kept the link, and nothing about people who kept the document.

### Should I send a PDF instead of a link?

If the document is going into a process — signature, submission, archive — yes, because a PDF is a fixed record everybody sees identically. If it will be read once on a phone and possibly revised next week, no: fixed pages read badly on a small screen and every revision is a new file.

### Will my tables and images survive being shared?

Tables survive if the renderer does GitHub Flavored Markdown, and they do not survive being pasted into a message, where the alignment row becomes a line of dashes. Images survive only if they are embedded in the output or hosted at an absolute address, because a relative path points at a folder your reader does not have.

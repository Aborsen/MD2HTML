---
title: "Do I Need a Static Site Generator? A Decision Guide"
description: A static site generator buys navigation, templates, search and taxonomies, and charges a toolchain for them. Three questions decide whether you need one.
date: 2026-09-04
tag: Publishing
keywords: do i need a static site generator, static site generator or converter, static site generator alternative, mkdocs vs converter, when to use a static site generator, markdown to html without a build step, simplest way to publish markdown
---

You have a directory of Markdown files and somewhere they have to end up. The advice you find says install a static site generator, and there are six credible ones, and each has a getting-started page that ends with a working site in four commands. None of those pages asks whether you needed a site.

That is the decision, and it is usually made backwards — the tool gets chosen first, then the requirement gets stretched to fit it. A generator is a build system. It expects a directory laid out its way, a configuration file, a template language, a theme, a lockfile and somewhere to deploy the output. In return it gives you real capabilities that a file-at-a-time converter cannot: a navigation tree computed from the files, links between pages that break the build when they rot, a search index, a tag listing. If you need those, nothing else will do. If you do not, you have taken on a toolchain to produce pages that a converter would have produced without one.

The awkward part is that the cost does not arrive on the day you install it. It arrives on the day, eleven months later, when a security advisory forces a dependency bump, the theme has not been released against the new major version, and the person who chose the generator has changed jobs.

### TL;DR

You need a static site generator when the pages have to know about each other — shared navigation, cross-page links that are checked, a search index, tag or version listings — or when the output has to be rebuilt automatically every time the source changes. You do not need one for a document with a recipient, or for a handful of pages that nobody navigates between; a converter and a link do that, and there is nothing to maintain. The number of files is the wrong test: fifty unrelated notes need no generator, and three interdependent pages that must republish on every merge do. If you are unsure, publish with a converter first — the migration into a generator later is annoying but bounded, and the toolchain you never installed cost nothing to keep alive.

## What a generator gives you, and what it charges for it

### The capabilities, stated as capabilities

Marketing pages describe generators with adjectives. The useful description is a list of things they do that a converter does not do, because those are what you are buying.

**A navigation tree derived from the files.** The generator walks your source directory, reads the front matter, and builds a sidebar and a breadcrumb from what it finds. Add a file, and it appears in the menu. A converter has no directory; it has the one file you gave it, and it cannot know what else exists.

**Templates, applied to every page.** One layout file, and every page gets the same header, footer, canonical link and analytics tag. Change the layout and 200 pages change. A converter applies a stylesheet to a document; it does not apply a shared shell across a set.

**Cross-page links that are validated.** Generators resolve internal links against the file tree, and most will fail the build when a link points at a page that no longer exists. That single behaviour is the strongest argument for a generator on a documentation set, because link rot in docs is silent and constant.

**A search index.** Full-text search over the whole set, built at compile time, served as a JSON file the page loads. You cannot get this from converted files. Browser find-in-page searches one document; a search box searches all of them.

**Taxonomies.** Tags, categories, versions, authors — each becoming its own generated listing page, with pagination. The listing does not exist as a source file; it is computed. This is how a blog index, a "all pages tagged API" page, and a version switcher get built.

**Incremental builds and a live-reload server.** A generator knows which outputs depend on which inputs, so a one-character edit rebuilds one page rather than all of them, and the browser refreshes while you type. On a large set that is the difference between an edit loop you can work inside and one you wait through, which over a year is the difference between documentation that gets corrected and documentation that gets left.

**An asset pipeline.** Images resized and fingerprinted, Sass compiled, CSS and JavaScript bundled and hashed for cache-busting. The output references `style.a83f1c.css`, and you can set a one-year cache header on it without fear.

**Feeds, sitemaps and redirects.** RSS, `sitemap.xml`, and a redirect map so an old URL keeps working after you move a page. Each is boring and each is a real job that something has to do.

### The costs, stated as costs

**A toolchain.** A runtime you did not previously need on every machine that builds the site: Python for MkDocs and Sphinx, Node for Docusaurus and Eleventy, a Go or Rust binary for Hugo and mdBook. Then the same runtime, at a compatible version, in CI.

**A lockfile, and the tree underneath it.** A JavaScript generator with a theme and half a dozen plugins resolves to a large dependency graph, and every entry in it is something that can publish a breaking change or a security advisory. This is the single biggest difference between the Node-based generators and the compiled ones.

**A build that breaks a year later.** Not from anything you did. A transitive dependency drops support for your runtime version, a theme pins a peer dependency that no longer resolves, the CI image's default runtime moves up a major version. The site is unchanged and it no longer builds.

**A theme you now maintain.** Every generator's theme is either one you wrote, in which case you own its accessibility, its dark mode and its mobile layout forever, or one somebody else wrote, in which case you own the upgrade whenever it changes. Themes are where most generator maintenance actually lives.

**Configuration as a thing to learn.** A template language — Go templates, Jinja, Nunjucks, JSX, Handlebars — plus the generator's own front matter conventions and directory rules. None of it transfers to the next generator.

**Somebody has to know it.** This is the cost people do not price. A generator is only cheap while the person who set it up is still around and still remembers. The moment it becomes "the docs site nobody understands", every trivial change becomes a small research project, and small research projects do not get done.

## The number of documents is the wrong axis

The instinct is to decide by volume: one file, use a converter; fifty files, use a generator. It is the wrong test, and it produces both failure modes. Somebody with fifty unrelated meeting notes installs Docusaurus and now maintains React to publish text. Somebody with three interdependent pages that must be current after every merge converts them by hand and they are stale within a fortnight.

Three questions actually decide it, and all three are about relationships and process rather than counting.

| The question | If yes | If no |
| --- | --- | --- |
| Do the pages need to know about each other? | You need shared navigation, checked cross-links, a search index, tag listings — the things only a build over the whole set can compute. That is a generator, or a platform that is one. | Each page stands alone. A converter per document is not a compromise; it is the correct shape, and there is nothing to keep alive between publishes. |
| Does it have to be republished on a schedule or on every change? | Something has to run unattended. That means a command, in CI, with pinned versions — a generator, or a converter plus a script, but automated either way. | A person publishing when they remember is fine, and a person cannot run a build reliably. Manual conversion is honest; a manual build step is a lie you tell yourself. |
| Who has to run it? | If the answer includes anybody who does not use a terminal, the build must be behind a button — a CI job on merge, or a hosted platform. A local build step excludes them permanently. | If the only people publishing are the people who wrote the toolchain, a local build is fine and the maintenance cost stays with the people who chose it. |

The first question is about the output's structure. The second is about whether a human is in the loop. The third is about who is stranded when the toolchain misbehaves, which is the question that most often changes the answer.

Two yeses out of three, and install the generator. Three noes, and you are looking at a converter and a link. One yes usually means the middle option: a converter driven by a script, which is a build step without a build system.

## The honest options, side by side

Every row here is a real answer for somebody. The generators are listed with what they are written in, because that is the runtime you are agreeing to install, and with their licence, because that is stable and checkable in a way that feature lists are not.

| Option | What it produces | What it needs | Who runs it | Suits | Cost |
| --- | --- | --- | --- | --- | --- |
| A converter, one file at a time | One self-contained HTML file, or a link | A browser | The author, on demand | A document with a recipient; a report; model output; anything you would otherwise have emailed as `.md` | Free |
| A converter plus a script in CI | A directory of HTML files, or one merged document | A CLI or an API, a workflow file | The CI runner, on push | A handful of pages in a repository that must stay current, with no template needs | Free; CI minutes |
| MkDocs | A documentation site with nav and search | Python | Author locally, or CI | Project docs written in Markdown by developers | Free, BSD-2-Clause (checked on github.com, 9 September 2026) |
| Docusaurus | A React documentation site with versioning and i18n | Node, and React knowledge for anything custom | CI, in practice | Versioned product documentation with a front end team behind it | Free, MIT (checked on github.com, 9 September 2026) |
| Hugo | Anything from docs to a large content site | A single downloaded binary; Git, Go or Dart Sass for some features | Anyone with the binary | Large content sites; teams that want no package manager | Free, Apache-2.0 (checked on github.com, 9 September 2026) |
| Eleventy | Whatever you template, with no imposed structure | Node | Author or CI | People who want a build with as few opinions as possible | Free, MIT (checked on github.com, 9 September 2026) |
| mdBook | A linear book with a table of contents and search | A single downloaded binary | Anyone with the binary | Handbooks, guides, anything read front to back | Free, MPL-2.0 (checked on github.com, 9 September 2026) |
| Sphinx | Reference documentation with cross-references and API extraction | Python; MyST-Parser to write in Markdown | CI, usually | Python projects; anything needing real cross-referencing and autodoc | Free, BSD-2-Clause (checked on github.com, 9 September 2026) |
| A documentation platform | A hosted docs site, built for you | An account, and your repository connected | The platform | Teams who want the build to be somebody else's problem | Read the Docs Community is "free, forever" for open source; commercial plans are Basic $50, Advanced $150 and Pro $250 per month, Enterprise from $10,000 per year (checked on about.readthedocs.com, 9 September 2026) |
| The repository's own renderer | Rendered Markdown at a repository URL | Nothing | Nobody | Internal docs read by people who already have repository access | Free |

The last row is the option people forget, and for internal engineering documentation it is frequently correct. GitHub and GitLab both render Markdown documents held in a repository, tables and task lists included, at the URL of the file itself (checked on docs.github.com and docs.gitlab.com, 9 September 2026). There is no build, no theme and no deploy. What you lose is a navigation tree, a search box scoped to your docs rather than the whole repository, and any control over presentation — and for a `docs/` directory read only by the people who commit to it, losing those may cost nothing at all. [Documentation that lives in the repository](/blog/documentation-that-lives-in-the-repo) is a discipline more than a toolchain, and the discipline is the part that matters.

## Case one: one document that has to reach a person

This is the most common case by a wide margin and the one most often over-tooled. You have written something — a proposal, a handover note, a report, a summary an assistant produced — and one person or a small group has to read it. It is finished. It will not be updated. Nobody will navigate from it to another page.

A generator is the wrong shape for this on every axis. It wants a site; you have a document. Its output is a directory of files with relative links between them, which means you cannot email it — you have to host it, which means a deploy target, which means a domain or a subpath, which means somebody has to remember it exists.

What the case actually needs is a single file that renders correctly wherever it lands. That means a complete HTML document rather than a fragment, with its styles inline and no requests to a CDN, so it looks the same on a laptop on a plane as it does on yours. [What makes an HTML file self-contained](/blog/self-contained-html-explained) is a narrow technical property and it is the whole difference between a file that survives being forwarded and one that does not.

| What you need | Converter | Generator |
| --- | --- | --- |
| Send it as an attachment | One file, opens on double-click | Directory of files with relative links; cannot be attached usefully |
| Send it as a link | A published link, revocable | A deploy, a URL scheme, and hosting to keep alive |
| No install for the sender | Runs in a browser tab | A runtime and a package install |
| No install for the reader | A browser | A browser |
| Update it next month | Convert again | Rebuild and redeploy |
| Keep the source private | Signed out, browser-side conversion uploads nothing | Source usually sits in a repository |

**Who this is for:** anybody whose next action is "send this to somebody". If the document has a recipient rather than an audience, you want a file or a link, not a site. [The ways to share a Markdown document as a link](/blog/share-a-markdown-document-as-a-link) covers what each method asks of the reader, which is the part that decides whether they actually read it.

The one thing worth being careful about: converting a document written by somebody else, or by a model, means converting text that may contain raw HTML, because Markdown permits it. A converter that sanitises against an allow-list handles that. A generator usually does not sanitise at all, on the reasonable assumption that you wrote your own site's content.

## Case two: a handful of documents in a repository

Now there are eight files in `docs/`, they change with the code, and somebody outside the repository has to be able to read them. This is the middle case, and it is where the generator decision is genuinely close.

Ask the first question from above. Do these eight pages need to know about each other? If they are eight independent references — an install guide, a runbook, an API note, a decision record — then no. Each is read on its own, arrived at from a link somebody pasted. If they form a sequence, or share a sidebar, or one of them is a landing page that lists the others, then yes, and you have a small site.

For the independent case, the honest tool is a converter with a script in front of it. A workflow triggered on push converts the changed files and publishes them, and the whole apparatus is a shell loop and a CLI or an API call. There is no template language, no theme, and no lockfile beyond whatever your CI already has. [Converting a directory of Markdown files in one pass](/blog/batch-convert-markdown-files) is the mechanical part; wiring it to a trigger is the rest.

| Approach | Build step | What breaks | Recovery when it breaks |
| --- | --- | --- | --- |
| Convert by hand when you remember | None | Nothing; the docs just go stale | Remember again |
| Converter plus a CI script | A loop and a CLI call | A CLI flag changes, or the runner's Node version moves | Read one command's help output |
| A generator in CI | The generator's whole build | A theme, a plugin, a peer dependency, the runtime | Bisect a dependency tree you did not choose |
| A documentation platform | Theirs | Their build, on their schedule | Open a support ticket |

The trade is straightforward. A script gives you fewer capabilities and far fewer failure modes, and the failure modes it does have are legible: one command, one flag, one exit code. A generator gives you navigation and search and a build you have to understand to repair.

**Who this is for:** repositories where the docs are reference material rather than a product. If publishing on merge is the actual requirement — and it usually is, because docs that are published manually are docs that are out of date — then [publishing Markdown from a GitHub Actions workflow](/blog/publish-markdown-from-github-actions) is the same amount of work whichever tool sits inside the job. Choose the tool by what you will have to fix, not by what the job looks like on the day you write it.

One thing a script cannot do, and it is worth knowing before you commit: it cannot tell you that a link from page three to page seven has broken. Nothing walks the set. If your eight pages link to each other heavily, that missing check will cost you more than the generator's dependency tree.

## Case three: a real documentation site

Here the generator is correct and the only question is which one. The signs are unambiguous: dozens of pages, a navigation tree people use to find things, a search box, contributors who are not the person who set it up, and probably versions.

Choose on two things, in this order. First, which runtime your team already maintains — because the generator that shares a runtime with your project costs you nothing extra in CI, and the one that does not costs you a second toolchain forever. Second, the shape of the output: reference documentation, a linear book, a versioned product site, or a general content site. Themes and looks come third, and they are the part you will change anyway.

### MkDocs

MkDocs is a static site generator for project documentation written in Python, released under the BSD-2-Clause licence (checked on github.com, 9 September 2026). Its sources are Markdown files configured with a single YAML file, it translates them with the Python Markdown library, and its dev server reloads the browser whenever you save (checked on mkdocs.org, 9 September 2026). That middle detail settles the extension question before you ask it: what a page can contain is whatever Python Markdown's extensions can express, switched on through `markdown_extensions`.

| Pros | Cons |
| --- | --- |
| One configuration file, small surface to learn | Navigation in a deliberate order means writing the `nav` list out by hand; leave it out and you get the files sorted alphanumerically (checked on mkdocs.org, 9 September 2026) |
| Python, which many teams already have in CI | The default extensions are `meta`, `toc`, `tables` and `fenced_code`; anything else is one you enable and then remember (checked on mkdocs.org, 9 September 2026) |
| Material for MkDocs is a mature theme, MIT licensed (checked on github.com, 9 September 2026) | Most of what people want comes from the theme, so you inherit its upgrade cycle |
| Live-reload server for local writing | Not designed for anything other than documentation |

**Who it is for:** developer documentation for a project that already uses Python, written by people who want to write Markdown and edit one YAML file.

### Docusaurus

Docusaurus builds documentation websites and is MIT licensed, built on JavaScript and React (checked on github.com, 9 September 2026). Its own documentation lists document versioning, internationalisation across locales, and MDX — interactive components written as JSX and React inside Markdown — among its features (checked on docusaurus.io, 9 September 2026). That is the argument for it and the argument against it in one sentence: it is the option here that does the most, on the largest runtime.

| Pros | Cons |
| --- | --- |
| Versioning and internationalisation are built in, not bolted on | React and Node are now dependencies of your documentation |
| MDX, so pages can embed live components | Everything arrives through npm, so the graph you patch is a front end framework's rather than a generator's |
| Search integrations and a plugin API | Customising anything means writing React |
| Well-exercised: many large projects use it | Major-version upgrades are real projects |

**Who it is for:** a product with multiple supported versions, more than one language, or interactive examples in the docs — and a front end team who will not be surprised by a React upgrade.

### Hugo

Hugo is a static site generator written in Go, released under Apache-2.0 (checked on github.com, 9 September 2026), and distributed as a downloadable binary rather than a package tree. It is the option with the smallest ongoing dependency surface and the steepest template language.

| Pros | Cons |
| --- | --- |
| A binary you download; no package manager in the loop | Templates are Go's `text/template` and `html/template` (checked on gohugo.io, 9 September 2026), the least forgiving syntax on this page |
| Fast enough that build time stops being a consideration | Its documentation assumes you already know its vocabulary |
| Handles content sites, not only docs: taxonomies, sections, feeds | Four editions to pick between, and the choice matters |
| Themes install as a Git submodule, as the quick start does (checked on gohugo.io, 9 September 2026), or as Hugo modules | Theme conventions vary a lot between themes |

Hugo's editions are worth knowing about before you install: the project documents standard, deploy, extended and extended/deploy builds, where deploy adds direct deployment to Google Cloud Storage, AWS S3 or Azure Storage, and extended adds LibSass transpiling for Sass. The same page notes that Git, Go and Dart Sass are commonly used alongside Hugo — Git for modules and theme submodules, Go for building from source or using modules, Dart Sass for modern Sass features — and that embedded LibSass is deprecated and "will be removed in a future release" (checked on gohugo.io, 9 September 2026). So the single-binary story is true, and the moment you want current Sass or theme modules it acquires neighbours.

**Who it is for:** teams that want no package manager involved, sites larger than documentation, and anybody who would rather learn one template language than maintain a dependency tree.

### Eleventy

Eleventy is a static site generator for Node, MIT licensed, described by its own repository as transforming a directory of templates into HTML (checked on github.com, 9 September 2026). Its distinguishing property is that it imposes very little: no required directory layout, no bundled theme, and a choice of template languages.

| Pros | Cons |
| --- | --- |
| Almost no imposed conventions; you build the site you want | You build the site you want, which means you build it |
| Many template languages — Nunjucks, Liquid, Handlebars, JavaScript, WebC and more — mixable in one project (checked on 11ty.dev, 9 September 2026) | No default theme, so presentation starts from nothing |
| Small dependency footprint by JavaScript standards | Navigation, search and versioning are plugins or your own code |
| Plain JavaScript configuration rather than a framework | Fewer ready-made documentation setups than MkDocs or Docusaurus |

**Who it is for:** people who have looked at a documentation generator's theme and wanted to delete most of it — and who have the time to replace it.

### mdBook

mdBook creates a book from Markdown files, is written in Rust and released under MPL-2.0 (checked on github.com, 9 September 2026). It produces one thing well: a linear document with a table of contents, chapter navigation and search. A single `SUMMARY.md` tells it which chapters to include, in what order, in what hierarchy and where the source files sit, and the built book answers `S` or `/` with a search box (checked on rust-lang.github.io, 9 September 2026).

| Pros | Cons |
| --- | --- |
| A binary, like Hugo; no runtime to install | Books, not sites: no taxonomies, no feeds, no listing pages |
| A single `SUMMARY.md` defines the whole structure | Themes are limited by design |
| Search included without configuration | Not the tool for reference documentation you jump around in |
| Very little to learn or maintain | Smaller ecosystem than the others |

**Who it is for:** handbooks, tutorials, internal guides and anything with chapters that are read in order.

### Sphinx

Sphinx is a documentation generator written in Python and released under a BSD 2-Clause licence, whose default markup is reStructuredText (checked on github.com, 9 September 2026). Markdown support comes from MyST-Parser, an MIT-licensed CommonMark-compliant parser that bridges to Sphinx (checked on github.com, 9 September 2026). Its own site describes generating API documentation from docstrings for Python, C++ and other domains; cross-references to sections, figures, tables, citations, glossaries and code objects, and across separate projects; and output as HTML, LaTeX for PDF, ePub and Texinfo (checked on sphinx-doc.org, 9 September 2026). Those three capabilities are the reason it survives its own conceptual weight.

| Pros | Cons |
| --- | --- |
| Real cross-referencing: link to a function, a term or a page and have it checked | reStructuredText by default, so Markdown is a deliberate addition |
| API documentation extracted from source | The heaviest conceptual model here: directives, roles, domains |
| Multiple output formats from one source, including PDF | Configuration is Python, and it grows |
| Long-established in scientific and Python projects | Overkill for a docs site with no API surface |

**Who it is for:** projects whose documentation has to reference code precisely — libraries, scientific software, anything where "link to this function's docs" is a daily need.

### A documentation platform

The fourth category is not a generator at all: you connect a repository and something else builds and hosts the site. Read the Docs is the long-standing example for Sphinx and MkDocs projects, and it states that Read the Docs Community is "free, forever" for open source, with commercial plans at Basic $50, Advanced $150 and Pro $250 per month and Enterprise starting at $10,000 per year (checked on about.readthedocs.com, 9 September 2026). It also builds your documentation for every new pull request, which means a change can be read in place before it lands rather than after (checked on docs.readthedocs.com, 9 September 2026).

| Pros | Cons |
| --- | --- |
| Somebody else owns the build environment and its upgrades | You own the configuration but not the environment it runs in |
| Pull request previews and versioned builds without workflow files | Debugging a failed build means reading their logs, not yours |
| A URL and hosting you do not maintain | Commercial pricing for private repositories |
| Non-engineers can be given access without a terminal | Migration away means rebuilding the pipeline you skipped |

**Who it is for:** teams who have concluded that the generator is necessary and the build infrastructure is not interesting. It is a reasonable conclusion, and it is the only option on this page where the second-year maintenance cost is somebody else's staffing problem.

## The second year, which is where the cost lives

Every getting-started page measures the cost of a generator in minutes. That number is honest and irrelevant. The install is not the cost; the install is the cheapest thing that will ever happen to this site.

Here is the shape of the actual cost. In month one somebody sets up the generator, picks a theme, and gets a good-looking site published on merge. It works. Nobody thinks about it for ten months, which is exactly what a build step is supposed to earn you. In month eleven, one of four things happens.

The CI image updates its default runtime, and a native dependency somewhere in the theme's tree no longer has a prebuilt binary for the new version, so the build fails while compiling something nobody knew was there. Or a security advisory lands on a transitive dependency, the automated bump opens a pull request, and the theme's peer dependency range refuses the new major version — so you can either leave the advisory open or upgrade the theme, which changes the site's layout. Or the theme is simply no longer maintained, and the fork everybody moved to has different configuration keys. Or none of the above happens, and instead somebody needs to add a page, discovers that the navigation is declared in a YAML file with an ordering convention they cannot infer, and asks in a channel where the only person who knew has left.

That last one is the most common and the least discussed. A toolchain's real dependency is a person. The generator is fine; the knowledge evaporated. And the failure is not dramatic — it looks like documentation that stops getting updated, because the cost of updating it went from "edit a file" to "work out how this builds".

The compiled generators are meaningfully better here. Hugo and mdBook are binaries: pin the version, commit the version number, and the build that worked last year works this year because nothing is being resolved at build time. The Node-based options are the other end — the most capability, the most moving parts, and a lockfile that describes hundreds of things that can change underneath you.

### And the counterweight, which is real

None of that means "always use a converter". Outgrowing a converter is a genuinely annoying migration, and pretending otherwise would be dishonest.

What it looks like: you have thirty pages published by a script. Now somebody wants a sidebar. So you write one, by hand, in every file — or you write a little template step, and then a nav-generation step, and then a link checker, because pages started referring to each other. Six months of that and you have built a bad static site generator with no documentation and one maintainer. That is worse than adopting MkDocs on day one, considerably worse, and it is a common way to arrive at a mess.

The migration itself costs: URLs change unless you are careful, which means redirects; front matter has to be reshaped into whatever the generator expects; anything your script did in an ad hoc way has to be re-expressed in a template language. It is a week of work, not a day.

So the honest rule is asymmetric. Starting with a converter and moving to a generator later costs you a bounded migration, once, if the requirement actually grows. Starting with a generator you did not need costs you maintenance every year, whether the requirement grows or not. The first risk is a known quantity; the second is a subscription. But the moment you catch yourself writing templating logic around a converter, stop and install a generator — that is the signal, and it is unmistakable when it arrives.

## Six questions to answer about your own situation

Answer these about the documents you actually have, not the documents you might have next year.

1. **Does any page need a link to another page that must not silently break?** If yes, you need something that walks the whole set and fails when a link rots, which means a generator or a platform — a per-file converter cannot see the other files, so the rot is invisible until a reader hits it.
2. **Does somebody need to search across all of it?** Browser find-in-page searches one document. A search box needs an index built over every page at compile time, and nothing that converts files one at a time can produce one, so this answer alone can decide it.
3. **Does it have to be republished without a person deciding to?** If the docs must be current after every merge, the publish step has to run unattended, and then the only question is whether the unattended thing is a generator or a three-line script — but manual publishing is not an option you can choose, because it degrades to no publishing.
4. **Who is the least technical person who will have to publish a change?** If that person does not use a terminal, any local build step excludes them permanently, and the site will accumulate a queue of edits waiting on somebody else — so the build belongs in CI or on a platform, whichever you pick.
5. **Which runtime does your team already keep working in CI?** Choosing a generator on a runtime you do not otherwise maintain doubles the number of toolchains you patch, and the second one always gets patched late, which is how a docs build ends up as the oldest thing in your pipeline.
6. **If the person who sets this up leaves in six months, can somebody else add a page?** Write down the answer honestly. If it is no, choose the option with the least configuration rather than the most capability — a slightly worse site that anybody can edit beats a better one that nobody dares touch.

Score them. Two or more yeses in questions one to three means a generator, and questions four and five choose which. If questions one to three are all no, you are looking at a document-shaped problem, and the tool for a document-shaped problem is a converter.

## Conclusion

A static site generator is the right answer when the pages have to know about each other and the build has to run without you. It is the wrong answer for a document with a recipient, for a set of unrelated notes, and for any situation where nobody on the team will still understand the build in a year. The middle ground is real and underused: a converter with a script in front of it publishes a directory of pages on every push with no theme, no lockfile and one command to debug. If what you have is a single document that has to reach somebody and look right when it arrives, [converting Markdown to a self-contained HTML file](/) takes a browser and no install, and there is nothing left over to maintain afterwards. Install the generator when the second question you ask about your documents is "how do I link these together?" — and not before.

## FAQ

### Do I need a static site generator to publish one Markdown file?

No. A generator produces a directory of interlinked files, which is exactly the wrong output for a single document — you cannot attach it to an email, and hosting it means keeping a deploy target alive. Convert it to a self-contained HTML file, or publish it as a link, and you are done.

### Is a static site generator overkill for a `docs/` folder in my repository?

It depends entirely on whether the pages reference each other. Eight independent reference pages are fine converted individually, or even read as rendered Markdown at their repository URLs. Eight pages with a shared sidebar and cross-links are a small site, and a generator will check the links you would otherwise break.

### Which static site generator has the lowest maintenance?

The ones distributed as a single binary, because nothing is resolved at build time. Hugo (Apache-2.0) and mdBook (MPL-2.0) both install as a downloaded binary, so pinning a version means the build that worked last year still works. Node-based generators offer more capability and a much larger dependency surface to keep patched.

### Can I use a static site generator without knowing JavaScript?

Yes. MkDocs and Sphinx are Python, Hugo is a Go binary, and mdBook is a Rust binary — none requires you to write JavaScript. Docusaurus is the exception: customising it beyond configuration means writing React, and that is a fair reason to choose something else.

### What if I start with a converter and outgrow it?

You migrate, and it costs about a week: reshaping front matter, re-expressing your script's behaviour in a template language, and adding redirects so old URLs keep working. That is a bounded, one-time cost, which compares well with maintaining a build you never needed. The signal to migrate is the day you start writing templating logic around the converter.

### Can I get search across my documents without a generator?

Not in any satisfying way. Search needs an index built over the whole set, which is a build-time job by definition. If a search box is a requirement, it is one of the strongest reasons on the list to use a generator or a hosted documentation platform.

### Is publishing Markdown on GitHub or GitLab good enough?

For internal engineering documentation, often yes. Both render Markdown documents held in a repository — tables and task lists included — at the file's own URL, with no build, no theme and no deploy (checked on docs.github.com and docs.gitlab.com, 9 September 2026). What you give up is navigation, scoped search and control over presentation — which may cost nothing at all if the only readers are the people who already commit to the repository.

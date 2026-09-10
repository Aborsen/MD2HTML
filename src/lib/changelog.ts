import raw from '../../content/changelog.md?raw';

/*
 * The entries, without the part written for somebody reading the file in the repository.
 *
 * `content/changelog.md` opens with an H1 and a sentence saying what the file is. The page renders
 * its own heading and lede from the catalogue, in the reader's language, so those two would appear
 * twice — once in English. Everything from the first release heading down is the content.
 *
 * The prerenderer reads the same file off disk rather than importing this, because it runs in Node
 * with no bundler in front of it. It takes the same slice and throws when there is no release
 * heading to slice at, so a file edited into the wrong shape fails the build rather than rendering
 * its own title twice.
 */
const FIRST_ENTRY = raw.indexOf('\n## ');

export const CHANGELOG = FIRST_ENTRY === -1 ? raw : raw.slice(FIRST_ENTRY + 1);

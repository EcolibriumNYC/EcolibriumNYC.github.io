# EcolibriumNYC Learning Resources

Astro Starlight site of learning resources for the EcolibriumNYC STEM workforce
program. Audience: students, interns, hackers, and tinkerers. The Virtual Power
Plant (`vpp`) is the main project and the running example throughout. The LES
Solar Map (`solar-map`) and Thermal Camera (`thermal-camera`) appear in the
schema and matrix but don't need to be mentioned in page content.

## Commands

Node is pinned in `.mise.toml`. Run `mise install` first.

- `mise run dev`: install dependencies if needed, then start the dev server with hot reload.
- `mise run preview`: production build, then serve it locally.
- `npm run build`: production build. Also validates every page's frontmatter against the schema, and `starlight-links-validator` fails the build on any broken internal link.

## Layout

- `src/content/docs/<section>/index.md`: one folder per section, so subpages can be added without changing URLs. A page's diagrams live next to it in the same folder.
- `src/content/docs/getting-started/`: the 30-minute onboarding path (terminal → configure Git → local Git workflow → GitHub account → clone → run with mise). Keep it minimal and literal.
- `src/content.config.ts`: frontmatter schema.
- `astro.config.mjs`: site config, sidebar order, draft badges, redirects, fonts, code-block theme, and plugins. Add new sections to the sidebar here.
- `src/styles/theme.css`: the lab-notebook theme (colors, fonts, graph-paper background, diagrams, tables, "Try it" cards).
- `src/components/PageTitle.astro`: replaces Starlight's page title. On the home page it renders the hero and the learning path (built from the sidebar order and each page's `description`); on other pages it adds a strip of chips from the frontmatter.
- `.github/workflows/deploy.yml`: builds with the mise-pinned Node and deploys to GitHub Pages on every push to `main`.

Sections are ordered so each builds on the last: Linux and Your Computer → Embedded Systems → Programming Fundamentals → Networking and the Internet → The Computing Stack → Reverse Engineering. Data Science and Building Science & Energy Systems are more standalone.

## Deployment

This repo is `EcolibriumNYC/EcolibriumNYC.github.io`, served at https://ecolibriumnyc.github.io/. Because it's the org Pages repo, the site is at the domain root: there is no `base` path, and root-relative links in content work as written. Don't move the site to a project repo without adding `base` and fixing every internal link.

The org profile (`profile/README.md`, `RESOURCES.md`) is a separate repo, `EcolibriumNYC/.github`. Its `RESOURCES.md` links have been migrated into this site.

### Renaming a section

URLs are public once pushed. When renaming a section folder, use `git mv`, update every link to it, and add the old path to `redirects` in `astro.config.mjs` so shared links keep working. Prefer URLs that match the title (`/computing-stack/` for "The Computing Stack").

## Frontmatter (required on every page)

```yaml
title: "Embedded Systems"
description: "One line."
ownership: frame-and-link        # own | frame-and-link | link
projects: [vpp, thermal-camera]  # at least one of: vpp, solar-map, thermal-camera
coreFor: [vpp]                   # optional; must be a subset of projects
owner: "@github-handle"          # person responsible for keeping the page current
lastReviewed: 2026-10-03         # date someone last checked content and links
```

Quote `title` and `description`, because colons and `&` break YAML. When you
check a page's links, update `lastReviewed`.

`projects` and `coreFor` mirror the Core/Helpful matrix on the landing page
(`src/content/docs/index.md`). Keep the two in sync.

Mark unfinished pages with a `badge: { text: 'Draft', variant: 'caution' }` on their sidebar entry in `astro.config.mjs` (it also shows as a chip on the page and on the home page), plus a `:::note[Draft]` aside at the top of the page so the status survives outside the site. Don't put "(DRAFT)" in the title. Notes on a draft page are short bullets in the maintainer's words. Don't expand them into prose until asked.

## Ownership tiers

- **`own`**: we write and maintain the content. Use it for program-specific material that exists nowhere else, such as Getting Started.
- **`frame-and-link`**: we write the framing, key ideas, and hands-on steps in our own words, and link out for depth and details. This is the default for sections.
- **`link`**: a curated list of external links with at most a sentence each.

Prefer linking over writing for anything that changes often (tool install
steps, CLI flags, library APIs, datasheets). Link to the upstream docs so they
can't go stale here. For example, Getting Started links to mise's install guide
instead of copying it.

## Writing style

The maintainer's style, learned from many rounds of revision. Draft new pages in this shape from the start.

- **Zoom out first.** Lead with the one big idea and how the pieces interact, often as "it's just…" ("it's just a small computer", "it's just passing messages"). Leave syntax and details for later or elsewhere, and say so.
- **Thread a framework through the site.** The four resources (CPU, storage, memory, network / IO) from Embedded Systems are the spine. Tie new material back to them and to earlier sections with internal links.
- **Reuse simple, concrete examples.** The button-and-LED breadboard circuit appears in Embedded Systems, Programming Fundamentals, and Reverse Engineering. The VPP is the real-world example; Lower East Side data is the dataset.
- **Recurring themes:** understanding and owning your stack, trust and responsibility for dependencies, reproducibility (pinned runtimes, lockfiles, notebooks), and local-first systems. Keep new pages consistent with them.
- **Hands-on "Try it" steps** are minimal and literal: numbered steps, with a short inline comment on each command explaining what it does (`git init  # turn this folder into a repository`). Stay local before needing outside services (push to a local bare repo before GitHub). Give OS differences in one sentence. Use real, runnable things: the site's own repo, real packets, real public data.
- **One diagram per section**, of a simple concrete example (see Diagrams).
- **References:** one external reference near the top, then Primary sources and Learn more at the bottom. No per-section "see chapter X" pointers in the body.
- **Prefer a short section over a callout** when the emphasis would be about the same. Keep asides for drafts, link checks, and true warnings.
- **Plain, friendly language** for interns. Short sections with descriptive headings. Name our real tools (mise, pixi, marimo, Git) and state our standards plainly ("We standardize on pixi").
- **Respect the maintainer's edits.** When revising a page, keep wording they've changed by hand, and change only what was asked.

## Page structure

Every section page has:

1. A one-sentence purpose.
2. Body content (optional for stubs).
3. `## Primary sources`: official docs, specs, standards, datasheets, the original project.
4. `## Learn more`: tutorials, courses, guides, internal links to related sections, and other secondary material.

Use `_None yet._` for an empty list rather than deleting the heading.

## Diagrams

- Hand-written SVG files next to the page, referenced with a relative path: `![alt text](./diagram.svg)`.
- Give each one a white rounded-rectangle background (it's a "card"), so it reads in both light and dark themes, plus `<title>` and `<desc>` elements.
- Write alt text that describes the whole diagram, so the page makes sense without the image.
- Check layout by rendering to PNG (`rsvg-convert -w 1000 file.svg -o out.png`) and looking for overlapping text before publishing.

## Content stays portable Markdown

- Plain Markdown only: headings, lists, links, tables, code blocks, images.
- The **only** custom syntax allowed is Starlight asides: `:::note`, `:::tip`, `:::caution`, `:::danger`.
- No MDX, no component imports, no inline HTML or `style` attributes, and no Starlight-specific frontmatter for presentation (e.g. `template: splash`, `hero`).
- Use root-relative links between pages (`/networking/`).

The aim is that the content still makes sense if moved to another static site generator or read raw on GitHub.

## Presentation lives in layouts/CSS only

The theme is a lab notebook: warm paper and ink in light mode, warm charcoal in dark mode, a faint graph-paper grid, Fraunces for headings, Atkinson Hyperlegible Next for body text, and JetBrains Mono for code. Accent colors come from the diagram palette (amber, blue, green, pink), so diagrams and site share one look. Some styling is keyed to content conventions rather than markup: every `## Try it` section is styled as an exercise card, and draft status, `lastReviewed`, and `owner` appear as chips under the page title (an `owner` of `@TBD` is hidden).


Styling, theming, and component overrides go in `astro.config.mjs`
(`customCss`, `components`) and files under `src/styles/` or `src/components/`,
never in content files. If a page seems to need special presentation, solve
it in the layout or CSS for every page, not with markup in one page.

## External material: link or summarize, don't copy

- Link to external material, or summarize it **in our own words**.
- Don't paste or lightly reword someone else's text, diagrams, or code unless its license explicitly allows adaptation (e.g. CC BY, CC BY-SA, MIT). If it does, give attribution and link the license, and follow any share-alike terms.
- Short quotations with attribution are fine when the exact wording matters.
- When unsure about a license, link instead.
- Known cases: the UTexas Valvano embedded systems book is CC BY-NC-ND (no derivatives), so summarize it, don't adapt it. The Odin Project is CC BY-NC-SA, so write fresh rather than adapting. Open-Meteo data is CC BY 4.0 and needs an attribution line where it's used.

## Verify before publishing

- Run every hands-on command and code example yourself before adding it, and report what you couldn't run (for example, GUI steps in Ghidra).
- `npm run build` must pass, and every internal link must resolve.

## Link hygiene

- Labels must describe where a link actually goes. Before adding a link, open it and check where it ends up after redirects.
- Flag broken or mismatched links in place with a `:::caution[Link check]` aside giving the date checked. Don't silently relabel or delete them; the page owner decides the fix.
- Update redirected URLs to their final destination.

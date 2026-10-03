# EcolibriumNYC Learning Resources

Astro Starlight site of learning resources for the EcolibriumNYC STEM workforce
program. Audience: students, interns, hackers, and tinkerers working on three
projects: Virtual Power Plant (`vpp`), LES Solar Map (`solar-map`), and Thermal
Camera (`thermal-camera`).

## Commands

Node is pinned in `.mise.toml`. Run `mise install` first.

- `npm run dev`: local dev server
- `npm run build`: production build. Also validates every page's frontmatter against the schema.

## Layout

- `src/content/docs/<section>/index.md`: one folder per section, so subpages can be added without changing URLs.
- `src/content/docs/getting-started/`: the 30-minute onboarding path (terminal → configure Git → clone → `mise install`). Keep it minimal and literal.
- `src/content.config.ts`: frontmatter schema.
- `astro.config.mjs`: site config and sidebar order. Add new sections to the sidebar here.
- `.github/workflows/deploy.yml`: builds with the mise-pinned Node and deploys to GitHub Pages on every push to `main`.

## Deployment

This repo is `EcolibriumNYC/EcolibriumNYC.github.io`, served at https://ecolibriumnyc.github.io/. Because it's the org Pages repo, the site is at the domain root: there is no `base` path, and root-relative links in content work as written. Don't move the site to a project repo without adding `base` and fixing every internal link.

The org profile (`profile/README.md`, `RESOURCES.md`) is a separate repo, `EcolibriumNYC/.github`. Its `RESOURCES.md` links have been migrated into this site.

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

## Ownership tiers

- **`own`**: we write and maintain the content. Use it for program-specific material that exists nowhere else, such as Getting Started or how our projects use a concept.
- **`frame-and-link`**: we write a short framing in our own words (why it matters for our projects, what to focus on) and link out for the depth. This is the default for sections.
- **`link`**: a curated list of external links with at most a sentence each.

Prefer linking over writing for anything that changes often (tool install
steps, CLI flags, library APIs, datasheets). Link to the upstream docs so they
can't go stale here. For example, Getting Started links to mise's install guide
instead of copying it.

## Page structure

Every section page has:

1. A one-sentence purpose.
2. Body content (optional for stubs).
3. `## Primary sources`: official docs, specs, standards, datasheets, the original project.
4. `## Learn more`: tutorials, courses, guides, and other secondary material.

Use `_None yet._` for an empty list rather than deleting the heading.

## Content stays portable Markdown

- Plain Markdown only: headings, lists, links, tables, code blocks, images.
- The **only** custom syntax allowed is Starlight asides: `:::note`, `:::tip`, `:::caution`, `:::danger`.
- No MDX, no component imports, no inline HTML or `style` attributes, and no Starlight-specific frontmatter for presentation (e.g. `template: splash`, `hero`).
- Use root-relative links between pages (`/linux/`).

The aim is that the content still makes sense if moved to another static site generator or read raw on GitHub.

## Presentation lives in layouts/CSS only

Styling, theming, and component overrides go in `astro.config.mjs`
(`customCss`, `components`) and files under `src/styles/` or `src/components/`,
never in content files. If a page seems to need special presentation, solve
it in the layout or CSS for every page, not with markup in one page.

## External material: link or summarize, don't copy

- Link to external material, or summarize it **in our own words**.
- Don't paste or lightly reword someone else's text, diagrams, or code unless its license explicitly allows adaptation (e.g. CC BY, CC BY-SA, MIT). If it does, give attribution and link the license, and follow any share-alike terms.
- Short quotations with attribution are fine when the exact wording matters.
- When unsure about a license, link instead.

## Link hygiene

- Labels must describe where a link actually goes. Before adding a link, open it and check where it ends up after redirects.
- Flag broken or mismatched links in place with a `:::caution[Link check]` aside giving the date checked. Don't silently relabel or delete them; the page owner decides the fix.
- Update redirected URLs to their final destination.

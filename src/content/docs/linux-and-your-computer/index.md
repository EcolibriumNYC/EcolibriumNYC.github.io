---
title: "Linux and Your Computer"
description: "Your platform, the shell, code editors, and Git: the everyday tools behind every project."
ownership: frame-and-link
projects: [vpp, solar-map, thermal-camera]
coreFor: [vpp, solar-map, thermal-camera]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This section goes beyond [Getting Started](/getting-started/) to explain the computer you're working on and the everyday tools you'll use on every project.

:::note[Draft]
This page is an early outline. It will be expanded to match the other sections.
:::

## Platform and architecture

Software is built for a particular **platform**: an operating system (Linux, macOS, Windows) running on a particular processor **architecture**. Most laptops use `x86_64`, while Apple Silicon Macs and Raspberry Pis use ARM (`arm64`/`aarch64`). A program compiled for one combination usually won't run on another. That's why install pages ask you to pick your OS and chip, and why tools like mise download a different file depending on your machine.

## The shell

The shell is the text interface where you type commands. Learning to move between folders, list and edit files, and read error messages makes every other tool easier to use.

## Code editors

A code editor is where you'll spend most of your time. Look for syntax highlighting, a built-in terminal, and Git integration.

## Git

Git records the history of a project and lets many people work on it at once. On our projects, changes are shared through GitHub pull requests.

## Primary sources

- [Git reference documentation](https://git-scm.com/doc)

## Learn more

- [MDN Command Line Guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line)
- [MDN Code Editor Basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Installing_software)
- [Odin Project Git Basics Guide](https://www.theodinproject.com/lessons/foundations-setting-up-git)

:::caution[Link check]
- "MDN Code Editor Basics" goes to MDN's **Installing basic software**, which covers browsers, editors, and other tools, not just editors.
- "Odin Project Git Basics Guide" goes to the **Setting up Git** lesson, not the Git Basics lesson.

Checked 2026-10-03. Relabel or replace.
:::

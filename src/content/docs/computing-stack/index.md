---
title: "The Computing Stack"
description: "How real applications are built from layers of other people's code: dependencies, abstractions, and the balance between trust and responsibility."
ownership: frame-and-link
projects: [vpp, solar-map, thermal-camera]
coreFor: [vpp, solar-map]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This section explains how complete applications are assembled from many pieces, most of them written by other people, and how to organize those pieces so a team can keep working on them.

The microcontroller program in [Programming Fundamentals](/programming-fundamentals/) was one file you mostly wrote yourself. A website, a data dashboard, or a server collecting readings from devices is different: most of its code comes from other people, and your job is to choose the pieces, connect them, and add the part specific to your project. For a longer introduction to how web applications are built, see MDN's [Server-side website programming first steps](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps).

## The layers of an application

![Six stacked layers, top to bottom: your code; a framework such as Astro or Flask; libraries installed by a package manager such as npm or pip; a runtime such as Node or Python, pinned by mise; the operating system; and the hardware. The framework, libraries, and runtime are marked as dependencies. The operating system and hardware are marked as the platform.](./app-layers.svg)

Each layer relies on the one below it. Your code sits on top of a framework, which uses libraries, which run on a runtime, which runs on an operating system, on hardware. The bottom two layers are the [platform](/linux-and-your-computer/), and the hardware is the same four resources (CPU, storage, memory, network / IO) from [Embedded Systems](/embedded-systems/).

## Dependencies

A **dependency** is code your project uses that someone else wrote and maintains. Dependencies have their own dependencies, and so on down. This site asks for just 3 packages, but installing them pulls in 376.

A **package manager** keeps track of them: npm for JavaScript, pip for Python. Two files work together:

- The **manifest** lists what your project asks for (`package.json` for npm, `pyproject.toml` or `requirements.txt` for Python).
- The **lockfile** records the exact version of every package that actually got installed (`package-lock.json` for npm), so everyone on the team gets the same thing.

Version numbers usually follow **semantic versioning**: `MAJOR.MINOR.PATCH`, like `7.3.5`. A patch fixes bugs, a minor version adds features, and a major version may break code that used the old one.

Some projects also **vendor** their dependencies: they copy the dependency's source code into their own repository instead of downloading it at install time. That way you control exactly what you build with, can read and patch it, and can still build if the original disappears. We vendor many of our dependencies at Ecolibrium.

mise does the same job one layer down: `.mise.toml` pins the runtime itself, like the exact version of Node, which is why [Getting Started](/getting-started/) runs `mise install`.

Every dependency saves you work but costs something: more to download and store, more code that might have security problems, and more things that can break when they're updated. On a microcontroller, each library also eats into scarce flash storage.

## Try it

This site is itself an application. Download it and look at its dependencies:

```sh
git clone https://github.com/EcolibriumNYC/EcolibriumNYC.github.io.git
cd EcolibriumNYC.github.io
cat .mise.toml          # the pinned runtime: which Node version
cat package.json        # the manifest: what we asked for
mise install            # install that Node version
npm install             # download every dependency into node_modules
npm ls                  # the packages we asked for, and their versions
```

Then run it:

```sh
mise run dev            # start the site and print its local address
```

Open the address it prints. You're running the same site you're reading right now, built from your own copy. Press `Ctrl+C` in the terminal to stop it.

## Abstractions

An **abstraction** puts some complexity behind an interface. You use the interface and don't need to know what's behind it. You've already used plenty:

- A **function** like `printf` hides how text actually reaches the screen.
- The **compiler** hides the machine code: you write C, and it worries about the CPU's instructions.
- An **HTTP request** hides routing: you ask for a page, and you never think about the routers in between.
- `git push` hides how files get packed up and copied to another machine.

Abstractions are how we build complicated software. Each layer in the diagram above is an abstraction over the one below it, so you can write a website without thinking about transistors. A **framework** is a big abstraction: it hides most of the structure of an application, so you only write the parts specific to your project.

## Trust

Every abstraction is something you trust. You trust that the compiler turns your C into correct machine code, that the network delivers your packets, that the hardware does what its datasheet says, and that a library does what its documentation says.

Look back over the past few sections: [hardware](/embedded-systems/), [compilers](/programming-fundamentals/), [networks](/networking/), and now hundreds of packages. The computing stack is vast, with interfaces everywhere, and nobody can check all of it themselves. Building anything means trusting a lot of people you'll never meet.

## Responsibility

An abstraction is still a dependency. It works until it doesn't: a bug, a security problem, an update that changes how it behaves, or a maintainer who stops working on it. When that happens, it's our project that's broken, and we have to fix it or find a replacement.

So we're always balancing two things: trusting other people's work, and being responsible for what we depend on. Before adding a dependency, ask:

- **Do we need it?** A few lines of our own code can be better than a whole package.
- **Who maintains it?** Is it still active, and do other projects rely on it?
- **What does it bring with it?** Its own dependencies, its size, its license.
- **What happens if it breaks or disappears?** Could we patch it, vendor it, or replace it?

When an abstraction does break, sometimes the only way forward is to look underneath it. That's what [Software Reverse Engineering](/reverse-engineering/) practices.

## Primary sources

- [Semantic Versioning](https://semver.org/)
- [npm: package.json reference](https://docs.npmjs.com/cli/configuring-npm/package-json)

## Learn more

- [MDN: Server-side website programming first steps](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps)
- [Joel Spolsky: The Law of Leaky Abstractions](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/): why every abstraction eventually shows what's underneath.
- [Ken Thompson: Reflections on Trusting Trust (PDF)](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf): a classic short lecture on how far you have to trust your compiler.
- [xkcd: Dependency](https://xkcd.com/2347/): the whole stack in one comic.

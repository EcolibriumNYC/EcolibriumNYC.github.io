---
title: "Software Applications"
description: "How real applications are put together: dependencies, frameworks, and application design."
ownership: frame-and-link
projects: [vpp, solar-map, thermal-camera]
coreFor: [vpp, solar-map]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This section explains how complete applications are built from other people's code and organized so a team can keep working on them.

## Dependencies

Almost no application is written from scratch. Projects depend on libraries and runtimes, and those depend on others in turn. Package managers (like npm) and version pinning (like mise) keep everyone on the same versions so the project builds the same way on every machine.

## Web frameworks

A framework provides the structure of an application, such as routing, pages, and talking to a server, so you only write the parts specific to your project. This site, for example, is built with the Astro framework.

## Application design

Design decisions include how to split an application into parts, where data lives, and how the parts talk to each other. These choices determine how easy the application is to change, test, and run.

## Primary sources

_None yet._

## Learn more

_None yet._

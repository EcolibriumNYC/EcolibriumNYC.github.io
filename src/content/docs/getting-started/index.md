---
title: "Getting Started"
description: "A 30-minute path from opening a terminal to running one of our projects on your machine."
ownership: own
projects: [vpp, solar-map, thermal-camera]
coreFor: [vpp, solar-map, thermal-camera]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This page gets you from zero to one of our projects running on your own computer in about 30 minutes.

## 1. Open a terminal (~3 min)

- **macOS:** open **Terminal** (Applications → Utilities).
- **Linux:** open your distribution's terminal app.
- **Windows:** open **PowerShell** from the Start menu.

You'll type every command below into this window. New to the command line? Skim the [MDN Command Line Guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line).

## 2. Configure Git (~5 min)

Check whether Git is installed:

```sh
git --version
```

If that prints an error, install Git from [git-scm.com/downloads](https://git-scm.com/downloads), then open a new terminal.

Run these commands to configure Git. Use a real email address; you'll use the same one for your GitHub account in step 4:

```sh
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 3. Learn the Git workflow (~10 min)

Practice on a throwaway project that lives only on your computer. Nothing here is uploaded to the internet.

Make a folder and turn it into a Git repository:

```sh
mkdir git_test; # "make directory"
cd git_test; # "change directory"
git init
```

If Git prints hints about the initial branch name, you can ignore them. You'll rename the branch later in this step.

Create an empty file and ask Git what it sees:

```sh
touch hello_world.txt; # "creates empty file"
git status
```

On Windows PowerShell, use `New-Item hello_world.txt` instead of `touch`.

Git lists `hello_world.txt` under **Untracked files**: it sees the file but isn't keeping track of it yet.

Saving a change in Git takes two steps. First you **stage** the change (pick what goes in), then you **commit** it (save a snapshot with a message):

```sh
git add hello_world.txt
git status
git commit -m "Add hello_world.txt"
git status
```

After `git add`, the file moves to **Changes to be committed**. After `git commit`, Git reports **nothing to commit, working tree clean**.

Now change the file. Open `hello_world.txt` in your editor, type a line of text, and save. Then:

```sh
git status
git add .
git commit -m "Add a greeting to hello_world.txt"
```

This time `git status` lists the file under **Changes not staged for commit**: Git already tracks it, and it has changed since the last commit. `git add .` stages every change in the current folder.

See your history:

```sh
git log
```

You should see two commits, each with your name, email, and the time. If the screen shows `(END)` at the bottom, press `q` (for quit) to get back to the prompt.

Finally, try to send your commits somewhere else:

```sh
git push
```

Git replies `fatal: No configured push destination.` Pushing uploads your commits to a **remote**: a copy of the repository stored on another computer. By convention the main remote is named `origin`. This practice repository doesn't have one, so your commits exist only on your computer.

A remote can also be a folder on your own computer, which makes it easy to practice. Create an empty repository next to `git_test` to act as the remote, then push to it:

```sh
git init --bare ../git_test_remote.git; # an empty repository to push to
git remote add origin ../git_test_remote.git; # name it "origin"
git branch -M main; # name your branch "main"
git push -u origin main; # upload, and make origin the default
git remote -v
```

`git remote -v` shows that `origin` points at `../git_test_remote.git`. `git status` now reports **Your branch is up to date with 'origin/main'**, and from now on a plain `git push` sends new commits there.

:::note[GitHub is our central store]
In real projects the remote lives on another computer. Each of our projects has one shared remote on GitHub. Everyone clones from it, pushes their commits to it, and pulls everyone else's work from it. That's how many people can work on the same project from different computers.
:::

When you're done, leave the practice folder:

```sh
cd ..
```

## 4. Create a GitHub account (~5 min)

Go to [GitHub.com](https://github.com/) and create an account! During the account setup, it will ask you for an email address. This needs to be a real email, and will be used by default to identify your contributions. Use the same email you gave Git in step 2.

## 5. Clone a project (~5 min)

Download a project and move into its folder. This example uses the Virtual Power Plant:

```sh
git clone https://github.com/EcolibriumNYC/Virtual-Power-Plant.git
cd Virtual-Power-Plant
```

The other projects work the same way:

- `https://github.com/EcolibriumNYC/LES-Solar-Map.git`
- `https://github.com/EcolibriumNYC/Thermal_Camera.git`

:::note
If `git clone` asks for a password or says "Repository not found," your GitHub account needs access to the EcolibriumNYC organization. Ask your mentor.
:::

Cloning sets up the remote for you. Look at it:

```sh
git remote -v
```

```text
origin	https://github.com/EcolibriumNYC/Virtual-Power-Plant.git (fetch)
origin	https://github.com/EcolibriumNYC/Virtual-Power-Plant.git (push)
```

`origin` points at our project on GitHub, so `git push` here knows where to send your commits.

From here, you can follow the same git workflow to edit, add, commit, and finally git push changes to our project.

To put your own project on GitHub, create an empty repository there and run the `git remote add` commands from step 3, replacing the path with the GitHub URL.

## 6. Run it with mise (~2 min)

We use [mise](https://mise.jdx.dev/) so everyone has the same tool versions. Install it by following the [mise Getting Started guide](https://mise.jdx.dev/getting-started.html). The steps differ by operating system and change over time, so follow theirs rather than a copy here.

Then, from inside the project folder:

```sh
mise install
```

This installs the exact runtimes the project needs. Follow the project's own `README.md` for the command that starts it.

## Primary sources

- [mise documentation](https://mise.jdx.dev/getting-started.html)
- [Git reference documentation](https://git-scm.com/doc)

## Learn more

- [The Odin Project: Git Basics](https://www.theodinproject.com/lessons/foundations-git-basics): a longer walkthrough of the same workflow, including pushing your work to GitHub.
- [Linux and Your Computer](/linux-and-your-computer/): more on the shell, code editors, Git, and your platform.

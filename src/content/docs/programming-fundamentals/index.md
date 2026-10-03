---
title: "Programming Fundamentals"
description: "How code becomes a running program, how a C program is organized, and how programs make decisions, before worrying about syntax."
ownership: frame-and-link
projects: [vpp, solar-map, thermal-camera]
coreFor: [vpp, solar-map, thermal-camera]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This section covers the big ideas behind programming a microcontroller: how your code becomes a running program, how a program is organized, and how it makes decisions.

You don't need to memorize syntax yet. The exact spelling of things comes with practice; these ideas are what make the syntax make sense. For a deeper, hands-on introduction in C, see UT Austin's [Chapter 2: Software Design](https://users.ece.utexas.edu/~valvano/Volume1/IntroToEmbSys/Ch2_SoftwareDesign.html).

## From text to a running program

Code goes through a chain of tools before it runs on a chip:

```text
main.c          source code, typed in an editor
  │ compiler
  ▼
main.s          assembly
  │ assembler
  ▼
main.o          machine code
  │ linker      (+ libraries and other files)
  ▼
firmware        one complete program
  │ loader
  ▼
chip's flash    runs at power-up; test it with a debugger
```

1. **Editor:** where you write your program as plain text, called **source code** (C files end in `.c`).
2. **Compiler:** translates your C into **assembly**, a human-readable list of instructions for one specific processor. This is why code has to be built for the chip it runs on (see [platform and architecture](/linux-and-your-computer/)).
3. **Assembler:** turns assembly into **machine code**, the actual binary instructions the CPU executes.
4. **Linker:** combines your code with everything else it uses (other files, libraries) into a single program, and decides where each piece will live in memory.
5. **Loader:** writes the finished program into the chip's flash storage. This is often called "flashing" or "uploading."
6. **Debugger:** lets you test the program on the chip: run it, pause it, step through it line by line, and look at values in memory.

In practice, one "Build" or "Upload" button usually runs steps 2–5 for you. Knowing the steps still helps you read errors. A typo is caught by the compiler, while a function that was declared but never written is caught by the linker ("undefined reference").

## The shape of a C program

Every C program has exactly one function called **`main`**. That's where the chip starts running your code when it powers on or resets. On a microcontroller, `main` usually never finishes: it sets things up, then loops forever.

A C program is organized into four sections, top to bottom:

1. **Documentation:** comments describing what the program does, who wrote it, when, and its copyright or license.
2. **Preprocessor directives:** lines starting with `#`, handled before compiling. `#include` pulls in code from other files, such as libraries. `#define` gives a name to a constant value.
3. **Declarations:** global variables (data the whole program can use) and function declarations (promises that a function exists, written further down).
4. **Functions:** the actual work of the program, including `main`.

Here's the button-and-LED project from [Embedded Systems](/embedded-systems/), with each section labeled. Don't worry about the exact syntax; look for the four sections.

```c
// 1. Documentation
// Toggles an LED each time the button is pressed.
// Author: Your Name   Date: 2026-10-03   License: MIT

// 2. Preprocessor directives
#include <stdbool.h>      // lets us use true and false
#include "board.h"        // made-up helpers for our board's pins
#define LED_PIN    2
#define BUTTON_PIN 3

// 3. Declarations
bool ledOn = false;       // global variable: is the LED on?
void toggleLed(void);     // function declaration

// 4. Functions
int main(void) {
  board_init();
  while (true) {                      // loop forever
    if (button_pressed(BUTTON_PIN)) {
      toggleLed();
    }
  }
}

void toggleLed(void) {
  ledOn = !ledOn;                     // flip true <-> false
  pin_write(LED_PIN, ledOn);
}
```

## Expressions and keywords

You'll see two more building blocks everywhere in C code:

- **Expressions** are the logic and math of a program: they combine values to produce a result, like `count + 1`, `temperature > 30`, or `ledOn && armed`.
- **Keywords** are words reserved by the language with a fixed meaning, like `if`, `while`, `return`, and `int`. You can't use them as names for your own variables or functions.

C has only a few dozen keywords and operators, and most languages share the same core ideas. Learn the details later as you need them, from a C reference or tutorial.

## Branching programs

An **`if` statement** checks a condition. If the condition is true, the program runs one block of code; otherwise it skips it, or runs an `else` block instead. A **`while` loop** repeats a block as long as its condition stays true.

Put a few of these together and the program can take different paths depending on its inputs. That's a **branching program**. On paper, it's often sketched as a flowchart, with diamonds for decisions and arrows for the paths.

Branching works well for simple programs, but it gets hard to follow as decisions pile up. The example above already has a bug: while the button is held down, `button_pressed` stays true on every pass through the loop, so the LED flickers on and off instead of toggling once. Fixing it means the program has to remember something: *was the button already down last time?*

## Finite state machines

A **finite state machine (FSM)** is a way to design a program around what it needs to remember. You describe:

- **States:** the situations the system can be in. Each state is a memory of "where we've been."
- **Outputs:** what the system does in each state.
- **Transitions:** which input moves the system from one state to another.

Here's the button-and-LED project redesigned as an FSM, with the flicker bug fixed:

![A state machine with four states in a loop. OFF, with the LED off, moves to ON_HELD, with the LED on, when the button is pressed. ON_HELD moves to ON when the button is released. ON moves to OFF_HELD, with the LED off, when the button is pressed. OFF_HELD moves back to OFF when the button is released.](./button-led-fsm.svg)

| State | LED | Button pressed | Button released |
| --- | --- | --- | --- |
| OFF | off | → ON_HELD | stay |
| ON_HELD | on | stay | → ON |
| ON | on | → OFF_HELD | stay |
| OFF_HELD | off | stay | → OFF |

The diagram and the table describe the same machine. Either one is a complete design you can check before writing any code. In code, an FSM is usually one variable holding the current state, plus a loop that reads the inputs, looks up the next state, and sets the outputs.

FSMs scale up well. A battery controller in a VPP might move between states like *idle*, *charging*, *discharging*, and *fault*. Laying those states out explicitly makes it much easier to check that every situation is handled.

## Seeing what your program is doing

When a state machine misbehaves, you need to see which states it went through and why. Two common techniques:

- **`printf`** prints a line of text. On a microcontroller, the text usually travels over a serial connection, through the USB cable, to a terminal on your laptop. Printing every transition, like `OFF -> ON_HELD`, shows the path the machine took. The catch: printing is slow for the chip. It uses CPU time and IO bandwidth, and it can change the timing of the very bug you're chasing.
- **Debug dump:** instead of printing as things happen, the program quietly records each event (the state, the input, and the time) into an array in RAM. Afterward, you read the whole record at once, with the debugger or one big print. This disturbs the program much less, at the cost of some memory.

Both trade one of the [four resources](/embedded-systems/) for visibility: printing spends CPU and IO, and a dump spends memory.

## Primary sources

_None yet._

## Learn more

- [UTexas: Chapter 2, Software Design](https://users.ece.utexas.edu/~valvano/Volume1/IntroToEmbSys/Ch2_SoftwareDesign.html): program structure, `if` and `while`, and functions in C, with flowcharts, videos, and interactive examples.
- [UTexas: Chapter 4, Arrays and Functional Debugging](https://users.ece.utexas.edu/~valvano/Volume1/IntroToEmbSys/Ch4_ArrayFunctionalDebugging.html): debugging techniques, including dumps, and how intrusive each one is.
- [UTexas: Chapter 5, Finite State Machines](https://users.ece.utexas.edu/~valvano/Volume1/IntroToEmbSys/Ch5_FiniteStateMachines.html): designing and building FSMs, with traffic light and vending machine examples.

:::note
The UT Austin material is licensed [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/), which doesn't allow adaptations. This page covers the same ideas in our own words and examples, and links to the original.
:::

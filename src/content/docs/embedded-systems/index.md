---
title: "Embedded Systems"
description: "Microcontrollers are small computers. Working with them means managing four scarce resources: CPU, storage, memory, and network/IO."
ownership: frame-and-link
projects: [vpp, thermal-camera]
coreFor: [vpp, thermal-camera]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This section introduces the microcontrollers inside the VPP nodes and the thermal camera, and the idea that ties all embedded work together: doing useful things with very limited resources.

## It's just a small computer

An embedded system is a computer hidden inside a device, built to do one job. It reads the physical world through sensors, makes decisions in software, and acts on the world through outputs like lights, motors, or relays. When it's connected to the internet, it's part of the Internet of Things (IoT).

The computer inside is usually a **microcontroller**: a processor, memory, storage, and input/output all packed onto a single chip. It's cheap, small, and uses very little power.

What makes embedded systems interesting is that the chip has far fewer resources than a laptop, so you have to manage them carefully. It helps to think of four main resources:

| Resource | A typical laptop | A typical microcontroller |
| --- | --- | --- |
| **CPU** | Several cores at a few GHz | Usually one core, from about 1 MHz to a few hundred MHz |
| **Storage** | Hundreds of GB on an SSD | A few KB to a few MB of flash |
| **Memory** | Many GB of RAM | Tens of bytes to a few hundred KB of RAM |
| **Network / IO** | USB, Wi-Fi, screen, keyboard | Individual pins, plus a radio on some chips |

The rest of this page goes through each resource. For a deeper, hands-on treatment, see UT Austin's [Chapter 1: Introduction to Embedded Systems](https://users.ece.utexas.edu/~valvano/Volume1/IntroToEmbSys/Ch1_Introduction.html).

## CPU

The processor runs your program by fetching instructions from storage and executing them one at a time. A microcontroller's processor is slower and simpler than a laptop's, and every instruction costs time and power. Work that takes a laptop an instant can keep a microcontroller busy long enough to miss a sensor reading.

Each processor family understands its own set of instructions, its **instruction set architecture**. This is the same idea as platform and architecture on the [Linux and Your Computer](/linux-and-your-computer/) page: code has to be built for the chip it runs on. Inside the processor, a small number of very fast **registers** hold the values being worked on right now, including which instruction comes next.

## Storage

Storage holds your program and anything else that has to survive losing power. On a microcontroller this is usually **flash**, a kind of read-only memory (ROM) that can be reprogrammed, but not as easily or as often as RAM can be written. Your compiled program (the **firmware**) has to fit in flash with room to spare. Every library you add takes up some of it.

## Memory

Memory (RAM) holds the data your program is working with while it runs: variables, sensor readings, buffers. Unlike storage, RAM is **volatile**: its contents disappear when power is lost. On a microcontroller, RAM is often the tightest resource of all. Some chips have only a few dozen bytes.

Managing memory means knowing how much space your data takes up:

- **Bits and bytes:** everything is stored as bits (1s and 0s), grouped into 8-bit bytes. A value stored in *n* bits can take 2ⁿ different values, so an 8-bit sensor reading has 256 possible levels.
- **Hexadecimal:** a shorthand for writing binary values. You'll see it constantly in datasheets and debuggers.
- **KB vs. KiB:** 1 KB is 1,000 bytes, but 1 KiB is 1,024 bytes. Datasheets usually mean the binary unit.
- **Memory map:** every byte of RAM, flash, and I/O has a numbered address. Knowing the map tells you where things live.
- **Endianness:** the order in which the bytes of a multi-byte number are stored. Most microcontrollers put the least significant byte first ("little endian"). This matters when you send data between devices.

## Network / IO

IO is how the chip touches the world. Each **pin** is one wire into or out of the chip, and a **port** is a group of pins. **General-purpose IO (GPIO)** lets software set each pin as an input (read a switch) or an output (turn on an LED). On many microcontrollers, the I/O hardware is controlled by reading and writing special addresses in the memory map, just like memory.

An **interface** is everything needed to connect to one device: the pin, any extra electronics, the device itself, and the software that talks to it. Signals reach the chip in four basic ways:

- **Parallel:** several bits at once, one per wire
- **Serial:** one bit at a time over a single wire. This is how most sensors and radios communicate.
- **Analog:** a value encoded as a voltage or current
- **Time:** a value encoded as a frequency, pulse width, or timing

Pins are limited, and so is the speed of each connection. Choosing which devices share which pins, and how often to talk to them, is part of designing the system. Networking, from radios to the internet, builds on these same IO basics. See [Networking](/networking/).

## Putting it together

Zoom out, and this is what a first embedded project often looks like: a small microcontroller board pressed into a breadboard, with a button that turns an LED on and off.

![A microcontroller board on a breadboard. Inside its chip are four blocks: CPU, storage, memory, and IO. One pin drives an LED through a resistor, another pin reads a push button, and both share a ground rail. A USB cable powers the board and uploads the firmware.](./breadboard-led.svg)

Even this tiny project uses all four resources, and they work together in a cycle:

1. **Storage:** you write the program on your laptop and upload it over USB into the chip's flash. It stays there when the board is unplugged and starts running again at power-up.
2. **Network / IO:** an input pin senses whether the button is pressed.
3. **CPU:** the processor runs the program's loop over and over: check the button, decide what to do, update the LED.
4. **Memory:** a few bytes of RAM remember whether the LED is currently on or off, so the program knows what to switch it to next.
5. **Network / IO:** an output pin turns the LED on or off. The resistor limits the current so the LED doesn't burn out.

Our real projects follow the same pattern at a larger scale. Swap the button for a temperature or power sensor, swap the LED for a relay or a radio, and the questions stay the same: Does the program fit in storage? Does the data fit in memory? Can the CPU keep up? Are there enough pins and bandwidth for everything we need to connect?

## Primary sources

_None yet._

## Learn more

- [UTexas: Chapter 1, Introduction to Embedded Systems](https://users.ece.utexas.edu/~valvano/Volume1/IntroToEmbSys/Ch1_Introduction.html): the source for this page's outline, with videos, interactive number-conversion tools, and checkpoint questions.
- [Instructables: Soldering Guide](https://www.instructables.com/How-to-solder/)
- [Reverse Engineering](/reverse-engineering/): trace circuits with a multimeter and take firmware apart with Ghidra.

:::note
The UT Austin material is licensed [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/), which doesn't allow adaptations. This page organizes the topics around our own four-resource framing, in our own words, and links to the original.
:::

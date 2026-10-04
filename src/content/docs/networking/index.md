---
title: "Networking and the Internet"
description: "How computers pass messages, from across the internet to across the room, and why our projects keep as much as possible on the local network."
ownership: frame-and-link
projects: [vpp, solar-map, thermal-camera]
coreFor: [vpp]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This section explains how computers send messages to each other, and why our projects keep as much of that as possible on the local network.

Networking is the **network / IO** resource from [Embedded Systems](/embedded-systems/), scaled up: from a single pin, to a wire, to a radio, to the whole internet. For a gentle visual introduction, see MDN's [How does the Internet work?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work)

## Networking means passing messages

Every networked device is doing the same thing: sending and receiving small chunks of data called **packets**. Getting a packet to the right place takes three ideas:

- **Addresses:** who the message is for. Every device on a network has an **IP address**, like `192.168.1.23`. A **port** number picks which program on that device gets the message, like an apartment number on a building's street address.
- **Routing:** how the message gets there. **Routers** pass packets along, hop by hop, toward their destination. No single machine needs to know the whole path.
- **Protocols:** the shared rules both sides follow, so the bytes mean the same thing at each end. **DNS** turns names into addresses; **HTTP** is how browsers ask for web pages.

## Internet basics

Your home, school, or lab has a **local network**: the devices connected to one router over Wi-Fi or Ethernet. Inside it, devices get private addresses (usually starting with `192.168.` or `10.`) that only mean something on that network. The router connects your local network to your internet provider, and the internet is just a huge number of networks connected this way.

Here's what happens when you open a web page:

1. **Look up the name.** Your computer asks a DNS server for the address of `google.com`.
2. **Connect.** It opens a connection to that address. For secure web pages, that's port 443.
3. **Ask.** The browser sends an HTTP request: "please send me this page."
4. **Answer.** The server sends the page back in many packets, which your computer puts back in order.

Most of that uses **TCP**, which checks that every packet arrives, in order. Some traffic, like DNS lookups and live video, uses **UDP** instead: faster, but with no guarantee that every packet makes it.

## Encryption

Packets pass through many routers on the way, and any of them could read a plain message. **Encryption** scrambles the contents so only the two ends can read them. Secure web pages use **TLS**, which is the "S" in HTTPS and the reason for port 443. Routers can still see *where* an encrypted packet is going, just not what's inside. Plain DNS lookups are usually not encrypted, which you'll see for yourself in [Reverse Engineering](/reverse-engineering/).

## Try it

Open a terminal and look at your own network.

Find your device's address on the local network:

```sh
ip addr      # Linux
ifconfig     # macOS
ipconfig     # Windows (PowerShell)
```

Look for an address starting with `192.168.` or `10.`. That's your private address on this network.

Look up a name, and send a few test packets:

```sh
nslookup google.com 8.8.8.8   # ask Google's DNS server for google.com
ping -c 4 8.8.8.8             # send 4 packets and time the replies
```

On Windows, use `ping 8.8.8.8` (it sends 4 by default). If Linux says `nslookup: command not found`, install your distribution's `dnsutils` or `bind` package. The [Reverse Engineering](/reverse-engineering/) section uses `nslookup` again to watch these exact packets fly by.

## Local-first networking

Most consumer smart devices send everything through a company's cloud server, even to reach another device in the same room. **Local-first** flips that around: devices talk to each other directly on the local network, and the internet is an optional extra.

![Two panels. Cloud-first: a battery, solar inverter, and laptop in one building all send messages out through the router to a cloud service and back, so they can't coordinate when the internet is down. Local-first: the same devices talk to each other directly through the building's router, the cloud is optional, and everything local keeps working when the internet is down.](./local-first.svg)

This is why the VPP is designed to be zero-cloud:

- **Resilience:** it keeps working when the internet goes down, which is often exactly when energy coordination matters most.
- **Privacy:** energy data stays in the community instead of on someone else's servers.
- **Speed:** messages cross the room, not the country.
- **Independence:** it doesn't stop working if a company shuts down its servers.

Without a cloud server in the middle, devices need another way to find each other. Local discovery protocols such as **mDNS** let devices announce themselves by name on the local network, like `battery-1.local`.

Local-first has tradeoffs too. Reaching the system from outside the building takes extra work, and keeping it secure is our responsibility, not a cloud provider's.

## Primary sources

_None yet._

## Learn more

- [How the Internet Works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work) · [How the Web Works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [Reverse Engineering](/reverse-engineering/): watch real network traffic with Wireshark.

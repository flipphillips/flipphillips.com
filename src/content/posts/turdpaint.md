---
title: "Turdpaint"
date: "2024-07-12T13:41:59"
modified: "2024-07-12T13:42:02"
slug: "turdpaint"
categories: ["Bloggery","Folklore"]
tags: ["folklore","graphics","history","Macintosh","megamax","paint","pascal"]
isFolklore: true
isPublication: false
excerpt: "In my computer graphics youth, everyone wrote two programs – a 2D paint program and a 3D renderer. Such was the curriculum of the time. Ed Tripp taught CIS 781-2-3, a three quarter sequence that took you from… [Read More](https://flipphillips.com/bloggery/turdpaint/)"
---

In my computer graphics youth, everyone wrote two programs – a 2D paint program and a 3D renderer.

Such was the curriculum of the time. Ed Tripp taught CIS 781-2-3, a three quarter sequence that took you from the [Bresenham line algorithm](https://en.wikipedia.org/wiki/Bresenham's_line_algorithm)[1](#cee5a6b2-4ce3-45e5-8a6a-5ee3a8d025c0) [2](#12028021-05d7-4bc3-ae93-35939e0b78b7) all the way to a scanline renderer. I wrote 99% of my code for that class on an original Macintosh 128K, in [Megamax C](https://en.wikipedia.org/wiki/Megamax_C) and Macintosh Pascal.

[![A Macintosh Pascal disk a kindly engineer from Apple sent me in 1984. I've still got it, just in case Apple would like it back.](/images/uploads/2024/07/MacPascal8.png)](/images/uploads/2024/07/MacPascal8.png?ssl=1)

For the in-person final exam for 783, Ed came in, wrote “Final: Write a ray tracer in JCL” on the board before we got to class. Having written a little bit of JCL in my life (we had a IBM 360 emulator that ran on the Amdahl, I learned assembly language on that) and I knew of its unreal power I was slightly panicked.

[JCL or “Job Control Language”](https://en.wikipedia.org/wiki/Job_Control_Language) was the stuff you put before your actual code to tell the computer what to load, where to load it from, where to get input and output, what to do with the code you gave it, etc. The only thing I remember from back then was forward slashes, and that `DD` was the data deck, so you’d say something like –

```
//SYSIN    DD   BLEH
```

to get it to load your data deck. It was a crazy but necessary part of getting things to run on mainframes.[3](#2fe6b2f8-0618-4f16-976a-bcfc3bd3ca80)

Luckily, it was a joke. But, you know, for a minute, it wasn’t.

When I finally got access to a color Macintosh (a Macintosh IIsi if I recall correctly, it was an engineering sample I got @ Pixar) I modified my paint program to work in color. The new version had a bug that caused it to paint in splats[4](#4519c2f2-4bcc-4bbe-b7d1-479f3ff62a83), little blobs, and was christened “turdpaint” by my wife.

[![An early paint program, 'turdpaint' that was created in 1984 and modified for color in 1989 or so.](/images/uploads/2024/07/turdpaint.png)](/images/uploads/2024/07/turdpaint.png?ssl=1)

I gave a talk at some point on user interfaces for computer graphics (I think it was for the Human Factors Society at Ohio State) probably around 1992 or 1993. I found the above image in the slide deck from that talk. The paint brush cursor was the best thing about it, now in color, and the icon was my second favorite thing –

[![Bauhaus minimalist icon](/images/uploads/2024/07/turdpainticon.png)](/images/uploads/2024/07/turdpainticon.png?ssl=1)

lest we forget that I went to a Bauhaus-Fascist[5](#c93a97b3-92cb-4dac-8a8d-7ca99617f315) architecture school.

Anyway – I found the slide deck, in which there are some really great images, but thought about turdpaint and its color revival, and it brought me great joy.

* * *

1.  I was on a SIGGRAPH bus, on my way to a social event at the ranch they used for the TV show _Dallas_.The gentleman next to me (who was wearing a very nice cowboy hat) introduced himself as Jack Bresenham. I said “Flip Phillips, I use your algorithm.” We had a great talk for the bus ride. [↩︎](#cee5a6b2-4ce3-45e5-8a6a-5ee3a8d025c0-link)
2.  [https://resources.wolframcloud.com/FunctionRepository/resources/BresenhamPoints/](https://resources.wolframcloud.com/FunctionRepository/resources/BresenhamPoints/) [↩︎](#12028021-05d7-4bc3-ae93-35939e0b78b7-link)
3.  [Fred Brooks](https://en.wikipedia.org/wiki/Fred_Brooks), supervisor of the OS/360 project, for which JCL was created, called it “the worst computer programming language ever devised by anybody, anywhere”. (see Wikipedia) [↩︎](#2fe6b2f8-0618-4f16-976a-bcfc3bd3ca80-link)
4.  A side note, I write a 3D particle renderer at Pixar that used what are now called Gaussian splats, back in 1989. I think Bill Reeves wrote one even earlier that inspired mine. [↩︎](#4519c2f2-4bcc-4bbe-b7d1-479f3ff62a83-link)
5.  That characterization thanks to Tony Lupidi, a painter a great friend at CGRG who was as non-Bauhaus as I was Gropius. [↩︎](#c93a97b3-92cb-4dac-8a8d-7ca99617f315-link)

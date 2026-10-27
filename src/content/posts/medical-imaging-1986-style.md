---
title: "Medical Imaging, 1986 Style."
date: "2017-07-25T11:06:41"
modified: "2018-08-02T11:53:59"
slug: "medical-imaging-1986-style"
categories: ["Bloggery"]
tags: ["cardiac","GUI","image processing","medical imaging","MRI","Sun","UI"]
isFolklore: false
isPublication: false
excerpt: "I was going through some slides for a talk today and I stumbled on this one from 1986 of a tool I wrote for analyzing cardiac ejection fraction. You can tell it’s old because it’s in black and… [Read More](https://flipphillips.com/bloggery/medical-imaging-1986-style/)"
---

I was going through some slides for a talk today and I stumbled on this one from 1986 of a tool I wrote for analyzing cardiac ejection fraction.

You can tell it’s old because it’s in black and white.

It was written on a [_Sun II_](https://en.wikipedia.org/wiki/Sun_Microsystems) named `jabba` (I left the prompt at the top to show you) at the Computer Graphics Research Group at The Ohio State University. It used a client-server setup where the heavy duty image processing was done on a [Convex mini-supercomputer](https://en.wikipedia.org/wiki/Convex_Computer) (where ‘mini’ = the size of a small car) and the user interface was done on the Sun. Indeed, it used a ‘front end’ and ‘kernel’ model that Theo Grey and Stephen Wolfram adopted (not in any way due to my stuff, I’m certain) for _Mathematica_. Coincidentally I would go on to beta test early versions of _Mathematica_, befriend Stephen and Theo, and even work for WRI for a while.

I wrote a paper about this model, submitted it to the Convex User Group and received a Macintosh SE as a prize for it! (Scott Dyer, also of CGRG, wrote about a rendering engine they were producing and also received an Mac.) Nowdays, when I submit a paper, I wait for 3 months for it to be ‘peer reviewed’, make revisions to suit some reviewer or editor’s agenda and then pay for the privilege of it being placed in a ‘blessed publication (aka web server)’. Amen. Praise science. (This subject is a whole blog post in itself, of course.)

![](/images/uploads/2017/07/mriTool.png)

Part of this tool (the cine module) apparently remained the ‘go to’ play-back tool at CGRG for several years after I left. After I wrote this, I left and went to Pixar where I designed some medical imaging software user interfaces. This was in the stone ages of UX/UI, no one called it those things, (‘GUI’ _maybe_), we called it a ‘user in your face’.

Man we were clever.

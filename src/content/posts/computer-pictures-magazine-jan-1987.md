---
title: "Computer Pictures Magazine – Jan 1987"
date: "2018-08-01T12:12:52"
modified: "2018-08-06T21:54:20"
slug: "computer-pictures-magazine-jan-1987"
categories: ["Bloggery"]
tags: ["3d","cgrg","medical imaging","MRI","OSU","pixar"]
isFolklore: false
isPublication: false
excerpt: "In 1984, I started working at the Ohio State Computer Graphics Research Group on a medical imaging project. In the same basement box with interview from fps magazine that I posted a bit ago, I found a few other… [Read More](https://flipphillips.com/bloggery/computer-pictures-magazine-jan-1987/)"
---

In 1984, I started [working](https://flipphillips.com/bloggery/osu-mri-flashback-1984/) at the Ohio State [Computer Graphics Research Group](https://accad.osu.edu) on a medical imaging project.

In the same basement box with [interview from fps magazine](https://flipphillips.com/bloggery/fps-interview-1995/) that I posted a bit ago, I found a few other gems. Here’s an article from [Computer Pictures](https://www.worldcat.org/title/computer-pictures/oclc/9470312) magazine that features some of the work we were doing back then.

![](/images/uploads/2018/08/ComputerPicturesCover.png)

The future of computer graphics, 1987 style…

It also features work done at the then-nascent Pixar, a system I went on to work on when I started there in 1987. We were working on the first human-scale ‘NMR’ scanners (people didn’t like the ‘N’ of Nuclear Magnetic Resonance, so it quickly became ‘MRI’). I wrote a whole bunch of [client-server based image analysis](https://flipphillips.com/bloggery/medical-imaging-1986-style/) and volumetric rendering software that used a Sun 2 as the front-end and a [Convex](https://en.wikipedia.org/wiki/Convex_Computer) mini-supercomputer (and later on a Cray II) to do the heavy lifting.

The image they used was made using the CGRG renderer, based on a set of automated feature extraction software that used multi-spectral MR data (in this case, just the T1 and T2) to help classify soft tissue, bone, white / grey matter, &c. It feels like it was pretty advanced at the time. We collaborated with the biomedical engineering group to come up with pulse sequences that would allow for better segmentation. Segmenting MR data is hard. At Pixar, our renderer used a really simple Bayesian classifier (in the mid-80’s y’all!) and only worked on CT data. The eventual product — the Pixar/Picker PICS2000 volume imaging workstation — never sold very well.

Of course, you can do all the stuff we did faster on a $15 RaspberryPi these days.

[Computer Pictures 1987](/images/uploads/2018/08/Computer-Pictures.pdf)

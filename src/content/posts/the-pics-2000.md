---
title: "The PICS 2000"
date: "2023-11-27T12:43:09"
modified: "2023-11-27T12:43:13"
slug: "the-pics-2000"
categories: ["Bloggery","Folklore"]
tags: ["folklore","image processing","medical imaging","pixar","volume rendering"]
isFolklore: true
isPublication: false
excerpt: "A medical imaging workstation – the beginning of volume imaging When I got my interview at Pixar, I was at Ohio State working on volumetric rendering of CT and MR images. There are a few callbacks to that… [Read More](https://flipphillips.com/bloggery/the-pics-2000/)"
image: "/images/PICS-2000.png"
---

A medical imaging workstation – the beginning of volume imaging

When I got my interview at Pixar, I was at Ohio State working on volumetric rendering of CT and MR images. There are a few callbacks to that on here, [OSU MRI Flashback – 1984](https://flipphillips.com/bloggery/osu-mri-flashback-1984/) for example. We were at the leading edge of that stuff back then. Pixar was looking for commercial sales of its Pixar Image Computer and volume imaging was a perfect use for a gigantic frame buffer + computer like the Pixar. This used the Pixar II, the second generation, designed to be a little more affordable. (It also implemented what was to be the future of high-res TV standards and other little fun tidbits.) It used a consumer-grade VHS recorder and a modified version of Steve Wozniak’s [CL-9 CORE universal remote control](https://en.wikipedia.org/wiki/CL_9). I learned how to write 6502 code for that thing, and wrote a nice little controller library. Bruce Young of our hardware group and I made a few trips down to CL-9 in Los Gatos, learned about this revolutionary-at-the-time device to control multiple devices with a single remote control!

The PICS had a SUN, Pixar II, and a 9-track tape drive + two monitors (one for the Pixar, one for the UI). I was tasked to design the UI. Back then, there wasn’t really much well-established UI/UX practice, so I mainly looked at the Macintosh and MacOS for inspiration. We used a spatial layout, moving ‘tasks’ like reading tape, processing images, outputting renders, from left to right in an inverted-U shape.

We built all sorts of neat tools for segmenting the images (my introduction to Bayesian statistics via Pat Hanrahan) selecting ROIs, etc. It was a really cool device and \_way\_ ahead of its time alas. I made two trips to RSNA (more good stories there about taxis, young Stephen Colbert @ Scuzi restaurant, a dead man’s Model Railroader, and more!) to help try to get radiologists to think they needed this beast, and, indeed I think we sold a total of six. The industry wasn’t ready for volume rendering. Now, when you pick up a CD from your radiology center, it’s got a volume renderer baked-into the viewer already on the disk.

There was not much in the way of agreed-upon medical imaging networking (for history fans, PACS was just being discussed at various imaging meetings, and wasn’t near being settled work) so you’d take the scan of the patient on 9-track tape and load it into our machine, read, and decode it. I had been doing this at OSU with the GE hardware we had there, and even for my Father-in-law’s pharmacy business, to read 9-track tapes which were the currency of exchange for medical (and, of course, other) data at the time.

I was digging through my archives, moving from house to house, and found the original literature / flier for it. And now, it is yours to enjoy too –

[PICS2000 Brochure](/images/uploads/2023/11/PICS2000.pdf)[Download](/images/uploads/2023/11/PICS2000.pdf)

If you ever got to see one of these, or the CL-9 (Cloud-9 alias) CORE or anything else fun like this, let me know.

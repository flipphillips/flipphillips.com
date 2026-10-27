---
title: "On Talks and Slides"
date: "2023-12-22T13:48:44"
modified: "2023-12-22T14:15:14"
slug: "on-talks-and-slides"
categories: ["Bloggery","Folklore"]
tags: ["history","knuth","latex","pixar","porter","powerpoint","presentations","talks","tufte"]
isFolklore: true
isPublication: false
excerpt: "Some history of style. Once upon a time, Ed Tufte called me a “sanctimonious assohole”. I suggested that he up the dosage of his medications and stopped recommending his books to my students and colleagues. But — The… [Read More](https://flipphillips.com/bloggery/on-talks-and-slides/)"
---

Some history of style.

Once upon a time, Ed Tufte called me a “sanctimonious assohole”. I suggested that he up the dosage of his medications and stopped recommending his books to my students and colleagues[1](#904512e2-07af-42a6-a612-c485c0ecc095). But — [The Cognitive Style of PowerPoint](https://www.edwardtufte.com/tufte/powerpoint) remains a pretty good essay (sometimes excessive) on some of its ills.

I grew up in a [Kodak Slide Carousel](https://porterelectronics.com/kodak-4200-carousel-slide-projector/) era of presentations. Every ‘big’ talk I went to as an undergrad was formatted that way – Ektachrome 35mm slides. Usually of images — text was actually _difficult_ to put on them, you needed a copy stand or a slide printing rig[2](#23a863aa-3b6f-4a9a-80c9-09d58f4508f0). Now you just type words and, boom, you’re done. Add some clip art of puppies or maybe some insane typographical effects and you get the sort of talk everyone loves to hate.

At Pixar, we had a text generating system for the Image Computer. It was based on the fonts that Don Knuth had put together ([Metafont](https://en.wikipedia.org/wiki/Metafont)) and a version of [`roff/nroff/troff`](https://en.wikipedia.org/wiki/Nroff) by Tom Porter, if I’m remembering right. Here’s one from a talk I gave in London in 1989 —

[![](/images/uploads/2023/12/Title-Slide-USENIX.jpeg)](/images/uploads/2023/12/Title-Slide-USENIX-scaled.jpeg?ssl=1)

Why that title? We sat around and decided to call ourselves, the animation group, “Studio Pixar” to identify as a different group than was making hardware and software. It sounds a little silly in retrospect, but hey, we weren’t in branding, just goofiness. That image rendered on the Pixar Image Computer and was then transferred to [Ektachrome](https://en.wikipedia.org/wiki/Ektachrome) or 5247 using the Pixar Laser Scanner[3](#240333ec-3c39-46e4-a3aa-69b1a677d88e), processed and mounted.

In those early days, a subset of Eben, Pete, Andrew and I used to go to places (usually colleges, usually Berkeley and Stanford) to show our films and talk about how we did things. This was all new stuff then, people wanted to know how we did it. Before one adventure, Pete decided to make some title and word slides that were more visually interesting to go with our more visually interesting content. I drew a few too, but Pete’s were the majority of the talk —

[![](/images/uploads/2023/12/Pete-1.jpeg)](/images/uploads/2023/12/Pete-1.jpeg?ssl=1)

I found them a while back. I love them so much —

[![](/images/uploads/2023/12/Pete-Cost.jpeg)](/images/uploads/2023/12/Pete-Cost-scaled.jpeg?ssl=1)

[![](/images/uploads/2023/12/Pete-Definition.jpeg)](/images/uploads/2023/12/Pete-Definition-scaled.jpeg?ssl=1)

[![](/images/uploads/2023/12/Pete-Calculator.jpeg)](/images/uploads/2023/12/Pete-Calculator-scaled.jpeg?ssl=1)

[![](/images/uploads/2023/12/Pete-Why-1.png)](/images/uploads/2023/12/Pete-Why-1.png?ssl=1)

This was a nice vacation from these —

[![](/images/uploads/2023/12/Tools.jpeg)](/images/uploads/2023/12/Tools-scaled.jpeg?ssl=1)

Anyway, someone was asking why I use so few words on my talk slides. I use a lot of (simplified) graphs and a lot of photos. I personally think it helps with the storytelling — to not have people reading lists of words, tables of numbers, &c. I loved the `beamer` LaTeX class back in my dissertation days — my slides were literally part of the document I created. Knuth’s [_Literate Programming_](https://en.wikipedia.org/wiki/Literate_programming), from which the Mathematica Notebook[4](#d0a31e24-ead3-4704-bc96-345912f227ae) took inspiration, was also an important of my presentation upbringing. One document, code, paper and talk slides, all in one. It all comes back to Knuth somehow, which I personally think is a good thing. A very thoughtful guy who facilitated a lot of what we use today.

Finally — if you’re looking for a tool to create more thoughtful presentations, have a look at [iA Presenter](https://ia.net/presenter). Markdown driven slide presentation — like Markdown, TeX, and roff, thinking about your \*content\* rather than which awesome transition and bullet point animation you’re going to use. Highly recommended process.

1.  At a particular institution I was associated with, I put the kibosh on a plan to retain him as a consultant on visual literacy. I showed the committee the correspondence between him and me and they decided that they didn’t want such a fragile personality involved in the project. It’s the little sanctimonious revenge that warms the cockles of the heart in the wintertime. There was also _possibly_ a bit of pot-kettle going on here I think. Regardless, I hope he’s feeling better these days. [↩︎](#904512e2-07af-42a6-a612-c485c0ecc095-link)
2.  Does anyone else remember the SIGGRAPH where, somehow, Larry Yeager (I think?) didn’t have his slides and made a set of hand-written bullet points, photographed them in his hotel and had them rush processed before his talk? Maybe I’m hallucinating that but I don’t think so. [↩︎](#23a863aa-3b6f-4a9a-80c9-09d58f4508f0-link)
3.  Another interesting piece of IO hardware, built by David DiFrancisco. [↩︎](#240333ec-3c39-46e4-a3aa-69b1a677d88e-link)
4.  Don’t get me started on some takes on the ‘innovation’ that are Python notebooks. I’m super happy they exist, but they’re not the new crazy thing everyone thinks. [↩︎](#d0a31e24-ead3-4704-bc96-345912f227ae-link)

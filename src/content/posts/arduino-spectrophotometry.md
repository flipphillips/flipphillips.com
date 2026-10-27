---
title: "Arduino Spectrophotometry"
date: "2019-02-08T12:20:43"
modified: "2019-02-08T12:20:43"
slug: "arduino-spectrophotometry"
categories: ["Bloggery","classes"]
tags: ["arduino","class","hardware","mathematica","photometry","sensors"]
isFolklore: false
isPublication: false
excerpt: "Well, OK, just measuring ambient light for now… but we’ll get there in class soon. Students in my Computational Methods class are using an Arduino to do some simple sensor measurement stuff. I found a bunch of old… [Read More](https://flipphillips.com/bloggery/arduino-spectrophotometry/)"
---

Well, OK, just measuring ambient light for now… but we’ll get there in class soon.

Students in my Computational Methods class are using an Arduino to do some simple sensor measurement stuff. I found a bunch of old FSRs and photoresistors in a bin in the lab. No markings so no datasheets.

No worries –

-   ![](/images/uploads/2019/02/IMG_0261-2.jpg)
    
    The setup
    
-   ![](/images/uploads/2019/02/IMG_0259.jpg)
    
    Calibrating 0
    

A little Mathematica [“Connected Device”](http://devices.wolfram.com) stuff to talk to the Arduino, my interface to [Argyll CMS](https://www.argyllcms.com) to talk to the i1 Pro, and adjusting the blinds in my office …

![](/images/uploads/2019/02/Screen-Shot-2019-02-08-at-11.52.31-AM-1.png)

DeviceReadTimeSeries + getAmbient = profit$

Pretty linear… We’re ready to roll.

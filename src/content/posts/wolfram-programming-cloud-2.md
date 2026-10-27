---
title: "Wolfram Programming Cloud"
date: "2014-06-26T13:32:14"
modified: "2018-08-02T11:55:02"
slug: "wolfram-programming-cloud-2"
categories: ["Bloggery"]
tags: ["mathematica"]
isFolklore: false
isPublication: false
excerpt: "You can create this: \\[WolframCloudAPI id=”a99541cf-90ab-4b52-ab5c-cd6b632f4c7f” rule=”62″ step=”30″\\] With this: \\[wlcode\\] CloudDeploy\\[APIFunction\\[{ “rule” -> Restricted\\[“Number”, {0, 255, 1}\\] -> 30, “step” -> Restricted\\[“Number”, {0, Infinity, 1}\\] -> 50 }, ArrayPlot\\[CellularAutomaton\\[#rule, {{1}, 0}, #step\\], Frame -> False\\] &, “PNG”… [Read More](https://flipphillips.com/bloggery/wolfram-programming-cloud-2/)"
---

You can create this:

\[WolframCloudAPI id=”a99541cf-90ab-4b52-ab5c-cd6b632f4c7f” rule=”62″ step=”30″\]

With this:

\[wlcode\] CloudDeploy\[APIFunction\[{  
“rule” -> Restricted\[“Number”, {0, 255, 1}\] -> 30,  
“step” -> Restricted\[“Number”, {0, Infinity, 1}\] -> 50  
},  
ArrayPlot\[CellularAutomaton\[#rule, {{1}, 0}, #step\],  
Frame -> False\] &,  
“PNG”  
\], Permissions -> “Public”\] \[/wlcode\]

Fun! Check out some of the fun stuff here [https://www.wolframcloud.com](https://www.wolframcloud.com)

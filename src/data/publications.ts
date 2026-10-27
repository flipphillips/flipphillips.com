export interface Publication {
  id: string;
  year: number;
  title: string;
  authors: string[];
  venue: string;
  type: 'journal' | 'conference' | 'book' | 'preprint' | 'techreport' | 'magazine';
  typeLabel: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  pdf?: string;
  image?: string;
  highlight?: boolean;
}

export const publications: Publication[] = [
  // 2026
  {
    id: "spectral-rendering-virtual-production-2026",
    year: 2026,
    title: "Spectral rendering techniques to improve color matching in virtual production",
    authors: ["V Simion", "S Farnand", "DL Long", "F Phillips"],
    venue: "SMPTE Motion Imaging Journal",
    volume: "135",
    issue: "6",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "social-attribution-newly-sighted-2026",
    year: 2026,
    title: "Social attribution behavior in newly sighted children",
    authors: ["D Verma", "M Yadav", "P Gupta", "C Ralekar", "S Ben-Ami", "S Gilad-Gutnick", "S Riskin", "F Phillips", "K Jazayeri", "S Ganesh", "P Sinha"],
    venue: "Nature: Scientific Reports",
    volume: "16",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "rolling-through-pipeline-siggraph-2026",
    year: 2026,
    title: "Rolling Through the Pipeline: A Course Model for Virtual Production Education",
    authors: ["F Phillips", "DL Long", "A Montag", "CY Peng"],
    venue: "Proceedings of the ACM SIGGRAPH Educator’s Forum (SIGGRAPH ’26), Los Angeles, CA",
    doi: "10.1145/3799829.3812522",
    type: "conference",
    typeLabel: "Conference Proceeding",
    highlight: true
  },
  {
    id: "compression-recompression-jpeg-2026",
    year: 2026,
    title: "Compression and recompression of JPEG: stability, artifacts, and iterative image collapse",
    authors: ["F Phillips"],
    venue: "Wolfram Community (Staff Pick)",
    type: "magazine",
    typeLabel: "Article"
  },

  // 2025
  {
    id: "non-dominant-hand-visual-discrimination-2025",
    year: 2025,
    title: "What the visual system can learn from the non-dominant hand: The effect of graphomotor engagement on visual discrimination",
    authors: ["S Ben-Ami", "B Buaron", "O Yaron", "K Keane", "VH Sun", "F Phillips", "J Friedman", "P Sinha", "R Mukamel"],
    venue: "Memory & Cognition",
    volume: "53",
    issue: "1",
    pages: "325–340",
    doi: "10.3758/s13421-024-01628-2",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "spectral-rendering-smpte-summit-2025",
    year: 2025,
    title: "Spectral rendering techniques to improve color matching in virtual production",
    authors: ["V Simion", "S Farnand", "DL Long", "F Phillips"],
    venue: "Proceedings of the SMPTE Media Technology Summit, Pasadena, CA",
    type: "conference",
    typeLabel: "Conference Proceeding"
  },
  {
    id: "stereo-artifacts-prisoner-wolfram-2025",
    year: 2025,
    title: "An adventure in two channels: investigating stereo artifacts in The Prisoner episode",
    authors: ["F Phillips"],
    venue: "Wolfram Community (Staff Pick)",
    type: "magazine",
    typeLabel: "Article"
  },
  {
    id: "in-memory-michael-trott-2025",
    year: 2025,
    title: "In Memory of Michael Trott (1959–2025): Scientist, Mentor, Friend",
    authors: ["F Phillips"],
    venue: "Wolfram Community",
    type: "magazine",
    typeLabel: "Article"
  },

  // 2024
  {
    id: "perceptual-plausibility-exaggerated-motion-2024",
    year: 2024,
    title: "Perceptual plausibility of exaggerated realistic motion",
    authors: ["F Schmidt", "L Noejovich", "G Chakalos", "F Phillips"],
    venue: "Cognition",
    volume: "251",
    pages: "art. 105880",
    doi: "10.1016/j.cognition.2024.105880",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },

  // 2023
  {
    id: "qualitative-perception-3d-shape-luminance-curvature-2023",
    year: 2023,
    title: "Qualitative perception of 3D shape from patterns of luminance curvature",
    authors: ["JT Todd", "Y Yu", "F Phillips"],
    venue: "Journal of Vision",
    volume: "23",
    issue: "5",
    pages: "art. 10",
    doi: "10.1167/jov.23.5.10",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2022
  {
    id: "identification-surface-concavities-2022",
    year: 2022,
    title: "The Identification of Surface Concavities From Patterns of Luminance Curvature",
    authors: ["JT Todd", "Y Yu", "F Phillips"],
    venue: "SSRN Electronic Journal",
    doi: "10.2139/ssrn.4100725",
    type: "preprint",
    typeLabel: "Preprint"
  },

  // 2021
  {
    id: "visual-feedback-persistence-visuo-motor-2021",
    year: 2021,
    title: "Influence of visual feedback persistence on visuo-motor skill improvement",
    authors: ["A Unell", "ZM Eisenstat", "A Braun", "A Gandhi", "S Gilad-Gutnick", "S Ben-Ami", "F Phillips", "P Sinha"],
    venue: "Nature: Scientific Reports",
    volume: "11",
    pages: "art. 17347",
    doi: "10.1038/s41598-021-96876-6",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "resilience-temporal-processing-visual-deprivation-2021",
    year: 2021,
    title: "Resilience of temporal processing to early and extended visual deprivation",
    authors: ["J Ye", "P Gupta", "P Shah", "K Tiwari", "T Gandhi", "S Ganesh", "F Phillips", "D Levi", "F Thorn", "S Diamond", "P Sinha"],
    venue: "Vision Research",
    volume: "186",
    pages: "pp. 80–86",
    doi: "10.1016/j.visres.2021.05.004",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2020
  {
    id: "veiled-virgin-visual-segmentation-shape-by-cause-2020",
    year: 2020,
    title: "The Veiled Virgin illustrates visual segmentation of shape by cause",
    authors: ["F Phillips", "RW Fleming"],
    venue: "Proceedings of the National Academy of Sciences (PNAS)",
    volume: "117",
    issue: "21",
    pages: "pp. 11453–11460",
    doi: "10.1073/pnas.1917565117",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "effects-illumination-shiny-materials-2020",
    year: 2020,
    title: "Effects of illumination on the categorization of shiny materials",
    authors: ["JF Norman", "JT Todd", "F Phillips"],
    venue: "Journal of Vision",
    volume: "20",
    issue: "5",
    pages: "art. 2",
    doi: "10.1167/jov.20.5.2",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "veiled-virgin-supporting-information-2020",
    year: 2020,
    title: "Supporting Information — The Veiled Virgin Effect: Visual Segmentation of Shape into Causal Layers",
    authors: ["F Phillips", "RW Fleming"],
    venue: "Authorea",
    doi: "10.22541/au.160824297.72970519/v1",
    type: "preprint",
    typeLabel: "Preprint"
  },

  // 2019
  {
    id: "visual-perception-shape-scission-2019",
    year: 2019,
    title: "Visual perception of shape-transforming processes: ‘Shape scission’",
    authors: ["F Schmidt", "F Phillips", "RW Fleming"],
    venue: "Cognition",
    volume: "189",
    pages: "art. 103960",
    doi: "10.1016/j.cognition.2019.04.006",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },

  // 2018
  {
    id: "why-does-cortex-reorganize-sensory-loss-2018",
    year: 2018,
    title: "Why does the cortex reorganize after sensory loss?",
    authors: ["A Kalia Singh", "F Phillips", "LB Merabet", "P Sinha"],
    venue: "Cell: Trends in Cognitive Sciences",
    volume: "22",
    issue: "7",
    pages: "pp. 569–582",
    doi: "10.1016/j.tics.2018.04.004",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "haptic-shape-discrimination-interhemispheric-2018",
    year: 2018,
    title: "Haptic shape discrimination and interhemispheric communication",
    authors: ["CJ Dowell", "JF Norman", "JR Moment", "LM Shain", "HF Norman", "F Phillips", "AML Kappers"],
    venue: "Nature: Scientific Reports",
    volume: "8",
    pages: "art. 377",
    doi: "10.1038/s41598-017-18691-2",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "post-weaning-social-isolation-oxytocin-2018",
    year: 2018,
    title: "Effects of post-weaning social isolation and oxytocin on adult anxiety and sociability in female rats",
    authors: ["M Lavoie", "R Toma", "F Phillips", "HH López"],
    venue: "IMPULSE",
    pages: "pp. 1–15",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2016
  {
    id: "enhancing-research-plenary-labs-2016",
    year: 2016,
    title: "Enhancing research with plenary labs",
    authors: ["P Sinha", "P Bex", "M Kjelgaard", "F Phillips"],
    venue: "Science and Public Policy",
    volume: "44",
    issue: "3",
    pages: "pp. 434–439",
    doi: "10.1093/scipol/scw051",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "perceiving-object-shape-specular-highlights-haptics-2016",
    year: 2016,
    title: "Perceiving object shape from specular highlight deformation, boundary contour deformation, and active haptic manipulation",
    authors: ["JF Norman", "F Phillips", "JR Cheeseman", "KE Thomason", "C Ronning", "K Behari", "K Kleinman", "AB Calloway", "D Lamirande"],
    venue: "PLoS ONE",
    volume: "11",
    issue: "2",
    pages: "art. e0149058",
    doi: "10.1371/journal.pone.0149058",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "binocular-eyetracking-virtual-ball-catching-2016",
    year: 2016,
    title: "Binocular eye tracking calibration during a virtual ball catching task using head mounted display",
    authors: ["K Binaee", "G Diaz", "J Pelz", "F Phillips"],
    venue: "Proceedings of the ACM Symposium on Applied Perception (SAP ’16)",
    pages: "pp. 15–18",
    doi: "10.1145/2931002.2931020",
    type: "conference",
    typeLabel: "Conference Proceeding"
  },

  // 2015
  {
    id: "french-drop-sleight-biological-motion-2015",
    year: 2015,
    title: "Magically deceptive biological motion—the French Drop Sleight",
    authors: ["F Phillips", "MB Natter", "EJL Egan"],
    venue: "Frontiers in Psychology",
    volume: "6",
    pages: "art. 371",
    doi: "10.3389/fpsyg.2015.00371",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },

  // 2014
  {
    id: "perception-tactile-graphics-embossings-cutouts-2014",
    year: 2014,
    title: "Perception of tactile graphics: Embossings versus cutouts",
    authors: ["A Kalia", "P Sinha", "L Merabet", "F Phillips", "L Yazzolino", "S Verma", "R Hopkins"],
    venue: "Multisensory Research",
    volume: "27",
    issue: "2",
    pages: "pp. 111–125",
    doi: "10.1163/22134808-00002450",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "shape-from-shading-reflectance-illumination-2014",
    year: 2014,
    title: "Is the perception of 3D shape from shading based on assumed reflectance and illumination?",
    authors: ["JT Todd", "EJL Egan", "F Phillips"],
    venue: "i-Perception",
    volume: "5",
    issue: "6",
    pages: "pp. 497–514",
    doi: "10.1068/i0645",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2012
  {
    id: "solid-shape-discrimination-natural-objects-feelies-2012",
    year: 2012,
    title: "Solid shape discrimination from vision and haptics: Natural objects (Capsicum annuum) and Gibson’s “Feelies”",
    authors: ["JF Norman", "F Phillips", "JD Holmin", "HF Norman", "AM Beers", "AM Boswell", "JR Cheeseman", "AG Stethen", "C Ronning"],
    venue: "Experimental Brain Research",
    volume: "222",
    issue: "3",
    pages: "pp. 321–332",
    doi: "10.1007/s00221-012-3220-7",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "anticipation-biological-motion-goalkeeper-2012",
    year: 2012,
    title: "Anticipation from biological motion: The goalkeeper problem",
    authors: ["GJ Diaz", "B Fajen", "F Phillips"],
    venue: "Journal of Experimental Psychology: Human Perception and Performance",
    volume: "38",
    issue: "4",
    pages: "pp. 848–864",
    doi: "10.1037/a0026962",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2011
  {
    id: "spatial-perception-action-handbook-2011",
    year: 2011,
    title: "Spatial perception and action",
    authors: ["B Fajen", "F Phillips"],
    venue: "Handbook of Spatial Cognition, American Psychological Association",
    pages: "ISBN 9781433812040",
    type: "book",
    typeLabel: "Book Chapter"
  },
  {
    id: "perception-3d-shape-planar-cut-contours-2011",
    year: 2011,
    title: "The perception of 3D shape from planar cut contours",
    authors: ["EJL Egan", "JT Todd", "F Phillips"],
    venue: "Journal of Vision",
    volume: "11",
    issue: "12",
    pages: "art. 15",
    doi: "10.1167/11.12.15",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "fechner-information-shape-perception-2011",
    year: 2011,
    title: "Fechner, information, and shape perception",
    authors: ["JS Lappin", "JF Norman", "F Phillips"],
    venue: "Attention, Perception, & Psychophysics",
    volume: "73",
    issue: "8",
    pages: "pp. 2353–2378",
    doi: "10.3758/s13414-011-0197-4",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2010
  {
    id: "texture-discrimination-global-feature-alignments-2010",
    year: 2010,
    title: "Texture discrimination based on global feature alignments",
    authors: ["F Phillips", "JT Todd"],
    venue: "Journal of Vision",
    volume: "10",
    issue: "6",
    pages: "art. 6",
    doi: "10.1167/10.6.6",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "fechners-aesthetics-revisited-2010",
    year: 2010,
    title: "Fechner’s aesthetics revisited",
    authors: ["F Phillips", "JF Norman", "AM Beers"],
    venue: "Seeing and Perceiving",
    volume: "23",
    issue: "3",
    pages: "pp. 263–271",
    doi: "10.1163/187847510X516412",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "does-monocular-visual-space-contain-planes-2010",
    year: 2010,
    title: "Does monocular visual space contain planes?",
    authors: ["JJ Koenderink", "AJ van Doorn", "R van Ee", "WA van de Grind", "AML Kappers", "JS Lappin", "SAHJ Oomes", "SP te Pas", "F Phillips", "SC Pont", "WA Richards", "JT Todd", "FAJ Verstraten", "S de Vries"],
    venue: "Acta Psychologica",
    volume: "134",
    issue: "1",
    pages: "pp. 40–47",
    doi: "10.1016/j.actpsy.2009.12.002",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "traveling-salesman-natural-environment-2010",
    year: 2010,
    title: "The Traveling Salesman Problem in the Natural Environment",
    authors: ["F Phillips", "T O’Connell", "O Layton"],
    venue: "Nature Precedings",
    pages: "art. npre.2010.4960.1",
    doi: "10.1038/npre.2010.4960.1",
    type: "preprint",
    typeLabel: "Preprint"
  },

  // 2009
  {
    id: "perceptual-equivalence-vision-touch-complexity-2009",
    year: 2009,
    title: "Perceptual equivalence between vision and touch is complexity dependent",
    authors: ["F Phillips", "EJL Egan", "BN Perry"],
    venue: "Acta Psychologica",
    volume: "132",
    issue: "3",
    pages: "pp. 259–266",
    doi: "10.1016/j.actpsy.2009.07.010",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "intercepting-moving-targets-foresight-2009",
    year: 2009,
    title: "Intercepting moving targets: A little foresight helps a lot",
    authors: ["GJ Diaz", "F Phillips", "BR Fajen"],
    venue: "Experimental Brain Research",
    volume: "195",
    issue: "3",
    pages: "pp. 345–360",
    doi: "10.1007/s00221-009-1794-5",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "perception-3d-shape-shadows-cast-curved-surfaces-2009",
    year: 2009,
    title: "The perception of 3D shape from shadows cast onto curved surfaces",
    authors: ["JF Norman", "Y Lee", "F Phillips", "HF Norman", "LR Jennings", "TR McBride"],
    venue: "Acta Psychologica",
    volume: "131",
    issue: "1",
    pages: "pp. 1–11",
    doi: "10.1016/j.actpsy.2009.01.007",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "distortion-posterior-visual-space-2009",
    year: 2009,
    title: "Distortion of posterior visual space",
    authors: ["F Phillips", "MG Voshell"],
    venue: "Perception",
    volume: "38",
    issue: "7",
    pages: "pp. 1045–1052",
    doi: "10.1068/p6203",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "crossmodal-information-visual-haptic-spie-2009",
    year: 2009,
    title: "Crossmodal information for visual and haptic discrimination",
    authors: ["F Phillips", "EJL Egan"],
    venue: "SPIE Human Vision and Electronic Imaging XIV",
    volume: "7240",
    pages: "art. 72400R",
    doi: "10.1117/12.811859",
    type: "conference",
    typeLabel: "Conference Proceeding"
  },

  // 2006
  {
    id: "foundations-cyclopean-perception-2006",
    year: 2006,
    title: "Foundations of Cyclopean Perception",
    authors: ["B Julesz", "T Papathomas", "F Phillips"],
    venue: "MIT Press",
    pages: "ISBN 0262101130",
    type: "book",
    typeLabel: "Book",
    highlight: true
  },
  {
    id: "human-robot-navigation-metric-nato-2006",
    year: 2006,
    title: "A novel metric for evaluating human-robot navigation performance",
    authors: ["F Phillips", "MG Voshell"],
    venue: "NATO RTO-MP-HFM-135",
    pages: "pp. 19-1–19-12",
    type: "conference",
    typeLabel: "Conference Proceeding"
  },
  {
    id: "collaborative-metadata-tr-2006",
    year: 2006,
    title: "Collaborative Metadata",
    authors: ["F Phillips", "W Redenbarger", "B Prue", "MG Voshell"],
    venue: "Technical Report, CPoD / CSEL, The Ohio State University, Columbus OH",
    type: "techreport",
    typeLabel: "Technical Report"
  },

  // 2005
  {
    id: "overcoming-keyhole-human-robot-coordination-2005",
    year: 2005,
    title: "Overcoming the keyhole in human-robot coordination: Simulation and evaluation",
    authors: ["MG Voshell", "DD Woods", "F Phillips"],
    venue: "Proceedings of the Human Factors and Ergonomics Society 49th Annual Meeting",
    volume: "49",
    issue: "3",
    pages: "pp. 442–446",
    doi: "10.1177/154193120504900348",
    type: "conference",
    typeLabel: "Conference Proceeding"
  },

  // 2004
  {
    id: "creating-noisy-stimuli-2004",
    year: 2004,
    title: "Creating noisy stimuli",
    authors: ["F Phillips"],
    venue: "Perception",
    volume: "33",
    issue: "7",
    pages: "pp. 837–854",
    doi: "10.1068/p5168",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "effects-3d-complexity-2d-depictions-2004",
    year: 2004,
    title: "Effects of three-dimensional complexity on the perception of two-dimensional depictions of objects",
    authors: ["F Phillips", "CH Thompson", "MG Voshell"],
    venue: "Perception",
    volume: "33",
    issue: "1",
    pages: "pp. 21–33",
    doi: "10.1068/p5156",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2003
  {
    id: "perceptual-representation-visible-surfaces-2003",
    year: 2003,
    title: "Perceptual representation of visible surfaces",
    authors: ["F Phillips", "JT Todd", "JJ Koenderink", "AML Kappers"],
    venue: "Perception & Psychophysics",
    volume: "65",
    issue: "5",
    pages: "pp. 747–762",
    doi: "10.3758/BF03194811",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 2001
  {
    id: "information-concentration-boundary-contours-2001",
    year: 2001,
    title: "Information concentration along the boundary contours of naturally shaped solid objects",
    authors: ["JF Norman", "F Phillips", "HE Ross"],
    venue: "Perception",
    volume: "30",
    issue: "11",
    pages: "pp. 1285–1294",
    doi: "10.1068/p3272",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "limits-uncertainty-randomness-2001",
    year: 2001,
    title: "Limits, uncertainty, and randomness",
    authors: ["F Phillips"],
    venue: "The Mathematica Journal",
    volume: "8",
    issue: "2",
    pages: "pp. 258–265",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "role-2d-3d-task-performance-visual-displays-2001",
    year: 2001,
    title: "The role of 2-D and 3-D task performance in the design and use of visual displays",
    authors: ["JS Tittle", "DD Woods", "A Roesler", "M Howard", "F Phillips"],
    venue: "Proceedings of the Human Factors and Ergonomics Society 45th Annual Meeting",
    volume: "45",
    issue: "4",
    pages: "pp. 331–335",
    doi: "10.1177/154193120104500414",
    type: "conference",
    typeLabel: "Conference Proceeding"
  },

  // 2000
  {
    id: "quantum-computation-2000",
    year: 2000,
    title: "Quantum computation",
    authors: ["F Phillips"],
    venue: "The Mathematica Journal",
    volume: "8",
    issue: "1",
    pages: "pp. 115–124",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "simulating-society-sim-city-2000",
    year: 2000,
    title: "Simulating society — Sim City",
    authors: ["F Phillips"],
    venue: "The Mathematica Journal",
    volume: "7",
    issue: "4",
    pages: "pp. 427–433",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "eel-language-experiments-2000",
    year: 2000,
    title: "eel: A Language for Conducting Experiments",
    authors: ["F Phillips", "JS Shomphe", "AB Cencinni", "MG Voshell"],
    venue: "Technical Report, ebv-00/01, Skidmore College, Saratoga Springs NY",
    type: "techreport",
    typeLabel: "Technical Report"
  },

  // 1999
  {
    id: "artlandia-1999",
    year: 1999,
    title: "Artlandia",
    authors: ["F Phillips"],
    venue: "The Mathematica Journal",
    volume: "7",
    issue: "3",
    pages: "pp. 230–236",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "feeling-shape-1999",
    year: 1999,
    title: "Feeling shape",
    authors: ["F Phillips"],
    venue: "The Mathematica Journal",
    volume: "7",
    issue: "1",
    pages: "pp. 93–94",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 1998
  {
    id: "perception-surface-curvature-optical-motion-1998",
    year: 1998,
    title: "The perception of surface curvature from optical motion",
    authors: ["VJ Perotti", "JT Todd", "JS Lappin", "F Phillips"],
    venue: "Perception & Psychophysics",
    volume: "60",
    issue: "3",
    pages: "pp. 377–388",
    doi: "10.3758/BF03206861",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "perception-scale-dependent-surface-structure-1998",
    year: 1998,
    title: "The perception of scale-dependent and scale-independent surface structure from binocular disparity, texture, and shading",
    authors: ["JS Tittle", "JF Norman", "VJ Perotti", "F Phillips"],
    venue: "Perception",
    volume: "27",
    issue: "2",
    pages: "pp. 147–166",
    doi: "10.1068/p270147",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 1997
  {
    id: "perceptual-localization-features-smoothly-curved-1997",
    year: 1997,
    title: "Perceptual localization of features on smoothly curved surfaces",
    authors: ["F Phillips", "JT Todd", "JJ Koenderink", "AML Kappers"],
    venue: "Journal of Experimental Psychology: Human Perception and Performance",
    volume: "23",
    issue: "5",
    pages: "pp. 1481–1492",
    doi: "10.1037/0096-1523.23.5.1481",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },

  // 1996
  {
    id: "perception-local-three-dimensional-shape-1996",
    year: 1996,
    title: "Perception of local three-dimensional shape",
    authors: ["F Phillips", "JT Todd"],
    venue: "Journal of Experimental Psychology: Human Perception and Performance",
    volume: "22",
    issue: "4",
    pages: "pp. 930–944",
    doi: "10.1037/0096-1523.22.4.930",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "surface-range-attitude-probing-stereoscopic-scenes-1996",
    year: 1996,
    title: "Surface range and attitude probing in stereoscopically presented dynamic scenes",
    authors: ["JJ Koenderink", "AML Kappers", "JT Todd", "JF Norman", "F Phillips"],
    venue: "Journal of Experimental Psychology: Human Perception and Performance",
    volume: "22",
    issue: "4",
    pages: "pp. 869–878",
    doi: "10.1037/0096-1523.22.4.869",
    type: "journal",
    typeLabel: "Journal Article"
  },
  {
    id: "al-procedural-modeling-animation-1996",
    year: 1996,
    title: "AL: A Language for Procedural Modeling and Animation",
    authors: ["SF May", "WE Carlson", "F Phillips", "F Scheepers"],
    venue: "Technical Report OSU-ACCAD-12/96-TR5, The Ohio State University, Columbus OH",
    type: "techreport",
    typeLabel: "Technical Report"
  },

  // 1995
  {
    id: "perception-surface-orientation-optical-information-1995",
    year: 1995,
    title: "The perception of surface orientation from multiple sources of optical information",
    authors: ["JF Norman", "JT Todd", "F Phillips"],
    venue: "Perception & Psychophysics",
    volume: "57",
    issue: "5",
    pages: "pp. 629–636",
    doi: "10.3758/BF03213268",
    type: "journal",
    typeLabel: "Journal Article"
  },

  // 1990
  {
    id: "siggraph-bowl-1990",
    year: 1990,
    title: "The SIGGRAPH Bowl",
    authors: ["J Blinn", "N England", "R Pike", "F Phillips"],
    venue: "ACM SIGGRAPH ’90 Panel Proceedings, Dallas, TX",
    pages: "pp. 501–529",
    doi: "10.1145/328750.328768",
    type: "conference",
    typeLabel: "Conference Proceeding",
    highlight: true
  },

  // 1989
  {
    id: "animation-environment-studio-pixar-1989",
    year: 1989,
    title: "The animation environment at Studio Pixar",
    authors: ["F Phillips"],
    venue: "Proceedings of Computer Graphics ’89 Conference, London, UK",
    pages: "pp. 243–255",
    type: "conference",
    typeLabel: "Conference Proceeding",
    highlight: true
  },

  // 1988
  {
    id: "supercomputer-medical-imaging-1988",
    year: 1988,
    title: "Supercomputer medical imaging",
    authors: ["F Phillips"],
    venue: "Convex White Paper Series on Supercomputing",
    pages: "pp. 1–7",
    type: "journal",
    typeLabel: "White Paper"
  },

  // 1987
  {
    id: "combinational-imaging-mri-eeg-1987",
    year: 1987,
    title: "Combinational imaging: Magnetic resonance imaging and EEG displayed simultaneously",
    authors: ["MW Torello", "F Phillips", "W Hunter", "CA Csuri"],
    venue: "Journal of Clinical Neurophysiology",
    volume: "4",
    issue: "3",
    pages: "pp. 274–275",
    type: "journal",
    typeLabel: "Journal Article",
    highlight: true
  },
  {
    id: "surface-representation-mr-data-ii-1987",
    year: 1987,
    title: "Three Dimensional Surface Representation and Perspective Enhancement of MR Data II",
    authors: ["F Phillips"],
    venue: "Technical Report, Computer Graphics Research Group, The Ohio State University, Columbus OH",
    type: "techreport",
    typeLabel: "Technical Report"
  },

  // 1986
  {
    id: "surface-representation-mr-data-1986",
    year: 1986,
    title: "Three Dimensional Surface Representation and Perspective Enhancement of MR Data",
    authors: ["F Phillips"],
    venue: "Technical Report, Computer Graphics Research Group, The Ohio State University, Columbus OH",
    type: "techreport",
    typeLabel: "Technical Report"
  }
];

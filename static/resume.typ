#import "@preview/basic-resume:0.2.8": *

#let name = "Sudarsh Kunnavakkam"
#let location = "Pasadena, CA"
#let email = "kvsudarsh786@gmail.com"
#let github = "github.com/skunnavakkam"
#let phone = "+1 (949) 254-8232"
#let personal-site = "sudarsh.com"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  github: github,
  phone: phone,
  personal-site: personal-site,
  accent-color: "#26428b",
  font: "New Computer Modern",
  paper: "us-letter",
  author-position: left,
  personal-info-position: left,
)

== Work Experience

#work(
  company: "Cognitogram Labs",
  location: "San Francisco, CA", 
  title: "CTO, Co-Founder",
  dates: dates-helper(start-date: "Nov 2025", end-date: "Present")
)
- Co-founded venture-backed neuroscience startup pursuing whole-brain emulation; raised \$1M pre-seed from Character Capital at 18.
- Built an imaging facility from the ground up to image the whole brain of the zebrafish at 10,000 slices per second in 3 months
- Designed and trained autoregressive models of larval zebrafish neural activity toward whole-brain emulation.


#work(
  company: "Model Evaluation and Threat Research (METR)",
  location: "Berkeley, CA",
  title: "Research Assistant",
  dates: dates-helper(start-date: "Sep 2023", end-date: "Jun 2025")
)
- Lead engineer for internal project to estimate the agentic time horizon of LLMs at much lower cost, through distilling failure points in agentic transcripts
- Co-lead engineer of a evaluation for Chain-of-Thought Faithfulness of Large Language Models, finding that Chain of Thought is informative about LLM cognition as long as the cognition is complex enough that it can't be performed in a single forward pass
- Helped lead teams of contractors red-team LLMs and curate datasets such as #link("https://huggingface.co/datasets/metr-evals/daft-math")[DAFT Math] of difficult, free-response questions 


#work(
  company: "ShapiroLab at Caltech",
  location: "Pasadena, CA",
  title: "Undergraduate Research Intern",
  dates: dates-helper(start-date: "Nov 2024", end-date: "Aug 2025")
)
- Built a high-throughput ultrasound screening platform; designed custom proteins with RFDiffusion, AlphaFold, and ESM3 for faster ultrasound reporter kinetics.


#work(
  company: "Supervised Program for Alignment Research",
  location: "Remote",
  title: "Research Fellow",
  dates: dates-helper(start-date: "Feb 2025", end-date: "May 2025")
)
- Implemented a _continuous double auction_ agent arena as a model environment for LLM collusion, accepted to _ICML 2025_

== Education

#edu(
  institution: "California Institute of Technology",
  location: "Pasadena, CA",
  dates: "In progress, on leave",
  degree: "B.S. in Physics & Computer Science"
)
- Co-director of Caltech AI Alignment, lead reading groups, research, and invited speakers; scaled from 10 to 100+ attendees at events



== Writing & Other Work

+ #link("https://sudarsh.com/blog/simulated-qualia-mugging/")[Simulated Qualia Mugging]
+ #link("https://sudarsh.com/blog/takes-on-automating-alignment/")[Takes on Automating Alignment]
+ #link("https://sudarsh.com/blog/how-to-slowdown/")[How Should We Implement an AI Pause?]
+ #link("https://sudarsh.com/blog/degenerate-attention-heads/")[Redundant Attention Heads in Large Language Models For In Context Learning]



== Selected Publications

+ A. Deng\*, S. Von Arx\*, B. Snodin, #underline[S. Kunnavakkam], T. Lanham, "CoT May Be Highly Informative Despite "Unfaithfulness"" by _METR_, Aug 2025

+ K. Agarwal, V. Teo, J. Vazquez, #underline[S. Kunnavakkam], V. Srikanth, A. Liu, "Evaluating LLM Agent Collusion in Double Auctions" at _ICML 2025 Workshop on Multi-Agent Systems in the Era of Foundation Models _, Vancouver, Canada, July 2025.

+ C. J. Effarah\*, T. Chen\*, #underline[S. Kunnavakkam]\*, C. M. Gonzalez, H. W. Lee, "Liquid Metal Printed 2D ITO for Nanophotonic Applications," in _California-US Government Workshop on 2D Materials_, Irvine, California, USA, Sep 2023


== Projects

#link("https://github.com/METR/CoT-faithfulness-and-monitorability")[
  #project(
    name: "METR: Faithfulness and Monitorability Eval",
    dates: 2025
  )
]
- Co-lead engineer on METR research report on chain-of-thought (CoT) faithfulness (Aug 2025), extending Anthropic’s seminal evaluation to three frontier models and publishing findings for the wider safety community

#link("https://github.com/andyjliu/llm-agent-collusion")[
  #project(
    name: "LLM Agent Collusion Arena",
    dates: 2025
  )
]
- Implemented a continuous double auction system for agents
- Implemented oversight, monitors, and other experimental conditions to test influence on collusion
- Added logging and metrics with WandB
- Accepted to ICML 2025 Workshop on Multi-agent Systems

#project(
  name: "Scanning Tunneling Microscope",
  dates: 2024,
)
- Built working STM for \$1,000 using open-source design
- Achieved atomic-resolution imaging capabilities (Circuit Design, Signal Processing, Mechanical Engineering)

== Awards

#project(
  name: "ARENA 6.0 Attendee",
  dates: 2025,
)

#project(
  name: "Non-trivial Fellow",
  dates: 2024,
)

#project(
  name: "YC W26 Acceptance (Declined)",
  dates: 2026,
)


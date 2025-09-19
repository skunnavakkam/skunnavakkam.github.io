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
  font-size:9pt,
)

== Work Experience
#work(
  company: "Model Evaluation and Threat Research (METR)",
  location: "Berkeley, CA",
  title: "Research Intern",
  dates: dates-helper(start-date: "Sep 2023", end-date: "Present")
)
- Worked on projects to evaluate the agentic time horizon of LLMs
- Co-lead engineer of a state of the art evaluation for Chain-of-Thought Faithfulness of Large Langauge Models
- Led team of contractors to red-team LLMs and write #link("https://huggingface.co/datasets/metr-evals/daft-math")[custom datasets]

#work(
  company: "ShapiroLab at Caltech",
  location: "Pasadena, CA",
  title: "Undergraduate Research Intern",
  dates: dates-helper(start-date: "Nov 2024", end-date: "Present")
)
- Building better BCIs by engineering towards 10ms response time ultrasound reporters
- Designed custom proteins with RFDiffusion, Alphafold, and ESM3 for 10x faster kinetics

#work(
  company: "Supervised Program for Alignment Research",
  location: "Remote",
  title: "Research Fellow",
  dates: dates-helper(start-date: "Feb 2025", end-date: "May 2025")
)
- Implemented a complex, _continuous double auction_ agent arena as a model environment for LLM collusion, accepted to _ICML 2025_

 
#work(
  company: "Lee Nano-Optics Lab at UC Irvine",
  location: "Irvine, CA",
  title: "High School Research Intern",
  dates: dates-helper(start-date: "Dec 2022", end-date: "Jun 2024")
)
- Scaled 2D ITO fabrication from mm² to multi-cm² sizes and developed new transfer-matrix methods for ellipsometry and refractive index characterization. Published at a US Government Workshop.

== Skills

Machine Learning (PyTorch, Jax, Transformers, Diffusion Models, Reinforcement Learning on LLMs, GRPO, PPO, Interpretability), Python, Rust, C++, Javascript, Full-stack Development, PCB Fabrication, Data Analysis, Signal Processing, Rust, 3D Modeling, Shop Experience, General Wet Lab, Electron Microscopy, AFM, Scanning Probe Microscopy

== Education

#edu(
  institution: "California Institute of Technology",
  location: "Pasadena, CA",
  dates: "In progress",
  degree: "B.S. in Physics & Computer Science"
)



== Selected Publications

+ A. Deng\*, S. Von Arx\*, B. Snodin, #underline[S. Kunnavakkam], T. Lanham, "CoT May Be Highly Informative Despite "Unfaithfulness"" by _METR_
+ K. Agarwal, V. Teo, J. Vaquez, #underline[S. Kunnavakkam], V. Srikanth, A. Liu, "Evaluating LLM Agent Collusion in Double Auctions" at _ICML 2025 Workshop on Multi-Agent Systems in the Era of Foundation Models _, Vancouver, Canada, July 2025.
+ C. J. Effarah\*, T. Chen\*, #underline[S. Kunnavakkam]\*, C. M. Gonzalez, H. W. Lee, "Liquid Metal Printed 2D ITO for Nanophotonic Applications," in _California-US Government Workshop on 2D Materials_, Irvine, California, USA, Sep 2023




== Projects

#link("https://github.com/METR/CoT-faithfulness-and-monitorability")[
  #project(
    name: "METR: Faithfulness and Monitorability Eval",
    dates: 2025
  )
]
- A thorough evaluation building on Anthropic's seminal work on chain-of-thought (CoT) faithfulness, with thorough redteaming throughout.

#link("https://github.com/andyjliu/llm-agent-collusion")[
  #project(
    name: "LLM Agent Collusion Arena",
    dates: 2025
  )
]
- A continuous double auction system for agents, oversight, monitors, and other experimental conditions to test influence on collusion, accepted to _ICML 2025_

#link("https://sudarsh.com/blog/em-sim")[
  #project(
    name: "EM Simulator",
    dates: 2025,
  )
]
- Reverse mode differentiable FDFD simulators in Jax for inverse design, with fast FDFD and FDTD through diffusion & neural operators

#project(
  name: "Scanning Tunneling Microscope",
  dates: 2024,
)
- Built working STM for \$1,000 using open-source design

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
  name: "Physics Brawl, top 10 US High School Teams",
  dates: "2024, 2023"
)

#project(
    name: "USACO Silver",
    dates: 2023
)

#project(
    name: "AIME Qualifier", 
    dates: 2023
)
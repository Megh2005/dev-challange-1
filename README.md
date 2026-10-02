---
title: ShramPark: Offline-First AI Engineering & Construction Safety Companion Built for Raghav
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built

**ShramPark** is an offline-first, mobile-responsive AI engineering companion and construction site safety platform built specifically for my civil engineer friend, **Raghav**.

### The Problem Raghav Faced

Raghav works as a structural and site civil engineer on active, high-pressure infrastructure and building projects. He spends hours stationed deep underground in basement excavations, piling pits, tunnel shafts, and remote jobsites where cellular networks and internet connectivity drop to absolute zero.

On active sites, Raghav constantly needs to:
- Cross-reference complex Indian Standard (IS) codes (such as IS 456:2000 for reinforced concrete, IS 800:2007 for structural steel, IS 1893:2016 for seismic design, IS 875 for wind and structural loading, and IS 10262:2019 for concrete mix proportioning).
- Perform step-by-step mathematical engineering calculations (limiting moment of resistance, shear capacity, development length, rebar curtailment, and deflection limits).
- Adjust concrete pouring and curing regimes based on real-time micro-climate factors (temperature, relative humidity, wind speed) to prevent thermal cracking and plastic shrinkage as per IS 7861.
- Inspect on-site craftsmanship (rebar placement, cover block clearances, shuttering verticality, honeycombing) and produce stamped technical audit sheets.

In deep basement pits with zero cell reception, conventional cloud-based AI tools are completely unusable. Raghav needed an intelligent, reliable engineering co-pilot that lives directly on his device and never requires an internet connection to solve complex structural problems.

### What ShramPark Does

- **Raghav AI (Offline On-Device Engineering Assistant)**: Runs Google's open-weight **Gemma 4 E2B** model 100% locally in the browser using **LiteRT-LM** and **WebGPU**. It performs limit-state RC beam/slab/column design, shear checks, development length derivations, and mix design checks completely offline with zero server roundtrips.
- **SiteVision (AI Quality & Safety Inspector)**: Computer vision diagnostics allowing engineers and supervisors to snap photos of rebar cages, shuttering, or freshly cast concrete to detect honeycombing, cover block placement errors, slurry leaks, and safety non-compliance.
- **Micro-Climate Engineering Personalization**: Integrates live site geolocation and micro-climate data (ambient temperature, humidity, wind speed) to automatically calculate evaporation rates, adjust curing durations, and suggest plastic shrinkage precautions as per IS 7861.
- **Standardized PDF Engineering Memos**: Generates client-side, formatted technical calculation reports and site inspection checklists with KaTeX mathematical formulas.
- **Tailored for 2 Core Site Roles**: Streamlined explicitly for **Supervisor** (field safety and visual audits) and **Engineer** (structural derivations and IS compliance).

## Demo

The application is deployed and ready to use live in the field:

[![Live Demo](https://img.shields.io/badge/Live%20Demo-shrampark.vercel.app-F06529?style=for-the-badge&logo=vercel&logoColor=white)](https://shrampark.vercel.app/)

**Live Deployment URL**: [https://shrampark.vercel.app/](https://shrampark.vercel.app/)

### Core Workflows to Test:
- **/raghav**: Initialize the on-device Gemma 4 E2B WebGPU engine (download once or select a local `.litertlm` artifact) for 100% offline civil engineering derivations and IS code calculations.
- **/sitevision**: Perform image-based field inspections and generate automated IS code compliance checklists.

## Code

{% github Megh2005/dev-challange-1 %}

[![GitHub Repository](https://opengraph.githubassets.com/1/Megh2005/dev-challange-1)](https://github.com/Megh2005/dev-challange-1)

**GitHub Repository**: [https://github.com/Megh2005/dev-challange-1](https://github.com/Megh2005/dev-challange-1)

## How I Built It

ShramPark is architected around open-weight on-device AI designed to withstand harsh, disconnected construction jobsite environments:

### 1. Open-Source & Open-Weight AI Architecture (Gemma + LiteRT-LM)
- **Model**: **Gemma 4 E2B** (`gemma-4-E2B-it-web.litertlm`), Google's open-weight instruct model quantized and packaged for the LiteRT runtime.
- **Inference Runtime**: **LiteRT-LM (`@litert-lm/core`)** executing client-side on-device inference via **WebGPU**.
- **Model Distribution**: Hosted openly on Hugging Face ([`litert-community/gemma-4-E2B-it-litert-lm`](https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm)).
- **Zero Server Overhead**: The model file is cached client-side using browser Cache Storage or loaded directly via the File System Access API from the user's hard drive. Inference consumes 0 server compute and transmits 0 bytes over the wire.
- **Engine Optimization**: Configured with a 4096-token execution context and KV cache recycling to execute step-by-step mathematical proofs and limit-state safety factor derivations without GPU out-of-memory errors.

### 2. Full-Stack & Engineering Stack
- **Framework**: **Next.js 14 (App Router)** with TypeScript and Tailwind CSS.
- **Multimodal Field Inspections**: Google Generative AI (`@google/generative-ai`) for visual defect analysis and safety compliance audits in SiteVision.
- **Mathematical Typography**: `react-markdown`, `remark-math`, `rehype-katex`, and `katex` for rendering complex civil engineering formulas and equations cleanly on mobile screens.
- **Audio & Accessibility**: Speech synthesis APIs and Cloud Speech for hands-free audio playback on noisy sites.
- **Document Export**: `jspdf` and `@react-pdf/renderer` for instant client-side generation of stamped site inspection logs and structural calculation sheets.
- **Database & Auth**: MongoDB Atlas with `@auth/mongodb-adapter` and `next-auth` for role-based access control (Supervisor, Engineer).

## Why Does Open Innovation Matter?

Open innovation is what made ShramPark viable for real-world construction:

1. **True Offline Independence in Dead Zones**:
   Closed-source APIs require round-trip internet requests. On construction sites—inside double-basements, metro tunnels, rebar fabrication yards, or remote flyover sites—cellular signals are weak or non-existent. Open weights paired with LiteRT-LM allow Raghav to carry an entire structural engineering brain directly in his laptop or tablet browser without a single bar of cell reception.

2. **Zero Incurred In-Field Costs**:
   Civil engineers, site supervisors, and independent contractors cannot afford recurring monthly API subscriptions or per-token fees for routine field calculations. Open-weight local inference delivers complete engineering calculations without recurring expenses.

3. **Domain Ownership & Adherence to Local Standards**:
   Generalist closed APIs frequently default to foreign codes (ACI 318, Eurocodes, or British Standards). Open innovation enables us to constrain and instruct open weights exclusively on Indian Standards (Bureau of Indian Standards: IS 456:2000, IS 1893:2016, IS 800:2007, IS 10262:2019) with deterministic formatting and rigorous limit checks.

4. **Privacy and Site Data Sovereignty**:
   Proprietary structural drawings, tender blueprints, and on-site defect photos remain strictly on the engineer’s machine, guaranteeing complete IP protection for builders and contractors.

## My Agent Session

This project was developed with the assistance of agentic workflows in **Google Antigravity**, which accelerated:
- Integration and debugging of `@litert-lm/core` WebGPU bindings and KV cache memory cleanup.
- Prompt design for strict IS code adherence, mathematical formula formatting, and micro-climate contextualization.
- Clean Next.js 14 architecture with responsive mobile layouts tailored for high-glare outdoor construction use.

## Prize Categories

- **Best Build on Gemma**: ShramPark harnesses Google's open-weight **Gemma 4 E2B** model running completely on-device in the browser via **LiteRT-LM (`@litert-lm/core`)** and **WebGPU**. By delivering 100% offline, zero-latency inference directly on client hardware, it solves the critical problem of cellular dead-zones in deep basement excavations and remote civil infrastructure projects, enabling step-by-step IS-code compliant structural calculations without ever pinging a cloud server.

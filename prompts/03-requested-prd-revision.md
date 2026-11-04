# Stage 3 — Requested PRD revision

**Sequence:** 3 of 3  
**Session date:** November 4, 2026 (session context; exact message time not recorded)  
**Tool:** Codex; exact model identifier not established in this record  
**Source:** User prompt, assistant actions, and resulting PRD visible in the current Codex conversation

## Purpose

Turn the critical review into a stronger implementation specification while preserving the university requirements and the boundary that only `PRD.md` could be changed.

## Original user prompt — verbatim

```text
Please revise PRD.md based on your critical review. Address all identified weaknesses, prioritizing visual quality, interaction, reliability, and meaningful Python integration.

Visual direction: Make the experience feel like a premium, playful, interactive Canva-style travel presentation. Use cohesive pastel pink, lavender, sky blue, and cream colors, polished typography, 3D-style illustrated travel objects, layered backgrounds, soft shadows, and varied slide compositions. The presentation should feel like a professionally designed interactive personality quiz, not a generic slideshow.

Specify one impressive animated 3D suitcase as a central visual feature, with precise materials, lighting, motion, and interaction behavior. Clearly distinguish actual 3D animation from 2D illustrations.

Make all seven quiz questions visually varied and engaging. Include a visual progress bar, smooth transitions, clickable answer cards, a back button, and the ability to revise answers. Hide profile scoring until results are revealed.

Make the result slide immediately show the user's traveler personality, personalized destination, and a brief explanation based on their actual answers. Include four distinct traveler profiles and a replay option.

Specify a reliable Python workflow that analyzes exported quiz responses and generates a chart, with clear instructions for demonstrating it. Define deterministic scoring and tie-breaking rules, export behavior after answer changes, and basic session recovery.

Add a clear plan for verified travel facts and source references, local assets, accessibility, responsive layout, and offline demonstration.

Update the slide-by-slide outline, acceptance criteria, implementation checklist, and testing plan accordingly. Preserve at least 12 slides and all university requirements.

Create or update only PRD.md. Do not implement the application yet. Summarize the revisions and wait for approval.
```

## Assistant work and response — reconstructed summary, not an exact transcript

The assistant inspected the existing PRD and replaced it with version 2.0. It retained 16 slides and seven questions, expanded the visual and interaction specifications, and added explicit recovery, export revision, and Python demonstration rules.

After writing the revision, the assistant checked that all 16 slide rows were present in sequence, code fences were balanced, and required topics were included. The check reported 7,624 words. A directory listing showed only the pre-existing `.DS_Store` file and `PRD.md`; no application files had been created.

The assistant summarized the revised plan and stated that implementation remained pending approval.

## Key decisions and resulting specification changes

| Area | Change in PRD version 2.0 |
| --- | --- |
| Visual quality | Defined pastel pink, lavender, sky blue, cream, dark ink, and action purple; added typography, grid, spacing, layering, shadows, state design, and representative-composition review. |
| Actual 3D | Changed the original CSS suitcase concept to a genuine mesh scene using a locally bundled Three.js module. Defined geometry, shell and trim materials, soft key/fill/rim lighting, camera framing, bounded idle motion, pointer/drag and keyboard controls, performance targets, and a local poster fallback. |
| 2D distinction | Explicitly separated the animated 3D suitcase from static dimensional illustrations and decorative 2D motion. |
| Quiz variety | Specified seven distinct compositions: city map, packing tags, route-change ticket, sunrise windows, travel vouchers, group conversation, and memory postcards. |
| Interaction | Added visual slide progress and seven-step quiz completion; retained clickable cards, Back/Next, answer revision, gating, and no automatic advance. |
| Reduced priming | Replaced the early profile introduction with a travel-mood slide and kept scoring/profile labels hidden until reveal. |
| Immediate results | Moved the full profile, destination, answer-based explanation, sample day, export, review, and replay to slide 12. Slide 16 became a synchronized recap. |
| Personalization | Required explanations using actual selections and destination-specific morning activity variants selected from Q4. |
| Scoring | Retained one point per answer. Adopted fixed tie priority Q7, Q1, Q5, Q4, Q2, Q3, Q6, with disclosure naming the actual deciding question. No eighth question was added. |
| Session recovery | Promoted validated tab-session recovery to P0 using session storage, with Resume/Start Fresh and graceful handling of corrupt, incompatible, or unavailable storage. |
| Export revisions | Defined per-attempt IDs, revision increments on answer changes, stable unchanged re-exports, new IDs for replay, and consistent recovery of revision state. |
| Python analysis | Required independent scoring, deduplication, latest-valid revision selection, conflicting-record quarantine, reporting, chart/CSV/JSON outputs, and controlled publication of matching chart/summary assets. |
| Demonstration | Added planned commands and an offline walkthrough showing an original browser export and edited revision counted as one attempt. |
| Synthetic evidence | Specified a deterministic 20-attempt sample with five final results per profile and clear “not a survey” labeling. This dataset was specified, not generated. |
| Facts and assets | Added source-verification records and release gates, local source metadata, destination/activity verification, licensing, and no required runtime CDN dependencies. |
| Acceptance and tests | Updated criteria, P0 checklist, milestones, recovery/export tests, 3D fallback tests, responsive checks, offline rehearsal, and planned JavaScript/Python parity across 16,384 answer combinations. |
| University documentation | Retained README screenshots, source code, Python, prompt records, credits, testing evidence, and at least three documented improvements as future repository requirements. |

## Evidence and limits

**Artifact changed:** [PRD.md](../PRD.md), from version 1.0 to version 2.0.

The checks performed during this stage were document-structure checks. They were not application tests, scoring parity tests, accessibility audits, or Python pipeline execution. No 3D scene, screenshots, synthetic dataset, source research, or executable analysis script was produced.

The revised specification explicitly leaves facts and destination activities to be verified before release. The representative visual review is a future implementation checkpoint, not a completed design approval.

## Human review and status

The user requested this revision and subsequently requested documentation of the three planning stages. The session does not contain approval to implement the application. Version 2.0 remains a proposed specification awaiting approval.

**Previous stage:** [Critical review](02-critical-review.md).  
**Process index:** [Planning chronology](README.md).

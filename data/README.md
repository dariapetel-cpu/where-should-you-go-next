# Shared quiz content

`quiz-v1.json` is the single versioned source for questions, stable option IDs, profile mappings, fixed answer order, tie priority, result text, morning variants, and source references. The browser fetches this local file over HTTP. The later Python analyzer must read the same JSON file directly; no browser backend or generated duplicate rules are needed.

Schema version: `1`. Quiz version: `1.0.0`. Any change to mappings, question semantics, or tie priority requires a new quiz version and a recovery compatibility decision.

## Response contract implemented in this milestone

An explicit result-screen download contains exactly:

- `schema_version`, `quiz_version`, random `response_id`, positive integer `revision`.
- `answers`: seven objects with `question_id` and `option_id`, in question order.
- `counts`: integer counts keyed by `planner`, `adventurer`, `relaxer`, `food_explorer`.
- `profile_id` and `data_origin: "participant"`.

A new attempt starts at revision 1; seven initial choices result in revision 8. Actual edits increment the revision. Selecting the same option or exporting again does not. Replay creates a new ID. No timestamps, free text, names, or contact data are collected. The random ID identifies an attempt, not a person.

Keep participant exports outside the repository. Existing `.gitignore` rules exclude the download filename pattern. Future Python validation must recompute scores, resolve revisions, reject conflicts/mixed provenance, and generate the chart according to PRD section 9. This milestone implements the input contract, **not the Python analysis or chart**.

## Destination source review

Reviewed November 5, 2026. Pages do not provide a publication date unless explicitly stated; no date has been invented. Sources support the general destination/experience pairing. The four personality matches and all sample-day combinations are editorial suggestions, not scientific or source-authored recommendations. Morning variants are generic activity ideas, not claims about a particular restaurant, booking, route, price, or opening time.

| Destination | Primary source | Supported content |
| --- | --- | --- |
| Kyoto | [Kyoto City Official Guide](https://kyoto.travel/en/) — Kyoto City Tourism Association | Temples, gardens, neighborhood exploration. |
| Queenstown | [Lake Sylvan Track](https://www.queenstownnz.co.nz/listing/lake-sylvan-track/10788/) — Destination Queenstown; [Queenstown day walks](https://www.doc.govt.nz/globalassets/documents/parks-and-recreation/tracks-and-walks/otago/queenstown-day-walks-bike-trails-brochure.pdf) — New Zealand Department of Conservation | Walking opportunities and Queenstown Gardens beside Lake Wakatipu. |
| The Algarve | [Cycling and walking in the Algarve](https://www.visitportugal.com/en/destinos/algarve/304109) — Turismo de Portugal | Coastal landscapes and walking; routes vary in difficulty. |
| Bologna | [Bologna Gourmet](https://www.bolognawelcome.com/en/clubs/cooking-schools-and-sfogline/bologna-gourmet-a-casa-ilaria-2) — Bologna Welcome | Local cooking workshops and market experiences. |

Concise references are available in the result details. The presentation content works without internet when the local server is running; opening external source pages requires internet. No external photos, models, fonts, or libraries were added. The later travel-facts slide still requires its own verified fact research.

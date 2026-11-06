# Stage 14 — Result reveal bug fix

Date: November 6, 2026.

## Exact user request

> URGENT BUG FIX: In getaway.html, slide 11 is stuck on "Comparing your preferences". Clicking "Show my match now" or "Reveal my match" does nothing, even though all 7 answers are saved.
>
> Investigate the JavaScript error and the transition from slide 11 to slide 12. Fix the root cause, verify that the result appears immediately, and test the complete quiz flow from question 1 through the destination result.
>
> Preserve all existing answers, scoring, designs and animations. Prioritize this bug over visual improvements. Do not commit or push. Report the fix and test results.

## Investigation and changes — implementation summary

The result renderer called `photo()` for the optional `scenery-near` layer without checking whether that element existed. A regression using the current controller with that optional layer absent reproduced `TypeError: Cannot read properties of null (reading 'dataset')`, through `photo → backdrop → renderResult → go`. This can occur with an older document containing the original background but not the new foreground layer. The actual error in the user's open tab could not be read: browser tab access failed with the tool's `timeoutMs` error. Thus the missing-layer scenario is a reproduced failure, not a directly observed browser-console diagnosis.

`go()` also changed the internal slide before rendering completed. An exception left the matching slide visible but navigation pointed at a later slide. Subsequent footer clicks could move the internal index again without revealing anything.

Fixed both issues:

- Image application and pointer movement tolerate an absent optional scenery layer. Normal imagery and animations are unchanged when present.
- Destination content renders before the active-slide/revealed state commits.
- A failed render logs the error, keeps the current navigation state and saved answers intact, and displays actionable retry feedback instead of failing silently.
- No state schema, scoring, content, CSS, quiz mappings or stored-answer migration changed.

## Verification

A new regression failed before the fix with the exact null/dataset exception, and passes afterward. Tests walk from question 1 through all seven answers and reveal immediately through each button, independently test the automatic transition, resume saved matching progress, and simulate an interrupted render followed by a successful retry. Assertions preserve attempt ID, revision and all seven answers. Existing tests retain coverage for all fifteen destinations and exhaustive scoring parity.

Browser verification remains unavailable. Headless Chrome also failed under environment permissions; no live browser or GPU claim is made. Refresh the same tab and select Resume to use the fix without clearing saved answers. No commit or push.

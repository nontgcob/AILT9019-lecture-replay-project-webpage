# Lecture Replay — project webpage

A responsive, static project page for [Lecture Replay](https://github.com/qpoe/AILT9019), built for GitHub Pages. No framework, build step, server-side runtime, or API key is required for this website.

## Preview locally

From this webpage repository:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Use an HTTP server rather than opening `index.html` directly: the real-example answer section loads a local JSON file with `fetch()`. This previews the webpage; the separate Streamlit application usually runs on port 8501.

## Publish to GitHub Pages

1. Commit and push these files to the `main` branch of `nontgcob/AILT9019-lecture-replay-project-webpage`.
2. In the GitHub repository, open **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select **main** and **/ (root)**, then save.
5. Wait for the Pages deployment to finish. The expected URL is https://nontgcob.github.io/AILT9019-lecture-replay-project-webpage/.

`.nojekyll` keeps the site as plain static assets. All internal asset/data links are relative, so the repository subpath works without a base-URL build setting. See [GitHub's official Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Contents

- `index.html` — project story, embedded YouTube demo, real answer examples, workflow, evidence, local application instructions, and attribution.
- `styles.css` — responsive design, typography, floating hero illustration, section reveals, video loading treatment, and reduced-motion support.
- `script.js` — answer carousel, source-passage inspection, keyboard navigation, animated mobile navigation and accordions, video loading state, scroll-triggered animations, operating-system command switch, and copy commands.
- `assets/favicon.svg` — Font Awesome rotate-left icon.
- `assets/fontawesome-solid.svg` — locally bundled Font Awesome Free 6.7.2 icon sprite.
- `assets/fontawesome-LICENSE.txt` — upstream licence and attribution.
- `evidence/demo.json` — four selected outputs, unchanged, from the project's saved evaluation report.
- `evidence/evaluation.json` — the complete saved model evaluation.
- `evidence/gold-questions.json` — the benchmark questions and reference evidence.
- `evidence/cleaning-audit.txt` — the existing transcript-cleaning audit.
- `evidence/local-verification.json` — genuine offline executions captured while building this webpage.

## Evidence provenance and limits

Source checkout inspected: `88c7d3610022cb64c97d7164485e84bb074ab8f1`.

The saved model report records `qwen3.8-flash`, run date `2026-11-12T18:32:36+00:00`, corpus commit `956d7bd`, and 17/17 questions / 81/81 checks passed. The page describes this as a historical result on a fixed benchmark. It is not a new evaluation or a general accuracy claim. The transcript-cleaning audit is a separate artifact, not a claim that every cleaning change passed manual review.

The interactive demonstration is a replay of those saved outputs, not a live model connection or a recreation of the Streamlit UI. It includes grounded, unsupported-topic, and refusal examples. Source passages and timestamps come directly from the report. Examples advance every three seconds with a vertical progress indicator. Hovering does not pause rotation; visitors can use the Pause/Play control. Long answers scroll inside a fixed-height panel. Reduced-motion preferences disable automatic rotation by default.

The separate video demo embeds [the recorded project walkthrough](https://www.youtube.com/watch?v=l_d4B_EfV1A) using YouTube’s privacy-enhanced embed domain. It loads lazily, does not autoplay, and has an orange frame and loading placeholder.

During this build, the current project's real `answer()` function was exercised with explicit empty credentials to force its cached fallback; the academic-integrity refusal and keyword retrieval were executed; and the scorer reference self-test was run. No live LLM API was called. The saved model evaluation and this offline verification are kept separate.

The initial three lectures are the documented demo/evaluation scope. The project also supports importing additional lectures; this page does not imply that the current corpus is limited by code to three files.

## Updating the page

If the project changes, refresh the evidence files from its `eval/` directory, update `demo.json` from the selected result entries (`G03`, `G09`, `G11`, `G13`), and update any affected pass counts and evidence descriptions in `index.html` and this README. Recheck the local setup commands against the application code. Do not add API keys or local secrets.

Google Fonts provides DM Sans for body text and the wordmark, and Fredericka the Great for headings; the CSS supplies system and Georgia fallbacks. The embedded demo requires a connection to YouTube. Other site assets and evidence files are local. Timestamped lecture citations open their source recordings on YouTube.

## Attribution

Lecture material: MIT OpenCourseWare, 6.100L Introduction to CS and Programming Using Python, lectures 1–3, used non-commercially under CC BY-NC-SA 4.0. Attribution and links to the original course and licence are included in the footer. Do not imply MIT endorsement.

All website icons, including the header/footer logo, favicon, workflow icons, navigation arrows, decorative marks and dynamically rendered source links, use Font Awesome Free 6.7.2. The selected solid SVG paths are bundled locally without a runtime icon CDN dependency. Icons: CC BY 4.0, Fonticons, Inc. See `assets/fontawesome-LICENSE.txt` and https://fontawesome.com/.

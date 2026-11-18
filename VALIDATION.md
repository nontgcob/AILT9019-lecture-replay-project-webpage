# Verification — 18 November 2026

- Browser: checked at 1440px, 423px and 375px widths. No horizontal document overflow at these widths. No console warnings or errors observed.
- Interactions: all four recorded-answer tabs; changing source citations and video link targets; keyboard arrow navigation between tabs; mobile menu opening and closing after navigation; macOS/Linux and Windows command switch; copy-command success UI; expandable MCP setup.
- Static checks: JavaScript syntax passed; all local static links and section fragments resolve; no duplicate HTML IDs. Relative asset paths support the GitHub Pages repository subpath.
- Original project: actual cached Q&A executed with explicit empty credentials (10 valid citations, cached mode); integrity request returned refused mode; real keyword retrieval returned passages; evaluation scorer reference self-test passed 17/17 and 81/81.
- MCP: real stdio integration test passed, including tools, shared rules and prompt, and input-error recovery.
- Saved demo answers are unchanged outputs from the existing evaluation JSON. Downloadable evaluation, benchmark and cleaning audit match the source files.

Limits: no fresh live LLM evaluation was run; no subjective answer-quality judging was performed; the Streamlit app UI itself was not launched in this build. GitHub Pages publication is not yet verified. Google Fonts and external video/repository links require internet access; local fallback fonts are provided.

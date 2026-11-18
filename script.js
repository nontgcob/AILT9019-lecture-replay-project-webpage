'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Small formatter for the repository's recorded answers. Raw HTML is always escaped.
function inline(text) {
  return escapeHTML(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
function renderAnswer(text) {
  return text.split(/\n\s*\n/).map(block => {
    const lines = block.split('\n');
    if (lines.every(line => /^\s*[-*]\s/.test(line))) return '<ul>' + lines.map(line => '<li>' + inline(line.replace(/^\s*[-*]\s/, '')) + '</li>').join('') + '</ul>';
    return '<p>' + inline(block).replace(/\n/g, '<br>') + '</p>';
  }).join('');
}
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  $('#navigation').classList.toggle('open', !expanded);
});
$$('#navigation a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); $('#navigation').classList.remove('open'); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); $('#navigation').classList.remove('open'); } });
let toastTimer;
function toast(message) { $('.toast').textContent = message; $('.toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('.toast').classList.remove('show'), 2500); }
$$('.copy-button').forEach(button => button.addEventListener('click', async () => {
  const code = document.getElementById(button.dataset.copy);
  try { await navigator.clipboard.writeText(code.textContent); toast('Step ' + button.dataset.copy.split('-').pop() + ' commands copied'); }
  catch { const range = document.createRange(); range.selectNodeContents(code); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); toast('Commands selected. Press Ctrl+C or ⌘C to copy.'); }
}));
$$('[data-os]').forEach(button => button.addEventListener('click', () => {
  const windows = button.dataset.os === 'windows';
  $$('[data-os]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  $('#setup-code-2').textContent = `${windows ? 'python' : 'python3'} -m venv .venv\n${windows ? '.venv\\Scripts\\activate.bat' : 'source .venv/bin/activate'}\npip install -r requirements.txt`;
  $('.activation-note').textContent = windows ? 'Use Windows Command Prompt.' : 'Use your macOS or Linux terminal.';
}));
function appendIcon(parent, name) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(ns, 'use');
  use.setAttribute('href', `assets/fontawesome-solid.svg#${name}`);
  svg.append(use);
  parent.append(svg);
}
function videoURL(url) {
  try { const parsed = new URL(url); if (parsed.protocol === 'https:' && parsed.hostname === 'www.youtube.com') return parsed.href; } catch {}
  return null;
}
let examples = [];
function selectExample(id) {
  const example = examples.find(item => item.id === id);
  if (!example) return;
  $$('.demo-tabs button').forEach(tab => { const selected = tab.dataset.id === id; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
  $('#demo-panel').setAttribute('aria-labelledby', `tab-${id}`);
  $('#demo-question').textContent = example.question;
  $('#answer-badge').textContent = example.result.mode === 'refused' ? 'Graded-work refusal' : example.category === 'unsupported' ? 'Outside the corpus' : 'Saved live output';
  $('#demo-answer').innerHTML = renderAnswer(example.result.text);
  const area = $('#citation-area');
  area.replaceChildren();
  const citations = example.result.citations || [];
  if (!citations.length) {
    const note = document.createElement('p'); note.className = 'behavior-note';
    note.textContent = example.category === 'refusal' ? 'The project declines this request and offers help with the underlying lecture concept instead.' : 'This recorded answer reports that the topic is not covered, rather than introducing unsupported material.';
    area.append(note); return;
  }
  const heading = document.createElement('p'); heading.className = 'citation-heading'; heading.textContent = 'INSPECT THE SOURCE · SELECT A CITATION';
  const chips = document.createElement('div'); chips.className = 'citations'; chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Source citations');
  const passage = document.createElement('div'); passage.className = 'source-passage'; passage.setAttribute('aria-live','polite');
  function chooseCitation(index) {
    const citation = citations[index];
    $$('button', chips).forEach((chip, i) => { chip.classList.toggle('active', i === index); chip.setAttribute('aria-pressed', String(i === index)); });
    passage.replaceChildren();
    const title = document.createElement('div'); title.className = 'source-title'; title.textContent = `${citation.lecture} · ${citation.timestamp} / Original corpus passage`;
    const quote = document.createElement('blockquote'); quote.textContent = citation.paragraph_text;
    passage.append(title, quote);
    const url = videoURL(citation.video_link);
    if (url) { const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Watch this moment on YouTube '; appendIcon(link, 'arrow-up-right-from-square'); passage.append(link); }
  }
  citations.forEach((citation, i) => { const button = document.createElement('button'); button.className = 'citation-chip'; button.textContent = `${citation.lecture} · ${citation.timestamp}`; button.addEventListener('click', () => chooseCitation(i)); chips.append(button); });
  area.append(heading, chips, passage); chooseCitation(0);
}
const tabs = $$('.demo-tabs button');
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectExample(tab.dataset.id));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); selectExample(tabs[next].dataset.id); }
  });
});
fetch('evidence/demo.json').then(response => { if (!response.ok) throw new Error('Demo unavailable'); return response.json(); }).then(data => { examples = data.examples; selectExample('G13'); }).catch(() => {
  $('#demo-question').textContent = 'Read the recorded demonstration';
  $('#demo-answer').innerHTML = '<p>The saved answers could not be loaded. Open this page through a local web server, or <a href="evidence/evaluation.json">read the evaluation report directly</a>.</p>';
  tabs.forEach(tab => { tab.disabled = true; });
});

// Animate native details while preserving keyboard activation and allowing reversals.
const accordionPanels = $$('.setup-detail');
const accordionControls = new Map();
accordionPanels.forEach(details => {
  const summary = $('summary', details);
  const content = summary.nextElementSibling;
  let expanded = details.open;
  let animation = null;
  details.dataset.expanded = String(expanded);
  summary.setAttribute('aria-expanded', String(expanded));
  content.inert = !expanded;
  function setExpanded(next) {
    if (next === expanded) return;
    expanded = next;
    const startHeight = details.getBoundingClientRect().height;
    if (animation) { animation.cancel(); animation = null; }
    details.open = true;
    details.dataset.expanded = String(next);
    summary.setAttribute('aria-expanded', String(next));
    content.inert = !next;
    const endHeight = next ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !details.animate) {
      details.open = next;
      details.style.overflow = '';
      return;
    }
    details.style.overflow = 'hidden';
    const current = details.animate(
      [{height: startHeight + 'px'}, {height: endHeight + 'px'}],
      {duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)'}
    );
    animation = current;
    current.onfinish = () => {
      if (animation !== current) return;
      details.open = expanded;
      details.style.overflow = '';
      animation = null;
    };
  }
  accordionControls.set(details, setExpanded);
  summary.addEventListener('click', event => {
    event.preventDefault();
    const next = !expanded;
    if (next) accordionControls.forEach((close, panel) => { if (panel !== details) close(false); });
    setExpanded(next);
  });
});

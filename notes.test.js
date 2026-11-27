const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const html = readFileSync(`${__dirname}/notes.html`, 'utf8');
const scripts = [...html.matchAll(/<script defer src="([^"]+)"/g)]
  .map(([, file]) => readFileSync(`${__dirname}/${file}`, 'utf8'));

function loadPage(storage) {
  const change = {};
  const selector = { append() {}, addEventListener(type, listener) { change[type] = listener; } };
  const input = {};
  const list = { replaceChildren(...items) { this.items = items; } };
  const template = { content: { cloneNode() {
    const elements = { p: {}, time: {} };
    return { querySelector: (tag) => elements[tag] };
  } } };
  const elements = {
    '#language': selector, '#note': input, '#notes': list,
    '#note-template': template, '#note-form': { addEventListener() {} },
  };
  const labels = [...html.matchAll(/data-text="([^"]+)"/g)]
    .map(([, key]) => ({ dataset: { text: key } }));
  const document = {
    documentElement: {},
    querySelector: (id) => elements[id],
    querySelectorAll: () => labels,
    createElement: () => ({}),
  };
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };

  runInNewContext(scripts.join('\n'), { document, localStorage });
  return {
    select(locale) { selector.value = locale; change.change(); },
    locale: () => document.documentElement.lang,
    labels: () => [...labels.map((label) => label.textContent), input.placeholder, document.title],
    time: () => list.items[0].querySelector('time').textContent,
  };
}

const createdAt = '2026-11-27T20:45:00.000Z';
const formattedTime = (locale) => new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(createdAt));

function noteStorage() {
  return new Map([['notes.entries', JSON.stringify([{ text: 'Example note', createdAt }])]]);
}

test('switching language updates every label and reformats existing timestamps', () => {
  const page = loadPage(noteStorage());
  assert.deepEqual(page.labels(), [
    'Notes', 'Language', 'New note', 'Add note', 'Saved notes', 'Write a note…', 'Notes',
  ]);
  assert.equal(page.time(), formattedTime('en-US'));

  page.select('fr-FR');
  assert.deepEqual(page.labels(), [
    'Notes personnelles', 'Langue', 'Nouvelle note', 'Ajouter la note',
    'Notes enregistrées', 'Écrivez une note…', 'Notes personnelles',
  ]);
  assert.equal(page.time(), formattedTime('fr-FR'));
  assert.notEqual(page.time(), formattedTime('en-US'));
});

test('the selected locale is applied on reload', () => {
  const storage = noteStorage();
  loadPage(storage).select('fr-FR');

  const page = loadPage(storage);
  assert.equal(page.locale(), 'fr-FR');
  assert.equal(page.labels()[0], 'Notes personnelles');
  assert.equal(page.time(), formattedTime('fr-FR'));
});

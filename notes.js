const language = document.querySelector('#language');
const noteInput = document.querySelector('#note');
const noteList = document.querySelector('#notes');
const noteTemplate = document.querySelector('#note-template');
const notes = JSON.parse(localStorage.getItem('notes.entries') ?? '[]');

for (const [locale, strings] of Object.entries(translations)) {
  const option = document.createElement('option');
  option.value = locale;
  option.lang = locale;
  option.textContent = strings.name;
  language.append(option);
}

const savedLanguage = localStorage.getItem('notes.language');
language.value = Object.hasOwn(translations, savedLanguage) ? savedLanguage : 'en-US';

function render() {
  const locale = language.value;
  const strings = translations[locale];
  document.documentElement.lang = locale;
  document.title = strings.heading;
  for (const element of document.querySelectorAll('[data-text]')) {
    element.textContent = strings[element.dataset.text];
  }
  noteInput.placeholder = strings.placeholder;

  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
  const items = notes.map(({ text, createdAt }) => {
    const item = noteTemplate.content.cloneNode(true);
    item.querySelector('p').textContent = text;
    const time = item.querySelector('time');
    time.dateTime = createdAt;
    time.textContent = formatter.format(new Date(createdAt));
    return item;
  });
  noteList.replaceChildren(...items);
}

language.addEventListener('change', () => {
  localStorage.setItem('notes.language', language.value);
  render();
});

document.querySelector('#note-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = noteInput.value.trim();
  if (!text) return;

  notes.unshift({ text, createdAt: new Date().toISOString() });
  localStorage.setItem('notes.entries', JSON.stringify(notes));
  noteInput.value = '';
  render();
});

render();

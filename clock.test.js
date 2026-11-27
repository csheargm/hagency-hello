// Run with: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { formatTime, startClock, TICK_INTERVAL_MS } = require('./clock.js');

const FIXED_WINTER = new Date('2026-01-15T12:00:00Z');
const FIXED_SUMMER = new Date('2026-07-15T12:00:00Z');
const MIN_LOCATIONS = 5;
const MAX_TICK_MS = 60000;

function readLocationZones() {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const select = html.match(/<select id="clock-location"[\s\S]*?<\/select>/);
  assert.ok(select, 'index.html has the location selector');
  return Array.from(select[0].matchAll(/<option value="([^"]+)"/g), (m) => m[1]);
}

/** Minimal stand-ins for the <select> and <output> elements. */
function makeFakePage(initialZone) {
  const listeners = [];
  const select = {
    value: initialZone,
    addEventListener: (type, fn) => listeners.push({ type, fn }),
  };
  const change = (zone) => {
    select.value = zone;
    listeners.filter((l) => l.type === 'change').forEach((l) => l.fn());
  };
  return { select, output: { textContent: '' }, change };
}

test('formatTime shows the fixed clock in each time zone', () => {
  assert.equal(formatTime(FIXED_WINTER, 'Asia/Tokyo'), '21:00:00');
  assert.equal(formatTime(FIXED_WINTER, 'America/New_York'), '07:00:00');
  assert.equal(formatTime(FIXED_WINTER, 'Europe/London'), '12:00:00');
  assert.equal(formatTime(FIXED_WINTER, 'America/Los_Angeles'), '04:00:00');
});

test('formatTime follows daylight saving time', () => {
  assert.equal(formatTime(FIXED_SUMMER, 'America/New_York'), '08:00:00');
  assert.equal(formatTime(FIXED_SUMMER, 'Europe/London'), '13:00:00');
});

test('formatTime shows midnight as 00, not 24', () => {
  assert.equal(formatTime(new Date('2026-01-15T15:00:00Z'), 'Asia/Tokyo'), '00:00:00');
});

test('the selector offers at least five cities in different time zones', () => {
  const zones = readLocationZones();
  assert.ok(zones.length >= MIN_LOCATIONS, `found ${zones.length} locations`);
  const times = zones.map((zone) => formatTime(FIXED_WINTER, zone));
  assert.equal(new Set(times).size, zones.length, 'every location shows a different time');
});

test('the page shows the selected location and updates on change', () => {
  const page = makeFakePage('Asia/Tokyo');
  startClock({ ...page, now: () => FIXED_WINTER, schedule: () => 0 });
  assert.equal(page.output.textContent, '21:00:00');

  page.change('America/New_York');
  assert.equal(page.output.textContent, '07:00:00');
});

test('the displayed time advances at least once a minute', () => {
  const page = makeFakePage('Europe/London');
  let current = FIXED_WINTER;
  let tick;
  let intervalMs;
  startClock({
    ...page,
    now: () => current,
    schedule: (fn, ms) => { tick = fn; intervalMs = ms; return 0; },
  });
  assert.equal(intervalMs, TICK_INTERVAL_MS);
  assert.ok(intervalMs <= MAX_TICK_MS);

  current = new Date(FIXED_WINTER.getTime() + MAX_TICK_MS);
  tick();
  assert.equal(page.output.textContent, '12:01:00');
});

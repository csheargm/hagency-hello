// Current time for a chosen location. Loaded as a plain script by index.html
// and as a CommonJS module by clock.test.js. The list of locations lives only
// in index.html (the <option> values are IANA time zone names).

const TICK_INTERVAL_MS = 1000;
const CLOCK_LOCALE = 'en-US';

/** Formats `date` as 24-hour HH:MM:SS in the given IANA time zone. */
function formatTime(date, timeZone) {
  return new Intl.DateTimeFormat(CLOCK_LOCALE, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

/**
 * Keeps `output` showing the current time in the zone selected in `select`.
 * `now` and `schedule` are injectable so tests can run against a fixed clock.
 */
function startClock({ select, output, now = () => new Date(), schedule = setInterval }) {
  const render = () => {
    output.textContent = formatTime(now(), select.value);
  };
  select.addEventListener('change', render);
  render();
  return schedule(render, TICK_INTERVAL_MS);
}

if (typeof document !== 'undefined') {
  startClock({
    select: document.getElementById('clock-location'),
    output: document.getElementById('clock-time'),
  });
}

if (typeof module !== 'undefined') {
  module.exports = { formatTime, startClock, TICK_INTERVAL_MS };
}

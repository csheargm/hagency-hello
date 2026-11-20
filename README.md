# hagency-hello

**Live site:** <https://csheargm.github.io/hagency-hello/>

## Deployment

The app is the single static file `index.html`, published with GitHub Pages by
the workflow in `.github/workflows/pages.yml`. Every push to the default branch
(that is, every merged change) copies `index.html` into the Pages artifact and
deploys it; there is no build step. You can also run the workflow by hand from
the Actions tab ("Deploy to GitHub Pages" → "Run workflow").

One-time setup: in the repository's **Settings → Pages**, set **Source** to
**GitHub Actions**.

## Greeting colors and sizes

Each language is paired with one representative country for styling only; the
pairing does not imply the language is exclusive to that country. Each country
has its own greeting color on a white background.

Sizes follow the population ranking, not a direct population ratio, so every
greeting stays within a readable range. Source: World Bank, [Population, total
(`SP.POP.TOTL`), 2024](https://api.worldbank.org/v2/country/FRA;EGY;MEX;RUS;USA;CHN/indicator/SP.POP.TOTL?date=2024&format=json).
Population figures are approximate, in millions.

| Representative country | 2024 population (millions) | Greeting size |
| --- | ---: | ---: |
| France | 69 | 1.75 rem |
| Egypt | 116 | 2 rem |
| Mexico | 131 | 2.25 rem |
| Russia | 144 | 2.5 rem |
| United States | 340 | 2.75 rem |
| China | 1,409 | 3 rem |

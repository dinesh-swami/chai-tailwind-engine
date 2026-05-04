# Chai-Tailwind

Chai-Tailwind is a lightweight utility-first CSS engine inspired by Tailwind CSS, but it runs entirely in the browser with no JIT compiler, no build step, and no backend dependency.

## Install

```bash
npm i chai-ui-engine
```

## Use

```html
<script src="node_modules/chai-tailwind/dist/chai-tailwind.js"></script>

<div class="chai-p-10 chai-bg-red chai-text-center chai-rounded-lg">
  Hello Chai
</div>
```

The engine scans the DOM, converts `chai-*` classes into inline styles, resolves conflicts with last-class-wins behavior, and optionally keeps watching the DOM with `MutationObserver`.

## CLI engine

If you want to convert `chai-*` classes into inline `style=""` attributes directly inside HTML files, run:

```bash
npx chai-engine
```

You can also scan a custom folder:

```bash
npx chai-engine ./src
```

The CLI:

- scans `.html` files
- only transforms files that include the `chai-tailwind` script tag
- converts supported `chai-*` classes into `style=""`
- removes successfully converted utility classes from the `class` attribute

## Supported utilities

- Spacing: `chai-p-16`, `chai-mx-auto`, `chai-px-24`
- Colors: `chai-bg-red`, `chai-text-blue`, `chai-border-gray`
- Typography: `chai-text-18`, `chai-text-center`, `chai-font-bold`
- Borders: `chai-border`, `chai-border-2`, `chai-rounded-xl`
- Layout: `chai-flex`, `chai-block`, `chai-inline-block`, `chai-justify-between`, `chai-items-center`
- Sizing: `chai-w-full`, `chai-max-w-480`, `chai-min-h-screen`

## Package files

- `chai.js`: source engine
- `dist/chai-tailwind.js`: readable browser build
- `dist/chai-tailwind.min.js`: minified browser build

## Docs site

- `index.html`: home page
- `docs.html`: setup, utility reference, examples, and engine explanation

## Test

```bash
npm test
npm run test:perf
```

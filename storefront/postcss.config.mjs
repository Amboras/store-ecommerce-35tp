import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// Explicitly resolve Tailwind v3 from pnpm store to avoid a stray v4 install
// shadowing `tailwindcss` at the top level of node_modules.
const tailwindcss = require(
  './node_modules/.pnpm/tailwindcss@3.4.19/node_modules/tailwindcss'
)
const autoprefixer = require(
  './node_modules/.pnpm/autoprefixer@10.5.0_postcss@8.5.9/node_modules/autoprefixer'
)

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [tailwindcss, autoprefixer],
}

export default config

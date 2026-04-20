import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Resolve tailwindcss and autoprefixer directly from the project's pnpm store
// because the root-level node_modules/tailwindcss symlink is missing and Node
// would otherwise walk up and pick up a global v4 install.
const tailwindcss = require(
  './node_modules/.pnpm/tailwindcss@3.4.19/node_modules/tailwindcss',
)
const autoprefixer = require(
  './node_modules/.pnpm/autoprefixer@10.5.0_postcss@8.5.9/node_modules/autoprefixer',
)

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [tailwindcss, autoprefixer],
}

export default config

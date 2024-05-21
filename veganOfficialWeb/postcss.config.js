// postcss.config.mjs
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import postcssNesting from 'postcss-nesting';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcssImport,
    tailwindcss,
    postcssNesting,
    autoprefixer,
  ],
};

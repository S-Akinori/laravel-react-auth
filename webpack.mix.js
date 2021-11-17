const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss'); //追加

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig({ // 追加 -> sassファイルを一括コンパイルする
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.scss/,
        loader: 'import-glob-loader'
      }
    ]
  }
});

//いくつか変更
mix.ts('resources/ts/app.tsx', 'public/js')
    .js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .options({
      processCssUrls: false,
      postCss: [tailwindcss('./tailwind.config.js')],
    });

import svg from 'rollup-plugin-svg'
import sass from 'rollup-plugin-sass'
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import cssnano from 'cssnano';
import postcss from 'postcss';
const license = require('rollup-plugin-license');

function getPlugins(isProd) {
  const sassOptions = {output:false};
  if(isProd) {
    sassOptions.processor = css => postcss([cssnano]).process(css).then(result => result.css);
  }

  let plugins = [
    resolve(),
    svg(),
    sass(sassOptions),
  ];

  if(isProd)
    plugins.push(terser());

  plugins.push(license({
    banner: {
      commentStyle: 'regular', // The default
      content: {
        file: 'LICENSE',
      },
    },
    thirdParty: {
      output: 'dist/dependencies.txt',
      includePrivate: true, // Default is false.
    },
  }));

  return plugins;
}

const config = {
  input: './src/api.js',
  output: {
    file:'dist/webapp-menu.js',
    //dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
};

export default (args)=>{
  const isProduction = !! args.configProduction;
  config.plugins = getPlugins(isProduction);

  return config;
}
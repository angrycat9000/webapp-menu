
import svg from 'rollup-plugin-svg'
import sass from 'rollup-plugin-sass'
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs'
import cssnano from 'cssnano';
import postcss from 'postcss';
const license = require('rollup-plugin-license');
const path = require('path');
const fs = require('fs');

const filePath = path.resolve('LICENSE');
const licenseTxt = fs.readFileSync(filePath, 'utf-8');

function getPlugins(isProd) {
  const sassOptions = {output:false};
  if(isProd) {
    sassOptions.processor = css => postcss([cssnano]).process(css).then(result => result.css);
  }

  let plugins = [
    resolve(),
    commonjs(),
    svg(),
    sass(sassOptions),
  ];

  if(isProd)
    plugins.push(terser());

  plugins.push(
    license({
      banner: {
      commentStyle: 'regular',
      content: 
        `<%= pkg.name %> <%= pkg.version %> [<%= pkg.homepage %>]
        
        ${licenseTxt}

        
        ============================    Dependencies     ==============================
        
        <% _.forEach(dependencies, function (dependency) { %>
          <%= dependency.name %> <%= dependency.version %> [<%= dependency.homepage %>]
          
          <%= dependency.licenseText %>

          ---------------------------------------------------------------------------
        <% }) %>`,
      }
    },
  ));

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
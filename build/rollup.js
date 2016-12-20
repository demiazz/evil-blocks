const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify');
const saveLicense = require('uglify-save-license');


function createBanner(short) {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf8' }));
  const contributors = pkg.contributors.map(meta => (
    meta.split(' ').slice(0, 2).join(' ')
  )).join(', ');

  if (short) {
    return `/*! ${[
      `${pkg.name} v${pkg.version}`,
      `${pkg.homepage}`,
      `(c) ${contributors}`,
      `${pkg.license} license`,
    ].join(' | ')} */`;
  }

  return [
    '/*!',
    ` * ${pkg.name} v${pkg.version}`,
    ` * ${pkg.homepage}`,
    ' *',
    ` * Copyright ${contributors}`,
    ` * Released under the ${pkg.license} license`,
    ' */',
  ].join('\n');
}

function createConfig(target) {
  const rollupOptions = {
    entry: 'src/index.js',
    exports: 'named',

    plugins: [buble()],
  };

  const writeOptions = {
    moduleId: 'evil-blocks',
    moduleName: 'evilBlocks',
    sourceMap: false,
  };

  if (target === 'commonjs') {
    Object.assign(writeOptions, {
      dest: 'dist/evil-blocks.js',
      format: 'cjs',
    });
  }

  if (target === 'ecmascript') {
    Object.assign(writeOptions, {
      dest: 'dist/evil-blocks.es.js',
      format: 'es',
    });
  }

  if (target === 'umd' || target === 'minified-umd') {
    Object.assign(writeOptions, {
      dest: 'dist/evil-blocks.umd.js',
      format: 'umd',
      banner: createBanner(),
    });
  }

  if (target === 'minified-umd') {
    rollupOptions.plugins.push(uglify({
      output: {
        comments: saveLicense,
      },
    }));

    Object.assign(writeOptions, {
      sourceMap: true,
      dest: 'dist/evil-blocks.umd.min.js',
      banner: createBanner(true),
    });
  }

  return { rollupOptions, writeOptions };
}

function build(targets) {
  targets.forEach((target) => {
    const { rollupOptions, writeOptions } = createConfig(target);

    rollup.rollup(rollupOptions).then(bundle => bundle.write(writeOptions));
  });
}


build(['commonjs', 'ecmascript', 'umd', 'minified-umd']);


import test from 'ava';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const babel = require('babel-core'); // eslint-disable-line import/no-commonjs

const plugin = resolve(__dirname, '../src/index.js');

function transformFixture(name, configuration) {
    return babel.transformFileSync(resolve(__dirname, 'fixtures', name), {
        plugins: [
            configuration ? [plugin, configuration] : plugin,
        ],
    }).code;
}

function readFixture(name) {
    return readFileSync(resolve(__dirname, 'fixtures', name), 'utf8');
}

test('basic require with default webpack name', t => {
    const actual = transformFixture('basic/absolute.js');
    const expected = readFixture('basic/expected.js');
    t.is(actual, expected);
});

test('basic require with es6 webpack config', t => {
    const actual = transformFixture('basic/absolute.js', {config: './webpack.config.babel.js'});
    const expected = readFixture('basic/expected.js');
    t.is(actual, expected);
});

test('basic require with the absolute resolve path', t => {
    const actual = transformFixture('basic/absolute.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('basic/expected.js');
    t.is(actual, expected);
});

test('basic require with the relative resolve path', t => {
    const actual = transformFixture('basic/relative.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('basic/expected.js');
    t.is(actual, expected);
});

test('filename require', t => {
    const actual = transformFixture('filename/source.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('filename/expected.js');
    t.is(actual, expected);
});

test('variable assignment', t => {
    const actual = transformFixture('variables/source.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('variables/expected.js');
    t.is(actual, expected);
});

test('requiring files from the root', t => {
    const actual = transformFixture('rootfolder/source.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('rootfolder/expected.js');
    t.is(actual, expected);
});

test('requiring module from by alternate name', t => {
    const actual = transformFixture('module/source.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('module/expected.js');
    t.is(actual, expected);
});

test('using the import syntax', t => {
    const actual = transformFixture('import/source.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('import/expected.js');

    t.is(actual, expected);
});

test('dont throw an exception if the config is found', t => {
    t.notThrows(() => transformFixture('basic/absolute.js', {
        config: "runtime.webpack.config.js",
        findConfig: true,
    }));
});

test('throw an exception when we cant find the config', t => {
    t.throws(() => transformFixture('basic/absolute.js', {
        config: "DoesNotExist.js",
        findConfig: true,
    }));
});

test('use environment variables for the config path', t => {
    const ORIGINAL_PWD = process.env.PWD;
    process.env.PWD = __dirname;

    const actual = transformFixture('import/source.js', {config: '${PWD}/runtime.webpack.config.js'});
    const expected = readFixture('import/expected.js');

    t.is(actual, expected);
    process.env.PWD = ORIGINAL_PWD;
});

test('works with extensions', t => {
    const actual = transformFixture('extensions/source.js', {config: './extensions.config.js'});
    const expected = readFixture('extensions/expected.js');
    t.is(actual, expected);
});

test('works with libraries targeted with path.resolve', t => {
    const actual = transformFixture('pathresolve/source.js', {config: './runtime.webpack.config.js'});
    const expected = readFixture('pathresolve/expected.js');
    t.is(actual, expected);
});

test('works with webpack configs that export an array, instead of a single object (multicompile mode)', t => {
    const actual = transformFixture('multicompile/source.js', {config: './webpack.multicompile.js'});
    const expected = readFixture('multicompile/expected.js');
    t.is(actual, expected);
});

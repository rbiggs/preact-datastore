import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'preactDataStore',
    sourcemap: true,
    sourcemapFile: 'dist/index.js.map'
  },
  plugins:[
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

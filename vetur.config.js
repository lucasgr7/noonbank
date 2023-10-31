module.exports = {
  projects: [
    './src', // shorthand for only root.
    {
      root: './src',
      package: './package.json',
      tsconfig: './tsconfig.json',
      globalComponents: [
        './src/components/**/*.vue'
      ]
    }
  ]
}

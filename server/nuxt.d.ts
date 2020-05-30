// https://github.com/nuxt/typescript/issues/44
declare module 'nuxt' {
  const Nuxt: any
  const Builder: any
  export { Nuxt, Builder }
}

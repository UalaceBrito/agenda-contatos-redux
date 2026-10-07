import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'https://ebac-agenda-contatos-tan.vercel.app',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
  },
})

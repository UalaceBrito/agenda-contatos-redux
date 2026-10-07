# Contatos

Agenda pessoal responsiva construída com React, TypeScript, Redux Toolkit e Styled Components.

## Requisitos

- Node.js compatível com Vite 8 e npm.

## Desenvolvimento

```sh
npm install
npm run dev
```

## Verificações

```sh
npm test
npm run lint
npm run build
```

Os testes de interface cobrem o fluxo de adicionar, editar, remover e buscar contatos, além da validação de dados obrigatórios. Os contatos ficam no estado Redux em memória e são removidos ao recarregar a página; não há sincronização com servidor.

## Testes end-to-end com Cypress

Este projeto contém testes Cypress para inclusão, edição e remoção de contatos na aplicação do exercício:
`https://ebac-agenda-contatos-tan.vercel.app/`.

```sh
npm install
npm run cy:open
```

Para executar os testes em modo headless:

```sh
npm run cy:run
```

Os testes usam e removem contatos fictícios com e-mails únicos. Eles atuam na aplicação publicada e, por isso, dependem de que o site e sua API estejam disponíveis.

## Estrutura

- `src/features/contacts/contactsSlice.ts`: estado e operações de contatos.
- `src/app/`: configuração da store Redux e hooks tipados.
- `src/App.tsx`: formulário, busca e listagem responsiva.
- `src/App.test.tsx`: testes direcionados de comportamento da agenda.
- `cypress/e2e/contacts.cy.js`: testes end-to-end de inclusão, edição e remoção.
- `cypress.config.js`: configuração do Cypress e URL base da aplicação sob teste.

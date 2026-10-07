const fillContactForm = ({ name, email, phone }) => {
  cy.get('input[placeholder="Nome"]').clear().type(name)
  cy.get('input[placeholder="E-mail"]').clear().type(email)
  cy.get('input[placeholder="Telefone"]').clear().type(phone)
}

const contactCard = (email) => cy.contains('.contato', email)

describe('Agenda de contatos', () => {
  let cleanupEmails

  beforeEach(() => {
    cleanupEmails = [`cypress.${Date.now()}@example.com`]
    cy.visit('/')
    cy.contains('h1', 'Agenda de contatos').should('be.visible')
  })

  afterEach(() => {
    cleanupEmails.forEach((email) => {
      cy.get('body').then(($body) => {
        const $contact = $body.find('.contato').filter((_, element) =>
          [...element.querySelectorAll('li')].some((item) => item.textContent.trim() === email),
        )

        if ($contact.length) {
          cy.wrap($contact).find('button.delete').click()
          cy.contains('.contato li', new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)).should('not.exist')
        }
      })
    })
  })

  it('inclui um contato na agenda', () => {
    const contact = {
      name: `Cypress Inclusao ${Date.now()}`,
      email: cleanupEmails[0],
      phone: '11987654321',
    }

    fillContactForm(contact)
    cy.contains('button', 'Adicionar').click()

    contactCard(contact.email).within(() => {
      cy.contains('li', contact.name).should('be.visible')
      cy.contains('li', contact.phone).should('be.visible')
      cy.contains('li', contact.email).should('be.visible')
    })
  })

  it('altera os dados de um contato', () => {
    const contact = {
      name: `Cypress Edicao ${Date.now()}`,
      email: cleanupEmails[0],
      phone: '21987654321',
    }
    const updatedContact = {
      name: `Cypress Atualizado ${Date.now()}`,
      email: `atualizado.${cleanupEmails[0]}`,
      phone: '31912345678',
    }

    fillContactForm(contact)
    cy.contains('button', 'Adicionar').click()
    contactCard(contact.email).contains('button.edit', 'Editar').click()

    fillContactForm(updatedContact)
    cy.contains('button', 'Salvar').click()
    cleanupEmails.push(updatedContact.email)

    contactCard(updatedContact.email).within(() => {
      cy.contains('li', updatedContact.name).should('be.visible')
      cy.contains('li', updatedContact.phone).should('be.visible')
      cy.contains('li', updatedContact.email).should('be.visible')
    })
    cy.get('.contato li').should(($items) => {
      const contactEmails = [...$items].map((item) => item.textContent.trim())
      expect(contactEmails).not.to.include(contact.email)
    })
  })

  it('remove um contato da agenda', () => {
    const contact = {
      name: `Cypress Remocao ${Date.now()}`,
      email: cleanupEmails[0],
      phone: '41987654321',
    }

    fillContactForm(contact)
    cy.contains('button', 'Adicionar').click()
    contactCard(contact.email).contains('button.delete', 'Deletar').click()

    cy.contains('.contato', contact.email).should('not.exist')
  })
})

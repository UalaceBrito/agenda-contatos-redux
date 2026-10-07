import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import contactsReducer from './features/contacts/contactsSlice'

function renderApp() {
  const store = configureStore({ reducer: { contacts: contactsReducer } })
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  )
}

describe('agenda de contatos', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('adiciona, edita e remove contatos', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('textbox', { name: 'Nome completo' }), 'Ana Souza')
    await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'ana@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Telefone' }), '(11) 99999-1234')
    await user.click(screen.getByRole('button', { name: 'Adicionar contato' }))

    expect(screen.getByRole('heading', { name: 'Ana Souza' })).toBeInTheDocument()
    expect(screen.getByText('1 pessoa na agenda')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Editar Ana Souza' }))
    const nameField = screen.getByRole('textbox', { name: 'Nome completo' })
    await user.clear(nameField)
    await user.type(nameField, 'Ana Lima')
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(screen.getByRole('heading', { name: 'Ana Lima' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Ana Souza' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remover Ana Lima' }))
    expect(window.confirm).toHaveBeenCalledWith('Remover Ana Lima da sua agenda?')
    expect(screen.getByRole('heading', { name: 'Sua agenda começa aqui' })).toBeInTheDocument()
  })

  it('filtra contatos por nome, e-mail ou telefone', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('textbox', { name: 'Nome completo' }), 'Bia Costa')
    await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'bia@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Telefone' }), '21 98765-4321')
    await user.click(screen.getByRole('button', { name: 'Adicionar contato' }))

    const search = screen.getByRole('searchbox', { name: 'Buscar contatos' })
    await user.type(search, '98765')
    expect(screen.getByRole('heading', { name: 'Bia Costa' })).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'não existe')
    expect(screen.getByRole('heading', { name: 'Nenhum contato encontrado' })).toBeInTheDocument()
  })

  it('não remove um contato quando a confirmação é recusada', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('textbox', { name: 'Nome completo' }), 'Caio Reis')
    await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'caio@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Telefone' }), '11 90000-0000')
    await user.click(screen.getByRole('button', { name: 'Adicionar contato' }))
    await user.click(screen.getByRole('button', { name: 'Remover Caio Reis' }))

    expect(screen.getByRole('heading', { name: 'Caio Reis' })).toBeInTheDocument()
  })

  it('não adiciona dados compostos só por espaços ou telefone inválido', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByRole('textbox', { name: 'Nome completo' }), '   ')
    await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'caio@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Telefone' }), '123')
    await user.click(screen.getByRole('button', { name: 'Adicionar contato' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Informe nome, e-mail e um telefone válido com pelo menos 8 dígitos.',
    )
    expect(screen.getByText('0 pessoas na agenda')).toBeInTheDocument()
  })
})

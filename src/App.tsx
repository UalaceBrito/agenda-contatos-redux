import { useMemo, useState, type FormEvent } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { useAppDispatch, useAppSelector } from './app/hooks'
import {
  contactAdded,
  contactRemoved,
  contactUpdated,
  type Contact,
  type ContactDraft,
} from './features/contacts/contactsSlice'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background: #f5f7f6;
    color: #172b29;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }
  button, input { font: inherit; }
  button { cursor: pointer; }
  button:focus-visible, input:focus-visible {
    outline: 3px solid rgba(36, 124, 103, .32);
    outline-offset: 2px;
  }
  ::selection { background: #cce8dd; }
`

const Page = styled.main`
  width: min(1160px, calc(100% - 48px));
  margin: 0 auto;
  padding: 34px 0 64px;

  @media (max-width: 600px) {
    width: min(100% - 32px, 520px);
    padding-top: 22px;
  }
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 54px;

  @media (max-width: 600px) { padding-bottom: 40px; }
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: #173d35;
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -.4px;
`

const BrandMark = styled.span`
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 12px;
  background: #1f6b59;
  color: white;
`

const PrivacyNote = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4c5a56;
  font-size: 13px;

  @media (max-width: 480px) { font-size: 0; gap: 0; }
`

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #43a987;
`

const Intro = styled.section`
  margin-bottom: 32px;

  p {
    margin: 0 0 10px;
    color: #4c8a78;
    font-size: 12px;
    font-weight: 750;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    color: #18302c;
    font-size: clamp(32px, 5vw, 46px);
    font-weight: 680;
    letter-spacing: -2px;
    line-height: 1.1;
  }

  span {
    display: block;
    margin-top: 12px;
    color: #687975;
    font-size: 16px;
    line-height: 1.55;
  }
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 350px) minmax(0, 1fr);
  align-items: start;
  gap: 24px;

  @media (max-width: 760px) { grid-template-columns: 1fr; }
`

const Panel = styled.section`
  border: 1px solid #e4ebe8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(28, 63, 53, .045);
`

const FormPanel = styled(Panel)`
  padding: 25px;

  @media (max-width: 760px) { order: 1; }
`

const ListPanel = styled(Panel)`
  min-height: 350px;
  padding: 25px;
`

const PanelHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 23px;

  h2 {
    margin: 0;
    color: #203934;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -.35px;
  }

  p {
    margin: 5px 0 0;
    color: #65736f;
    font-size: 13px;
  }
`

const Field = styled.label`
  display: block;
  margin-bottom: 17px;
  color: #394b47;
  font-size: 13px;
  font-weight: 650;

  span { display: block; margin-bottom: 8px; }

  input {
    display: block;
    width: 100%;
    height: 46px;
    padding: 0 13px;
    border: 1px solid #dce5e1;
    border-radius: 10px;
    background: #fff;
    color: #233b35;
    font-size: 14px;
    font-weight: 450;
    transition: border-color .15s ease, box-shadow .15s ease;

    &::placeholder { color: #687671; }
    &:focus { border-color: #4c9a82; box-shadow: 0 0 0 3px rgba(76, 154, 130, .12); outline: none; }
  }
`

const Button = styled.button`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  padding: 0 15px;
  font-size: 14px;
  font-weight: 700;
  transition: background .15s ease, color .15s ease, transform .15s ease;

  &:active { transform: translateY(1px); }
`

const PrimaryButton = styled(Button)`
  width: 100%;
  margin-top: 3px;
  background: #1f6b59;
  color: white;
  &:hover { background: #195746; }
`

const TextButton = styled(Button)`
  min-height: 34px;
  background: transparent;
  color: #687975;
  font-size: 13px;
  &:hover { background: #f0f5f3; color: #1f6b59; }
`

const ListHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;

  @media (max-width: 480px) { flex-direction: column; }
`

const Count = styled.span`
  display: inline-flex;
  min-width: 27px;
  height: 27px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #edf5f1;
  color: #347760;
  font-size: 12px;
  font-weight: 750;
`

const SearchWrap = styled.label`
  position: relative;
  display: block;
  width: min(100%, 250px);
  flex-shrink: 0;

  span {
    position: absolute;
    top: 50%;
    left: 12px;
    color: #65736f;
    font-size: 15px;
    transform: translateY(-50%);
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 40px;
    border: 1px solid #e1e8e5;
    border-radius: 10px;
    padding: 0 12px 0 35px;
    color: #233b35;
    font-size: 13px;
    background: #fbfcfb;
    &:focus { border-color: #4c9a82; outline: 3px solid rgba(76, 154, 130, .12); }
  }

  @media (max-width: 480px) { width: 100%; }
`

const ContactList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`

const ContactItem = styled.li`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid #edf1ef;
  border-radius: 13px;
  background: #fff;
  transition: border-color .15s ease, background .15s ease;
  &:hover { border-color: #d6e6df; background: #fcfefd; }

  @media (max-width: 480px) {
    align-items: flex-start;
    gap: 11px;
    padding: 12px;
  }
`

const Avatar = styled.span`
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 13px;
  background: #edf5f1;
  color: #28715c;
  font-size: 14px;
  font-weight: 750;
  letter-spacing: .3px;
`

const ContactInfo = styled.div`
  min-width: 0;
  flex: 1;
  h3 {
    overflow: hidden;
    margin: 0 0 4px;
    color: #263b36;
    font-size: 14px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p {
    overflow: hidden;
    margin: 0;
    color: #76847f;
    font-size: 12px;
    line-height: 1.6;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  button {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #74827e;
    font-size: 16px;
    &:hover { background: #edf5f1; color: #1f6b59; }
    &[data-danger="true"]:hover { background: #fff0ee; color: #b44739; }
  }

  @media (max-width: 480px) { flex-direction: column; }
`

const EmptyState = styled.div`
  display: grid;
  min-height: 225px;
  place-content: center;
  justify-items: center;
  padding: 20px;
  text-align: center;

  span {
    display: grid;
    width: 48px;
    height: 48px;
    margin-bottom: 14px;
    place-items: center;
    border-radius: 15px;
    background: #edf5f1;
    color: #39816a;
    font-size: 21px;
  }
  h3 { margin: 0 0 6px; color: #314640; font-size: 15px; }
  p { max-width: 270px; margin: 0; color: #84918d; font-size: 13px; line-height: 1.5; }
`

const LiveMessage = styled.p`
  min-height: 20px;
  margin: 15px 0 0;
  color: #357660;
  font-size: 12px;
`

const Footer = styled.footer`
  margin-top: 22px;
  color: #61716c;
  font-size: 12px;
  text-align: center;
`

const emptyDraft: ContactDraft = { name: '', email: '', phone: '' }

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('pt-BR') ?? '')
    .join('')
}

function App() {
  const dispatch = useAppDispatch()
  const contacts = useAppSelector((state) => state.contacts.items)
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [announcement, setAnnouncement] = useState('')

  const visibleContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return [...contacts]
      .filter((contact) =>
        [contact.name, contact.email, contact.phone].some((value) =>
          value.toLocaleLowerCase('pt-BR').includes(normalizedQuery),
        ),
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [contacts, query])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const changes = {
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    }

    if (!changes.name || !changes.email || changes.phone.replace(/\D/g, '').length < 8) {
      setAnnouncement('Informe nome, e-mail e um telefone válido com pelo menos 8 dígitos.')
      return
    }

    if (editingId) {
      dispatch(contactUpdated({ id: editingId, changes }))
      setAnnouncement(`${changes.name} atualizado com sucesso.`)
    } else {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      dispatch(contactAdded({ id, ...changes }))
      setAnnouncement(`${changes.name} adicionado à agenda.`)
    }

    setDraft(emptyDraft)
    setEditingId(null)
  }

  function startEditing(contact: Contact) {
    setEditingId(contact.id)
    setDraft({ name: contact.name, email: contact.email, phone: contact.phone })
    setAnnouncement(`Editando ${contact.name}.`)
  }

  function cancelEditing() {
    setDraft(emptyDraft)
    setEditingId(null)
    setAnnouncement('Edição cancelada.')
  }

  function removeContact(contact: Contact) {
    if (!window.confirm(`Remover ${contact.name} da sua agenda?`)) return
    dispatch(contactRemoved(contact.id))
    setAnnouncement(`${contact.name} removido da agenda.`)
    if (editingId === contact.id) cancelEditing()
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Header>
          <Brand>
            <BrandMark aria-hidden="true">C</BrandMark>
            contatos
          </Brand>
          <PrivacyNote><Dot aria-hidden="true" /> Seus contatos ficam neste dispositivo</PrivacyNote>
        </Header>

        <Intro>
          <p>Organização simples, por perto</p>
          <h1>Sua agenda de contatos</h1>
          <span>Guarde as informações importantes e encontre cada pessoa com facilidade.</span>
        </Intro>

        <Layout>
          <FormPanel aria-labelledby="form-heading">
            <PanelHeading>
              <div>
                <h2 id="form-heading">{editingId ? 'Editar contato' : 'Novo contato'}</h2>
                <p>Preencha os dados para manter sua agenda atualizada.</p>
              </div>
            </PanelHeading>
            <form onSubmit={handleSubmit}>
              <Field>
                <span>Nome completo</span>
                <input
                  autoComplete="name"
                  maxLength={100}
                  name="name"
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  placeholder="Ex.: Ana Souza"
                  required
                  value={draft.name}
                />
              </Field>
              <Field>
                <span>E-mail</span>
                <input
                  autoComplete="email"
                  maxLength={254}
                  name="email"
                  onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  placeholder="ana@exemplo.com"
                  required
                  type="email"
                  value={draft.email}
                />
              </Field>
              <Field>
                <span>Telefone</span>
                <input
                  autoComplete="tel"
                  maxLength={32}
                  name="phone"
                  onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
                  placeholder="(11) 99999-9999"
                  required
                  type="tel"
                  value={draft.phone}
                />
              </Field>
              <PrimaryButton type="submit">
                <span aria-hidden="true">{editingId ? '✓' : '+'}</span>
                {editingId ? 'Salvar alterações' : 'Adicionar contato'}
              </PrimaryButton>
              {editingId && (
                <TextButton onClick={cancelEditing} type="button">Cancelar edição</TextButton>
              )}
            </form>
            <LiveMessage aria-live="polite" role="status">{announcement}</LiveMessage>
          </FormPanel>

          <ListPanel aria-labelledby="contacts-heading">
            <ListHeader>
              <PanelHeading>
                <div>
                  <h2 id="contacts-heading">Seus contatos</h2>
                  <p>{contacts.length === 1 ? '1 pessoa na agenda' : `${contacts.length} pessoas na agenda`}</p>
                </div>
                <Count aria-label={`${contacts.length} contatos`}>{contacts.length}</Count>
              </PanelHeading>
              <SearchWrap>
                <span aria-hidden="true">⌕</span>
                <input
                  aria-label="Buscar contatos"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar..."
                  type="search"
                  value={query}
                />
              </SearchWrap>
            </ListHeader>

            {visibleContacts.length > 0 ? (
              <ContactList aria-label="Lista de contatos">
                {visibleContacts.map((contact) => (
                  <ContactItem key={contact.id}>
                    <Avatar aria-hidden="true">{initials(contact.name)}</Avatar>
                    <ContactInfo>
                      <h3>{contact.name}</h3>
                      <p>{contact.email}</p>
                      <p>{contact.phone}</p>
                    </ContactInfo>
                    <Actions>
                      <button
                        aria-label={`Editar ${contact.name}`}
                        onClick={() => startEditing(contact)}
                        title={`Editar ${contact.name}`}
                        type="button"
                      >✎</button>
                      <button
                        aria-label={`Remover ${contact.name}`}
                        data-danger="true"
                        onClick={() => removeContact(contact)}
                        title={`Remover ${contact.name}`}
                        type="button"
                      >×</button>
                    </Actions>
                  </ContactItem>
                ))}
              </ContactList>
            ) : (
              <EmptyState>
                <span aria-hidden="true">{query ? '⌕' : '♡'}</span>
                <h3>{query ? 'Nenhum contato encontrado' : 'Sua agenda começa aqui'}</h3>
                <p>
                  {query
                    ? 'Tente buscar por outro nome, e-mail ou telefone.'
                    : 'Adicione seu primeiro contato pelo formulário para ver tudo organizado aqui.'}
                </p>
              </EmptyState>
            )}
          </ListPanel>
        </Layout>

        <Footer>Uma agenda simples, sempre à mão.</Footer>
      </Page>
    </>
  )
}

export default App

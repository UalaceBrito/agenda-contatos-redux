import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
}

export type ContactDraft = Omit<Contact, 'id'>

interface ContactsState {
  items: Contact[]
}

const initialState: ContactsState = { items: [] }

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    contactAdded: (state, action: PayloadAction<Contact>) => {
      state.items.push(action.payload)
    },
    contactUpdated: (
      state,
      action: PayloadAction<{ id: string; changes: ContactDraft }>,
    ) => {
      const contact = state.items.find((item) => item.id === action.payload.id)
      if (contact) Object.assign(contact, action.payload.changes)
    },
    contactRemoved: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((contact) => contact.id !== action.payload)
    },
  },
})

export const { contactAdded, contactUpdated, contactRemoved } =
  contactsSlice.actions

export default contactsSlice.reducer

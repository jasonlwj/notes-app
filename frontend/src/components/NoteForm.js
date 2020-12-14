import React, { useState } from 'react'

const NoteForm = ({ addNote }) => {
	const [ newNote, setNewNote ] = useState('')

	// event handler(s) for the form field(s)
	const handleNewNoteChange = ({ target }) => setNewNote(target.value)

	// grab state from the form field(s) and call the global addNote function
	const handleSubmitNote = event => {
		event.preventDefault()

		addNote({
			content: newNote,
			date: new Date().toISOString(),
			important: Math.random() < 0.5
		})

		setNewNote('')
	}

	// render
	return (
		<form onSubmit={handleSubmitNote}>
			<input type="text" value={newNote} onChange={handleNewNoteChange} />
			<button type="submit">save</button>
		</form>
	)
}

export default NoteForm

import React from 'react'

const NoteForm = ({ addNote, newNote, handleNewNoteChange }) => (
	<form onSubmit={addNote}>
		<input type="text" value={newNote} onChange={handleNewNoteChange} />
		<button type="submit">save</button>
	</form>
)

export default NoteForm

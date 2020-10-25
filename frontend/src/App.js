import React, { useState, useEffect } from 'react'
import noteService from './services/notes'
import Note from './components/Note'
import Notification from './components/Notification'


const App = () => {
	const [ notes, setNotes ] = useState([])
	const [ newNote, setNewNote ] = useState('')
	const [ showAll, setShowAll ] = useState(true) // false: only show important notes
	const [ errorMessage, setErrorMessage ] = useState(null)
	
	// get all notes
	useEffect(() => {
		noteService
			.getAll()
			.then(initialNotes => setNotes(initialNotes))
	}, [])

	// create note
	const addNote = event => {
		event.preventDefault()
		const noteToAdd = {
			content: newNote,
			date: new Date().toISOString(),
			important: Math.random() < 0.5
		}

		noteService
			.create(noteToAdd)
			.then(returnedNote => {
				setNotes(notes.concat(returnedNote))
				setNewNote('')
			})
	}

	// update note
	const toggleImportanceOf = id => {
		const note = notes.find(note => note.id === id)
		const changedNote = { ...note, important: !note.important }

		noteService
			.update(id, changedNote)
			.then(returnedNote => {
				setNotes(notes.map(note => note.id === id ? returnedNote : note))
			})
			.catch(error => {
				setErrorMessage(`the note '${note.content}' was already deleted from the server`)
				setTimeout(() => setErrorMessage(null), 5000)
				setNotes(notes.filter(n => n.id !== id))
			})
	}

	// handle form state
	const handleToggleShowAll = () => setShowAll(!showAll)
	const handleNewNoteChange = event => setNewNote(event.target.value)

	// grab notes that match filter criteria
	const notesToShow = showAll 
		? notes 
		: notes.filter(note => note.important)

	// render it all to the screen
	return (
		<div className="App">
			<div>
				<h1>Notes</h1>
				<Notification message={errorMessage} />
				<button onClick={handleToggleShowAll}>
					show {showAll ? 'important' : 'all'}
				</button>
				<ul>
					{notesToShow.map(note => 
						<Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
					)}
				</ul>
				<form onSubmit={addNote}>
					<input value={newNote} onChange={handleNewNoteChange} />
					<button type="submit">save</button>
				</form>
			</div>
		</div>
	)
}

export default App

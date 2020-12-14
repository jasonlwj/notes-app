import React, { useState, useEffect } from 'react'
import noteService from './services/notes'
import loginService from './services/login'
import Note from './components/Note'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'

const App = () => {
	const [ notes, setNotes ] = useState([])
	const [ showAll, setShowAll ] = useState(true) // false: only show important notes
	const [ errorMessage, setErrorMessage ] = useState(null)
	const [ user, setUser ] = useState(null)
	
	// get all notes
	useEffect(() => {
		noteService
			.getAll()
			.then(initialNotes => setNotes(initialNotes))
	}, [])

	// check if user logged-in
	useEffect(() => {
		const loggedInNoteUser = window.localStorage.getItem('loggedInNoteUser')

		if (loggedInNoteUser) {
			const userJSON = JSON.parse(loggedInNoteUser)
			setUser(userJSON)
			noteService.setToken(userJSON.token)
		}
	}, [])

	// add a note to the global list of notes
	const addNote = async noteObject => {
		const createdNote = await noteService.create(noteObject)
		setNotes(notes.concat(createdNote))
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

	// login
	const login = async credentials => {
		try {
			const user = await loginService.login(credentials)

			window.localStorage.setItem(
				'loggedInNoteUser', JSON.stringify(user)
			)

			noteService.setToken(user.token)
			setUser(user)
		} catch (exception) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000);
		}
	}

	// logout button event handler
	const handleLogout = () => {
		window.localStorage.removeItem('loggedInNoteUser')
		noteService.setToken(null)
		setUser(null)
	}

	// handle form state
	const handleToggleShowAll = () => setShowAll(!showAll)

	// grab notes that match filter criteria
	const notesToShow = showAll 
		? notes 
		: notes.filter(note => note.important)

	// return the login form
	const loginForm = () => (
		<Togglable buttonLabel='login'>
			<LoginForm
				login={login} 
			/> 
		</Togglable>
	)

	// return the note form
	const noteForm = () => (
		<Togglable buttonLabel="new note">
			<NoteForm 
				addNote={addNote}
			/>
		</Togglable>
	)

	// render it all to the screen
	return (
		<div className="App">
			<div>
				<h1>Notes</h1>
				<Notification message={errorMessage} />
				{
					(user === null) ? 
						 loginForm() :
						<div>
							<p>{user.name} logged in</p>
							<button onClick={handleLogout}>logout</button>
							{noteForm()}
						</div>
				}
				<button onClick={handleToggleShowAll}>
					show {showAll ? 'important' : 'all'}
				</button>
				<ul>
					{notesToShow.map(note => 
						<Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
					)}
				</ul>
			</div>
		</div>
	)
}

export default App

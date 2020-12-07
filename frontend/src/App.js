import React, { useState, useEffect } from 'react'
import noteService from './services/notes'
import loginService from './services/login'
import Note from './components/Note'
import Notification from './components/Notification'

// TODO: add logout function
// TODO: refactor this file

const App = () => {
	const [ notes, setNotes ] = useState([])
	const [ newNote, setNewNote ] = useState('')
	const [ showAll, setShowAll ] = useState(true) // false: only show important notes
	const [ errorMessage, setErrorMessage ] = useState(null)
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
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

	const handleLogin = async event => {
		event.preventDefault()
		console.log('logging in with', username, password)

		try {
			const user = await loginService.login({
				username,
				password
			})

			window.localStorage.setItem(
				'loggedInNoteUser', JSON.stringify(user)
			)

			noteService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000);
		}
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedInNoteUser')
		noteService.setToken(null)
		setUser(null)
	}

	// handle form state
	const handleToggleShowAll = () => setShowAll(!showAll)
	const handleNewNoteChange = ({ target }) => setNewNote(target.value)
	const handleUsernameChange = ({ target }) => setUsername(target.value)
	const handlePasswordChange = ({ target }) => setPassword(target.value)

	// grab notes that match filter criteria
	const notesToShow = showAll 
		? notes 
		: notes.filter(note => note.important)

	// form to login
	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
				username <input type="text" value={username} onChange={handleUsernameChange} />
			</div>
			<div>
				password <input type="password" value={password} onChange={handlePasswordChange} />
			</div>
			<button type="submit">login</button>
		</form>
	)

	// form to add notes
	const noteForm = () => (
		<form onSubmit={addNote}>
			<input type="text" value={newNote} onChange={handleNewNoteChange} />
			<button type="submit">save</button>
		</form>
	)

	// render it all to the screen
	return (
		<div className="App">
			<div>
				<h1>Notes</h1>
				<Notification message={errorMessage} />
				{
					(user === null)
						? loginForm()
						: <div>
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

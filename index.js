require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

/**
 * Middleware Config
 */

const requestLogger = (req, res, next) => {
	console.log('Method:', req.method)
	console.log('Path:', req.path)
	console.log('Body:', req.body)
	console.log('---')
	next()
}

const unknownEndpoint = (req, res, next) => {
	res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (err.name === 'ValidationError') {
		return res.status(400).send({ error: err.message })
	}

	next(err)
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

/**
 * Routes
 */

app.get('/', (req, res) => {
	res.send('<h1>haha funny poop</h1>')
})

app.get('/api/notes', (req, res) => {
	Note
		.find({})
		.then(notes => res.json(notes))
})

app.get('/api/notes/:id', (req, res, next) => {
	Note
		.findById(req.params.id)
		.then(note => {
			if (note) {
				res.json(note)
			} else {
				res.status(404).end()
			}
		})
		.catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res) => {
	Note
		.findByIdAndDelete(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
	const body = req.body

	if (!body.content) {
		return res.status(400).json({
			error: 'content missing'
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date()
	})

	note
		.save()
		.then(savedNote => savedNote.toJSON())
		.then(formattedNote => res.json(formattedNote))
		.catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
	const body = req.body

	const note = {
		content: body.content,
		important: body.important
	}

	Note
		.findByIdAndUpdate(req.params.id, note, { new: true })
		.then(updatedNote => {
			res.json(updatedNote)
		})
		.catch(err => next(err))
})

// Handle requests with unknown endpoint
app.use(unknownEndpoint)

// Handle requests which result in errors
app.use(errorHandler)

/**
 * Bind to port and listen for requests
 */

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server now running on port ${PORT}`)
})

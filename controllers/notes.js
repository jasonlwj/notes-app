const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (req, res) => {
	const notes = await Note
		.find({})
		.populate('user', { username: 1, name: 1 })

	res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
	const note = await Note.findById(req.params.id)

	if (note) {
		res.json(note)
	} else {
		res.status(404).end()
	}
})

notesRouter.delete('/:id', async (req, res) => {
	await Note.findByIdAndRemove(req.params.id)
	res.status(204).end()
})

notesRouter.post('/', async (req, res) => {
	const body = req.body

	const user = await User.findById(body.userId)

	if (!body.content) {
		return res.status(400).json({
			error: 'content missing'
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
		user: user.id
	})

	const savedNote = await note.save()
	user.notes = user.notes.concat(savedNote.id)
	await user.save()

	res.json(savedNote)
})

notesRouter.put('/:id', (req, res, next) => {
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

module.exports = notesRouter

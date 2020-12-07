import axios from 'axios'

const baseUrl = '/api/notes'
let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const create = async newNote => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios.post(baseUrl, newNote, config)
	return response.data
}

const update = (id, newNote) => {
	const request = axios.put(`${baseUrl}/${id}`, newNote)
	return request.then(response => response.data)
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default { getAll, create, update, setToken }

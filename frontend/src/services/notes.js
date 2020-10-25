import axios from 'axios'

const baseUrl = '/api/notes'

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const create = newNote => {
	const request = axios.post(baseUrl, newNote)
	return request.then(response => response.data)
}

const update = (id, newNote) => {
	const request = axios.put(`${baseUrl}/${id}`, newNote)
	return request.then(response => response.data)
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default { getAll, create, update }

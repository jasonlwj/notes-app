import React, { useState } from 'react'

const LoginForm = ({ login }) => {
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')

	// event handler(s) for the form field(s)
	const handleUsernameChange = ({ target }) => setUsername(target.value)
	const handlePasswordChange = ({ target }) => setPassword(target.value)

	// grab state from the form field(s) and call the global login function
	const handleLogin = async event => {
		event.preventDefault()

		login({
			username,
			password
		})

		setUsername('')
		setPassword('')
	}

	// render
	return (
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
}

export default LoginForm

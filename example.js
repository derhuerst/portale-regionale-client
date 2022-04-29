'use strict'

const {fetchTripStatus} = require('.')

;(async () => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		console.log(await fetchTripStatus())
		await new Promise(r => setTimeout(r, 3000))
	}
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})

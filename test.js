'use strict'

const {ok, strictEqual} = require('assert')
const {
	fetchCommon,
	fetchTripStatus,
} = require('.')

;(async () => {
	const c = await fetchCommon()

	strictEqual(typeof c.isGpsValid, 'boolean', 'c.isGpsValid must be a boolean')

	const t = await fetchTripStatus()

	strictEqual(typeof t.isGpsValid, 'boolean', 't.isGpsValid must be a boolean')

	ok(Array.isArray(t.stopovers), 't.stopovers must be an array')
	for (let i = 0; i < t.stopovers.length; i++) {
		const st = t.stopovers[i]
		const n = `t.stopovers[${i}]`

		strictEqual(typeof st.id, 'string', n + '.id must be a string')
		ok(st.id, n + '.id must not be empty')

		// todo
	}
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})

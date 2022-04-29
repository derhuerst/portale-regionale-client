'use strict'

const createDebug = require('debug')
const Promise = require('pinkie-promise')
const {
	Request,
	fetch,
} = require('fetch-ponyfill')({Promise})
const slugg = require('slugg')
const {name, homepage} = require('./package.json')

const debugRequests = createDebug(name + ':requests')
const debugResponses = createDebug(name + ':responses')

// todo: resolve `www.portaleregionale.it` using local DNS?
const endpoint = 'http://192.168.12.100/PortaleRegionale/'
const userAgent = homepage

const request = async (route, reqBody = null) => {
	const reqHeaders = {
		'User-Agent': userAgent,
		'Accept': 'application/json',
	}
	if (reqBody !== null) {
		reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
	}
	debugRequests(route, reqBody)

	const req = new Request(endpoint + route, {
		// The API doesn't seem to have CORS enabled.
		// mode: 'cors',
		method: reqBody === null ? 'GET' : 'POST',
		redirect: 'follow',
		headers: reqHeaders,
		body: reqBody,
	})

	const res = await fetch(req)
	if (!res.ok) {
		const err = new Error(res.statusText)
		err.statusCode = res.status
		err.fetchResponse = res
		err.fetchRequest = req
		throw err
	}

	const resBody = await res.json()
	debugResponses(route, resBody)
	return resBody
}

const parseBasics = (_) => {
	return {
		isTrackValid: _.isTrackValid === 'true',
		isGpsValid: _.isGpsValid === 'true',
		isTrackOnGPS: _.isTrackOnGPS === 'true',
	}
}

const parseInfos = (infos) => {
	return {
		...infos,
		speed: parseFloat(infos.speed),
		// todo: I saw `\dm`, is there `\dh` or `\dh\dm`
		delay: infos.delay === ''
			? null
			: parseFloat(infos.delay),
	}
}

const parseStopover = (stazione) => {
	const index = parseInt(stazione.id)
	// todo: stazione.passed?
	const progressFromPrevious = stazione.percent
		? parseFloat(stazione.percent)
		: 0
	const name = stazione.descrizione

	const plannedArrival = stazione.arrivo.oraProgrammata || null // todo: add tz from _.datetime?
	const actualArrival = stazione.arrivo.oraReale || null // todo: add tz from _.datetime?
	const plannedArrivalPlatform = stazione.arrivo.binarioProgrammato || null
	const actualArrivalPlatform = stazione.arrivo.binarioReale || null
	// todo: oraReale - oraProgrammata does not always equal ultimoRitardo
	const arrivalDelay = (
		'number' === typeof stazione.arrivo.ultimoRitardo
		&& actualArrival !== null
	) ? stazione.arrivo.ultimoRitardo : null

	const plannedDeparture = stazione.partenza.oraProgrammata || null // todo: add tz from _.datetime?
	const actualDeparture = stazione.partenza.oraReale || null // todo: add tz from _.datetime?
	const plannedDeparturePlatform = stazione.partenza.binarioProgrammato || null
	const actualDeparturePlatform = stazione.partenza.binarioReale || null
	// todo: oraReale - oraProgrammata does not always equal ultimoRitardo
	const departureDelay = (
		'number' === typeof stazione.partenza.ultimoRitardo
		&& actualDeparture !== null
	) ? stazione.partenza.ultimoRitardo : null

	return {
		index,
		progressFromPrevious,
		stop: {
			type: 'stop',
			// todo: find a proper ID
			id: slugg(name),
			name,
			// todo: find location
			location: null,
		},

		arrival: actualArrival !== null
			? actualArrival
			: plannedArrival,
		actualArrival, plannedArrival, arrivalDelay,
		arrivalPlatform: actualArrivalPlatform !== null
			? actualArrivalPlatform
			: plannedArrivalPlatform,

		departure: actualDeparture !== null
			? actualDeparture
			: plannedDeparture,
		actualDeparture, plannedDeparture, departureDelay,
		departurePlatform: actualDeparturePlatform !== null
			? actualDeparturePlatform
			: plannedDeparturePlatform,
	}
}

const fetchCommonRaw = async () => {
	return await request('common.getInfos.action', 'lang=en')
}

const fetchCommon = async () => {
	const _ = await fetchCommonRaw()

	return {
		..._,
		...parseBasics(_),
		infos: parseInfos(_.infos),
	}
}

const fetchTripStatusRaw = async () => {
	return await request('infoviaggio.getData.action', 'stazioniList=true')
}

const fetchTripStatus = async () => {
	const _ = await fetchTripStatusRaw()

	const stopovers = _.stazioni.map(parseStopover)
	const upcomingStopover = stopovers[parseInt(_.index)] || null

	return {
		..._,
		...parseBasics(_),
		infos: parseInfos(_.infos),
		routepercent: parseFloat(_.routepercent),

		stopovers,
		upcomingStopover,
	}
}

// There also is GET meteo.getData.action, but the actual weather information is delivered via HTML.

module.exports = {
	fetchCommonRaw,
	fetchCommon,
	fetchTripStatusRaw,
	fetchTripStatus,
}

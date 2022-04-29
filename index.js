'use strict'

const createDebug = require('debug')
const Promise = require('pinkie-promise')
const {
	Request,
	fetch,
} = require('fetch-ponyfill')({Promise})
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
	}
}

const parseInfos = (infos) => {
	return {
		...infos,
		speed: parseFloat(infos.speed),
		delay: infos.delay === ''
			? null
			: parseFloat(infos.delay),
	}
}

const fetchCommonRaw = async () => {
	return await request('common.getInfos.action', 'lang=en')
}

const fetchTripStatusRaw = async () => {
	return await request('infoviaggio.getData.action', 'stazioniList=true')
}

// There also is GET meteo.getData.action, but the actual weather information is delivered via HTML.

module.exports = {
	fetchCommonRaw,
	fetchTripStatusRaw,
}

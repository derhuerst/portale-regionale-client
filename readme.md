# portale-regionale-client

**Client for the [Portale Regional onboard Italian trains](#todo).**

[![npm version](https://img.shields.io/npm/v/portale-regionale-client.svg)](https://www.npmjs.com/package/portale-regionale-client)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/portale-regionale-client.svg)
![minimum Node.js version](https://img.shields.io/node/v/portale-regionale-client.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installation

```shell
npm install portale-regionale-client
```


## Usage

```js
const {fetchTripStatus} = require('portale-regionale-client')

await fetchTripStatus()
```

```js
{
	datetime: '2022-29-04T12:50:18+0200',
	nextStation: 'TERMINI IMERESE',
	infos: {
		categoriaCommerciale: 'REGIO_FAST',
		trackNumber: '5359',
		trackTitle: 'MESSINA CENT. - PALERMO C.LE',
		speed: 160,
		delay: 1,
		// …
	},
	routepercent: 35,
	// …
	stopovers: [
		{
			index: 0,
			progressFromPrevious: 100,
			stop: {
				type: 'stop',
				id: 'messina-cent',
				name: 'MESSINA CENT.',
				location: null,
			},
			arrival: null,
			actualArrival: null,
			plannedArrival: null,
			arrivalDelay: null,
			arrivalPlatform: null,
			departure: '2022-04-29T10:43:30',
			actualDeparture: '2022-04-29T10:43:30',
			plannedDeparture: '2022-04-29T10:43:00',
			departureDelay: 1,
			departurePlatform: null,
		},
		// …
		{
			index: 7,
			progressFromPrevious: 35,
			stop: {
				type: 'stop',
				id: 'cefalu',
				name: 'Cefalu`',
				location: null,
			},
			arrival: '2022-04-29T12:43:00',
			actualArrival: '2022-04-29T12:43:00',
			plannedArrival: '2022-04-29T12:41:00',
			// …
		},
		// …
		{
			index: 9,
			progressFromPrevious: 0,
			stop: {
				type: 'stop',
				id: 'palermo-c-le',
				name: 'PALERMO C.LE',
				location: null
			},
			arrival: '2022-04-29T13:32:00',
			actualArrival: null,
			plannedArrival: '2022-04-29T13:32:00',
			// …
		},
	],
	upcomingStopover: {
		index: 7,
		progressFromPrevious: 35,
		stop: {
			type: 'stop',
			id: 'cefalu',
			name: 'Cefalu`',
			location: null,
		},
		arrival: '2022-04-29T12:43:00',
		actualArrival: '2022-04-29T12:43:00',
		plannedArrival: '2022-04-29T12:41:00',
		arrivalDelay: 2,
		arrivalPlatform: null,
		departure: '2022-04-29T12:45:00',
		actualDeparture: '2022-04-29T12:45:00',
		plannedDeparture: '2022-04-29T12:42:00',
		departureDelay: 3,
		departurePlatform: null,
	},
}
```

## Related

- [`sncf-wifi-portal-client`](https://github.com/derhuerst/sncf-wifi-portal-client) – Query information from the SNCF WiFi portal in French TGV trains.
- [`wifi-on-ice-portal-client`](https://github.com/derhuerst/wifi-on-ice-portal-client) – Query information from the WifiOnICE portal in German ICE trains.
- [`digital-im-regio-portal-client`](https://github.com/derhuerst/digital-im-regio-portal-client) – Query information from the Digital im Regio portal in German Regio trains.
- [`cd-wifi-client`](https://github.com/derhuerst/cd-wifi-client) – A client for the onboard WiFi portal of České dráhy (Czech Railways) trains.


## Contributing

If you have a question or need support using `portale-regionale-client`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/portale-regionale-client/issues).

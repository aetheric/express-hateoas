/* global process */
'use strict';

import Resource from './resource.js';
import httpConst from 'http-constants';

export default class Hateoas {

	/**
	 * @param {?} express The instantiated expressjs object.
	 */
	constructor(express) {
		this._express = express;
		this._resources = {};

		try {
			this._express.use((i,o,n) => this.filter(i,o,n));

		} catch (error) {
			console.error('Failed to register express filter: - ' + error.stack);
			process.exit(1);
		}

	}

	get express() {
		return this._express;
	}

	get resources() {
		return this._resources;
	}

	filter(request, response, next) {

		const matches = /.*\.(\w+)$/.exec(request.url);

		if (!matches || matches.length < 2) {
			return next();
		}

		const type = matches[1];
		console.info(`Detected type ${type} for request on ${request.url}`);

		request.headers[httpConst.headers.request.ACCEPT] = `*/${type}`;
		request.url = request.url.substring(0, request.url.length - (type.length + 1));

		console.info(`Altered path for request to be ${request.url}.`);
		return next();

	}

	/**
	 * @param {String} path The path of the resource. e.g. /api/books/:bookId/pages
	 */
	resource(path) {
		try {

			return this._resources[path]
					|| ( this._resources[path] = new Resource(this, path) );

		} catch (error) {
			console.log(`hateoas/hateoas: ${error.stack}`);
			process.exit(1);
		}

	}

}

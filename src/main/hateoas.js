/* global */
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

		this._express.use((request, response, next) => {

			console.info(`Checking request on ${request.url} for mime override extension`);
			const matches = /.*\.(\w+)$/.exec(request.url);

			if (!matches || matches.length < 2) {
				console.info(`No overrides found.`);
				next();
			}

			const type = matches[1];
			console.info(`Detected type ${type} for request on ${request.url}`);

			request.headers[httpConst.headers.request.ACCEPT] = `*/${type}`;
			request.url = request.url.substring(0, request.url.length - (type.length + 1));

			console.info(`Altered path for request to be ${request.url}.`);
			next();

		});

	}

	get express() {
		return this._express;
	}

	get resources() {
		return this._resources;
	}

	/**
	 * @param {String} path The path of the resource. e.g. /api/books/:bookId/pages
	 */
	resource(path) {

		let resource = this._resources[path];

		if (!resource) {
			resource = new Resource(this, path);
		}

		return resource;

	}

}

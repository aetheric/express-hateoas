/* global */
'use strict';

import Resource from './resource.js';
import Middleware from './middleware.js';

export default class Hateoas {

	/**
	 * @param {?} express The instantiated expressjs object.
	 */
	constructor(express) {
		this._express = express;
		this._resources = {};
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

		let resource = resources[path];

		if (!resource) {
			resource = new Resource(express, path);
		}

		return resource;

	}

}

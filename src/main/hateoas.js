/* global */
'use strict';

import Resource from './resource.js';
import Middleware from './middleware.js';

export default class Hateoas {

	/**
	 * @param {?} express The instantiated expressjs object.
	 */
	constructor(express) {
		this.express = express;
		this.resources = {};
	}

	/**
	 * @param {String} path The path of the resource. e.g. /api/books/:bookId/pages
	 */
	resource(path) {

		let resource = this.resources[path];

		if (!resource) {
			resource = new Resource(this.express, path);
		}

		return resource;

	}

}

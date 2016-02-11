/* global */
'use strict';

import Type from './type.js';
import httpConst from 'http-constants';

export default class Method {

	/**
	 * @param {Resource} resource
	 * @param {String} method
	 */
	constructor(resource, method) {
		this._resource = resource;
		this._method = method;
		this._types = {};

		resource.hateoas.express[method](this._resource.path, (request, response) => {

			const mime = request.headers[httpConst.headers.request.ACCEPT];
			const matches = /[\w\-\*]+?\/([\w\-\*]+?)$/.exec(mime);

			if (!matches || matches.length < 2) {
				console.warn(`No handler found for request.`);
				response.status(httpConst.codes.UNSUPPORTED_MEDIA_TYPE);
				return;
			}

			const mimeMatch = matches[1];
			console.trace(`Extracted request type ${mimeMatch} from ${mime}.`);

			const handler = this._types[mimeMatch];

			let data;
			try {
				data = handler.validate(request.data);

			} catch (error) {
				response.status(httpConst.codes.BAD_REQUEST)
						.json(error);
			}

			try {
				handler.handle(request, response, data);
			} catch (error) {
				response.status(httpConst.codes.INTERNAL_SERVER_ERROR)
						.json(error);
			}

		});

	}

	get resource() {
		return this._resource;
	}

	get method() {
		return this._method;
	}

	get types() {
		return this._types;
	}

	as(type) {
		return this._types[type]
				|| ( this._types[type] = new Type(this, type) );
	}

}

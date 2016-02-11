/* global */
'use strict';

import Type from './type.js';
import * as httpConst from 'http-constants';

/**
 * @param {String} path
 * @returns {String}
 */
export function extractTypeFromPath(path) {
	const matches = /.*\.(\w+)$/.exec(path);
	return matches && matches.length > 1
			? matches[1]
			: undefined;
}

export function extractTypeFromMime(mime) {
	const matches = /\w+\/(\w+)$/.exec(mime);
	return matches && matches.length > 1
			? matches[1]
			: undefined;
}

export function getHandlerFromRequest(request, handlers) {

	const pathMatch = extractTypeFromPath(request.pathname);
	if (pathMatch) {
		console.trace(`Extracted request type ${pathMatch} from ${request.pathname}.`);
		return handlers[pathMatch];
	}

	const mime = request.header(httpConst.headers.CONTENT_TYPE);
	const mimeMatch = extractTypeFromMime(mime);
	if (mimeMatch) {
		console.trace(`Extracted request type ${mimeMatch} from ${mime}.`);
		return handlers[mimeMatch];
	}

	return null;

}

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

			const handler = getHandlerFromRequest(request, this._types);

			if (!handler) {
				console.warn(`No handler found for request.`);
				response.status(httpConst.codes.UNSUPPORTED_MEDIA_TYPE);
				return;
			}

			let data;
			try {
				data = handler.validate(request.data);

			} catch (error) {
				response.status(httpConst.codes.BAD_REQUEST)
						.body(JSON.stringify(error));
			}

			try {
				handler.handle(request, response, data);
			} catch (error) {
				response.status(httpConst.codes.INTERNAL_SERVER_ERROR)
						.body(JSON.stringify(error));
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

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

export const buildGetHandler = (types) => (request) => {

	const pathMatch = extractTypeFromPath(request.pathname);
	if (pathMatch) {
		return types[pathMatch];
	}

	const mime = request.header(httpConst.headers.CONTENT_TYPE);
	const mimeMatch = extractTypeFromMime(mime);
	if (mimeMatch) {
		return types[mimeMatch];
	}

	return undefined;

};

export const buildHandler = (getHandler) => (request, response) => {

	const handler = getHandler(request);

	if (!handler) {
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

};

export default class Method {

	/**
	 * @param {Resource} resource
	 * @param {String} method
	 */
	constructor(resource, method) {
		this._resource = resource;
		this._method = method;
		this._types = {};

		resource.express[method](buildHandler(buildGetHandler(types)));

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
		return types[type] || ( types[type] = new Type(this, type) );
	}

}

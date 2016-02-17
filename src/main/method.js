/* global process, console, JSON */
'use strict';

import Type from './type.js';
import httpConst from 'http-constants';

function determineType(request) {

	const headerAccept = request.headers[httpConst.headers.request.ACCEPT.toLowerCase()];
	const headerContentType = request.headers[httpConst.headers.request.CONTENT_TYPE.toLowerCase()];

	const matches = /[\w\-\*]+?\/([\w\-\*]+?)$/.exec( headerAccept || headerContentType );

	if (!matches || matches.length < 2) {
		console.warn(`No mime found in headers.`);
		return null;
	}

	return matches[1];

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

		const path = resource.path;

		try {
			const express = resource.hateoas.express;
			express[method](path, (i,o) => this.handle(i,o));
			console.info(`Handler added for ${path} : ${method}.`);

		} catch (error) {
			console.error(`Failed to add handler for ${method}:${path} - ${error.stack}`);
			process.exit(1);
		}

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

	handle(request, response) {
		try {

			const type = determineType(request);
			if (!type) {
				console.info(`Request for ${this._resource.path} expecting nonexistent ${type} handler.`);
				return response.status(httpConst.codes.UNSUPPORTED_MEDIA_TYPE);
			}

			const handler = this._types[type];

			let data;
			try {
				data = handler.validate({
					headers: request.headers,
					body: request.body,
					params: request.params,
					query: request.query
				});

			} catch (error) {
				return response.status(httpConst.codes.BAD_REQUEST).json({
					message: error.message
				});
			}

			return handler.handle(request, response, data);

		} catch (error) {
			console.error(error.stack);
			return response.status(httpConst.codes.INTERNAL_SERVER_ERROR).json({
				error: 'An unexpected error occurred.'
			});
		}
	}

	as(type) {
		try {
			return this._types[type]
					|| ( this._types[type] = new Type(this, type) );
		} catch (error) {
			console.error(`hateoas/method: ${error.stack}`);
			process.exit(1);
		}
	}

}

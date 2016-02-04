/* global */
'use strict';

import http from 'http-constants'
import crypto from 'crypto-api';
import files from 'fs';

import Method from './method.js';

const verbs = http.methods;

function ensure(resource, verb) {
	return resource.methods[verb]
			|| ( resource.methods[verb] = new Method(resource.methods, verb) );
}

/**
 * @type {Object<files.FSWatcher>}
 */
const watchers = {};

export default class Resource {

	constructor(hateoas, path) {
		this._hateoas = hateoas;
		this._path = Resource.cleansePath(path);
		this._methods = {};
	}

	get hateoas() {
		return this._hateoas;
	}

	get path() {
		return this._path;
	}

	get methods() {
		return this._methods;
	}

	/**
	 * @param path The path to suffix the parent path with.
	 * @returns {Resource}
	 */
	child(path) {
		return new Resource(this._hateoas, `${this.path}${cleansePath(path)}`);
	}

	file(type, filePath) {

		let hash = null;

		return GET().as(type).handler = (request, response) => {

			let watcher = watchers[filePath];

			if (!watcher) {

				watcher = files.watch(filePath, (event) => {
					switch (event) {

						case 'change':

							files.readFile(filePath, (content) => {
								hash = crypto.hash('md5', content).stringify('hex');

							});

							break;

						case 'rename':

							console.log(`File [${filePath}] renamed. Closing watcher.`);

							// Remove the existing watcher.
							watcher.close();
							delete watchers[filePath];

							// Zero-out the references.
							watcher = null;
							hash = null;

							break;

						default:

							console.warn(`Unexpected event while watching [${filePath}]`);

							break;

					}

				});

				watcher.on('error', (error) => {

					console.log(`An error occurred watching [${filePath}]: ${error.message}`);

					// Remove the existing watcher.
					watcher.close();
					delete watchers[filePath];

					// Zero-out the references.
					watcher = null;
					hash = null;

				});

				watchers[filePath] = watcher;

			}

			if (hash === request.header('etag')) {
				return response.statusCode(304);
			}

			if (!stream(filePath, request, response)) {
				return response.statusCode(520);
			}

		}
	}

	OPTIONS() {
		return ensure(this, verbs.OPTIONS);
	}

	GET() {
		return ensure(this, verbs.GET);
	}

	HEAD() {
		return ensure(this, verbs.HEAD);
	}

	POST() {
		return ensure(this, verbs.POST);
	}

	PUT() {
		return ensure(this, verbs.PUT);
	}

	DELETE() {
		return ensure(this, verbs.DELETE);
	}

	TRACE() {
		return ensure(this, verbs.TRACE);
	}

	CONNECT() {
		return ensure(this, verbs.CONNECT);
	}

	static cleansePath(path) {

		if (!path || path[0] !== '/') {
			return cleansePath('/' + path);
		}

		return path;

	}

}

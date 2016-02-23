/* global process, console, JSON */
'use strict';

import httpConst from 'http-constants';

export default function determineType(request, response) {

	const headerAccept = request.headers[httpConst.headers.request.ACCEPT.toLowerCase()];
	const headerContentType = request.headers[httpConst.headers.request.CONTENT_TYPE.toLowerCase()];

	const matches = /[\w\-\*]+?\/([\w\-\*]+?)$/.exec( headerAccept || headerContentType );

	if (!matches || matches.length < 2 || !matches[1]) {
		console.info(`Request for ${this._resource.path} expecting nonexistent handler.`);
		response.status(httpConst.codes.UNSUPPORTED_MEDIA_TYPE).json({});
		return Promise.reject();
	}

	const typeHandler = this._types[matches[1]];

	if (!typeHandler) {
		response.status(httpConst.codes.NOT_FOUND).json({});
		return Promise.reject();
	}

	return Promise.resolve(typeHandler);

}

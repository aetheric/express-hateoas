/* global process, console, JSON */
'use strict';

import httpConst from 'http-constants';

export default function checkPermission(request, typeHandler, response) {

	if (!typeHandler.permission) {
		return Promise.resolve();
	}

	const principle = request.session && request.session['principle'];

	if (principle && _.contains(principle['permissions'], typeHandler.permission) ) {
		return Promise.resolve();
	}

	response.status(httpConst.codes.UNAUTHORIZED).json({
		required: typeHandler.permission
	});

	return Promise.reject();

}

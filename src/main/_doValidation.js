/* global process, console, JSON */
'use strict';

export default function doValidation(request, handler, response) {
	try {

		return Promise.resolve(handler.validate({
			headers: request.headers,
			body: request.body,
			params: request.params,
			query: request.query,
			session: request.session
		}));

	} catch (error) {

		if (_.isArray(error)) {
			console.info(`Client submitted bad request: ${JSON.stringify(error)}`);
			response.status(httpConst.codes.BAD_REQUEST).json(error);
			return Promise.reject();
		}

		throw error;

	}
}

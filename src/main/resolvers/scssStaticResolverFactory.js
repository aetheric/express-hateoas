import { registerResolverConfigFactory } from '../scanner.js';
import ResolverConfig from '../ResolverConfig.js';
import ResolverConfigFactory from '../ResolverConfigFactory.js';

const files = require('fs');

export default registerResolverConfigFactory(new ResolverConfigFactory('scss', function(file) {
	return new ResolverConfig('GET', '*/scss', null, function(data, session, resolve, reject) {

		fs.readFile(file, function(error, content) {

			if (error) {
				reject(error);

			} else {
				resolve(content);
			}

		});

	});
}));

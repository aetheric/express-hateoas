import { registerResolverConfigFactory } from '../scanner.js';
import ResolverConfig from '../ResolverConfig.js';
import ResolverConfigFactory from '../ResolverConfigFactory.js';

export default registerResolverConfigFactory(new ResolverConfigFactory('es6', function(file) {
	return require(file);
}));

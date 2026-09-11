// Force the classic JSX runtime with an auto-imported '@wordpress/element'
// pragma (matching the older @wordpress/scripts default), so
// build/index.asset.php keeps depending on the long-standing 'wp-element'
// handle instead of 'react-jsx-runtime', which isn't guaranteed to be
// registered on every WordPress version this plugin supports (see
// readme.txt "Requires at least").
const defaultConfig = require( '@wordpress/babel-preset-default' );

module.exports = function ( api ) {
	const config = defaultConfig( api );

	return {
		...config,
		plugins: config.plugins
			.map( ( plugin ) => {
				const [ pluginPath ] = Array.isArray( plugin )
					? plugin
					: [ plugin ];
				if (
					typeof pluginPath === 'string' &&
					pluginPath.includes( 'plugin-transform-react-jsx' )
				) {
					return [
						pluginPath,
						{
							runtime: 'classic',
							pragma: 'createElement',
							pragmaFrag: 'Fragment',
						},
					];
				}
				return plugin;
			} )
			.concat( [
				[
					require.resolve(
						'@wordpress/babel-plugin-import-jsx-pragma'
					),
					{
						scopeVariable: 'createElement',
						scopeVariableFrag: 'Fragment',
						source: '@wordpress/element',
						isDefault: false,
					},
				],
			] ),
	};
};

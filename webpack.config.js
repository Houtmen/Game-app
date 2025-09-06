const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
		// Main process
		{
			mode: 'production',
			entry: './src/main.ts',
			target: 'node',
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'main.cjs',
				library: { type: 'commonjs2' },
			},
			resolve: {
				extensions: ['.ts', '.js'],
			},
			module: {
				rules: [
					{
						test: /\.ts$/,
						exclude: /node_modules/,
						use: 'ts-loader',
					},
				],
			},
			node: {
				__dirname: false,
				__filename: false,
			},
			devtool: false,
			externals: {
				electron: 'commonjs2 electron',
			},
		},
		// Preload script
		{
			mode: 'production',
			entry: './src/preload.js',
			target: 'electron-preload',
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'preload.js',
			},
			devtool: false,
		},
		// Renderer process
		{
			mode: 'production',
			entry: './src/renderer/index.tsx',
			target: 'web',
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'renderer.js',
			},
			resolve: {
				extensions: ['.ts', '.tsx', '.js', '.jsx'],
			},
			module: {
				rules: [
					{
						test: /\.(ts|tsx)$/,
						exclude: /node_modules/,
						use: 'ts-loader',
					},
					{
						test: /\.css$/,
						use: ['style-loader', 'css-loader'],
					},
				],
			},
			plugins: [
				new HtmlWebpackPlugin({
					template: './src/renderer/index.html',
					filename: 'index.html',
				}),
			],
			devtool: false,
		},
];

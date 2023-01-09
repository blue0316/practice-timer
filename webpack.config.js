var config = {
	entry: './main.js',
	output: {
		path: __dirname + '/',
		filename: 'index.js',
	},
	devServer: {
		inline: true,
		port: 8080
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env'],
                      plugins: ['@babel/plugin-transform-runtime']
                    }
				},
			}
		]
	}
};

module.exports = config;
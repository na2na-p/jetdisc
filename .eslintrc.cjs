module.exports = {
	'env': {
		'es2021': true,
		'node': true,
	},
	'extends': [
		'google',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
	},
	'plugins': [
		'@typescript-eslint',
	],
	'rules': {
		'no-tabs': 'off',
		'max-len': ['error', {'code': 120}],
		'indent': ['error', 'tab'],
	},
};

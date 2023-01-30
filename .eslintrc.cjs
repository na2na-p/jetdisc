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
		'import',
	],
	'rules': {
		'no-tabs': 'off',
		'max-len': ['error', { 'code': 120 }],
		'indent': ['error', 'tab'],
		'@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
		'@typescript-eslint/no-redeclare': ['error'],
		'no-unused-vars': 'off',
		'require-jsdoc': 'off',
		'object-curly-spacing': ['error', 'always'],
		'import/order': [
			'error',
			{
				'groups': [
					'builtin',
					'external',
					'internal',
					['sibling', 'parent'],
					'object',
				],
				'pathGroups': [
					{
						'pattern': '@/**',
						'group': 'external',
						'position': 'after',
					},
				],
				'pathGroupsExcludedImportTypes': ['builtin'],
				'alphabetize': {
					'order': 'asc',
					'caseInsensitive': true,
				},
				'newlines-between': 'always',
			},
		],
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{ 'prefer': 'type-imports' },
		],
		'import/no-duplicates': 'error',
		'operator-linebreak': ['error', 'before'],
		'semi': ['error', 'always'],
	},
};

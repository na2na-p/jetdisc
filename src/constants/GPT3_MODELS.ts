/**
 * @see https://beta.openai.com/docs/models/overview
 */
const GPT3_MODELS = {
	davinci: 'text-davinci-003',
	curie: 'text-curie-001',
	babbage: 'text-babbage-001',
	ada: 'text-ada-001',
} as const satisfies {
	[key in string]: string;
};

export default GPT3_MODELS;

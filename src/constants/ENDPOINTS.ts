const ENDPOINTS = {
	OPEN_AI: 'https://api.openai.com/v1',
} as const satisfies {
	[key in string]: string;
};

export default ENDPOINTS;

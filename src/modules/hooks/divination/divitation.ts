import type { divination, horoscope } from './index.js';

type parsedDivination = {
	[key in horoscope]: divination;
};

/**
	 * @param {string} sign
	 * @param {string} dateStr
	 * @return {divination} 引数で渡した星座の運勢を返す
	 */
export async function getDivination(sign: horoscope, dateStr: String): Promise<divination> {
	const jugemkey = 'http://api.jugemkey.jp/api/horoscope/free/' + dateStr;
	const options = {
		method: 'GET',
		url: jugemkey,
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const response: Array<divination> =
			JSON.parse(await (await fetch(options.url, options)).text()).horoscope[`${dateStr}`];
	const protoResult: Partial<parsedDivination> = {};

	response.forEach((eachResults) => {
		// resultに[key: eachResults.sign]: eachResultsを追加する
		const key: keyof parsedDivination = eachResults.sign;
		protoResult[key] = eachResults;
	});
	const result = protoResult as parsedDivination;
	return result[sign];
}

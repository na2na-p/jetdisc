/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
/**
 * TODO JSDoc直す
 * 引数で渡された配列 or 数値の範囲内でランダムに一つ返す
 * candidateを渡した場合はmin/max入れないで :TODO 型定義頑張る
 * @param {candidate?: T[], min?: number, max?: number} options
 */
export function random<T>(options: {candidate: Array<T>}): T;
export function random(options: {min: number, max: number}): number;

export function random<T>(
	options: {candidate?: Array<T>, min?: number, max?: number},
): T | number {
	if (options.candidate) {
		// options.candidate.lengthからランダムに選ぶ
		return options.candidate[Math.floor(Math.random() * options.candidate.length)];
	} else {
		// min/maxからランダムに選ぶ
		const optionsRange = options as Required<Exclude<typeof options, 'candidate'>>; // TODO: Exculdeでみなかったことにするやつ
		const result = Math.floor(Math.random() * (optionsRange.max - optionsRange.min + 1)) + optionsRange.min;
		if (result < optionsRange.min || result > optionsRange.max) {
			throw new Error('random()で生成した数値がmin/maxの範囲外です');
		}
		return result;
	}
}

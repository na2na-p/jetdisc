import dayjs from 'dayjs';

import { getDivination } from '@/modules/hooks/divination/divitation.js';
import { random } from '@/utils/random.js';

describe('モジュール群のテスト', () => {
	describe('randomモジュールのテスト', () => {
		it('2つのnumber型引数をとる場合のテスト', () => {
			const options = {
				min: 1,
				max: 10,
			};
			// 1~10までの数字の正規表現
			const regex = /^[1-9]|[1-9][0-9]$/;
			const result = random(options);
			expect(regex.test(result.toString())).toBe(true);
		});
		it('2つのnumber型引数をとる場合のテスト(大小が同値のパターン)', () => {
			const options = {
				min: 10,
				max: 10,
			};
			expect(random(options)).toBe(10);
		});
		it('2つのnumber型引数をとる場合のテスト(大小が逆転のパターン)', () => {
			const options = {
				min: 10,
				max: 1,
			};
			// エラーがthrowされることを確認
			expect(() => random(options)).toThrow('random()で生成した数値がmin/maxの範囲外です');
		});
		it('一つのArray<string>を引数にとる場合のテスト', () => {
			const options = {
				candidate: ['a'],
			};
			expect(random(options)).toBe('a');
		});
	});
	describe('divinationモジュールのテスト', () => {
		const dateStr = dayjs().format('YYYY/MM/DD');
		const sign = '天秤座';
		it('正しく返ってくるか(毎日変わるのでresult.signだけ確認してます。)', async () => {
			const result = await getDivination(sign, dateStr);
			expect(result.sign).toBe(sign);
		});
	});
});

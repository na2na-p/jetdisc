import {expect} from 'chai';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _mocha from 'mocha';
import {random} from '../built/utils/random.js';

// mochaを利用したテストコード
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
			expect(regex.test(result.toString())).to.be.true;
		});
		it('2つのnumber型引数をとる場合のテスト(大小が同値のパターン)', () => {
			const options = {
				min: 10,
				max: 10,
			};
			expect(random(options)).to.equal(10);
		});
		it('2つのnumber型引数をとる場合のテスト(大小が逆転のパターン)', () => {
			const options = {
				min: 10,
				max: 1,
			};
			// エラーがthrowされることを確認
			expect(() => random(options)).to.throw('random()で生成した数値がmin/maxの範囲外です');
		});
		it('一つのArray<string>を引数にとる場合のテスト', () => {
			const options = {
				candidate: ['a'],
			};
			expect(random(options)).to.equal('a');
		});
	});
});

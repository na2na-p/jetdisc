import { getRTT } from './getRTT.js';

describe('getRTT', () => {
  it('should return the correct RTT', () => {
    const localTime = 1000;
    const serverTime = 500;
    const expectedRTT = localTime - serverTime;

    const result = getRTT({ localTime, serverTime });

    expect(result).toBe(expectedRTT);
  });
});

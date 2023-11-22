import { assertNever } from './assertNever.func.js';

describe('assertNever', () => {
  it('should throw an error with the unexpected object', () => {
    const unexpectedObject = {} as never;
    expect(() => assertNever(unexpectedObject)).toThrowError(
      'Unexpected object: [object Object]'
    );
  });

  it('should not throw an error when shouldThrow is false', () => {
    const unexpectedObject = {} as never;
    expect(() => assertNever(unexpectedObject, false)).not.toThrow();
  });
});

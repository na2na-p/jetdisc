import { singleton } from './singleton.func.js';

it('not identical', () => {
  const factory = () => ({});

  const x = factory();
  const y = factory();

  expect(x).not.toBe(y);
});
it('with singleton, identical', () => {
  const factory = () => ({});
  const getter = singleton(factory);

  const x = getter();
  const y = getter();

  expect(x).toBe(y);
});

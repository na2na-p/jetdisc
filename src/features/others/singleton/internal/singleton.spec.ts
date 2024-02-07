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

it('not identical with args', () => {
  const factory = (a: number) => ({ a });

  const x = factory(1);
  const y = factory(1);

  expect(x).not.toBe(y);
});

it('with singleton, identical with args', () => {
  const factory = (a: number) => ({ a });
  const getter = singleton(factory);

  const x = getter(1);
  const y = getter(1);

  expect(x).toBe(y);
});

it('not identical with multiple args', () => {
  const factory = (a: number, b: number) => ({ a, b });

  const x = factory(1, 2);
  const y = factory(1, 2);

  expect(x).not.toBe(y);
});

it('with singleton, identical with multiple args', () => {
  const factory = (a: number, b: number) => ({ a, b });
  const getter = singleton(factory);

  const x = getter(1, 2);
  const y = getter(1, 2);

  expect(x).toBe(y);
});

it('not identical with class', () => {
  class TestClass {}

  const x = new TestClass();
  const y = new TestClass();

  expect(x).not.toBe(y);
});

it('with singleton, identical with class', () => {
  class TestClass {}

  const getter = singleton(TestClass);

  const x = getter();
  const y = getter();

  expect(x).toBe(y);
});

it('not identical with class and args', () => {
  class TestClass {
    constructor(public a: number) {}
  }

  const x = new TestClass(1);
  const y = new TestClass(1);

  expect(x).not.toBe(y);
});

it('with singleton, identical with class and args', () => {
  class TestClass {
    constructor(public a: number) {}
  }

  const getter = singleton(TestClass);

  const x = getter(1);
  const y = getter(1);

  expect(x).toBe(y);
});

it('not identical with class and multiple args', () => {
  class TestClass {
    constructor(
      public a: number,
      public b: number
    ) {}
  }

  const x = new TestClass(1, 2);
  const y = new TestClass(1, 2);

  expect(x).not.toBe(y);
});

it('with singleton, identical with class and multiple args', () => {
  class TestClass {
    constructor(
      public a: number,
      public b: number
    ) {}
  }

  const getter = singleton(TestClass);

  const x = getter(1, 2);
  const y = getter(1, 2);

  expect(x).toBe(y);
});

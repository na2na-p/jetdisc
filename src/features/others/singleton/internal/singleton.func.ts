type Constructor<T, Args extends unknown[]> = new (...args: Args) => T;
type FactoryFunction<T, Args extends unknown[]> = (...args: Args) => T;

function isClass<T, Args extends unknown[]>(
  func: Constructor<T, Args> | FactoryFunction<T, Args>
): func is Constructor<T, Args> {
  return /^class\s/.test(Function.prototype.toString.call(func));
}

export function singleton<T, Args extends unknown[]>(
  factoryOrConstructor: Constructor<T, Args> | FactoryFunction<T, Args>
): (...args: Args) => T {
  let instance: T | null = null;
  return (...args: Args) => {
    if (!instance) {
      instance = isClass<T, Args>(factoryOrConstructor)
        ? new factoryOrConstructor(...args)
        : factoryOrConstructor(...args);
    }
    return instance;
  };
}

type Getter<T> = () => T;
type Factory<T> = () => T;

export const singleton = <T>(factory: Factory<T>): Getter<T> =>
  ((): Getter<T> => {
    let memo: T | null = null;

    return () => (memo ? memo : (memo = factory()));
  })();

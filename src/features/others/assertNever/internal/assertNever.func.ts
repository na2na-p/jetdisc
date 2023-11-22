export const assertNever = (x: never, shouldThrow: boolean = true): never => {
  if (shouldThrow) throw new Error(`Unexpected object: ${x}`);
  return x;
};

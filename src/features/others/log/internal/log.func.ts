import { chalk } from '@/features/library/index.js';

export const log = ({
  message,
  // eslint-disable-next-line no-console
  stdoutMethod = console.log,
}: {
  message: string;
  stdoutMethod?: (message: string) => void;
}) => {
  const now = new Date();
  const date = `${zeroPad(now.getHours())}:${zeroPad(
    now.getMinutes()
  )}:${zeroPad(now.getSeconds())}`;
  stdoutMethod(`${chalk.gray(date)} ${message}`);
};

const zeroPad = (num: number, length: number = 2): string => {
  return ('0000000000' + num).slice(-length);
};

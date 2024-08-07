/* eslint-disable no-console */
import type { MockInstance } from 'vitest';

import { chalk } from '@/features/library/index.js';

import { log } from './log.func.js';

describe('log', () => {
  let mockStdout: MockInstance;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    mockStdout = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockStdout.mockRestore();
    console.log = originalConsoleLog;
  });

  it('should log the message with the current time in gray color', () => {
    const message = 'test message';
    const now = new Date();
    const expectedDate = `${zeroPad(now.getHours())}:${zeroPad(
      now.getMinutes()
    )}:${zeroPad(now.getSeconds())}`;
    const expectedOutput = `${chalk.gray(expectedDate)} ${message}`;

    log({ message });

    expect(mockStdout).toHaveBeenCalledWith(expectedOutput);
  });

  it('should use the provided stdout method if given', () => {
    const message = 'test message';
    const mockStdoutMethod = vi.fn();

    log({ message, stdoutMethod: mockStdoutMethod });

    expect(mockStdoutMethod).toHaveBeenCalledWith(
      expect.stringContaining(message)
    );
  });
});

const zeroPad = (num: number, length: number = 2): string => {
  return ('0000000000' + num).slice(-length);
};

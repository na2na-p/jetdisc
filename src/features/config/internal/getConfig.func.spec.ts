import { getConfig } from './getConfig.func.js';

describe('getConfig', () => {
  const originalProcessEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalProcessEnv };
  });

  afterEach(() => {
    process.env = originalProcessEnv;
  });

  it('should return the expected config', () => {
    process.env['DISCORD_APP_TOKEN'] = 'test_token';
    process.env['BOT_NAME'] = 'test_bot';
    process.env['SET_COMMANDS_TARGET_SERVERS'] = 'server1,server2';
    process.env['STORE_DRIVER'] = 'local';

    const expectedConfig = {
      DISCORD_APP_TOKEN: 'test_token',
      BOT_NAME: 'test_bot',
      SET_COMMANDS_TARGET_SERVERS: ['server1', 'server2'],
      STORE_DRIVER: 'local',
    };

    expect(getConfig()).toEqual(expectedConfig);
  });

  it('should throw an error if DISCORD_APP_TOKEN is not set', () => {
    process.env['BOT_NAME'] = 'test_bot';
    process.env['SET_COMMANDS_TARGET_SERVERS'] = 'server1,server2';

    expect(getConfig).toThrow();
  });

  it('should throw an error if BOT_NAME is not set', () => {
    process.env['DISCORD_APP_TOKEN'] = 'test_token';
    process.env['SET_COMMANDS_TARGET_SERVERS'] = 'server1,server2';

    expect(getConfig).toThrow();
  });

  it('should throw an error if SET_COMMANDS_TARGET_SERVERS is not set', () => {
    process.env['DISCORD_APP_TOKEN'] = 'test_token';
    process.env['BOT_NAME'] = 'test_bot';

    expect(getConfig).toThrow();
  });
});

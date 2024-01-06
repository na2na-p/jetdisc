export const createTestEnv = () => {
  process.env['DISCORD_APP_TOKEN'] = 'test_token';
  process.env['BOT_NAME'] = 'test_bot';
  process.env['SET_COMMANDS_TARGET_SERVERS'] = 'server1,server2';
  process.env['SPOTIFY_CLIENT_ID'] = 'test_client_id';
  process.env['SPOTIFY_CLIENT_SECRET'] = 'test_client_secret';
  return;
};

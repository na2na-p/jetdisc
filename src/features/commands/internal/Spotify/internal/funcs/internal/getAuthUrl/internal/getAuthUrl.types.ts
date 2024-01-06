export type GetAuthUrl = (args: {
  state: string;
  spotifyClientId: string;
  redirectUri: string;
  applicationScopes?: ReadonlyArray<string>;
}) => string;

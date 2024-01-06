export type GetAuthUrl = (args: {
  state: string;
  spotifyClientId: string;
  applicationScopes?: ReadonlyArray<string>;
  redirectUri?: string;
}) => string;

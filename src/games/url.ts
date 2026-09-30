export const DEFAULT_GAME_ID = 'block-match';

export const readGameId = () => new URLSearchParams(window.location.search).get('game') ?? DEFAULT_GAME_ID;

export const buildGameUrl = (gameId: string, params: Record<string, string> = {}) =>
  `?${new URLSearchParams({ game: gameId, ...params })}`;

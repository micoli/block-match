export const buildGameUrl = (gameId: string, params: Record<string, string> = {}) =>
  `?${new URLSearchParams({ game: gameId, ...params })}`;

// Links predating multi-game support carried only a seed and meant Block Match.
export const readRoute = () => {
  const params = new URLSearchParams(window.location.search);
  const seed = params.get('seed');
  return { seed, gameId: params.get('game') ?? (seed ? 'block-match' : null) };
};

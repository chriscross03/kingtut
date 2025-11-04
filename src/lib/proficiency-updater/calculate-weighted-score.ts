export function calculateWeightedScore(
  oldScore: number,
  newScore: number,
  oldWeight: number = 0.7,
  newWeight: number = 0.3
): number {
  return oldScore * oldWeight + newScore * newWeight;
}

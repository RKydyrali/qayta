export function calculateCo2Saved(wasteKg: number): number {
  return wasteKg * 1.5;
}

export function calculateWasteFromBox(
  estimatedWeightKg: number | undefined,
  quantity: number,
): number {
  return (estimatedWeightKg ?? 1.5) * quantity;
}

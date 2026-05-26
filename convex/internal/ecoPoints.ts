export function pointsForOrder(
  discountedPrice: number,
  originalPrice: number,
): number {
  if (originalPrice <= 0) return 0;
  return Math.round((1 - discountedPrice / originalPrice) * 10);
}

export function levelFromPoints(totalPoints: number): number {
  if (totalPoints >= 3000) return 6;
  if (totalPoints >= 1500) return 5;
  if (totalPoints >= 700) return 4;
  if (totalPoints >= 300) return 3;
  if (totalPoints >= 100) return 2;
  return 1;
}

export function levelName(level: number, lang: "ru" | "kk" = "ru"): string {
  const names: Record<number, { ru: string; kk: string }> = {
    1: { ru: "Новичок", kk: "Жаңадан" },
    2: { ru: "Эко-старт", kk: "Эко-бастау" },
    3: { ru: "Борец с отходами", kk: "Қалдықтармен күрес" },
    4: { ru: "Зелёный страж", kk: "Жасыл қорғаушы" },
    5: { ru: "Эко-герой", kk: "Эко-батыр" },
    6: { ru: "Климатический чемпион", kk: "Климат чемпионы" },
  };
  return names[level]?.[lang] ?? names[1]![lang];
}

export function nextLevelPoints(level: number): number {
  const thresholds = [0, 100, 300, 700, 1500, 3000, Infinity];
  return thresholds[level] ?? Infinity;
}

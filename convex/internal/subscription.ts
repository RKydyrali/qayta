const FREE_ACTIVE_BOX_LIMIT = 3;

export function checkPartnerBoxLimit(
  activeCount: number,
  isPremium: boolean,
): { allowed: boolean; limit: number } {
  if (isPremium) {
    return { allowed: true, limit: Infinity };
  }
  return {
    allowed: activeCount < FREE_ACTIVE_BOX_LIMIT,
    limit: FREE_ACTIVE_BOX_LIMIT,
  };
}

export const FARM_SUBSCRIPTION_PRICE_MONTHLY = 25000;

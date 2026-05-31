import { formatPercent } from '@/utils/numberFormat.utils';

export interface FormatOwnershipOptions {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    signed?: boolean;
}

export function computeOwnershipPercentage(
    balance: number | null | undefined,
    totalSupply: number | null | undefined
): number | null {
    if (balance == null || totalSupply == null) return null;
    if (!Number.isFinite(balance) || !Number.isFinite(totalSupply)) return null;
    if (totalSupply <= 0) return null;
    return (balance / totalSupply) * 100;
}

export function formatOwnershipPercent(
    balance: number | null | undefined,
    totalSupply: number | null | undefined,
    options: FormatOwnershipOptions = {}
): string {
    const pct = computeOwnershipPercentage(balance, totalSupply);
    if (pct == null) return '—';
    return formatPercent(pct, {
        maximumFractionDigits: options.maximumFractionDigits ?? 2,
        minimumFractionDigits: options.minimumFractionDigits ?? 0,
        signed: options.signed ?? false,
    });
}

export default {
    computeOwnershipPercentage,
    formatOwnershipPercent,
};

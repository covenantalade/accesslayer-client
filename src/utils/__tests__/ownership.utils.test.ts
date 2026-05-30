import { describe, it, expect } from 'vitest';
import {
    computeOwnershipPercentage,
    formatOwnershipPercent,
} from '../ownership.utils';

describe('ownership.utils', () => {
    describe('computeOwnershipPercentage', () => {
        it('returns null when balance is null', () => {
            expect(computeOwnershipPercentage(null, 100)).toBeNull();
        });

        it('returns null when totalSupply is null', () => {
            expect(computeOwnershipPercentage(10, null)).toBeNull();
        });

        it('returns null when totalSupply is zero or negative', () => {
            expect(computeOwnershipPercentage(10, 0)).toBeNull();
            expect(computeOwnershipPercentage(10, -5)).toBeNull();
        });

        it('computes correct percentage for normal values', () => {
            expect(computeOwnershipPercentage(25, 100)).toBeCloseTo(25);
            expect(computeOwnershipPercentage(1, 3)).toBeCloseTo((1 / 3) * 100);
        });

        it('handles balances greater than supply ( >100%)', () => {
            expect(computeOwnershipPercentage(150, 100)).toBeCloseTo(150);
        });

        it('returns null for non-finite inputs', () => {
            expect(computeOwnershipPercentage(NaN, 100)).toBeNull();
            expect(computeOwnershipPercentage(10, Infinity)).toBeNull();
        });
    });

    describe('formatOwnershipPercent', () => {
        it('returns placeholder when percentage cannot be computed', () => {
            expect(formatOwnershipPercent(null, 100)).toBe('—');
            expect(formatOwnershipPercent(10, 0)).toBe('—');
        });

        it('formats percentage with default precision', () => {
            expect(formatOwnershipPercent(1, 4)).toBe('25%');
            expect(formatOwnershipPercent(1, 3)).toBe('33.33%');
        });

        it('respects maximumFractionDigits option', () => {
            expect(formatOwnershipPercent(1, 3, { maximumFractionDigits: 1 })).toBe(
                '33.3%'
            );
        });

        it('handles large balances and supplies', () => {
            expect(formatOwnershipPercent(1_000_000, 10_000_000)).toBe('10%');
        });

        it('can show signed positives when requested', () => {
            expect(
                formatOwnershipPercent(1, 4, { signed: true, maximumFractionDigits: 0 })
            ).toBe('+25%');
        });
    });
});

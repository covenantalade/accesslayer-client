import { describe, expect, it } from 'vitest';
import {
	formatCreatorKeyPriceDisplay,
	formatDisplayKeyPrice,
	resolveCreatorKeyPriceStroops,
} from '../keyPriceDisplay.utils';
import { STROOPS_PER_XLM } from '@/constants/stellar';

describe('resolveCreatorKeyPriceStroops', () => {
	it('prefers explicit stroops', () => {
		expect(
			resolveCreatorKeyPriceStroops({ priceStroops: 42, price: 1 })
		).toBe(42);
	});

	it('derives stroops from legacy XLM price', () => {
		expect(resolveCreatorKeyPriceStroops({ price: 0.05 })).toBe(
			0.05 * STROOPS_PER_XLM
		);
	});
});

describe('formatDisplayKeyPrice', () => {
	it('formats amounts above the XLM display threshold in XLM', () => {
		expect(formatDisplayKeyPrice(500_000)).toBe('0.05 XLM');
	});

	it('falls back to stroops when XLM would round to zero', () => {
		expect(formatDisplayKeyPrice(1)).toBe('1 stroops');
	});

	it('returns placeholder for missing values', () => {
		expect(formatDisplayKeyPrice(null)).toBe('—');
	});
});

describe('formatCreatorKeyPriceDisplay', () => {
	it('formats from stroops on a creator record', () => {
		expect(formatCreatorKeyPriceDisplay({ priceStroops: 1_200_000 })).toBe(
			'0.12 XLM'
		);
	});
});

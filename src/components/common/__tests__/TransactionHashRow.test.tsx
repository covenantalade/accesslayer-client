import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TransactionHashRow from '@/components/common/TransactionHashRow';

describe('TransactionHashRow', () => {
	it('announces copy success in a visually hidden live region', async () => {
		vi.useFakeTimers();
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: { writeText },
		});

		render(<TransactionHashRow hash="0xabcdef1234567890" />);

		await act(async () => {
			fireEvent.click(
				screen.getByRole('button', { name: 'Copy transaction hash' })
			);
		});

		expect(writeText).toHaveBeenCalledWith('0xabcdef1234567890');
		expect(
			screen.getByRole('button', { name: 'Transaction hash copied' })
		).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(25);
		});

		const status = screen.getByRole('status');
		expect(status).toHaveTextContent('Transaction hash copied.');
		expect(status).toHaveClass('sr-only');
		expect(status).not.toHaveTextContent(
			'Transaction hash copied to clipboard'
		);

		vi.useRealTimers();
	});
});

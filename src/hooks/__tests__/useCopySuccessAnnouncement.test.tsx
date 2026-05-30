import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
	COPY_SUCCESS_ANNOUNCEMENT,
	COPY_SUCCESS_TOAST_ARIA_PROPS,
	useCopySuccessAnnouncement,
} from '@/hooks/useCopySuccessAnnouncement';

describe('useCopySuccessAnnouncement', () => {
	it('announces copy success through a reusable live-region message', () => {
		vi.useFakeTimers();

		const { result } = renderHook(() =>
			useCopySuccessAnnouncement({ clearAfterMs: 100 })
		);

		act(() => {
			result.current.announceCopySuccess();
		});

		expect(result.current.announcement).toBe('');

		act(() => {
			vi.advanceTimersByTime(25);
		});

		expect(result.current.announcement).toBe(COPY_SUCCESS_ANNOUNCEMENT);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current.announcement).toBe('');

		vi.useRealTimers();
	});

	it('provides aria-live off props for visible copy-success toasts', () => {
		expect(COPY_SUCCESS_TOAST_ARIA_PROPS).toEqual({
			role: 'status',
			'aria-live': 'off',
		});
	});
});

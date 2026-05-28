import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToastOptions } from 'react-hot-toast';

export const COPY_SUCCESS_ANNOUNCEMENT = 'Copy successful.';

export const COPY_SUCCESS_TOAST_ARIA_PROPS: NonNullable<
	ToastOptions['ariaProps']
> = {
	role: 'status',
	'aria-live': 'off',
};

interface UseCopySuccessAnnouncementOptions {
	/**
	 * How long the live region should keep the announcement text after a copy.
	 */
	clearAfterMs?: number;
}

export function useCopySuccessAnnouncement({
	clearAfterMs = 2000,
}: UseCopySuccessAnnouncementOptions = {}) {
	const [announcement, setAnnouncement] = useState('');
	const announceTimerRef = useRef<number | null>(null);
	const clearTimerRef = useRef<number | null>(null);

	const clearTimers = useCallback(() => {
		if (announceTimerRef.current !== null) {
			window.clearTimeout(announceTimerRef.current);
			announceTimerRef.current = null;
		}

		if (clearTimerRef.current !== null) {
			window.clearTimeout(clearTimerRef.current);
			clearTimerRef.current = null;
		}
	}, []);

	const announceCopySuccess = useCallback(
		(message = COPY_SUCCESS_ANNOUNCEMENT) => {
			clearTimers();
			setAnnouncement('');

			announceTimerRef.current = window.setTimeout(() => {
				setAnnouncement(message);
				announceTimerRef.current = null;

				clearTimerRef.current = window.setTimeout(() => {
					setAnnouncement('');
					clearTimerRef.current = null;
				}, clearAfterMs);
			}, 25);
		},
		[clearAfterMs, clearTimers]
	);

	useEffect(() => clearTimers, [clearTimers]);

	return {
		announcement,
		announceCopySuccess,
	};
}

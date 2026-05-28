import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CreatorProfileHeader from '@/components/common/CreatorProfileHeader';

describe('CreatorProfileHeader', () => {
	it('closes the profile image lightbox with Escape and returns focus to the trigger', async () => {
		render(
			<CreatorProfileHeader
				name="Alex Rivers"
				handle="arivers"
				creatorId="arivers"
				avatarUrl="https://example.com/avatar.png"
			/>
		);

		const avatarTrigger = screen.getByRole('button', {
			name: 'Open Alex Rivers profile image',
		});

		fireEvent.click(avatarTrigger);

		expect(
			screen.getByRole('dialog', { name: 'Alex Rivers profile image' })
		).toBeInTheDocument();

		fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
		expect(avatarTrigger).toHaveFocus();
	});
});

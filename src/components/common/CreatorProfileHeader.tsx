import React, { useRef, useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import showToast from '@/utils/toast.util';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import CreatorInitialsAvatar from '@/components/common/CreatorInitialsAvatar';
import CreatorBio from '@/components/common/CreatorBio';
import { formatCreatorHandle } from '@/utils/handleDisplay.utils';

interface CreatorProfileHeaderProps {
	name: string;
	handle: string;
	creatorId?: string | number | null;
	avatarUrl?: string;
	isVerified?: boolean;
	bio?: string | null;
	className?: string;
}

const CREATOR_PROFILE_SUBTITLE_WRAP_CLASS_NAME =
	'max-w-full whitespace-normal break-words [overflow-wrap:anywhere]';

const CreatorProfileHeader: React.FC<CreatorProfileHeaderProps> = ({
	name,
	handle,
	creatorId,
	avatarUrl,
	isVerified,
	bio,
	className,
}) => {
	const [copied, setCopied] = useState(false);
	const [avatarLightboxOpen, setAvatarLightboxOpen] = useState(false);
	const avatarTriggerRef = useRef<HTMLButtonElement>(null);

	// Display-normalised handle; raw `handle` is preserved for any equality /
	// URL construction the caller might do via the prop.
	const displayHandle = formatCreatorHandle(handle);

	const handleShare = async () => {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: `${name} (${displayHandle || `@${handle}`}) on Access Layer`,
					url,
				});
			} catch (err) {
				// User cancelled the share dialog — not an error worth surfacing
				if (err instanceof Error && err.name !== 'AbortError') {
					showToast.error('Failed to share profile');
				}
			}
			return;
		}

		// Fallback: copy to clipboard
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			showToast.success('Profile link copied to clipboard!');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			showToast.error('Failed to copy link');
		}
	};

	const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

	const avatar = (
		<CreatorInitialsAvatar name={name} creatorId={creatorId} imageSrc={avatarUrl} />
	);

	return (
		<div
			className={cn(
				'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
				className
			)}
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
				{avatarUrl ? (
					<Dialog open={avatarLightboxOpen} onOpenChange={setAvatarLightboxOpen}>
						<DialogTrigger asChild>
							<button
								type="button"
								ref={avatarTriggerRef}
								aria-label={`Open ${name} profile image`}
								className="size-24 overflow-hidden rounded-2xl border-4 border-white/10 shadow-xl transition hover:border-amber-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:size-32"
							>
								{avatar}
							</button>
						</DialogTrigger>
						<DialogContent
							aria-labelledby="creator-profile-image-lightbox-title"
							aria-describedby="creator-profile-image-lightbox-description"
							className="border-white/10 bg-slate-950/95 p-4 sm:max-w-xl"
							onCloseAutoFocus={(event) => {
								event.preventDefault();
								avatarTriggerRef.current?.focus();
							}}
							onEscapeKeyDown={() => {
								setAvatarLightboxOpen(false);
							}}
						>
							<DialogTitle
								id="creator-profile-image-lightbox-title"
								className="sr-only"
							>
								{name} profile image
							</DialogTitle>
							<DialogDescription
								id="creator-profile-image-lightbox-description"
								className="sr-only"
							>
								Expanded creator profile image. Press Escape or the close button to
								dismiss it.
							</DialogDescription>
							<img
								src={avatarUrl}
								alt={`${name} profile image`}
								className="max-h-[75vh] w-full rounded-2xl object-contain"
							/>
						</DialogContent>
					</Dialog>
				) : (
					<div
						className="size-24 overflow-hidden rounded-2xl border-4 border-white/10 shadow-xl md:size-32"
						role="img"
						aria-labelledby="creator-profile-name"
					>
						{avatar}
					</div>
				)}
				<div className="min-w-0 space-y-1">
					<div className="flex items-center gap-2 overflow-hidden">
						<h1
							id="creator-profile-name"
							className="truncate font-grotesque text-3xl font-black tracking-tight text-white md:text-4xl"
						>
							{name}
						</h1>
						{isVerified && (
							<div className="shrink-0">
								<VerifiedBadge verified={true} />
							</div>
						)}
					</div>
					<p
						className={cn(
							'font-jakarta text-lg text-white/50',
							CREATOR_PROFILE_SUBTITLE_WRAP_CLASS_NAME
						)}
					>
						{displayHandle || `@${handle}`}
					</p>
					{/* #315: profile bio auto-collapses with a Show more / less
						toggle once long enough. Short bios render unchanged. */}
					<CreatorBio
						bio={bio}
						variant="profile"
						collapsible
						className="mt-2 max-w-md"
					/>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Button
					onClick={handleShare}
					variant="outline"
					className="h-11 rounded-xl border-white/10 bg-white/5 px-4 font-bold text-white transition-all hover:border-amber-500/30 hover:bg-amber-500/10 active:scale-95"
				>
					{copied ? (
						<Check className="mr-2 size-4 text-emerald-400" />
					) : canNativeShare ? (
						<Share2 className="mr-2 size-4 text-amber-500" />
					) : (
						<Copy className="mr-2 size-4 text-amber-500" />
					)}
					<span className="hidden sm:inline">
						{copied
							? 'Copied!'
							: canNativeShare
								? 'Share Profile'
								: 'Copy Profile Link'}
					</span>
					<span className="sm:hidden">
						{copied ? 'Copied' : canNativeShare ? 'Share' : 'Copy'}
					</span>
				</Button>
			</div>
		</div>
	);
};

export default CreatorProfileHeader;

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import CopySuccessAnnouncement from '@/components/common/CopySuccessAnnouncement';
import { useCopySuccessAnnouncement } from '@/hooks/useCopySuccessAnnouncement';

interface TruncatedAddressProps {
	address: string;
	prefixChars?: number;
	suffixChars?: number;
	copyable?: boolean;
	className?: string;
}

function truncate(address: string, prefix: number, suffix: number): string {
	if (address.length <= prefix + suffix + 3) {
		return address;
	}
	return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
}

const TruncatedAddress: React.FC<TruncatedAddressProps> = ({
	address,
	prefixChars = 6,
	suffixChars = 4,
	copyable = false,
	className,
}) => {
	const [copied, setCopied] = useState(false);
	const { announcement, announceCopySuccess } = useCopySuccessAnnouncement();

	const handleCopy = async () => {
		await navigator.clipboard.writeText(address);
		announceCopySuccess('Address copied.');
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 font-mono text-sm text-white/70',
				className
			)}
			title={address}
		>
			<span>{truncate(address, prefixChars, suffixChars)}</span>
			{copyable && (
				<>
					<button
						onClick={handleCopy}
						aria-label={copied ? 'Address copied' : 'Copy address'}
						className="text-white/40 transition-colors hover:text-amber-500"
					>
						{copied ? (
							<Check className="size-3" aria-hidden="true" />
						) : (
							<Copy className="size-3" aria-hidden="true" />
						)}
					</button>
					<CopySuccessAnnouncement message={announcement} />
				</>
			)}
		</span>
	);
};

export default TruncatedAddress;

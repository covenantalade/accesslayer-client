interface CopySuccessAnnouncementProps {
	message: string;
}

function CopySuccessAnnouncement({ message }: CopySuccessAnnouncementProps) {
	return (
		<span
			role="status"
			aria-live="polite"
			aria-atomic="true"
			className="sr-only"
		>
			{message}
		</span>
	);
}

export default CopySuccessAnnouncement;

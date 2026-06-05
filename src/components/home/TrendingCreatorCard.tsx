import makeBlockie from 'ethereum-blockies-base64';
import { TrendingUp, TrendingDown, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Course } from '@/services/course.service';

type Props = { creator: Course & { walletAddress: string } };

function PriceChange({ change }: { change?: number }) {
	if (change === undefined) return null;
	const up = change >= 0;
	return (
		<span className={`flex items-center gap-1 font-mono text-[10px] ${up ? 'text-emerald-600' : 'text-red-500'}`}>
			{up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
			{up ? '+' : ''}{change.toFixed(1)}%
		</span>
	);
}

export default function TrendingCreatorCard({ creator }: Props) {
	const name = creator.title || 'Unnamed creator';
	const avatar = makeBlockie(creator.walletAddress);
	const priceXlm = creator.priceStroops
		? (creator.priceStroops / 1e7).toFixed(2)
		: creator.price.toFixed(2);

	return (
		<article className="group relative overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
			{/* Avatar */}
			<div className="relative h-48 overflow-hidden bg-gray-50">
				<img
					src={avatar}
					alt={name}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
					style={{ imageRendering: 'pixelated' }}
				/>

	
				{creator.change24h !== undefined && (
					<div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-black/8 bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm">
						<PriceChange change={creator.change24h} />
					</div>
				)}
			</div>

			{/* Body */}
			<div className="p-5">
				<h3 className="truncate font-jakarta text-base font-semibold text-gray-900">
					{name}
				</h3>

				{creator.description && (
					<p className="mt-2 line-clamp-2 font-jakarta text-xs leading-relaxed text-gray-500">
						{creator.description}
					</p>
				)}

				{/* Stats row */}
				<div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
					<div className="flex items-center gap-1.5">
						<img src="/icons/key.svg" alt="" className="size-3.5 opacity-40 invert" />
						<span className="font-jakarta text-sm font-semibold text-gray-900">
							{priceXlm} XLM
						</span>
					</div>
					{creator.creatorShareSupply !== undefined && (
						<div className="flex items-center gap-1.5 text-gray-400">
							<Users className="size-3.5" />
							<span className="font-mono text-[10px]">
								{creator.creatorShareSupply.toLocaleString()}
							</span>
						</div>
					)}
				</div>

				{/* CTA */}
				<Link
					to={`/creator/${creator.id}`}
					className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-gray-200 bg-gray-50 py-2.5 font-mono text-[9px] uppercase tracking-wider text-gray-600 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
				>
					Buy Keys
					<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>
		</article>
	);
}

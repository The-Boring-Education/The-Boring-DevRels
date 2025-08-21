import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { FlexContainer } from "@/components/ui/FlexContainer";
import { Text } from "@/components/ui/Text";
import { LINKS } from "@/config/links";
import { LANDING } from "@/config/landing";

export default function CallToActionSection() {
	const { heading, description, primaryCtaText, secondaryCtaText } = LANDING.cta;
	return (
		<Section className="bg-gradient-to-br from-[#ff5757] to-[#ff6b6b] relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
			</div>

			<div className="max-w-6xl mx-auto relative z-10 text-center">
				<Text level="h2" className="text-3xl md:text-4xl font-bold text-white mb-8">
					{heading}
				</Text>
				<Text level="p" className="text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
					{description}
				</Text>

				<FlexContainer className="mb-10 gap-6 justify-center" direction="col" wrap={false}>
					<Link
						href={LINKS.joinDevRelAdvocate}
						target="_blank"
						className="bg-white text-[#ff5757] hover:bg-gray-100 px-10 py-5 rounded-2xl shadow-xl text-xl font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
					>
						{primaryCtaText}
					</Link>
					<Link
						href={LINKS.viewSessionDetails}
						target="_blank"
						className="text-white underline hover:text-gray-200 transition-colors duration-300 text-xl"
					>
						{secondaryCtaText}
					</Link>
				</FlexContainer>

				<FlexContainer className="gap-6 justify-center" itemCenter wrap>
					<span className="flex items-center gap-2 text-white/90 text-sm">
						<span className="w-3 h-3 bg-green-400 rounded-full" />
						Applications Open
					</span>
					<span className="opacity-40">•</span>
					<span className="flex items-center gap-2 text-white/90 text-sm">
						<span className="w-3 h-3 bg-yellow-400 rounded-full" />
						Rolling Admissions
					</span>
					<span className="opacity-40">•</span>
					<span className="flex items-center gap-2 text-white/90 text-sm">
						<span className="w-3 h-3 bg-blue-400 rounded-full" />
						Start Anytime
					</span>
				</FlexContainer>
			</div>
		</Section>
	);
}


import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { FlexContainer } from "@/components/ui/FlexContainer";
import { Text } from "@/components/ui/Text";
import { LINKS } from "@/config/links";
import { LANDING } from "@/config/landing";

export default function HeroSection() {
	const { title, description, imageSrc, primaryCtaText, secondaryCtaText } = LANDING.hero;
	return (
		<Section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl" />
				<div className="absolute -bottom-24 -left-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl" />
			</div>

			<div className="max-w-6xl mx-auto relative z-10">
				<FlexContainer direction="col" itemCenter className="gap-12 lg:gap-16 lg:flex-row">
					<div className="flex-1 text-center lg:text-left">
						<Text level="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
							{title}
						</Text>
						<Text level="p" className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
							{description}
						</Text>

						<FlexContainer className="mt-8 gap-4 justify-center lg:justify-start" direction="col" wrap={false}>
							<Link
								href={LINKS.joinDevRelAdvocate}
								target="_blank"
								className="bg-[#ff5757] hover:bg-[#ff6b6b] text-white px-8 py-4 rounded-xl shadow-lg shadow-[#ff5757]/25 text-lg font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
							>
								{primaryCtaText}
							</Link>
							<Link
								href={LINKS.viewSessionDetails}
								target="_blank"
								className="text-gray-700 underline hover:text-gray-900 text-center transition-colors duration-300 text-lg"
							>
								{secondaryCtaText}
							</Link>
						</FlexContainer>

						<FlexContainer className="mt-8 gap-6 justify-center lg:justify-start" itemCenter>
							<span className="flex items-center gap-2 text-gray-600 text-sm">
								<span className="w-3 h-3 bg-green-500 rounded-full" />
								Open across colleges in India
							</span>
							<span className="opacity-40 hidden sm:block">•</span>
							<span className="flex items-center gap-2 text-gray-600 text-sm">
								<span className="w-3 h-3 bg-yellow-500 rounded-full" />
								Limited Seats
							</span>
						</FlexContainer>
					</div>

					<div className="flex-1 flex justify-center lg:justify-end">
						<div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl p-6 shadow-2xl relative">
							<Image src={imageSrc} alt="Campus tech vibes" width={500} height={500} className="rounded-xl w-full h-auto" />
							<div className="absolute -bottom-3 -right-3 bg-[#ff5757] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
								🎯 Join Now
							</div>
						</div>
					</div>
				</FlexContainer>
			</div>
		</Section>
	);
}


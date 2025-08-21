import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { LANDING } from "@/config/landing";

export default function PerksSection() {
	const { heading, focusText, items } = LANDING.perks;
	return (
		<Section id="perks" className="bg-gray-50">
			<div className="max-w-6xl mx-auto">
				<SectionHeader heading={heading} focusText={focusText} />

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map((item) => (
						<div
							key={item.perk}
							className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
						>
							<div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xl text-white flex-shrink-0`}>
								{item.icon}
							</div>
							<div className="flex-1">
								<Text level="p" className="text-gray-900 text-lg leading-relaxed font-medium">
									{item.perk}
								</Text>
							</div>
						</div>
					))}
				</div>
			</div>
		</Section>
	);
}


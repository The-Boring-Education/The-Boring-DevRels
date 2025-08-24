import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { LANDING } from "@/config/landing";

export default function LearningJourneySection() {
	const { heading, focusText, stages } = LANDING.journey;
	return (
		<Section className="bg-white">
			<div className="max-w-6xl mx-auto">
				<SectionHeader heading={heading} focusText={focusText} />

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
					{stages.map((item, idx) => (
						<div
							key={item.title}
							className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
						>
							<div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl text-white mb-4`}>
								{item.icon}
							</div>
							<div className="text-sm text-gray-700 mb-3 font-medium">Stage {idx + 1}</div>
							<Text level="h4" className="text-sm font-semibold text-gray-700 leading-tight mb-4">
								{item.title}
							</Text>
							<div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
								<div
									className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
									style={{ width: `${(idx + 1) * 20}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</Section>
	);
}


import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { LANDING } from "@/config/landing";

export default function HiringProcessSection() {
	const { heading, focusText, steps } = LANDING.process;
	return (
		<Section id="process" className="bg-gray-50">
			<div className="max-w-6xl mx-auto">
				<SectionHeader heading={heading} focusText={focusText} />

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{steps.map((s, idx) => (
						<div key={s.step} className="relative flex flex-col items-center text-center">
							{idx < steps.length - 1 && (
								<div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 transform -translate-y-1/2 z-0" />
							)}

							<div className="relative z-10">
								<div className="w-20 h-20 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center font-bold text-indigo-600 shadow-lg text-xl mb-6">
									{s.step}
								</div>

								<div className="text-3xl mb-4">{s.icon}</div>
								<Text level="h3" className="text-xl font-bold text-gray-700 mb-3">
									{s.title}
								</Text>
								<Text level="p" className="text-gray-700 leading-relaxed">
									{s.desc}
								</Text>
							</div>
						</div>
					))}
				</div>

				<div className="lg:hidden mt-8 flex justify-center">
					<div className="flex items-center gap-2 text-gray-700-400">
						<span>↓</span>
						<span>↓</span>
						<span>↓</span>
					</div>
				</div>
			</div>
		</Section>
	);
}


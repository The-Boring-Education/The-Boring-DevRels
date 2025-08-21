import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { LANDING } from "@/config/landing";

export default function AboutSection() {
	const { heading, focusText, features } = LANDING.about;
	return (
		<Section id="about" className="bg-white">
			<div className="max-w-6xl mx-auto">
				<SectionHeader heading={heading} focusText={focusText} />

				<div className="mb-12">
					<Text level="p" className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto" textCenter>
						As a Campus DevRel, you will build a tech and learning community on your campus, host events and workshops, collaborate on hackathons, and learn directly from our mentors. Become a leader who drives innovation and community building at your college.
					</Text>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((item) => (
						<div
							key={item.title}
							className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
						>
							<div className="text-4xl mb-4">{item.icon}</div>
							<Text level="h3" className="text-xl font-semibold text-gray-900 mb-3">
								{item.title}
							</Text>
							<Text level="p" className="text-gray-600 leading-relaxed">
								{item.desc}
							</Text>
						</div>
					))}
				</div>
			</div>
		</Section>
	);
}


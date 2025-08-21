import React from "react";
import { Text } from "@/components/ui/Text";

type SectionHeaderProps = {
	heading: string;
	focusText: string;
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ heading, focusText, headingLevel = 2 }) => (
	<div className="text-center mb-16">
		<Text level={`h${headingLevel}`} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
			{heading}
		</Text>
		<Text level="p" className="text-xl text-gray-600 max-w-3xl mx-auto">
			{focusText}
		</Text>
	</div>
);

export default SectionHeader;


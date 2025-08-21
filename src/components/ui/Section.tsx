import React from "react";

type SectionProps = {
	id?: string;
	className?: string;
	children: React.ReactNode;
};

export const Section: React.FC<SectionProps> = ({ id, className = "", children }) => (
	<section id={id} className={`px-4 md:px-8 py-16 md:py-20 ${className}`}>
		{children}
	</section>
);

export default Section;


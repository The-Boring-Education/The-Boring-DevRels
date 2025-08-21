import React, { JSX } from "react";

type AllowedTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

type TextProps = {
	level: AllowedTags;
	children: React.ReactNode;
	className?: string;
	textCenter?: boolean;
};

export const Text: React.FC<TextProps> = ({ level, children, className = "", textCenter = false }) => {
	const Tag = level as keyof JSX.IntrinsicElements;
	return <Tag className={`${className} ${textCenter ? "text-center" : ""}`}>{children}</Tag>;
};

export default Text;


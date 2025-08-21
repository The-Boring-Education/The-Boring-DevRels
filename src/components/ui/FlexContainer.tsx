import React from "react";

type Direction = "row" | "col";

type FlexContainerProps = {
	children: React.ReactNode;
	direction?: Direction;
	itemCenter?: boolean;
	justifyCenter?: boolean;
	wrap?: boolean;
	className?: string;
};

export const FlexContainer: React.FC<FlexContainerProps> = ({
	children,
	direction = "row",
	itemCenter = false,
	justifyCenter = true,
	wrap = true,
	className = "",
}) => (
	<div
		className={`flex ${direction === "col" ? "flex-col" : "flex-row"} ${itemCenter ? "items-center" : ""} ${
			justifyCenter ? "justify-center" : ""
		} ${wrap ? "flex-wrap" : ""} ${className}`}
	>
		{children}
	</div>
);

export default FlexContainer;


import { clsx } from 'clsx';
import type React from 'react';

type CardProps = {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
	neonBorder?: boolean;
};

export const Card: React.FC<CardProps> = ({
	children,
	className,
	hover = true,
	neonBorder = false,
}) => {
	return (
		<div
			className={clsx(
				'rounded-lg bg-black/50 p-6',
				hover && 'card-hover',
				neonBorder && 'neon-border',
				className
			)}
		>
			{children}
		</div>
	);
};

import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import type React from 'react';

type ButtonProps = {
	variant?: 'primary' | 'secondary' | 'outline';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
	icon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
	children,
	className,
	variant = 'primary',
	size = 'md',
	loading = false,
	icon,
	disabled,
	...props
}) => {
	const baseStyles =
		'font-orbitron font-bold transition-all duration-300 flex items-center justify-center gap-2';

	const variants = {
		primary: 'cyber-button',
		secondary: 'bg-purple-600 text-white hover:bg-purple-700 rounded-md',
		outline:
			'border-2 border-gray-400 text-gray-400 hover:border-gray-300 hover:text-gray-300 rounded-md',
	};

	const sizes = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg',
	};

	return (
		<button
			className={clsx(
				baseStyles,
				variants[variant],
				sizes[size],
				loading && 'cursor-not-allowed opacity-70',
				disabled && 'cursor-not-allowed opacity-50',
				className
			)}
			disabled={loading || disabled}
			{...props}
		>
			{loading ? (
				<Loader2 className="h-5 w-5 animate-spin" />
			) : (
				<>
					{icon}
					{children}
				</>
			)}
		</button>
	);
};

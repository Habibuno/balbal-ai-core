/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				orbitron: ['Orbitron', 'sans-serif'],
				rajdhani: ['Rajdhani', 'sans-serif'],
				tech: ['Share Tech Mono', 'monospace'],
			},
			typography: {
				DEFAULT: {
					css: {
						color: '#fff',
						a: {
							color: '#60a5fa',
							'&:hover': {
								color: '#93c5fd',
							},
						},
						h1: {
							color: '#fff',
						},
						h2: {
							color: '#fff',
						},
						h3: {
							color: '#fff',
						},
						h4: {
							color: '#fff',
						},
						strong: {
							color: '#fff',
						},
						code: {
							color: '#fff',
						},
						blockquote: {
							color: '#9ca3af',
						},
					},
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};

type EnvConfig = {
	smtp: {
		host: string;
		port: number;
		user: string;
		pass: string;
	};
	reporting: {
		recipient: string;
	};
	environment: 'development' | 'production';
};

export const env: EnvConfig = {
	smtp: {
		host: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
		port: Number.parseInt(import.meta.env.VITE_SMTP_PORT || '587', 10),
		user: import.meta.env.VITE_SMTP_USER || '',
		pass: import.meta.env.VITE_SMTP_PASS || '',
	},
	reporting: {
		recipient: import.meta.env.VITE_REPORT_RECIPIENT || '',
	},
	environment: (import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'production',
};
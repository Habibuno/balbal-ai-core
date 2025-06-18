type EnvConfig = {
	smtp: {
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
		user: import.meta.env.VITE_SMTP_USER || '',
		pass: import.meta.env.VITE_SMTP_PASS || '',
	},
	reporting: {
		recipient: import.meta.env.VITE_REPORT_RECIPIENT || '',
	},
	environment: (import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'production',
};
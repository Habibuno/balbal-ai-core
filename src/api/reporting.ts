const baseUrl = import.meta.env.VITE_APP_ENV === 'production'
	? '/.netlify/functions'
	: import.meta.env.VITE_APP_NETLIFY === 'true'
		? `${import.meta.env.VITE_API_BASE_URL}/.netlify/functions`
		: `${import.meta.env.VITE_API_BASE_URL}/api`;

type ErrorContext = {
	component?: string;
	action?: string;
	userInfo?: Record<string, string | number | boolean | null>;
	additionalData?: Record<string, string | number | boolean | null | unknown[]>;
};

export async function sendErrorReport(error: Error, context?: ErrorContext): Promise<void> {
	const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

	try {
		const response = await fetch(`${baseUrl}/report-error`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Request-ID': requestId,
			},
			body: JSON.stringify({
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack,
				},
				context,
				requestId,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Failed to send error report');
		}
	} catch (error) {
		console.error('Failed to send error report:', error);
		throw error;
	}
}
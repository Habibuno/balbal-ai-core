type ErrorReport = {
	error: {
		name: string;
		message: string;
		stack?: string;
	};
	context?: {
		component?: string;
		action?: string;
		userInfo?: Record<string, unknown>;
		additionalData?: Record<string, unknown>;
	};
};

export async function sendErrorReport(report: ErrorReport): Promise<void> {
	try {
		const url = `${window.location.origin}/api/report-error`;

		console.log('Sending error report to:', url);
		console.log('Report data:', report);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(report),
		});

		console.log('Response status:', response.status);
		console.log('Response headers:', Object.fromEntries(response.headers.entries()));

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Failed to send error report: ${response.statusText} - ${errorText}`);
		}

		const result = await response.json();
		console.log('Success response:', result);
	} catch (error) {
		console.error('Failed to send error report:', error);
		throw error;
	}
}
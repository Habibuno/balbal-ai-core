import React, { useEffect, useRef } from 'react';

type Props = {
	messages: string[];
};

export const Terminal: React.FC<Props> = ({ messages }) => {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className="h-[calc(100%-36px)] space-y-1 overflow-y-auto p-4 font-mono text-sm">
			{messages.map((message, index) => (
				<div key={index} className="text-gray-300">
					{message}
				</div>
			))}
			<div ref={bottomRef} />
		</div>
	);
};

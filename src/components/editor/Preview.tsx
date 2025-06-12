type PreviewProps = {
	previewHtml: string;
};

export const Preview: React.FC<PreviewProps> = ({ previewHtml }) => {
	return (
		<div className="flex h-full flex-col items-center justify-center bg-[#111] p-4">
			<div className="h-[640px] w-[360px] overflow-hidden rounded-[2rem] border-8 border-gray-800 bg-black shadow-xl">
				<div className="relative h-6 bg-black">
					<div className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-black" />
				</div>
				<iframe
					srcDoc={previewHtml}
					sandbox="allow-scripts"
					title="preview"
					className="h-full w-full"
				/>

				<div className="flex h-2 items-center justify-center">
					<div className="h-1 w-20 rounded-full bg-gray-700" />
				</div>
			</div>
		</div>
	);
};
import React from 'react';

type Props = {
	code: string;
};

export const MobilePreview: React.FC<Props> = ({ code }) => {
	const iframeContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
        background: linear-gradient(to bottom, #1f1f1f, #111);
      }
      #root:empty {
        display: none;
      }
      #root:empty + .placeholder {
        display: flex;
      }
      .placeholder {
        display: none;
        position: fixed;
        inset: 0;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.01em;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <div class="placeholder">
      Powered by BalBal.io
    </div>
    <script type="text/babel">
      ${code}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(React.StrictMode, null,
        React.createElement(App)
      ));
    </script>
  </body>
</html>`;

	return (
		<div className="relative h-[640px] w-[320px] overflow-hidden rounded-[40px] border-8 border-gray-800 bg-black shadow-2xl">
			<div className="absolute left-1/2 top-0 z-20 flex h-6 w-32 -translate-x-1/2 transform items-center justify-center rounded-b-2xl bg-black">
				<div className="h-3 w-16 rounded-full bg-gray-900"></div>
			</div>

			<div className="h-full w-full overflow-hidden bg-gradient-to-b from-[#1f1f1f] to-[#111]">
				<iframe
					srcDoc={iframeContent}
					className="h-full w-full"
					sandbox="allow-scripts"
					title="preview"
				/>
			</div>

			<div className="absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 transform rounded-full bg-gray-700"></div>
		</div>
	);
};

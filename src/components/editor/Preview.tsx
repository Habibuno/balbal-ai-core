import { Maximize2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface PreviewProps {
  files: Record<string, string>;
}

export const Preview: React.FC<PreviewProps> = ({ files }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#111] p-4">
      <div className="mb-4 flex w-full justify-end">
        <Button variant="outline" size="sm" icon={<Maximize2 className="h-4 w-4" />}>
          Plein écran
        </Button>
      </div>
      <div className="h-[640px] w-[360px] overflow-hidden rounded-[2rem] border-8 border-gray-800 bg-black shadow-xl">
        <div className="relative h-6 bg-black">
          <div className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-black" />
        </div>
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script src="https://unpkg.com/@react-navigation/native@6.1.9/dist/index.umd.js"></script>
                <script src="https://unpkg.com/@react-navigation/stack@6.3.20/dist/index.umd.js"></script>
                <style>
                  body { margin: 0; padding: 0; }
                  #root { min-height: 100vh; }
                </style>
              </head>
              <body>
                <div id="root"></div>
                <script type="text/babel">
                  // Mock React Navigation
                  const NavigationContainer = ({ children }) => children;
                  const createStackNavigator = () => ({
                    Navigator: ({ children }) => children,
                    Screen: ({ component: Component }) => <Component />
                  });

                  ${files['src/App.tsx']
                    .replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
                    .replace(/export\s+default\s+const\s+(\w+)/, 'const $1')
                    .replace(/export\s+default\s+(\w+)/, 'const $1')}
                  
                  // Render the app
                  const root = document.getElementById('root');
                  ReactDOM.createRoot(root).render(React.createElement(App));
                </script>
              </body>
            </html>
          `}
          className="h-[calc(100%-2rem)] w-full bg-white"
          sandbox="allow-scripts"
          title="preview"
        />
        <div className="flex h-2 items-center justify-center">
          <div className="h-1 w-20 rounded-full bg-gray-700" />
        </div>
      </div>
    </div>
  );
}; 
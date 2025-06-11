# Balbal.io

A modern web application built with React, Vite, and TypeScript.

## 🚀 Features

- Modern and reactive user interface
- Multi-language support with i18next
- Dark/light theme
- Performance optimized
- Enhanced security
- PWA support

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🛠 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/balbal.io.git
   cd balbal.io
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=your_api_url
   ```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Building

To build the application for production:

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code with ESLint
- `npm run format` - Format code with Prettier
- `npm run security:check` - Check for security vulnerabilities
- `npm run quality` - Run all quality checks

## 🔒 Security

The application implements several security measures:

- Content Security Policy (CSP)
- XSS protection
- Clickjacking protection
- Strict referrer policy
- MIME type sniffing protection
- Restrictive permissions policy

## 🌐 Internationalization

The application supports multiple languages using i18next. Translations are stored in the `src/locales/` directory.

## 🎨 Theme

The application uses Tailwind CSS for styling and supports dark/light theme.

## 📱 PWA

The application is configured as a Progressive Web App (PWA) with:

- Offline installation
- Push notifications
- Automatic updates

## 📊 Code Analysis (Optional)

The project includes optional configuration for code analysis with SonarQube. To use it:

1. Install SonarQube locally on your machine
2. Configure settings in `sonar-project.properties`
3. Run the analysis:

```bash
npm run sonar
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 📞 Support

For any questions or issues, please open an issue on GitHub.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [i18next](https://www.i18next.com/)

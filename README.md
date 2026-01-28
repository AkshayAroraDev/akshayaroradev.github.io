# Portfolio Application

A modern, responsive portfolio website built with Angular 21, featuring dynamic theming, interactive animations, and a comprehensive showcase of professional experience and projects.

## 🌟 Live Demo

[View Live Portfolio](https://akshayaroradev.github.io/)

## ✨ Features

### Core Functionality
- **Dynamic Theme System**: Real-time theme switching with multiple color schemes (Blue, Purple, Teal, Orange, Green)
- **Responsive Design**: Fully responsive layout optimized for desktop, tablet, and mobile devices
- **Interactive Animations**: Smooth GSAP-powered animations and transitions
- **Project Showcase**: Modal-based project viewer with detailed information and images
- **Skills Visualization**: Interactive skill clusters with hover effects and visual hierarchy
- **Timeline Component**: Custom-built professional experience timeline
- **Contact Integration**: Social media links and professional contact information

### Advanced Features
- **Proximity Magnify Effect**: Interactive hover magnification on skill items
- **Scroll-to-Top Button**: Smooth scroll navigation with fade-in/fade-out animations
- **Connection Beam Effects**: Visual connection animations using @omnedia components
- **Typewriter Effect**: Animated text display for hero section
- **Theme Persistence**: User's theme preference saved in localStorage
- **JSON-Driven Content**: Easy content management through JSON configuration files

## 🛠️ Tech Stack

### Frontend Framework
- **Angular 21** - Latest version with standalone components
- **TypeScript 5.9** - Strongly typed JavaScript
- **SCSS** - Advanced styling with CSS variables

### UI Libraries & Animation
- **Angular Material 21** - Material Design components
- **Angular CDK** - Component Dev Kit for advanced interactions
- **GSAP 3.14** - Professional-grade animation library
- **@omnedia Components** - Specialized UI effects (connection beam, dot pattern, tracing beam, typewriter, split text)

### State Management & Utilities
- **RxJS 7.8** - Reactive programming with observables
- **Custom Services** - Theme management and application state

### Development Tools
- **Angular CLI 21** - Project scaffolding and build tools
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking and transpilation

### Deployment
- **angular-cli-ghpages** - GitHub Pages deployment automation

## 📁 Project Structure

```
portfolio-app/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── app-hero/        # Hero section with typewriter effect
│   │   │   ├── app-projects/    # Projects showcase
│   │   │   ├── app-skills/      # Skills visualization
│   │   │   ├── app-toolbar/     # Navigation with theme switcher
│   │   │   ├── app-footer/      # Footer with social links
│   │   │   └── ...              # Other components
│   │   ├── services/            # Application services
│   │   │   └── theme.service.ts # Theme management
│   │   ├── constants/           # Theme definitions and constants
│   │   │   └── themes.ts        # Theme color configurations
│   │   ├── models/              # TypeScript interfaces and data models
│   │   ├── directives/          # Custom Angular directives
│   │   └── utils/               # Utility functions (color manipulation)
│   ├── json/                    # Content configuration files
│   │   ├── hero.json           # Hero section content
│   │   ├── projects.json       # Projects data
│   │   ├── skills.json         # Skills information
│   │   ├── timeline.json       # Professional experience
│   │   └── ...
│   ├── styles/                  # Global styles
│   └── styles.scss             # Main stylesheet
├── public/assets/               # Static assets
│   ├── docs/                   # Documents (resume, etc.)
│   ├── icons/                  # Icon assets
│   └── projects/               # Project images and demos
└── docs/                        # Documentation files
    ├── DEVELOPER_ONBOARDING.md
    ├── SCALABLE_THEME_SYSTEM.md
    ├── THEMING_GUIDE.md
    └── ...
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v11.6.2 or higher (specified in package.json)
- **Angular CLI**: v21 (installed globally or via npx)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

4. **Open in browser**
   ```
   Navigate to http://localhost:4200/
   ```

The application will automatically reload when you make changes to the source files.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on http://localhost:4200 |
| `npm run build` | Build the project for production |
| `npm run watch` | Build in development mode with file watching |
| `npm test` | Run unit tests with Karma |
| `npm run deploy` | Build and deploy to GitHub Pages |

## 🎨 Theme System

The portfolio features a sophisticated theme system with real-time switching capabilities:

### Available Themes
- **Blue** - Professional and trustworthy (#3b82f6)
- **Purple** - Creative and innovative (#8b5cf6)
- **Teal** - Modern and balanced (#14b8a6)
- **Orange** - Energetic and warm (#f59e0b)
- **Green** - Natural and growth-oriented (#10b981)

### Theme Architecture
- **CSS Variables**: All colors use CSS custom properties for dynamic updating
- **RGB Support**: Themes include RGB variants for alpha transparency
- **LocalStorage Persistence**: User theme preference saved across sessions
- **Service-Based**: Centralized theme management via `ThemeService`

### Adding a New Theme
1. Edit `src/app/constants/themes.ts`
2. Add new theme configuration with primary and secondary colors
3. Theme automatically appears in the toolbar switcher

For detailed documentation, see:
- [SCALABLE_THEME_SYSTEM.md](SCALABLE_THEME_SYSTEM.md)
- [DEVELOPER_ONBOARDING.md](DEVELOPER_ONBOARDING.md)
- [THEMING_GUIDE.md](THEMING_GUIDE.md)

## 🎯 Content Management

All content is managed through JSON files in `src/json/`:

- **hero.json** - Hero section content (subtitle, description)
- **projects.json** - Project details, technologies, highlights
- **skills.json** - Skill categories and items
- **timeline.json** - Professional experience timeline
- **toolbar.json** - Navigation and branding
- **footer.json** - Social links and contact info

Simply edit these files to update portfolio content without modifying components.

## 🧪 Testing

The project uses Angular's testing infrastructure:

```bash
npm test
```

Tests are located alongside component files with `.spec.ts` extension.

## 📦 Building for Production

Create an optimized production build:

```bash
npm run build
```

Build artifacts will be stored in the `dist/portfolio-app/browser/` directory.

### Production Optimizations
- Ahead-of-Time (AOT) compilation
- Tree shaking for smaller bundle sizes
- Minification and uglification
- Asset optimization

## 🚢 Deployment

### GitHub Pages

The project includes automatic GitHub Pages deployment:

```bash
npm run deploy
```

This command:
1. Builds the project with production configuration
2. Deploys to GitHub Pages using `angular-cli-ghpages`
3. Pushes to the `master` branch

For more details, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📚 Documentation

Comprehensive documentation is available in the repository:

### Development Guides
- **[DEVELOPER_ONBOARDING.md](DEVELOPER_ONBOARDING.md)** - Onboarding checklist for new contributors
- **[SCALABLE_THEME_SYSTEM.md](SCALABLE_THEME_SYSTEM.md)** - Complete theme architecture overview
- **[THEMING_GUIDE.md](THEMING_GUIDE.md)** - Detailed theming instructions
- **[THEME_QUICK_REFERENCE.md](THEME_QUICK_REFERENCE.md)** - Quick lookup for theme usage

### Additional Resources
- Theme refactoring summaries and implementation notes
- Background variations documentation
- Visual system summaries

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Use CSS variables for colors (never hardcode hex values)
- Test theme switching with all changes
- Update relevant documentation
- Write meaningful commit messages

## 📝 Code Style

The project uses Prettier for code formatting:

- **Print Width**: 100 characters
- **Single Quotes**: Enabled
- **Angular HTML Parser**: For .html files

Format code automatically on save or run manually:
```bash
npx prettier --write .
```

## 🐛 Known Issues

- None at this time

## 📄 License

This project is private and proprietary.

## 👤 Author

**Senior Frontend Engineer**
- 8+ years of experience with Angular and TypeScript
- Specializes in scalable, high-performance web applications

## 🙏 Acknowledgments

- **Angular Team** - For the amazing framework
- **@omnedia** - For specialized animation components
- **GreenSock (GSAP)** - For powerful animation capabilities
- **Material Design** - For UI component library

---

**Note**: This is a personal portfolio project showcasing professional experience and technical skills. For content updates, edit the JSON files in `src/json/`. For theme customization, refer to the theme documentation files.

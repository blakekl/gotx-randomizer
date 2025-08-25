# 🎮 GotX Randomizer

> **A comprehensive web application for exploring and randomizing games from the Retro Handhelds Discord community's "Game of the X" programs.**

[![Live Application](https://img.shields.io/badge/🌐_Live_App-gotx.retrohandhelds.gg-blue?style=for-the-badge)](https://gotx.retrohandhelds.gg)
[![Tests](https://img.shields.io/badge/Tests-479%2F479_Passing-brightgreen?style=for-the-badge)](#testing)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript)](#tech-stack)

---

## 🌟 **What is GotX Randomizer?**

The **GotX Randomizer** is your gateway to discovering games from the Retro Handhelds community's gaming programs. Whether you're looking for a random game to play or want to explore the rich history of community nominations and winners, this application has you covered.

### **🎯 Core Features**

- **🎲 Game Randomizer** - Get random games from various GotX programs with customizable filters
- **🏆 Theme Browser** - Explore the complete history of GotX themes across all programs
- **📊 Statistics Dashboard** - Detailed analytics on nominations, completions, and trends
- **🔍 Game Database** - Search and browse the entire collection of featured games
- **👥 User Profiles** - Track individual user nominations, wins, and completions

---

## 🏆 **Supported GotX Programs**

### **Game of the Month (GotM)**

Monthly themed competitions with year-based categories (Pre-96, 96-99, 2000+)

- **Multiple winners per theme** based on release year categories
- **Rich nomination history** with detailed breakdowns

### **Retrobit**

Curated selection of standout retro games

- **Single winner per theme** showcasing exceptional retro titles
- **Focused curation** highlighting gaming gems

### **RPG Program**

Dedicated role-playing game themes and competitions

- **RPG-specific categories** with specialized filtering
- **Enhanced completion tracking** with RetroAchievements integration

### **Game of the Year (GotY)**

Annual awards celebrating the best games across multiple categories

- **Multiple award categories** (Best Platformer, Best RPG, etc.)
- **Year-based organization** with comprehensive winner showcases

### **Game of the Week of the Year (GotWotY)**

Special annual recognition for weekly standouts

- **Annual compilation** of weekly highlights
- **Community celebration** of consistent excellence

---

## 🚀 **Key Features & Capabilities**

### **🎲 Smart Randomization**

- **Multi-program filtering** - Include/exclude specific GotX programs
- **Time-to-beat filtering** - Find games that fit your schedule
- **Hidden game management** - Customize your randomization pool
- **Instant results** with detailed game information

### **🏆 Comprehensive Theme Browser**

- **Complete theme history** across all GotX programs
- **Interactive game details** - Click any game for full information
- **Responsive design** - Perfect on desktop and mobile

### **📊 Rich Analytics**

- **Nomination trends** over time
- **User success rates** and participation metrics
- **Game popularity** and completion statistics
- **Interactive charts** with detailed breakdowns

### **🔍 Advanced Search & Discovery**

- **Full-text game search** across all titles and metadata
- **User profile exploration** with detailed statistics
- **Game detail modals** with comprehensive information
- **Cross-referenced data** linking games, users, and themes

---

## 🛠️ **Tech Stack**

### **Frontend**

- **⚛️ React 18** with TypeScript for type-safe development
- **🎨 Bulma CSS** for responsive, modern UI components
- **📱 Mobile-first design** with responsive breakpoints
- **🔄 MobX** for reactive state management

### **Data & Performance**

- **🗄️ SQLite** database with 2.7MB of community data
- **⚡ sql.js** for client-side database operations
- **🚀 Vite** for lightning-fast development and builds
- **📦 Asset optimization** with content hashing

### **Quality & Testing**

- **🧪 Vitest** testing framework with 479 passing tests
- **🎯 100% TypeScript** coverage for type safety
- **🔍 ESLint + Prettier** for code quality and consistency
- **🪝 Husky** for pre-commit hooks and quality gates

### **Deployment & CI/CD**

- **🌐 Automated deployments** with database synchronization
- **📈 Performance monitoring** and optimization
- **🔄 15-minute update cycles** for fresh community data

---

## 🏗️ **Project Architecture**

### **📁 Directory Structure**

```
src/
├── components/          # Reusable UI components
├── data/               # Database queries and initialization
├── models/             # TypeScript interfaces and DTOs
├── pages/              # Route-based page components
│   ├── Randomizer/     # Game randomization features
│   ├── Themes/         # Theme browser and details
│   ├── Statistics/     # Analytics and charts
│   ├── Games/          # Game search and details
│   └── Users/          # User profiles and stats
├── stores/             # MobX state management
└── __tests__/          # Comprehensive test suite
```

### **🔄 Data Flow**

1. **SQLite Database** → Client-side sql.js processing
2. **MobX Stores** → Reactive state management
3. **React Components** → Type-safe UI rendering
4. **Responsive Design** → Cross-device compatibility

---

## 🚀 **Getting Started**

### **Prerequisites**

- **Node.js 18+** (see `.nvmrc` for exact version)
- **npm** or **yarn** package manager

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-username/gotx-randomizer.git
cd gotx-randomizer

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run test suite (479 tests)
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run prettier     # Format code with Prettier
```

---

## 🧪 **Testing**

The project maintains **100% test coverage** with **479 passing tests** across:

- **✅ Unit Tests** - Individual component and function testing
- **✅ Integration Tests** - Page-level workflow testing
- **✅ Database Tests** - Query validation and data integrity
- **✅ UI Tests** - User interaction and accessibility testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

---

## 📚 **Documentation**

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **📖 [Project Context](./docs/project-context.md)** - Overview, architecture, and GotX programs
- **🎯 [Theme Browser](./docs/theme-browser-progress.md)** - Complete feature documentation
- **🗄️ [Database Schema](./docs/database-schema.md)** - Data structure and relationships
- **🔧 [Codebase Patterns](./docs/codebase-patterns.md)** - Development guidelines and best practices

---

## 🤝 **Contributing**

We welcome contributions to improve the GotX Randomizer! Here's how to get started:

### **Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** the existing code patterns and TypeScript conventions
4. **Add tests** for new functionality (maintain 100% coverage)
5. **Run** the full test suite (`npm test`)
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to your branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### **Code Quality Standards**

- **TypeScript** - All code must be properly typed
- **Testing** - New features require corresponding tests
- **Linting** - Code must pass ESLint and Prettier checks
- **Documentation** - Update relevant docs for significant changes

### **Areas for Contribution**

- **🎨 UI/UX improvements** - Enhanced user experience
- **📊 New analytics** - Additional statistics and insights
- **🔍 Search enhancements** - Improved discovery features
- **📱 Mobile optimization** - Better mobile experience
- **♿ Accessibility** - Improved accessibility features

---

## 📈 **Performance**

- **⚡ Fast initial load** - Optimized asset delivery
- **🗄️ Efficient data processing** - Client-side SQLite operations
- **📱 Responsive design** - Smooth experience across devices
- **🔄 Smart caching** - Optimized for repeat visits

---

## 🎯 **Roadmap**

### **Upcoming Features**

- **🔄 Progressive loading** - Improved initial page performance
- **📱 PWA support** - Offline functionality and app-like experience
- **🔍 Enhanced search** - More powerful filtering and discovery
- **📊 Advanced analytics** - Deeper insights and trends

### **Future Enhancements**

- **🌐 Backend API** - Migration from SQLite to full backend
- **👥 User authentication** - Personalized experiences
- **🏆 Achievement system** - Gamification features
- **📱 Mobile app** - Native mobile applications

---

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 **Acknowledgments**

- **🎮 Retro Handhelds Discord Community** - For the amazing GotX programs
- **⚛️ React Team** - For the excellent framework
- **🎨 Bulma** - For the beautiful CSS framework
- **🧪 Vitest Team** - For the fantastic testing experience

---

## 📞 **Support & Contact**

- **🌐 Live Application:** [gotx.retrohandhelds.gg](https://gotx.retrohandhelds.gg)
- **📚 Documentation:** [docs/](./docs/)
- **🐛 Issues:** [GitHub Issues](https://github.com/your-username/gotx-randomizer/issues)
- **💬 Community:** [Retro Handhelds Discord](https://discord.gg/retrohandhelds)

---

<div align="center">

**Made with ❤️ for the Retro Handhelds community**

[![Retro Handhelds](https://img.shields.io/badge/Retro_Handhelds-Community_Project-orange?style=for-the-badge)](https://retrohandhelds.gg)

</div>

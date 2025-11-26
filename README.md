# GitLog AI Reporter

A desktop application built with Tauri (Rust backend) + React (TypeScript frontend) that analyzes Git repositories and generates weekly/monthly reports using LLMs (OpenAI/DeepSeek/local models).

## Status

✅ **M1 (Project Skeleton) - Completed and Reviewed**

All M1 review feedback has been addressed:
- ✅ Rust-TypeScript data model alignment with serde rename
- ✅ All commands have minimal mock implementations
- ✅ Frontend skeleton fully wired (Zustand + hooks + components)
- ✅ Tauri permissions and dialog plugin configured
- ✅ Dependencies aligned (Zustand, Tailwind, lazy_static)

See [M1_REVIEW_FIXES.md](M1_REVIEW_FIXES.md) for details.

## Prerequisites

- Node.js 20+ and npm
- Rust 1.70+ (install from https://rustup.rs/)
- Platform-specific dependencies:
  - **Ubuntu**: `sudo apt-get install libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run tauri dev
```

## Project Structure

```
gitlog-ai-reporter/
├── src/                      # Frontend (React + TypeScript)
│   ├── components/          # UI components
│   │   ├── RepoSelector/
│   │   ├── CommitList/
│   │   ├── ReportViewer/
│   │   └── Settings/
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── src-tauri/              # Backend (Rust + Tauri)
│   ├── src/
│   │   ├── commands/       # Tauri command handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   └── utils/          # Utility functions
│   └── Cargo.toml
└── .github/workflows/      # CI/CD workflows
```

## Available Scripts

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Backend

- `cd src-tauri && cargo fmt` - Format Rust code
- `cd src-tauri && cargo clippy` - Run Clippy linter
- `cd src-tauri && cargo test` - Run tests

### Build

- `npm run tauri build` - Build production app for current platform

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Documentation

- Architecture: See `../CLAUDE.md` and `../skelet.md`
- Implementation Plan: See `../Plan.md`

## License

TBD


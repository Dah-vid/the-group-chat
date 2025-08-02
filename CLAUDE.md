# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application called "ai-study-buddies" bootstrapped with Create React App. The project is currently in its initial state with the default CRA setup.

## Development Commands

- `npm start` - Run development server (opens at http://localhost:3000)
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Build for production (outputs to `build/` folder)
- `npm run eject` - Eject from CRA (one-way operation, not recommended)

## Architecture

- **Framework**: React 19.1.1 with React DOM
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with react-app configuration
- **Entry Point**: `src/index.js` renders `App` component into `public/index.html`
- **Main Component**: `src/App.js` contains the root application component

## Testing Setup

- Tests use Jest and React Testing Library
- Test files should follow the pattern `*.test.js` or be placed in `__tests__/` folders
- Run `npm test` for interactive test runner with watch mode
- Testing utilities available: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

## Code Style

- ESLint configuration extends `react-app` and `react-app/jest`
- No additional linting or formatting tools configured beyond CRA defaults
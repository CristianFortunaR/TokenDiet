# Contributing to Token Diet

First off, thank you for considering contributing to Token Diet! It's people like you that make open-source tools robust, efficient, and accessible.

This document serves as a set of guidelines for contributing to the repository.

## Getting Started

To get a local development environment up and running:

1. **Fork the Repository**: Click the 'Fork' button at the top right of this page.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/CristianFortunaR/TokenDiet.git
   cd TokenDiet
   ```
3. **Install Dependencies**: We use standard NPM for package management.
   ```bash
   npm install
   ```
4. **Run the Dev Server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy
- `main`: The stable release branch.
- Creating a feature branch: Create a branch from `main` using a descriptive name.
  - Examples: `feat/add-gemini-provider`, `fix/diff-view-bug`, `docs/update-readme`

### Commit Messages
We encourage clean, descriptive commit messages to keep the history readable. 
A good commit message looks like: `feat(optimizer): add support for Google Gemini API`

## How You Can Contribute

### 1. Adding New LLM Providers
One of the best ways to contribute is by adding new AI providers to the "Smart Optimize" engine (e.g., Google Gemini, Cohere, Groq).
- You'll need to update the `provider` state and the dropdown in `src/App.tsx`.
- Add the corresponding fetch logic in `src/utils/optimizer.ts`.
- Be sure to utilize the robust `OptimizerError` class for error handling.

### 2. Improving the Regex Diet
The "Quick Diet" engine uses basic Regex to strip polite filler words. If you find edge cases or can make the regex more efficient, updates to `quickDiet` in `src/utils/optimizer.ts` are highly welcome!

### 3. UI/UX Refinements
Token Diet uses vanilla CSS and a glassmorphic aesthetic. If you're a designer or frontend engineer, feel free to propose animations, responsive fixes, or dark mode enhancements.

## Pull Request Process

1. Ensure your code follows the existing TypeScript styles and doesn't throw errors (`npm run build`).
2. Update the `README.md` with details of changes to the interface or new environment variables if applicable.
3. Open a Pull Request against the `main` branch.
4. Describe your changes clearly in the PR description, including what issue it solves and how you tested it.

## Found a Bug?

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our GitHub Repository. Even better, you can submit a Pull Request with a fix!

---

*Thank you for helping me put prompts on a diet!*

# Token Diet

Token Diet is a high-performance, local-first React application engineered to explore the intersection of prompt efficiency and LLM cost management. Built as a proof-of-concept for production-grade prompt engineering tools, it demonstrates full-stack expertise in API orchestration, client-side state management, and real-time data visualization.

This project was developed to address the "tokenmaxxing" phenomenon, providing a transparent, privacy-first alternative to bloated autonomous agent workflows. It serves as a technical showcase for handling complex LLM interactions with minimal infrastructure overhead.

<img width="1514" height="801" alt="Captura de Tela 2026-05-18 às 22 17 16" src="https://github.com/user-attachments/assets/ddf2805e-e28e-4e68-abba-2171528bc48a" />

## Key Features

- **Quick Diet (Regex):** Instantly strips common polite filler words ("please", "could you", "if you don't mind") and collapses redundant whitespace/newlines without any API calls.
- **Smart Optimize:** Uses AI to rewrite your prompt into a concise, high-density instruction format. Supports OpenAI, Anthropic, and Local Ollama models.
- **Technical Mode:** A toggle that ensures JSON structures, Markdown tables, and complex formatting are preserved exactly as-is during AI optimization.
- **Diff View:** Visually compare your original prompt with the optimized prompt to see exactly what was removed (red highlights) and added (green highlights).
- **Benchmark Suite:** Run your prompt (or a standardized prompt) across all your configured LLM providers simultaneously to compare latency, token usage, and net savings.

## Technical Journey & Learnings
This project was built to test several advanced development concepts in a real-world scenario:

Privacy-First Architecture: Implemented a "Bring Your Own Key" (BYOK) pattern to handle sensitive credentials entirely on the client side, ensuring zero-knowledge privacy.

API Abstraction: Designed a modular wrapper for OpenAI, Anthropic, and local Ollama providers, allowing for extensible multi-LLM support.

Latency & Token Profiling: Integrated tiktoken for real-time token counting and performance benchmarking to help users quantify the ROI of their prompt optimizations.

Complex State Visualization: Engineered custom components (like the DiffView) to provide immediate feedback on LLM-driven text transformation.

## 🛠 Tech Stack & Architecture Decisions

Token Diet was deliberately built with a lightweight, local-first stack that prioritizes speed, security, and a premium developer experience.

- **React 18 & Vite**: Chosen for a highly reactive, component-based UI paired with lightning-fast Hot Module Replacement (HMR). Vite's optimized build pipeline keeps the app's footprint small and loading times minimal.
- **TypeScript**: Enforces strict typing (like `OptimizerSettings` and `OptimizerError`), drastically reducing runtime errors across multiple third-party API interactions and configuration states.
- **Vanilla CSS (Glassmorphism)**: We avoided heavy utility frameworks (like Tailwind) or component libraries (like Material UI). Instead, we wrote custom CSS utilizing modern CSS variables and glassmorphic techniques (backdrop filters, subtle borders) to achieve a uniquely high-end, futuristic "diet" interface.
- **`gpt-tokenizer` (tiktoken)**: Embedded directly into the client. By performing BPE (Byte-Pair Encoding) token estimation directly in the browser, users get instantaneous token counts as they type, eliminating the need for constant, laggy server round-trips.
- **`diff` library**: Essential for the DiffView. It provides exact character/word-level textual comparisons. This turns a "black box" AI transformation into a highly transparent process, highlighting exactly what conversational filler was removed.
- **Lucide React**: Integrated for crisp, scalable, modern SVG icons that match the premium aesthetic without the bloat of traditional icon fonts.
- **Zero-Backend / BYOK Model**: The entire application runs statically. By using a "Bring Your Own Key" (BYOK) model, your API keys (OpenAI, Anthropic) are saved exclusively to your browser's `localStorage`. This guarantees 100% privacy and zero server costs.

## Running Locally

Token Diet is built with Vite, React, and TypeScript. 

1. **Clone the repository** and navigate into the directory:
   ```bash
   cd TokenDiet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## Using Local Ollama (Important Note on CORS)

Token Diet supports running optimizations completely offline using a local [Ollama](https://ollama.com/) instance.

By default, Token Diet expects Ollama to be running on `http://localhost:11434`. However, because Token Diet runs in the browser, **you must enable CORS in Ollama** to allow the frontend to communicate with the local API. If you don't do this, you will see a `NETWORK_ERROR`.

### How to Enable CORS for Ollama:

**On macOS:**
1. Open your Terminal.
2. Set the environment variable and start the Ollama server:
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
   *(Alternatively, if running the Ollama app, you can use `launchctl setenv OLLAMA_ORIGINS "*"` and restart the app).*

**On Linux:**
1. Edit the systemd service file:
   ```bash
   sudo systemctl edit ollama.service
   ```
2. Under `[Service]`, add the environment variable:
   ```ini
   [Service]
   Environment="OLLAMA_ORIGINS=*"
   ```
3. Reload systemd and restart Ollama:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart ollama
   ```

**On Windows:**
1. Open Command Prompt or PowerShell.
2. Set the environment variable:
   ```cmd
   setx OLLAMA_ORIGINS "*"
   ```
3. Restart the Ollama application.

Once Ollama is running with CORS enabled, ensure you have the `llama3` model pulled (`ollama run llama3`), and Token Diet will automatically connect!

---

## Security & BYOK (Bring Your Own Key)

Token Diet is a strictly **local-first** application. 
- API keys (OpenAI, Anthropic) are saved exclusively to your browser's `localStorage`.
- There is no backend server or database storing your credentials.
- The project's `.gitignore` explicitly excludes `.env` files to prevent accidental credential leakage.

## License

MIT License

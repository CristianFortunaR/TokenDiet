# Token Diet

Token Diet is a premium, local-first React application designed for prompt engineering and LLM token optimization. It helps developers strip out conversational filler, preserve technical constraints, and compress prompts before sending them to large language models—saving you API tokens, latency, and money.

<img width="1514" height="801" alt="Captura de Tela 2026-05-18 às 22 17 16" src="https://github.com/user-attachments/assets/ddf2805e-e28e-4e68-abba-2171528bc48a" />

## Key Features

- **Quick Diet (Regex):** Instantly strips common polite filler words ("please", "could you", "if you don't mind") and collapses redundant whitespace/newlines without any API calls.
- **Smart Optimize:** Uses AI to rewrite your prompt into a concise, high-density instruction format. Supports OpenAI, Anthropic, and Local Ollama models.
- **Technical Mode:** A toggle that ensures JSON structures, Markdown tables, and complex formatting are preserved exactly as-is during AI optimization.
- **Diff View:** Visually compare your original prompt with the optimized prompt to see exactly what was removed (red highlights) and added (green highlights).
- **Benchmark Suite:** Run your prompt (or a standardized prompt) across all your configured LLM providers simultaneously to compare latency, token usage, and net savings.

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

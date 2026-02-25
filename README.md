# FivWall

<p align="center">
  <strong>Privacy-first visual note-taking</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#google-drive-sync">Google Drive Sync</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#license">License</a>
</p>

---

FivWall is an **open-source**, privacy-first visual note-taking app. Your notes stay on your device by default—nothing is sent to any server. Optionally sync to your own Google Drive when you want cloud backup.

- **Local-first** — Data stored in your browser; no backend required
- **PWA** — Install as an app; works offline
- **Optional Google Drive sync** — Your data, your Drive; FivWall never reads or stores it
- **Rich editing** — Slash commands, tables, images, tags, and more

Built with care by [Fivex Labs](https://fivexlabs.com).

---

## Features

| Feature | Description |
|---------|-------------|
| **Wall View** | Infinite canvas for free-form note placement |
| **Board View** | Kanban-style columns (To Do, In Progress, Done) |
| **Rich Text** | Headings, lists, tables, code blocks, images |
| **Color Coding** | 8 colors to organize notes visually |
| **Labels** | One label per note for quick filtering |
| **Search** | ⌘K / Ctrl+K to search titles and content |
| **Export / Import** | Full JSON backup and restore |
| **Google Drive Sync** | Optional sync to your own Drive folder |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Install

```bash
git clone git@github.com:Fivex-Labs/FivWall.git
cd fivwall
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## Google Drive Sync

FivWall can sync your notes to a dedicated folder in your Google Drive. This is **optional** and **opt-in**.

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Google Drive API**
3. Configure OAuth consent screen (External) and add `drive.file` scope
4. Create an **OAuth 2.0 Client ID** (Web application)
5. Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to your environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Without this variable, the app runs fully local—the Sign in with Google button simply won't appear.

---

## Deployment

### Vercel (recommended)

1. Push your repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in Project Settings → Environment Variables (if using sync)
4. Deploy

### Other platforms

FivWall is a standard Next.js app. Deploy to any platform that supports Next.js (Netlify, Railway, etc.).

---

## Tech Stack

- **Framework** — [Next.js](https://nextjs.org) 16
- **UI** — React 19, Tailwind CSS, [FivUI](https://ui.fivexlabs.com)
- **Editor** — [TipTap](https://tiptap.dev)
- **State** — [Zustand](https://zustand-demo.pmnd.rs)
- **PWA** — next-pwa

---

## Contributing

FivWall is open source. Contributions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## License

FivWall is released under the [MIT License](LICENSE). See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with care for privacy-conscious creators and thinkers
</p>
<p align="center">
  <a href="https://fivexlabs.com">Fivex Labs</a>
</p>

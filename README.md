# Network Navigator

Network Navigator is a web app built with a Node/Express backend and a Vite frontend.

## How to run the app locally

### 1. Clone the repository

```bash
git clone https://github.com/devaswani2012/network-navigator.git
cd network-navigator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the app in your browser

After the server starts, open:

```text
http://127.0.0.1:5000
```

or:

```text
http://localhost:5000
```

## Recommended Node version

Use Node.js 20 or newer.

Check your version with:

```bash
node -v
```

## Files that should not be committed

The following should stay out of GitHub:

```text
.env
.env.local
node_modules/
dist/
*.mp4
attached_assets/*.mp4
```

These should be included in `.gitignore`.

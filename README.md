# Ghosted

A tiny website that answers one question: **Am I being ghosted?**

Upload screenshots or paste a conversation. Ghosted reads the receipts with GPT-4o Vision and returns a shareable ghosting report.

## Run locally

```bash
cp .env.example .env.local
# add your OPENAI_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Launch on Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the `ghosted` repo.
3. Add environment variable: `OPENAI_API_KEY` = your OpenAI key.
4. Deploy. You get a `*.vercel.app` URL immediately.
5. In the Vercel project: **Analytics → Enable Web Analytics**.

Visitor pageviews, unique users, and custom events (`click_analyze_cta`, `analyze_submit`, `analyze_success`, `share_verdict`) show up there. No accounts required.

## Privacy

Conversations are processed for the analysis request only. They are not stored in a database. Share cards never include the private thread.

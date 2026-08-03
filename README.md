# Zema Bet

[Live demo](https://nahom8423.github.io/yaredbooksite/) · [Source](https://github.com/nahom8423/yaredbooksite)

Zema Bet is a source-aware conversational interface for questions about Ethiopian Orthodox Tewahedo history, liturgy, theology, Ge'ez, and the musical tradition of Saint Yared. I built the frontend to make specialized cultural and religious material easier to explore while keeping supporting sources visible to the reader.

## What it does

- Offers quick answers that can be expanded into detailed, source-supported responses
- Displays citations and source cards alongside the conversation
- Preserves local chat history and supports renaming, deleting, and regenerating messages
- Renders structured Markdown, tables, links, and embedded media
- Adapts the interface for desktop and mobile use
- Connects to a separate API and knowledge base through a configurable endpoint

## Why this project matters

Many useful resources in this area are distributed across books, recordings, community knowledge, and material that is difficult to search. Zema Bet explores how software can improve access without treating generated text as a substitute for sources or knowledgeable people. The larger project also informs my work on human-reviewed tools for historical Ge'ez manuscripts.

## Technology

- React 18 and Vite
- Tailwind CSS
- `react-markdown` with GitHub-flavored Markdown support
- REST API integration
- GitHub Pages deployment

## Run locally

```bash
git clone https://github.com/nahom8423/yaredbooksite.git
cd yaredbooksite
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_API_URL` in `.env.local` if you want to use a different backend.

## Verification

```bash
npm run build
```

The repository contains the frontend only. The production knowledge base and backend are maintained separately.

## Status

Active prototype. Current work focuses on clearer source attribution, better handling of long-form responses, and a more deliberate human-review workflow for culturally specialized material.

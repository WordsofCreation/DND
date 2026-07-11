# D&D Campaign Command Center

A dependency-free, static website for running a Dungeons & Dragons campaign from GitHub. The app is designed for a Dungeon Master and at least six participants to manage campaign setup, party quick references, quests, encounters, session recaps, shared notes, dice rolls, invite links, and portable JSON backups.

## Features

- **Campaign dashboard:** campaign name, DM, next game date, table rules, and shareable join code.
- **Six-player party roster:** pre-seeded roster cards for six players, with support for adding more participants.
- **Character quick references:** player, character, class/level, HP, AC, passive score, and notes.
- **Quest board:** active, completed, and rumor quest tracking.
- **Encounter builder:** difficulty, location, monsters/NPCs, and treasure notes.
- **Session log:** dated recaps and next-session planning notes.
- **World notes:** shared space for lore, NPCs, locations, factions, secrets, and house rules.
- **Dice roller:** supports common notation such as `d20`, `2d6+3`, and `1d100`.
- **Import/export:** save or restore the full campaign as JSON.
- **Static deployment:** no runtime dependencies or backend required for the prototype.

## Local Development

This project uses plain HTML, CSS, JavaScript, and small Node scripts. No package installation is required.

```bash
npm run dev
```

Open the printed URL, usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

The production-ready static files are copied into `dist/`.

To preview the built site:

```bash
npm run preview
```

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. To deploy:

1. Push this branch to GitHub.
2. In the repository settings, enable **Pages** and choose **GitHub Actions** as the source.
3. Run the workflow manually or push to `main`, `master`, or `work`.
4. GitHub Pages will publish the generated `dist/` folder.

The site uses relative asset paths, so it can be deployed at either a user site root or a project page path.

## Data and Multiplayer Notes

Campaign data is saved in each browser's `localStorage`. The invite link helps players reach the same website and join code, but static GitHub Pages hosting does not provide a shared live database, authentication, or real-time collaboration by itself.

For a private, multi-user production campaign with true shared edits, add a backend service such as Supabase, Firebase, or a server-hosted database/API. Do not put DM-only secrets, private notes, or admin keys into frontend code deployed to GitHub Pages.

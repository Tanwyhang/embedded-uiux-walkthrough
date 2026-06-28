# Embedded UI/UX Walkthrough Skill

An installable agent skill for building embedded UI/UX walkthroughs, product tours, onboarding demos, and fake-cursor tutorials that reuse real app components with demo-only data.

## Install With npx

From any project directory:

```bash
npx github:Tanwyhang/embedded-uiux-walkthrough install
```

This installs the skill to:

```text
./.agents/skills/embedded-uiux-walkthrough/SKILL.md
```

Other targets:

```bash
npx github:Tanwyhang/embedded-uiux-walkthrough install --target claude
npx github:Tanwyhang/embedded-uiux-walkthrough install --target agents
npx github:Tanwyhang/embedded-uiux-walkthrough install --dir ./.agents/skills --force
```

If this package is later published to npm, the same installer can run as:

```bash
npx embedded-uiux-walkthrough install
```

## What This Skill Does

Use this skill when you want an AI coding agent to add a polished embedded walkthrough to a web app.

It guides the agent to build:

- Embedded tutorial routes such as `/tutorial` and `/tutorial/embed`
- Real-component walkthroughs instead of screenshots
- Demo-only data and production-safe no-write flows
- Fake cursor movement, target highlights, click pulses, and typewriter copy
- Guided click and typing automation
- Iframe or embedded-surface scroll and input locking
- Mobile-aware target detection for responsive apps
- Stable `data-tutorial` hooks for reliable targeting

## Best For

- SaaS onboarding tours
- B2B dashboard tutorials
- Admin panel training flows
- Product-led growth demos
- Sales demo sandboxes
- Customer education experiences
- Internal tool walkthroughs
- React and Next.js app tutorials

## CLI Usage

```bash
embedded-uiux-walkthrough help
embedded-uiux-walkthrough install
embedded-uiux-walkthrough install --target claude
embedded-uiux-walkthrough install --target agents
embedded-uiux-walkthrough install --target project --force
embedded-uiux-walkthrough print
```

Targets:

```text
project/opencode  ./.agents/skills/embedded-uiux-walkthrough
agents            ~/.agents/skills/embedded-uiux-walkthrough
claude            ~/.claude/skills/embedded-uiux-walkthrough
```

## Example Prompts After Installing

```text
Add an embedded tutorial walkthrough for our dashboard. Use real components, demo data only, fake cursor, highlights, guided clicks, and make it work on mobile.
```

```text
Build a product tour for the admin panel with an iframe-style route. It should block user clicks but let the guide click and type through modals safely.
```

```text
Review our onboarding walkthrough and fix target positioning on mobile. It keeps highlighting hidden desktop elements.
```

## SEO Tags

embedded UI walkthrough, UX walkthrough, product tour, onboarding tutorial, interactive product demo, fake cursor tutorial, guided app walkthrough, React walkthrough, Next.js walkthrough, iframe tutorial, demo mode app, no-write tutorial, SaaS onboarding, B2B product demo, customer education, app training flow, AI coding skill, Claude skill, OpenCode skill, agent skill

## Repository Topics

`ai-skill`, `agent-skill`, `claude-skill`, `opencode`, `product-tour`, `onboarding`, `interactive-tutorial`, `ui-walkthrough`, `ux-design`, `react`, `nextjs`, `fake-cursor`, `iframe`, `demo-mode`, `saas`

## License

MIT

---
name: embedded-uiux-walkthrough
description: Build embedded UI/UX walkthroughs for real web apps using iframe-style routes, real production components with demo data, fake cursors, guided clicks, typewriter text, target highlights, mobile-aware positioning, and production-safe no-write tutorial mode. Use this skill whenever the user asks for an onboarding tutorial, product tour, interactive demo, guided walkthrough, embedded tutorial, fake cursor flow, demo-mode app replica, or UI/UX training experience in React, Next.js, or similar web apps.
---

# Embedded UI/UX Walkthrough

Use this skill to implement guided walkthroughs that feel like the real app because they reuse real app surfaces, not screenshots or fake mockups. The priority is parity, safety, and reliability across desktop and mobile.

## Core Principles

- Reuse real components wherever possible so the tutorial does not drift from production UI.
- Feed those components demo-only data and tutorial-mode handlers so no production records are created, updated, or deleted.
- Embed the walkthrough in an isolated route or iframe-style surface so the guide can control scroll, clicks, typing, and visual focus.
- Use stable `data-tutorial` selectors instead of text queries or brittle class selectors.
- Resolve only visible targets so mobile flows do not highlight hidden desktop duplicates.
- Make the guide run automatically, but include pause, replay, and next controls.
- Verify both desktop and mobile because iframe geometry, scroll locking, and duplicate responsive elements often fail only on small screens.

## Recommended Architecture

Create two surfaces:

- A tutorial shell route, such as `/tutorial`, that hosts the lesson picker, device frame, iframe, and high-level navigation.
- An embedded route, such as `/tutorial/embed`, that renders the real app components using demo providers, demo props, and tutorial-safe callbacks.

Keep the automation overlay inside the embedded document when possible. It makes target measurement simpler because `getBoundingClientRect()` returns coordinates in the same viewport as the highlighted elements.

If the app already has protected routes, keep the tutorial protected too unless the user explicitly wants a public demo. A protected tutorial can still use demo data and block writes.

## Implementation Flow

1. Inspect the current app navigation, data loading, forms, modals, confirmation flows, and mobile layout.
2. Choose the real components to reuse in the embedded route.
3. Add a tutorial/demo mode prop only where needed to prevent production writes or external side effects.
4. Create deterministic demo data that exercises realistic empty, normal, modal, and confirmation states.
5. Add `data-tutorial` hooks to navigation items, cards, rows, buttons, inputs, modals, and confirmation controls used in lessons.
6. Define lessons as data, with each step specifying a target selector, title, body copy, optional action, optional typed value, and optional duration.
7. Build the overlay with target measurement, fake cursor movement, highlight rings, click pulses, typewriter copy, guided click/type actions, and pause/replay/next controls.
8. Block manual iframe interaction and scroll while still allowing automation-controlled actions.
9. Tune timing with a single speed constant so future requests like "make it 2x faster" are one-line changes.
10. Run lint/build/tests, then manually verify desktop and mobile walkthrough positioning.

## Lesson Data Pattern

Use a small serializable model. Keep copy and timing outside the overlay so the guide engine stays reusable.

```ts
type TutorialStep = {
  target: string;
  title: string;
  body: string;
  action?: "click" | "type";
  value?: string;
  duration?: number;
};

type TutorialLesson = {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
};
```

Use selectors like `[data-tutorial='stock-parent-card']`, not button text. Responsive apps often render both desktop and mobile variants at the same time, so visible-element filtering is essential.

## Overlay Mechanics

Build the overlay around these behaviors:

- `findTarget(step)` queries `step.target`, filters for visible elements, and prefers an element already in the viewport.
- `measureTarget(step)` scrolls the target into view, waits for one or two animation frames, then stores its rect.
- `clickTarget(step)` sets a short-lived automation flag, triggers the click, waits for layout, then clears the flag.
- `typeIntoTarget(step)` focuses inputs and dispatches real `input` and `change` events so React state updates.
- The fake cursor moves to the target center before click/type actions.
- The guide card docks near the target on desktop and moves to the top or bottom on narrow mobile screens.

Example automation flag:

```ts
declare global {
  interface Window {
    __appTutorialAutomationClick?: boolean;
  }
}

async function clickTarget(target: HTMLElement) {
  window.__appTutorialAutomationClick = true;
  target.click();
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  window.__appTutorialAutomationClick = false;
}
```

Use the flag inside tutorial-safe components to distinguish guide-controlled clicks from blocked user clicks.

## Blocking User Interaction Safely

The embedded route should feel guided, not editable by the user. Block manual interaction with a capture-phase guard around pointer, wheel, touch, and keyboard events.

Allow events from the guide controls and allow automation clicks while the temporary automation flag is true. This keeps the tutorial deterministic without making the app look like a static screenshot.

## Demo Data And No-Write Safety

Treat tutorial mode as a separate runtime path:

- Use local arrays, static fixtures, or mocked query results.
- Replace create/update/delete callbacks with local demo state changes or no-op handlers.
- Keep production API clients and Supabase mutation paths out of tutorial flows unless they are read-only and necessary.
- Never rely on row-level security as the only safety mechanism for a tutorial that performs guided clicks.
- If a modal or confirmation is important, open the real modal component with demo values and intercept the final submit.

## Mobile Targeting Checklist

- Filter out `display: none`, `visibility: hidden`, zero-size, and fully transparent elements.
- Prefer a visible in-viewport candidate when duplicate selectors exist.
- Wait for layout to settle after scroll and after modal open/close.
- Use a docked guide card on small screens so it does not cover the target.
- Test mobile nav, bottom sheets, sticky headers, and responsive table/card swaps.

## Verification Checklist

Run the project-standard checks, typically:

```bash
npm run lint
npm run build
```

Then verify these behaviors manually or with browser automation:

- The tutorial renders real app components with demo data.
- No production write happens during guided clicks, typing, modal submit, or confirmation flows.
- The fake cursor lands on the highlighted target.
- The highlight does not point to hidden desktop/mobile duplicates.
- Pause, replay, next, and lesson switching work.
- Desktop and mobile layouts both keep the guide card readable.
- User wheel, touch, pointer, and keyboard input are blocked inside the embedded walkthrough except guide controls.

## Avoid These Failure Modes

- Do not use screenshots when the goal is app parity.
- Do not target visible text that product copy may change.
- Do not run guided mutations against production data.
- Do not assume desktop selectors will work on mobile.
- Do not block all clicks globally without allowing guide controls and automation clicks.
- Do not scatter timing constants across the codebase; keep speed configurable.

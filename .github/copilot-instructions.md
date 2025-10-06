# Copilot Instructions for tarot-spreads

## Project Overview
- This is a React + TypeScript web app for interactive tarot card readings.
- Main UI logic is in `src/TarotSpreads.tsx`, which manages deck state, drag-and-drop, spread selection, and card modals.
- Tarot card data is imported from `src/data/tarotMeanings.ts` (not shown here, but referenced in code).
- Card images are loaded from `src/assets/tarot-cards/` and via URLs in the card data.

## Key Architectural Patterns
- **Single-page app**: All tarot logic is in one main component (`TarotSpreads`).
- **Stateful deck**: Card state includes position, reversed status, and random visual offsets for realism.
- **Drag-and-drop**: Cards are dragged from the deck to spread positions. Drop zones update card position in state.
- **Spread selection**: UI buttons switch between spread types, updating the grid and positions.
- **Modal details**: Clicking a placed card opens a modal with upright/reversed meanings.
- **CSS custom styling**: Layout and card visuals are controlled by `TarotSpreads.css`.

## Developer Workflows
- **Start dev server**: `npm start` (runs on localhost:3000)
- **Run tests**: `npm test` (uses React Testing Library)
- **Build for production**: `npm run build`
- **Eject config**: `npm run eject` (irreversible)

## Project-Specific Conventions
- **Card data**: Tarot cards are referenced by `id` and imported from a data file. Extend the deck by editing `src/data/tarotMeanings.ts`.
- **Spread logic**: Spread positions are defined in code, not config files. To add new spreads, update the switch in `TarotSpreads.tsx`.
- **Image assets**: Card backs use a local image; faces use URLs from the data file. Place new images in `src/assets/tarot-cards/`.
- **Randomization**: Card orientation and offset are randomized on shuffle for a more organic look.
- **Modal**: Card details modal is controlled by local state; clicking outside closes it.

## Integration Points
- **No backend/API**: All logic and data are client-side.
- **External dependencies**: Uses React, TypeScript, and React Testing Library. No custom middleware or service layer.

## Example: Adding a New Spread
1. Update the spread switch in `TarotSpreads.tsx` to add a new case and label.
2. Add the new spread's positions to the returned array.
3. Optionally update CSS for custom grid layout.

## Example: Extending Card Data
- Edit `src/data/tarotMeanings.ts` to add new cards or update meanings/images.

## Key Files
- `src/TarotSpreads.tsx`: Main logic and UI
- `src/TarotSpreads.css`: Custom styles
- `src/data/tarotMeanings.ts`: Card data (meanings, images)
- `src/assets/tarot-cards/`: Card images

---

For questions or unclear conventions, check `README.md` or ask for clarification.

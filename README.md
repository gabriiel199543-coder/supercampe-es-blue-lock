# Ego Football Engine

Prototype calculation engine for a browser football RPG inspired by manager games,
monster evolution, 1v1 anime duels, and special techniques.

This first version focuses on the core math:

- player attributes and match state
- 1v1 duel resolution
- stamina, confidence, pressure, and ego modifiers
- style-based evolution with appearance changes
- short match simulation made of decisive duel events

The engine is plain JavaScript for quick iteration. The functions are kept pure-ish
and JSON-friendly so the same model can later be ported to Rust and compiled to
WebAssembly.

## Run

```bash
npm test
npm run demo
```

Or directly:

```bash
node examples/demo.js
```

## Main Ideas

Players do not only gain numbers. They build a style.

Winning a duel with a certain action increases that style counter. When the
awakening gauge passes a threshold, the player evolves. The dominant style shapes
the new special skill, attribute bonuses, and appearance description.

Example:

- repeated dribble wins can create a phantom-step style
- repeated shot wins can create a predator finisher style
- repeated pass wins can create a visionary creator style
- repeated defensive wins can create a shadow-wall style

## Next Engine Steps

1. Add team tactics that modify duel probabilities.
2. Add training weeks that prepare evolution paths.
3. Add rivalry memory between two players.
4. Add position maps and zones.
5. Port the stable calculation core to Rust/WebAssembly.

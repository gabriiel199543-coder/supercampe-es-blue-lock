# Supercampeoes Blue Lock Prototype

Prototype calculation engine and playable browser base for a football RPG inspired by
manager games, monster evolution, 1v1 anime duels, and special techniques.

This first version focuses on the core loop:

- player attributes and match state
- 1v1 duel resolution
- stamina, confidence, pressure, and ego modifiers
- style-based evolution with appearance changes
- short match simulation made of decisive duel events
- a 22-player Brazilian prototype roster
- a standalone browser prototype in `index.html`

## Play in the Browser

Open `index.html` in a browser.

You can choose the next duel action:

- dribble
- pass
- sprint
- shoot
- special technique

The match updates score, possession, stamina, awakening, stage, and special skills.

## Run the Engine

```bash
npm test
npm run demo
```

Or directly:

```bash
node examples/demo.js
```

## Prototype Roster

The first roster has two 11-player teams:

- `Historia do Brasil FC`: Brazilian historical figures.
- `Internet Brasileira FC`: friendly public internet personas, meme figures, streamers, and creator collectives.

Important: the internet roster is for internal prototyping and tone discovery. Before
any public or commercial release, replace living people and active brands with
licensed, authorized, or clearly fictionalized characters.

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

# Supercampeoes Blue Lock Prototype

Prototype of a football manager RPG about coaching Brazilian historical figures,
internet personas, meme characters, and creator collectives.

The current direction is closer to Football Manager than to direct arcade control:
you act as the coach. Your job is to read the squad, define training, choose a
tactical identity, handle the team talk, and watch how the match engine turns
those decisions into duels, goals, awakenings, fatigue, pressure, and player
evolution.

## Play in the Browser

Open \`index.html\` in a browser.

Current manager actions:

- choose which team to command
- choose formation
- define tactical identity
- choose weekly training
- choose a focus player
- set team talk
- tune pressing, tempo, creative freedom, and risk/ego
- simulate 15-minute blocks or the whole match
- read assistant feedback and squad condition

## Run the Engine

\`\`\`bash
npm test
npm run demo
\`\`\`

Or directly:

\`\`\`bash
node examples/demo.js
\`\`\`

## Prototype Roster

The first roster has two 11-player teams:

- \`Historia do Brasil FC\`: Brazilian historical figures.
- \`Internet Brasileira FC\`: friendly public internet personas, meme figures, streamers, and creator collectives.

Important: the internet roster is for internal prototyping and tone discovery. Before
any public or commercial release, replace living people and active brands with
licensed, authorized, or clearly fictionalized characters.

## Core Systems

- squad attributes and role fit
- match state and score
- training week effects
- tactical identity and sliders
- morale, condition, fatigue, pressure, and sharpness
- 1v1 duel resolution inside the simulation
- style-based evolution and special skills
- assistant report after segments

## Next Steps

1. Add a true squad screen with substitutes and position changes.
2. Add staff reports before the match.
3. Add opposition scouting.
4. Add a calendar with multiple fixtures.
5. Move the stable match engine to Rust/WebAssembly.

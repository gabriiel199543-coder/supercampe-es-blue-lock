# Supercampeoes Blue Lock Prototype

Prototype of a football manager RPG about coaching Brazilian historical figures,
internet personas, meme characters, and creator collectives.

The current direction is closer to Football Manager than to direct arcade control:
you act as the coach. Your job is to read the squad, build the starting XI,
assign player roles, define training, choose a tactical identity, handle the team
talk, and watch how the match engine turns those decisions into duels, goals,
awakenings, fatigue, pressure, substitutions, tactical changes, and player
evolution.

## Play in the Browser

Open \`index.html\` in a browser.

If you are viewing the file on GitHub, the normal blob page shows the source
instead of running the game. Download/open the raw \`index.html\` locally, or
publish the repository with GitHub Pages when the prototype is ready to share.

Current manager actions:

- choose which team to command
- choose formation
- fill all 11 pitch slots manually
- assign a tactical role to every selected player
- auto-pick a starting XI based on position and role fit
- define tactical identity
- choose weekly training
- choose a focus player
- set team talk before the match
- tune pressing, tempo, creative freedom, and risk/ego
- simulate 15-minute blocks or the whole match
- use the bench during the match
- make up to 5 substitutions
- change formation, roles, and tactical sliders while the match is live
- inspect each player's FM-style attribute and skill profile
- define a player from the skill screen as weekly focus
- read assistant feedback, squad condition, role fit, and match consequences

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
- \`Internet Brasileira FC\`: friendly public internet personas, meme figures,
  streamers, and creator collectives.

Important: the internet roster is for internal prototyping and tone discovery.
Before any public or commercial release, replace living people and active brands
with licensed, authorized, or clearly fictionalized characters.

## Core Systems

- squad attributes and role fit
- formation slots and player position fit
- manager-style starting XI selection
- role instructions for each player
- FM-inspired player attribute profile
- skill nodes based on awakening, style progress, and role mastery
- bench management and substitution limits
- in-match tactical changes
- match state, score, xG, and momentum
- training week effects
- tactical identity and sliders
- morale, condition, fatigue, pressure, and sharpness
- 1v1 duel resolution inside the simulation
- style-based evolution and special skills
- assistant report after segments

## Current Design Target

The browser prototype should answer one question first: "Did my coaching choices
change the match in a readable way?"

The short-term priority is depth of the manager loop, not graphics. Every new
feature should make the coach experience clearer: team selection, roles,
opposition scouting, substitutions, development, squad hierarchy, or season
planning.

## Next Steps

1. Make skill nodes affect role-specific bonuses more explicitly.
2. Add opposition scouting before each fixture.
3. Add player promises, hierarchy, and training feedback.
4. Add a calendar with multiple fixtures and form history.
5. Add post-match analysis with heat-map style summaries.
6. Split the stable match logic into a WebAssembly-ready engine module.

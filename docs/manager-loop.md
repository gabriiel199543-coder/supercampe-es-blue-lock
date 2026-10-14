# Manager Loop

This prototype should feel like coaching a strange, funny, high-drama version of
Football Manager.

## Primary Fantasy

The player is not controlling every touch. The player is the coach responsible
for turning chaotic historical and internet figures into a functioning football
team.

The fantasy is strongest when a match result creates an obvious coaching
question: change the formation, change the role, trust a player, bench a player,
train a weakness, release ego, or calm the squad down.

## Current Turn Structure

1. Read the squad report.
2. Choose the team to command.
3. Choose the formation.
4. Fill the 11 pitch slots.
5. Assign a role to every selected player.
6. Review assistant warnings about weak fits, fatigue, and volatility.
7. Choose weekly training.
8. Pick a focus player.
9. Set tactical identity, team talk, and sliders.
10. Simulate the match in 15-minute blocks or all at once.
11. During the match, change formation, roles, pressing, tempo, freedom, and risk.
12. Use up to 5 substitutions from the bench.
13. Watch morale, fatigue, pressure, xG, goals, and awakening change.
14. Repeat across fixtures.

## Management Screens

| Screen | Controls and information |
| --- | --- |
| Visão geral | Club selection, condition/morale/sharpness averages, current tactical plan, preparation checks, assistant report, and shortcuts |
| Tática | Formation, identity, pressing/tempo/freedom/risk, all 11 pitch slots, role selection, auto lineup, and team ratings |
| Elenco | Natural positions, current slot and role, condition, morale, sharpness, and awakening; player names open the profile |
| Ficha e skills | Player selector, attribute columns, awakening progress, skill nodes, assistant analysis, and a shortcut to set the training focus |
| Treinos | Weekly training and focus, expected effects, squad development summary, and feedback from the last applied week |
| Dia de jogo | Team talk, 15-minute/full-match simulation, xG, momentum, match feed, substitutions, and tactical-change history |

The scoreboard stays outside the screen containers. Every control is mounted
once and has one ID; navigation only changes visibility. It must never reset the
career, recompute the lineup, consume a simulated minute, change the selected
player, or apply training. URL hashes and browser history mirror the active
screen. Invalid hashes fall back to Visão geral.

The profile's focus action opens Treinos with the selected player. Its assistant
analysis appears on the profile itself and is also added to the general report.
Training feedback appears in Treinos, even when the assistant report changes.
During a match, training, focus selection, and free starter changes remain
locked; tactical adjustments stay available between simulation blocks.

The tactical pitch uses formation rows and grid columns to keep cards apart.
Below 600px, it becomes a full-width list with the same player and role controls.
The squad table can scroll horizontally without widening the whole page.

This prototype keeps state in memory only. Reloading starts a fresh career.
The roster has 11 players per side, so a full XI has no available reserves yet.

## Calculation Model

Each selected player contributes through four layers:

- raw attributes: technique, physique, vision, ego, discipline, creativity,
  emotional control, defense, finishing, goalkeeping
- position fit: natural positions are rewarded; related positions are playable;
  bad fits create performance drag
- role fit: the role weights the attributes that matter for that tactical job
- tactical context: identity, pressing, tempo, freedom, risk, team talk, morale,
  condition, chemistry, fatigue, substitutions, skill progress, and live tactical
  changes modify the final result

The match simulator uses those ratings to create readable pressure phases and
1v1 duels. Individual actions still matter, but the coach should understand why
they are happening.

## Match-Day Rules

- Before kickoff, the coach can freely change starters, formation, roles, training,
  focus player, and team talk.
- After kickoff, player changes must use the substitution panel.
- Each match allows 5 substitutions.
- A player who leaves the match cannot return.
- Formation, role, identity, pressing, tempo, creative freedom, and risk can be
  changed live and are logged as tactical changes.
- Assistant feedback should push the coach toward a decision: protect a lead,
  chase a goal, rest a tired player, or accept a risky ego burst.

## Tactical Identities

- Control: favors vision, technique, discipline, and midfield structure.
- Vertical: favors physique, finishing, tempo, and direct attackers.
- Compact: favors defense, discipline, emotional control, and lower risk.
- Ego: favors ego and creativity, but increases volatility.

## Player Development

Players evolve through the kind of football they repeatedly succeed at:

- dribble wins push dribble evolution
- finishing wins push striker evolution
- pass wins push creator evolution
- sprint wins push runner evolution
- defensive stops push defender evolution
- special actions push ego evolution

Evolution should eventually change both numbers and appearance. In this version,
the browser prototype tracks awakening stage, special-skill growth, style-specific
skill nodes, and a player profile screen inspired by Football Manager attributes.
The visual form changes are a future UI layer.

## Design Rule

The match should be readable as a consequence of managerial choices. If the
player loses, they should have a plausible coaching question to ask next:

- Did I use the wrong formation?
- Did I pick a player outside his natural position?
- Did I choose roles that contradicted the tactical identity?
- Did I react too late with the bench?
- Did I overuse pressing?
- Did I give too much creative freedom?
- Did I train the wrong thing?
- Did I release ego before the squad had discipline?

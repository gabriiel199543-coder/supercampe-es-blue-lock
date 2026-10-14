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
11. Watch morale, fatigue, pressure, xG, goals, and awakening change.
12. Repeat across fixtures.

## Screen Layers

- Coach Room: formation, identity, training, focus player, team talk, sliders.
- Tactical Board: all 11 pitch slots with player and role selection.
- Squad Table: natural positions, current slot, role, condition, morale,
  sharpness, and awakening stage.
- Match Feed: goals, duels, pressure swings, evolution events, and score.
- Assistant Report: actionable warnings and next tactical suggestions.

## Calculation Model

Each selected player contributes through four layers:

- raw attributes: technique, physique, vision, ego, discipline, creativity,
  emotional control, defense, finishing, goalkeeping
- position fit: natural positions are rewarded; related positions are playable;
  bad fits create performance drag
- role fit: the role weights the attributes that matter for that tactical job
- tactical context: identity, pressing, tempo, freedom, risk, team talk, morale,
  condition, chemistry, and fatigue modify the final result

The match simulator uses those ratings to create readable pressure phases and
1v1 duels. Individual actions still matter, but the coach should understand why
they are happening.

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
the browser prototype already tracks awakening stage and special-skill growth;
the visual form changes are a future UI layer.

## Design Rule

The match should be readable as a consequence of managerial choices. If the
player loses, they should have a plausible coaching question to ask next:

- Did I use the wrong formation?
- Did I pick a player outside his natural position?
- Did I choose roles that contradicted the tactical identity?
- Did I overuse pressing?
- Did I give too much creative freedom?
- Did I train the wrong thing?
- Did I release ego before the squad had discipline?

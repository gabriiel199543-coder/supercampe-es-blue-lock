"use strict";

const { simulateMatch } = require("../src/engine");
const { splitTeams } = require("../src/roster");

const { home, away } = splitTeams();
const result = simulateMatch({
  home,
  away,
  seed: "brazilian-roster-v0",
  events: 22
});

console.log("Final score");
console.log(`${home[0].teamName} ${result.score.home} x ${result.score.away} ${away[0].teamName}`);
console.log("");
console.log("Duel log");
for (const event of result.log) {
  const marker = event.goal ? " GOAL" : "";
  console.log(`${String(event.minute).padStart(2, "0")}' [${event.team}] ${event.text}${marker}`);
}

console.log("");
console.log("Evolution state");
for (const player of [...result.home, ...result.away]) {
  if (player.stage > 0 || player.awakening > 20) {
    console.log(
      `${player.name}: stage ${player.stage}, ${player.evolutionTitle}, awakening ${Math.round(
        player.awakening
      )}, skills [${player.skills.join(", ") || "none"}], appearance: ${player.appearance}`
    );
  }
}

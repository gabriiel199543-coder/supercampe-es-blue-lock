"use strict";

const { sampleTeams, simulateMatch } = require("../src/engine");

const { home, away } = sampleTeams();
const result = simulateMatch({
  home,
  away,
  seed: "gabriel-blue-lock-manager-v0",
  events: 14
});

console.log("Final score");
console.log(`Home ${result.score.home} x ${result.score.away} Away`);
console.log("");
console.log("Duel log");
for (const event of result.log) {
  const marker = event.goal ? " GOAL" : "";
  console.log(`${String(event.minute).padStart(2, "0")}' [${event.team}] ${event.text}${marker}`);
}

console.log("");
console.log("Home evolution state");
for (const player of result.home) {
  console.log(
    `${player.name}: stage ${player.stage}, ${player.evolutionTitle}, awakening ${Math.round(
      player.awakening
    )}, skills [${player.skills.join(", ") || "none"}], appearance: ${player.appearance}`
  );
}

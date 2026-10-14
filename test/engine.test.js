"use strict";

const assert = require("assert");
const {
  makePlayer,
  resolveDuel,
  sampleTeams,
  simulateMatch
} = require("../src/engine");
const { PLAYER_BLUEPRINTS, getRoster, splitTeams } = require("../src/roster");

function testDeterministicDuel() {
  const attacker = makePlayer("p1", "Test Striker", "FW", {
    finishing: 82,
    technique: 75,
    ego: 80,
    emotionalControl: 70
  });
  const defender = makePlayer("p2", "Test Keeper", "GK", {
    goalkeeping: 70,
    emotionalControl: 65,
    physique: 70
  });

  const first = resolveDuel({
    attacker,
    defender,
    action: "shoot",
    seed: "same-seed",
    context: { minute: 88, stakes: 0.95, zone: "box" }
  });
  const second = resolveDuel({
    attacker,
    defender,
    action: "shoot",
    seed: "same-seed",
    context: { minute: 88, stakes: 0.95, zone: "box" }
  });

  assert.deepStrictEqual(first.outcome, second.outcome);
}

function testProbabilityFavorsStrongAttacker() {
  const attacker = makePlayer("p1", "Elite Forward", "FW", {
    finishing: 92,
    technique: 88,
    ego: 86,
    emotionalControl: 78,
    creativity: 75
  });
  const defender = makePlayer("p2", "Weak Keeper", "GK", {
    goalkeeping: 45,
    emotionalControl: 45,
    physique: 48
  });

  const result = resolveDuel({
    attacker,
    defender,
    action: "shoot",
    seed: "strong-attacker",
    context: { minute: 65, stakes: 0.7, zone: "box" }
  });

  assert(result.outcome.probability > 0.8);
}

function testEvolutionChangesPlayer() {
  const attacker = makePlayer(
    "p1",
    "Almost Awakened",
    "FW",
    {
      finishing: 88,
      technique: 84,
      ego: 90,
      emotionalControl: 70,
      creativity: 72
    },
    {
      awakening: 58,
      preferredStyle: "shoot",
      styleCounters: { shoot: 58 }
    }
  );
  const defender = makePlayer("p2", "Training Keeper", "GK", {
    goalkeeping: 35,
    emotionalControl: 45,
    physique: 45
  });

  const result = resolveDuel({
    attacker,
    defender,
    action: "shoot",
    seed: "evolve-now",
    context: { minute: 90, stakes: 1, zone: "box" }
  });

  assert(result.attacker.stage >= 1);
  assert(result.attacker.skills.length >= 1);
  assert.notStrictEqual(result.attacker.appearance, "raw prospect");
}

function testMatchSimulationShape() {
  const { home, away } = sampleTeams();
  const result = simulateMatch({ home, away, seed: "match-test", events: 8 });

  assert.strictEqual(result.log.length, 8);
  assert(Number.isInteger(result.score.home));
  assert(Number.isInteger(result.score.away));
  assert.strictEqual(result.home.length, home.length);
  assert.strictEqual(result.away.length, away.length);
}

function testBrazilianRosterShape() {
  const roster = getRoster();
  const { home, away } = splitTeams();

  assert.strictEqual(PLAYER_BLUEPRINTS.length, 22);
  assert.strictEqual(roster.length, 22);
  assert.strictEqual(home.length, 11);
  assert.strictEqual(away.length, 11);
  assert(home.some((player) => player.role === "GK"));
  assert(away.some((player) => player.role === "GK"));

  for (const player of roster) {
    assert(player.id);
    assert(player.name);
    assert(player.teamName);
    assert(player.archetype);
    assert(player.specialSkill);
    for (const value of Object.values(player.attributes)) {
      assert(value >= 1 && value <= 100);
    }
  }
}

function testBrazilianRosterMatchRuns() {
  const { home, away } = splitTeams();
  const result = simulateMatch({ home, away, seed: "brazilian-roster-test", events: 22 });

  assert.strictEqual(result.log.length, 22);
  assert.strictEqual(result.home.length, 11);
  assert.strictEqual(result.away.length, 11);
  assert(result.log.some((event) => event.action === "shoot" || event.action === "special"));
}

testDeterministicDuel();
testProbabilityFavorsStrongAttacker();
testEvolutionChangesPlayer();
testMatchSimulationShape();
testBrazilianRosterShape();
testBrazilianRosterMatchRuns();

console.log("All engine tests passed.");

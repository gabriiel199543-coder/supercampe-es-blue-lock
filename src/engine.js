"use strict";

const ATTRIBUTES = [
  "technique",
  "physique",
  "vision",
  "ego",
  "discipline",
  "creativity",
  "emotionalControl",
  "defense",
  "finishing",
  "goalkeeping"
];

const EVOLUTION_THRESHOLDS = [0, 60, 150, 300];

const ACTIONS = {
  dribble: {
    label: "Dribble",
    staminaCost: 8,
    variance: 8,
    attackerWeights: {
      technique: 0.32,
      creativity: 0.2,
      ego: 0.18,
      physique: 0.12,
      emotionalControl: 0.1,
      vision: 0.08
    },
    defenderWeights: {
      defense: 0.34,
      physique: 0.2,
      discipline: 0.16,
      emotionalControl: 0.12,
      technique: 0.1,
      vision: 0.08
    }
  },
  pass: {
    label: "Impossible pass",
    staminaCost: 5,
    variance: 6,
    attackerWeights: {
      vision: 0.34,
      technique: 0.2,
      discipline: 0.15,
      creativity: 0.15,
      emotionalControl: 0.1,
      ego: 0.06
    },
    defenderWeights: {
      defense: 0.26,
      vision: 0.22,
      discipline: 0.2,
      physique: 0.12,
      emotionalControl: 0.1,
      technique: 0.1
    }
  },
  sprint: {
    label: "Explosive sprint",
    staminaCost: 10,
    variance: 7,
    attackerWeights: {
      physique: 0.35,
      technique: 0.16,
      ego: 0.16,
      emotionalControl: 0.1,
      creativity: 0.1,
      vision: 0.08,
      discipline: 0.05
    },
    defenderWeights: {
      physique: 0.3,
      defense: 0.26,
      discipline: 0.16,
      emotionalControl: 0.12,
      vision: 0.1,
      technique: 0.06
    }
  },
  shoot: {
    label: "Finish",
    staminaCost: 9,
    variance: 9,
    attackerWeights: {
      finishing: 0.34,
      technique: 0.2,
      ego: 0.2,
      emotionalControl: 0.14,
      physique: 0.07,
      creativity: 0.05
    },
    defenderWeights: {
      goalkeeping: 0.38,
      defense: 0.18,
      emotionalControl: 0.16,
      physique: 0.12,
      vision: 0.1,
      discipline: 0.06
    }
  },
  special: {
    label: "Special technique",
    staminaCost: 16,
    variance: 12,
    attackerWeights: {
      technique: 0.24,
      ego: 0.24,
      creativity: 0.18,
      emotionalControl: 0.14,
      finishing: 0.12,
      physique: 0.08
    },
    defenderWeights: {
      defense: 0.28,
      emotionalControl: 0.18,
      physique: 0.16,
      vision: 0.14,
      discipline: 0.12,
      technique: 0.12
    }
  },
  tackle: {
    label: "Hard tackle",
    staminaCost: 7,
    variance: 7,
    attackerWeights: {
      defense: 0.34,
      physique: 0.2,
      discipline: 0.16,
      emotionalControl: 0.12,
      technique: 0.1,
      ego: 0.08
    },
    defenderWeights: {
      technique: 0.28,
      physique: 0.18,
      emotionalControl: 0.16,
      creativity: 0.14,
      vision: 0.12,
      ego: 0.12
    }
  }
};

const EVOLUTION_ARCHETYPES = {
  dribble: {
    title: "Phantom Dribbler",
    skill: "Phantom Step",
    appearance: "sharper stance, loose shoulders, bright boots",
    bonuses: { technique: 5, creativity: 4, ego: 3 }
  },
  shoot: {
    title: "Box Predator",
    skill: "Meteor Shot",
    appearance: "forward lean, colder eyes, heavy striking leg",
    bonuses: { finishing: 6, ego: 4, emotionalControl: 2 }
  },
  pass: {
    title: "False Nine Visionary",
    skill: "Impossible Angle",
    appearance: "calm posture, open body shape, conductor gestures",
    bonuses: { vision: 6, technique: 3, discipline: 3 }
  },
  sprint: {
    title: "Lightning Runner",
    skill: "Lightning Lane",
    appearance: "lower running posture, taped wrists, neon trim",
    bonuses: { physique: 6, technique: 2, ego: 2 }
  },
  special: {
    title: "Awakened Egoist",
    skill: "Ego Zone",
    appearance: "visible aura, intense stare, altered celebration",
    bonuses: { ego: 5, creativity: 4, emotionalControl: 3 }
  },
  defense: {
    title: "Shadow Wall",
    skill: "Blackout Marking",
    appearance: "wider stance, guarded shoulders, dark captain band",
    bonuses: { defense: 6, physique: 3, discipline: 3 }
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function hashSeed(seed) {
  const text = String(seed ?? "default-seed");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = hashSeed(seed);
  return function rng() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(rng, min, max) {
  return min + (max - min) * rng();
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function valueOf(player, attribute) {
  return clamp(Number(player.attributes?.[attribute] ?? 50), 1, 100);
}

function weightedAverage(player, weights) {
  let totalWeight = 0;
  let total = 0;

  for (const [attribute, weight] of Object.entries(weights)) {
    totalWeight += weight;
    total += valueOf(player, attribute) * weight;
  }

  return totalWeight === 0 ? 50 : total / totalWeight;
}

function normalizePlayer(player) {
  const normalized = clone(player);

  normalized.attributes = normalized.attributes || {};
  for (const attribute of ATTRIBUTES) {
    if (normalized.attributes[attribute] == null) {
      normalized.attributes[attribute] = 50;
    }
    normalized.attributes[attribute] = clamp(normalized.attributes[attribute], 1, 100);
  }

  normalized.stage = clamp(Number(normalized.stage ?? 0), 0, 3);
  normalized.awakening = Number(normalized.awakening ?? 0);
  normalized.skills = Array.isArray(normalized.skills) ? normalized.skills : [];
  normalized.appearance = normalized.appearance || "raw prospect";
  normalized.evolutionTitle = normalized.evolutionTitle || "Raw Talent";
  normalized.styleCounters = normalized.styleCounters || {};
  normalized.state = {
    stamina: 100,
    confidence: 50,
    pressure: 0,
    heat: 0,
    ...(normalized.state || {})
  };

  normalized.state.stamina = clamp(normalized.state.stamina, 0, 100);
  normalized.state.confidence = clamp(normalized.state.confidence, 0, 100);
  normalized.state.pressure = clamp(normalized.state.pressure, 0, 100);
  normalized.state.heat = clamp(normalized.state.heat, 0, 100);

  return normalized;
}

function pressureModifier(player, context, actionName) {
  const stakes = clamp(context.stakes ?? 0.5, 0, 1);
  const pressure = clamp(player.state?.pressure ?? 0, 0, 100);
  const emotionalControl = valueOf(player, "emotionalControl");
  const ego = valueOf(player, "ego");
  const discipline = valueOf(player, "discipline");

  const pressurePenalty = (pressure / 100) * stakes * ((100 - emotionalControl) / 100) * 18;
  const egoSurge = ((ego - 50) / 50) * stakes * 5;
  const recklessPenalty =
    actionName === "special" && discipline < 45 ? ((45 - discipline) / 45) * stakes * 5 : 0;

  return egoSurge - pressurePenalty - recklessPenalty;
}

function playerScore(player, weights, context, actionName, rng, variance) {
  const base = weightedAverage(player, weights);
  const stageBonus = (player.stage ?? 0) * 2.5;
  const staminaBonus = ((player.state?.stamina ?? 100) - 50) * 0.1;
  const confidenceBonus = ((player.state?.confidence ?? 50) - 50) * 0.12;
  const heatBonus = ((player.state?.heat ?? 0) / 100) * clamp(context.stakes ?? 0.5, 0, 1) * 4;
  const pressure = pressureModifier(player, context, actionName);
  const randomness = randomBetween(rng, -variance, variance);

  return base + stageBonus + staminaBonus + confidenceBonus + heatBonus + pressure + randomness;
}

function roleAdjustedDefenderWeights(defender, action) {
  if (action !== ACTIONS.shoot || defender.role === "GK") {
    return action.defenderWeights;
  }

  return {
    defense: 0.34,
    physique: 0.18,
    emotionalControl: 0.16,
    discipline: 0.14,
    vision: 0.1,
    technique: 0.08
  };
}

function styleKeyForAction(actionName, winnerSide) {
  if (winnerSide === "defender") {
    return "defense";
  }
  if (actionName === "tackle") {
    return "defense";
  }
  return actionName;
}

function updateAfterDuel(player, outcome, side, actionName, context) {
  const updated = clone(player);
  const stakes = clamp(context.stakes ?? 0.5, 0, 1);
  const won = outcome.winner === side;
  const staminaCost = ACTIONS[actionName].staminaCost * (side === "attacker" ? 1 : 0.65);
  const emotionalControl = valueOf(updated, "emotionalControl");
  const pressureDelta = won ? -5 - stakes * 4 : 5 + stakes * 8 - emotionalControl * 0.04;
  const confidenceDelta = won ? 4 + stakes * 5 : -3 - stakes * 4;
  const heatDelta = won ? 6 + stakes * 8 : 1 + stakes * 2;

  updated.state.stamina = clamp(updated.state.stamina - staminaCost, 0, 100);
  updated.state.confidence = clamp(updated.state.confidence + confidenceDelta, 0, 100);
  updated.state.pressure = clamp(updated.state.pressure + pressureDelta, 0, 100);
  updated.state.heat = clamp(updated.state.heat + heatDelta, 0, 100);

  const styleKey = styleKeyForAction(actionName, outcome.winner);
  const progressBase = won ? 8 + stakes * 12 + Math.max(0, outcome.margin) * 0.18 : 2 + stakes * 4;
  const adversityBonus = !won && stakes > 0.7 ? 3 : 0;
  const roleBonus = updated.preferredStyle === styleKey ? 4 : 0;
  const progress = progressBase + adversityBonus + roleBonus;

  if (won || adversityBonus > 0) {
    updated.styleCounters[styleKey] = (updated.styleCounters[styleKey] || 0) + progress;
  }

  updated.awakening += progress * (won ? 1 : 0.55);

  return applyEvolution(updated);
}

function dominantStyle(player) {
  const entries = Object.entries(player.styleCounters || {});
  if (entries.length === 0) {
    return player.preferredStyle || "special";
  }
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function applyEvolution(player) {
  const updated = clone(player);

  while (updated.stage < 3 && updated.awakening >= EVOLUTION_THRESHOLDS[updated.stage + 1]) {
    updated.stage += 1;
    const style = dominantStyle(updated);
    const archetype = EVOLUTION_ARCHETYPES[style] || EVOLUTION_ARCHETYPES.special;
    updated.evolutionTitle = `${archetype.title} ${updated.stage}`;
    updated.appearance = archetype.appearance;

    if (!updated.skills.includes(archetype.skill)) {
      updated.skills.push(archetype.skill);
    }

    for (const [attribute, bonus] of Object.entries(archetype.bonuses)) {
      updated.attributes[attribute] = clamp(updated.attributes[attribute] + bonus, 1, 100);
    }
  }

  return updated;
}

function resolveDuel(input) {
  const rng = input.rng || createRng(input.seed);
  const actionName = input.action || "dribble";
  const action = ACTIONS[actionName];

  if (!action) {
    throw new Error(`Unknown action: ${actionName}`);
  }

  const context = {
    minute: 1,
    zone: "midfield",
    stakes: 0.5,
    ...(input.context || {})
  };

  const attacker = normalizePlayer(input.attacker);
  const defender = normalizePlayer(input.defender);
  const attackerScore = playerScore(
    attacker,
    action.attackerWeights,
    context,
    actionName,
    rng,
    action.variance
  );
  const defenderScore = playerScore(
    defender,
    roleAdjustedDefenderWeights(defender, action),
    context,
    actionName,
    rng,
    action.variance
  );
  const rawMargin = attackerScore - defenderScore;
  const probability = sigmoid(rawMargin / 12);
  const roll = rng();
  const attackerWins = roll <= probability;
  const margin = Math.abs(rawMargin);

  const outcome = {
    action: actionName,
    label: action.label,
    winner: attackerWins ? "attacker" : "defender",
    loser: attackerWins ? "defender" : "attacker",
    probability: round(probability),
    roll: round(roll),
    margin: round(margin),
    critical: margin >= 14,
    attackerScore: round(attackerScore),
    defenderScore: round(defenderScore),
    context
  };

  const updatedAttacker = updateAfterDuel(attacker, outcome, "attacker", actionName, context);
  const updatedDefender = updateAfterDuel(defender, outcome, "defender", actionName, context);

  return {
    outcome,
    attacker: updatedAttacker,
    defender: updatedDefender,
    text: describeDuel(attacker, defender, outcome)
  };
}

function describeDuel(attacker, defender, outcome) {
  const actor = outcome.winner === "attacker" ? attacker.name : defender.name;
  const target = outcome.winner === "attacker" ? defender.name : attacker.name;
  const verb =
    outcome.winner === "attacker"
      ? `${outcome.label} beats`
      : `shuts down ${outcome.label.toLowerCase()} from`;
  const critical = outcome.critical ? " Critical moment." : "";

  return `${actor} ${verb} ${target} at ${outcome.context.minute}'.${critical}`;
}

function pickByRole(players, roles, rng) {
  const pool = players.filter((player) => roles.includes(player.role));
  const options = pool.length > 0 ? pool : players;
  return options[Math.floor(rng() * options.length)];
}

function replacePlayer(players, updated) {
  return players.map((player) => (player.id === updated.id ? updated : player));
}

function simulateMatch(input) {
  const rng = createRng(input.seed || "match-seed");
  let home = input.home.map(normalizePlayer);
  let away = input.away.map(normalizePlayer);
  const events = input.events ?? 12;
  const score = { home: 0, away: 0 };
  const log = [];

  for (let index = 0; index < events; index += 1) {
    const homeAttacks = rng() >= 0.5;
    const attackingTeam = homeAttacks ? home : away;
    const defendingTeam = homeAttacks ? away : home;
    const minute = Math.floor(((index + 1) / (events + 1)) * 90);
    const action = chooseAction(rng, minute);
    const attackerRoles = action === "shoot" || action === "special" ? ["FW", "AM"] : ["FW", "AM", "MF", "WG"];
    const defenderRoles = action === "shoot" ? ["GK"] : ["DF", "MF", "GK"];
    const attacker = pickByRole(attackingTeam, attackerRoles, rng);
    const defender = pickByRole(defendingTeam, defenderRoles, rng);
    const stakes = clamp(0.25 + minute / 120 + (action === "special" ? 0.25 : 0), 0, 1);

    const result = resolveDuel({
      attacker,
      defender,
      action,
      rng,
      context: {
        minute,
        stakes,
        zone: action === "shoot" || action === "special" ? "box" : "half-space"
      }
    });

    if (homeAttacks) {
      home = replacePlayer(home, result.attacker);
      away = replacePlayer(away, result.defender);
    } else {
      away = replacePlayer(away, result.attacker);
      home = replacePlayer(home, result.defender);
    }

    const isGoalAction = action === "shoot" || action === "special";
    const goal = isGoalAction && result.outcome.winner === "attacker";
    if (goal) {
      score[homeAttacks ? "home" : "away"] += 1;
    }

    log.push({
      minute,
      team: homeAttacks ? "home" : "away",
      action,
      text: result.text,
      goal,
      score: { ...score },
      outcome: result.outcome
    });
  }

  return { score, home, away, log };
}

function chooseAction(rng, minute) {
  const roll = rng();
  const late = minute > 70;

  if (late && roll > 0.78) return "special";
  if (roll < 0.24) return "dribble";
  if (roll < 0.44) return "pass";
  if (roll < 0.62) return "sprint";
  if (roll < 0.86) return "shoot";
  return "special";
}

function makePlayer(id, name, role, attributes, extras = {}) {
  return normalizePlayer({
    id,
    name,
    role,
    attributes,
    ...extras
  });
}

function sampleTeams() {
  const home = [
    makePlayer(
      "h1",
      "Caio Vortex",
      "FW",
      {
        technique: 72,
        physique: 63,
        vision: 54,
        ego: 84,
        discipline: 42,
        creativity: 75,
        emotionalControl: 58,
        finishing: 78
      },
      { preferredStyle: "shoot" }
    ),
    makePlayer("h2", "Leo Prisma", "AM", {
      technique: 70,
      physique: 50,
      vision: 82,
      ego: 61,
      discipline: 68,
      creativity: 81,
      emotionalControl: 70,
      finishing: 62
    }),
    makePlayer("h3", "Rafa Muro", "DF", {
      technique: 54,
      physique: 78,
      vision: 55,
      ego: 52,
      discipline: 76,
      creativity: 40,
      emotionalControl: 74,
      defense: 82
    }),
    makePlayer("h4", "Nico Luva", "GK", {
      technique: 50,
      physique: 70,
      vision: 65,
      ego: 48,
      discipline: 72,
      emotionalControl: 80,
      defense: 60,
      goalkeeping: 84
    })
  ];

  const away = [
    makePlayer("a1", "Igor Furia", "FW", {
      technique: 68,
      physique: 74,
      vision: 48,
      ego: 88,
      discipline: 38,
      creativity: 66,
      emotionalControl: 50,
      finishing: 80
    }),
    makePlayer("a2", "Tales Corte", "MF", {
      technique: 64,
      physique: 62,
      vision: 76,
      ego: 56,
      discipline: 75,
      creativity: 68,
      emotionalControl: 72,
      defense: 66
    }),
    makePlayer("a3", "Bruno Sombra", "DF", {
      technique: 55,
      physique: 82,
      vision: 58,
      ego: 65,
      discipline: 70,
      creativity: 42,
      emotionalControl: 67,
      defense: 85
    }),
    makePlayer("a4", "Davi Trave", "GK", {
      technique: 45,
      physique: 76,
      vision: 60,
      ego: 55,
      discipline: 68,
      emotionalControl: 76,
      defense: 62,
      goalkeeping: 80
    })
  ];

  return { home, away };
}

module.exports = {
  ACTIONS,
  EVOLUTION_ARCHETYPES,
  EVOLUTION_THRESHOLDS,
  applyEvolution,
  createRng,
  makePlayer,
  normalizePlayer,
  resolveDuel,
  sampleTeams,
  simulateMatch
};

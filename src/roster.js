"use strict";

const { makePlayer } = require("./engine");

const PLAYER_BLUEPRINTS = [
  {
    id: "hist-barao-rio-branco",
    name: "Barao do Rio Branco",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "GK",
    source: "historical",
    archetype: "Diplomatic Keeper",
    preferredStyle: "defense",
    specialSkill: "Tratado da Area",
    attributes: {
      technique: 58,
      physique: 62,
      vision: 86,
      ego: 64,
      discipline: 90,
      creativity: 70,
      emotionalControl: 88,
      defense: 74,
      finishing: 30,
      goalkeeping: 84
    }
  },
  {
    id: "hist-dandara",
    name: "Dandara dos Palmares",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "DF",
    source: "historical",
    archetype: "Quilombo Captain",
    preferredStyle: "defense",
    specialSkill: "Corte de Palmares",
    attributes: {
      technique: 68,
      physique: 84,
      vision: 72,
      ego: 84,
      discipline: 80,
      creativity: 66,
      emotionalControl: 78,
      defense: 88,
      finishing: 58,
      goalkeeping: 35
    }
  },
  {
    id: "hist-zumbi",
    name: "Zumbi dos Palmares",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "DF",
    source: "historical",
    archetype: "Last Line Rebel",
    preferredStyle: "defense",
    specialSkill: "Muralha do Quilombo",
    attributes: {
      technique: 66,
      physique: 88,
      vision: 70,
      ego: 86,
      discipline: 74,
      creativity: 60,
      emotionalControl: 75,
      defense: 90,
      finishing: 62,
      goalkeeping: 35
    }
  },
  {
    id: "hist-maria-quiteria",
    name: "Maria Quiteria",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "DF",
    source: "historical",
    archetype: "Independence Tackler",
    preferredStyle: "defense",
    specialSkill: "Carrinho da Independencia",
    attributes: {
      technique: 64,
      physique: 80,
      vision: 68,
      ego: 76,
      discipline: 86,
      creativity: 58,
      emotionalControl: 82,
      defense: 84,
      finishing: 56,
      goalkeeping: 35
    }
  },
  {
    id: "hist-luiz-gama",
    name: "Luiz Gama",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "MF",
    source: "historical",
    archetype: "Legal Playmaker",
    preferredStyle: "pass",
    specialSkill: "Recurso Impossivel",
    attributes: {
      technique: 78,
      physique: 66,
      vision: 90,
      ego: 74,
      discipline: 88,
      creativity: 84,
      emotionalControl: 86,
      defense: 72,
      finishing: 64,
      goalkeeping: 35
    }
  },
  {
    id: "hist-chiquinha",
    name: "Chiquinha Gonzaga",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "MF",
    source: "historical",
    archetype: "Maestra de Pressao",
    preferredStyle: "pass",
    specialSkill: "Partitura Taticamente Perfeita",
    attributes: {
      technique: 84,
      physique: 56,
      vision: 88,
      ego: 74,
      discipline: 82,
      creativity: 94,
      emotionalControl: 84,
      defense: 58,
      finishing: 67,
      goalkeeping: 35
    }
  },
  {
    id: "hist-machado",
    name: "Machado de Assis",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "AM",
    source: "historical",
    archetype: "Bruxo do Meio-Campo",
    preferredStyle: "pass",
    specialSkill: "Ironia Obliqua",
    attributes: {
      technique: 86,
      physique: 48,
      vision: 96,
      ego: 72,
      discipline: 88,
      creativity: 94,
      emotionalControl: 92,
      defense: 55,
      finishing: 74,
      goalkeeping: 35
    }
  },
  {
    id: "hist-santos-dumont",
    name: "Santos Dumont",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "WG",
    source: "historical",
    archetype: "Aerial Winger",
    preferredStyle: "sprint",
    specialSkill: "14-Bis na Linha de Fundo",
    attributes: {
      technique: 82,
      physique: 70,
      vision: 88,
      ego: 70,
      discipline: 80,
      creativity: 92,
      emotionalControl: 78,
      defense: 52,
      finishing: 72,
      goalkeeping: 35
    }
  },
  {
    id: "hist-tarsila",
    name: "Tarsila do Amaral",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "WG",
    source: "historical",
    archetype: "Modernist Dribbler",
    preferredStyle: "dribble",
    specialSkill: "Abaporu Cut",
    attributes: {
      technique: 84,
      physique: 58,
      vision: 78,
      ego: 78,
      discipline: 70,
      creativity: 96,
      emotionalControl: 76,
      defense: 48,
      finishing: 70,
      goalkeeping: 35
    }
  },
  {
    id: "hist-anita-garibaldi",
    name: "Anita Garibaldi",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "FW",
    source: "historical",
    archetype: "Farroupilha Striker",
    preferredStyle: "sprint",
    specialSkill: "Arrancada Farrapa",
    attributes: {
      technique: 76,
      physique: 84,
      vision: 70,
      ego: 84,
      discipline: 76,
      creativity: 72,
      emotionalControl: 80,
      defense: 66,
      finishing: 80,
      goalkeeping: 35
    }
  },
  {
    id: "hist-aleijadinho",
    name: "Aleijadinho",
    team: "historia",
    teamName: "Historia do Brasil FC",
    role: "FW",
    source: "historical",
    archetype: "Baroque Finisher",
    preferredStyle: "shoot",
    specialSkill: "Escultura no Angulo",
    attributes: {
      technique: 90,
      physique: 46,
      vision: 76,
      ego: 72,
      discipline: 82,
      creativity: 90,
      emotionalControl: 84,
      defense: 44,
      finishing: 84,
      goalkeeping: 35
    }
  },
  {
    id: "net-gaules",
    name: "Gaules",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "GK",
    source: "internet_persona",
    archetype: "Tribo Keeper",
    preferredStyle: "defense",
    specialSkill: "Defesa da Tribo",
    attributes: {
      technique: 62,
      physique: 68,
      vision: 80,
      ego: 72,
      discipline: 78,
      creativity: 72,
      emotionalControl: 90,
      defense: 76,
      finishing: 35,
      goalkeeping: 86
    }
  },
  {
    id: "net-chorume-gremio",
    name: "Chorume do Gremio",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "DF",
    source: "meme_collective",
    archetype: "Imortal Corneteiro",
    preferredStyle: "defense",
    specialSkill: "Corneta Imortal",
    attributes: {
      technique: 62,
      physique: 76,
      vision: 74,
      ego: 90,
      discipline: 52,
      creativity: 82,
      emotionalControl: 54,
      defense: 86,
      finishing: 58,
      goalkeeping: 35
    }
  },
  {
    id: "net-nobru",
    name: "Nobru",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "DF",
    source: "influencer",
    archetype: "Reflex Defender",
    preferredStyle: "sprint",
    specialSkill: "Capa no Carrinho",
    attributes: {
      technique: 84,
      physique: 80,
      vision: 78,
      ego: 78,
      discipline: 70,
      creativity: 76,
      emotionalControl: 74,
      defense: 76,
      finishing: 66,
      goalkeeping: 35
    }
  },
  {
    id: "net-casimiro",
    name: "Casimiro",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "MF",
    source: "streamer",
    archetype: "People's Regista",
    preferredStyle: "pass",
    specialSkill: "Meteu Essa Assistencia",
    attributes: {
      technique: 76,
      physique: 64,
      vision: 90,
      ego: 70,
      discipline: 74,
      creativity: 84,
      emotionalControl: 92,
      defense: 62,
      finishing: 68,
      goalkeeping: 35
    }
  },
  {
    id: "net-cellbit",
    name: "Cellbit",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "MF",
    source: "streamer",
    archetype: "Puzzle Midfielder",
    preferredStyle: "pass",
    specialSkill: "Enigma Entrelinhas",
    attributes: {
      technique: 80,
      physique: 58,
      vision: 92,
      ego: 76,
      discipline: 82,
      creativity: 92,
      emotionalControl: 78,
      defense: 60,
      finishing: 70,
      goalkeeping: 35
    }
  },
  {
    id: "net-manoel-gomes",
    name: "Manoel Gomes",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "MF",
    source: "meme_artist",
    archetype: "Caneta Maestro",
    preferredStyle: "pass",
    specialSkill: "Caneta Azul na Gaveta",
    attributes: {
      technique: 74,
      physique: 60,
      vision: 80,
      ego: 78,
      discipline: 68,
      creativity: 88,
      emotionalControl: 82,
      defense: 54,
      finishing: 76,
      goalkeeping: 35
    }
  },
  {
    id: "net-orochinho",
    name: "Orochinho",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "AM",
    source: "influencer",
    archetype: "Chaos Creator",
    preferredStyle: "dribble",
    specialSkill: "Corte do Caos",
    attributes: {
      technique: 82,
      physique: 62,
      vision: 78,
      ego: 86,
      discipline: 54,
      creativity: 94,
      emotionalControl: 62,
      defense: 42,
      finishing: 76,
      goalkeeping: 35
    }
  },
  {
    id: "net-alanzoka",
    name: "Alanzoka",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "WG",
    source: "streamer",
    archetype: "Reaction Winger",
    preferredStyle: "dribble",
    specialSkill: "Reflexo de Live",
    attributes: {
      technique: 86,
      physique: 74,
      vision: 76,
      ego: 74,
      discipline: 70,
      creativity: 84,
      emotionalControl: 76,
      defense: 50,
      finishing: 74,
      goalkeeping: 35
    }
  },
  {
    id: "net-peewee-squad",
    name: "PeeWee Squad",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "WG",
    source: "creator_collective",
    archetype: "Cinema Winger",
    preferredStyle: "pass",
    specialSkill: "Review em Diagonal",
    attributes: {
      technique: 78,
      physique: 62,
      vision: 84,
      ego: 72,
      discipline: 76,
      creativity: 88,
      emotionalControl: 80,
      defense: 52,
      finishing: 70,
      goalkeeping: 35
    }
  },
  {
    id: "net-luva",
    name: "Luva de Pedreiro",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "FW",
    source: "meme_influencer",
    archetype: "Receba Striker",
    preferredStyle: "shoot",
    specialSkill: "Receba no Angulo",
    attributes: {
      technique: 76,
      physique: 88,
      vision: 66,
      ego: 94,
      discipline: 62,
      creativity: 76,
      emotionalControl: 72,
      defense: 46,
      finishing: 90,
      goalkeeping: 35
    }
  },
  {
    id: "net-ines-brasil",
    name: "Ines Brasil",
    team: "internet",
    teamName: "Internet Brasileira FC",
    role: "FW",
    source: "meme_artist",
    archetype: "Showtime Striker",
    preferredStyle: "special",
    specialSkill: "Aloka do Contra-Ataque",
    attributes: {
      technique: 78,
      physique: 66,
      vision: 72,
      ego: 96,
      discipline: 48,
      creativity: 92,
      emotionalControl: 72,
      defense: 40,
      finishing: 82,
      goalkeeping: 35
    }
  }
];

function createPlayer(blueprint) {
  return makePlayer(blueprint.id, blueprint.name, blueprint.role, blueprint.attributes, {
    team: blueprint.team,
    teamName: blueprint.teamName,
    source: blueprint.source,
    archetype: blueprint.archetype,
    preferredStyle: blueprint.preferredStyle,
    specialSkill: blueprint.specialSkill
  });
}

function getRoster() {
  return PLAYER_BLUEPRINTS.map(createPlayer);
}

function getTeamPlayers(team) {
  return PLAYER_BLUEPRINTS.filter((player) => player.team === team).map(createPlayer);
}

function splitTeams() {
  return {
    home: getTeamPlayers("historia"),
    away: getTeamPlayers("internet")
  };
}

module.exports = {
  PLAYER_BLUEPRINTS,
  getRoster,
  getTeamPlayers,
  splitTeams
};

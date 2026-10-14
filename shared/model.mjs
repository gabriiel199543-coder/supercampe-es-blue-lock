import {clamp,clone,average} from './rng.mjs';
export const formations = {
      "433": [
        ["GK", 50, 88], ["RB", 82, 68], ["CB", 62, 72], ["CB", 38, 72], ["LB", 18, 68],
        ["DM", 50, 58], ["CM", 35, 48], ["CM", 65, 48], ["RW", 82, 27], ["ST", 50, 18], ["LW", 18, 27]
      ],
      "4231": [
        ["GK", 50, 88], ["RB", 82, 69], ["CB", 62, 73], ["CB", 38, 73], ["LB", 18, 69],
        ["DM", 42, 58], ["DM", 58, 58], ["AM", 50, 42], ["RW", 82, 30], ["ST", 50, 18], ["LW", 18, 30]
      ],
      "343": [
        ["GK", 50, 88], ["CB", 68, 72], ["CB", 50, 76], ["CB", 32, 72],
        ["RWB", 82, 52], ["LWB", 18, 52], ["CM", 42, 45], ["AM", 58, 38], ["RW", 80, 24], ["ST", 50, 18], ["LW", 20, 24]
      ],
      "442": [
        ["GK", 50, 88], ["RB", 82, 70], ["CB", 62, 73], ["CB", 38, 73], ["LB", 18, 70],
        ["RM", 78, 46], ["CM", 58, 48], ["CM", 42, 48], ["LM", 22, 46], ["ST", 58, 20], ["ST", 42, 20]
      ]
    };

export const roleOptions = {
      GK: [["keeper", "Goleiro clássico"], ["sweeperKeeper", "Goleiro líbero"]],
      CB: [["stopper", "Zagueiro xerife"], ["cover", "Zagueiro cobertura"], ["ballPlayingDef", "Construtor defensivo"]],
      RB: [["fullback", "Lateral apoiador"], ["wingback", "Ala agressivo"], ["defFullback", "Lateral defensivo"]],
      LB: [["fullback", "Lateral apoiador"], ["wingback", "Ala agressivo"], ["defFullback", "Lateral defensivo"]],
      RWB: [["wingback", "Ala agressivo"], ["wideCreator", "Ala criador"], ["defFullback", "Ala contido"]],
      LWB: [["wingback", "Ala agressivo"], ["wideCreator", "Ala criador"], ["defFullback", "Ala contido"]],
      DM: [["anchor", "Volante âncora"], ["ballWinner", "Cão de guarda"], ["regista", "Regista"]],
      CM: [["playmaker", "Armador"], ["boxToBox", "Box-to-box"], ["ballWinner", "Meio-campista combativo"]],
      RM: [["wideCreator", "Meia aberto"], ["winger", "Ponta trabalhador"], ["boxToBox", "Meia intenso"]],
      LM: [["wideCreator", "Meia aberto"], ["winger", "Ponta trabalhador"], ["boxToBox", "Meia intenso"]],
      AM: [["advancedPlaymaker", "Meia criador"], ["shadowStriker", "Atacante sombra"], ["freeCreator", "Criador livre"]],
      RW: [["winger", "Ponta aberto"], ["insideForward", "Ponta invertido"], ["wideCreator", "Criador de lado"]],
      LW: [["winger", "Ponta aberto"], ["insideForward", "Ponta invertido"], ["wideCreator", "Criador de lado"]],
      ST: [["poacher", "Matador"], ["pressingForward", "Atacante pressionador"], ["falseNine", "Falso 9"], ["egoStriker", "Atacante egoísta"]]
    };

export const roleWeights = {
      keeper: { goalkeeping: .55, emotionalControl: .2, defense: .15, discipline: .1 },
      sweeperKeeper: { goalkeeping: .38, vision: .22, technique: .18, emotionalControl: .14, discipline: .08 },
      stopper: { defense: .42, physique: .24, ego: .14, discipline: .12, emotionalControl: .08 },
      cover: { defense: .34, vision: .2, discipline: .2, emotionalControl: .16, physique: .1 },
      ballPlayingDef: { defense: .28, technique: .24, vision: .24, discipline: .14, emotionalControl: .1 },
      fullback: { defense: .25, physique: .2, technique: .2, vision: .18, discipline: .17 },
      wingback: { physique: .26, technique: .24, creativity: .17, defense: .17, ego: .1, discipline: .06 },
      defFullback: { defense: .38, discipline: .25, emotionalControl: .16, physique: .13, vision: .08 },
      anchor: { defense: .34, discipline: .28, emotionalControl: .17, vision: .13, physique: .08 },
      ballWinner: { defense: .32, physique: .23, discipline: .2, ego: .13, emotionalControl: .12 },
      regista: { vision: .34, technique: .24, discipline: .18, creativity: .14, emotionalControl: .1 },
      playmaker: { vision: .34, technique: .23, creativity: .21, discipline: .12, emotionalControl: .1 },
      boxToBox: { physique: .26, technique: .18, vision: .17, defense: .17, discipline: .12, ego: .1 },
      wideCreator: { creativity: .28, vision: .24, technique: .22, physique: .1, emotionalControl: .08, ego: .08 },
      winger: { technique: .3, physique: .2, creativity: .17, vision: .12, ego: .12, discipline: .09 },
      insideForward: { finishing: .3, technique: .24, ego: .19, creativity: .13, physique: .08, emotionalControl: .06 },
      advancedPlaymaker: { vision: .35, creativity: .26, technique: .22, emotionalControl: .09, discipline: .08 },
      shadowStriker: { finishing: .29, ego: .23, technique: .2, creativity: .14, physique: .08, vision: .06 },
      freeCreator: { creativity: .34, technique: .25, ego: .18, vision: .15, emotionalControl: .08 },
      poacher: { finishing: .42, ego: .22, technique: .17, emotionalControl: .12, physique: .07 },
      pressingForward: { physique: .25, finishing: .22, ego: .17, discipline: .15, defense: .12, technique: .09 },
      falseNine: { vision: .28, technique: .24, creativity: .22, finishing: .12, discipline: .08, ego: .06 },
      egoStriker: { ego: .34, finishing: .28, technique: .18, creativity: .12, emotionalControl: .08 }
    };

export const actionWeights = {
      dribble: { attack: { technique: .33, creativity: .22, ego: .18, physique: .12, emotionalControl: .08, vision: .07 }, defense: { defense: .35, physique: .18, discipline: .18, emotionalControl: .12, vision: .09, technique: .08 } },
      pass: { attack: { vision: .35, technique: .22, creativity: .18, discipline: .12, emotionalControl: .08, ego: .05 }, defense: { defense: .28, vision: .22, discipline: .2, physique: .12, emotionalControl: .1, technique: .08 } },
      sprint: { attack: { physique: .35, technique: .18, ego: .16, vision: .1, creativity: .1, emotionalControl: .06, discipline: .05 }, defense: { physique: .3, defense: .26, discipline: .17, emotionalControl: .12, vision: .09, technique: .06 } },
      shoot: { attack: { finishing: .36, technique: .21, ego: .19, emotionalControl: .13, physique: .07, creativity: .04 }, defense: { goalkeeping: .38, defense: .18, emotionalControl: .16, physique: .12, vision: .1, discipline: .06 } },
      special: { attack: { ego: .25, technique: .23, creativity: .2, emotionalControl: .13, finishing: .12, physique: .07 }, defense: { defense: .27, emotionalControl: .19, physique: .16, vision: .14, discipline: .13, technique: .11 } }
    };

export const families=['impact','creation','reading'];
export const familyLabels={impact:'Impacto',creation:'Criação',reading:'Leitura'};
export const familyId=value=>({Impacto:'impact','Criação':'creation',Leitura:'reading'}[value]||value);
export const attributeLabels={technique:'Técnica',physique:'Físico',vision:'Visão',ego:'Ego',discipline:'Disciplina',creativity:'Criatividade',emotionalControl:'Controle emocional',defense:'Defesa',finishing:'Finalização',goalkeeping:'Goleiro'};
const positions={GK:['GK'],DF:['CB','RB','LB','RWB','LWB','DM'],MF:['CM','DM','AM','RM','LM'],AM:['AM','CM','ST'],WG:['RW','LW','RM','LM'],FW:['ST','AM']};
export function migratePlayer(input){
 const p=clone(input);p.baseRole=p.baseRole||p.role||'MF';p.role=p.baseRole;
 p.naturalPositions=p.naturalPositions||positions[p.baseRole]||positions.MF;
 p.condition=p.condition??p.state?.stamina??96;p.morale=p.morale??62;p.sharpness=p.sharpness??54;
 p.fatigue=p.fatigue??0;p.pressure=p.pressure??0;p.focus=p.focus??100;p.awakening=p.awakening??0;p.stage=p.stage??0;
 p.skills=p.skills||[];p.styleCounters=p.styleCounters||{};p.appearance=p.appearance||'Potencial bruto';p.evolutionTitle=p.evolutionTitle||'Talento bruto';
 p.personality={cooperation:60,ambition:60,resilience:60,adaptability:60,...p.personality};delete p.personality.ego;delete p.personality.discipline;
 p.psychology={confidence:55,frustration:0,coachTrust:60,...p.psychology};
 const signature=p.power?{id:p.power.id,name:p.power.name,family:familyId(p.power.category),mastery:p.power.initialMastery||0,status:p.power.initialStatus||'latente',signature:true}:null;
 p.development={affinity:Object.fromEntries(families.map(f=>[f,p.affinities?.[familyLabels[f]]??50])),mastery:{impact:0,creation:0,reading:0},significantExperience:0,meaningfulConfrontations:0,trainingPreparation:0,assimilation:p.assimilation??50,readiness:0,familyExperience:{impact:0,creation:0,reading:0},familyTraining:{impact:0,creation:0,reading:0},awakeningAttemptsByMatch:{},powerInstances:signature?[signature]:[],...p.development};
 if(p.stage>=1&&!input.development&&signature&&!p.development.powerInstances.some(x=>x.id===signature.id&&x.status!=='latente')){const existing=p.development.powerInstances.find(x=>x.id===signature.id);if(existing){existing.status='conhecido';existing.mastery=Math.max(20,existing.mastery);}else p.development.powerInstances.push({...signature,status:'conhecido',mastery:20});}
 p.memories=p.memories||[];p.memoryIds=p.memoryIds||[];p.memorySummary=p.memorySummary||{archived:0};return p;
}
export const attr=(p,k)=>Number(p.attributes[k]??50);
export const weighted=(p,weights)=>Object.entries(weights).reduce((s,[k,w])=>s+attr(p,k)*w,0);
export function positionFit(p,position){if(p.naturalPositions.includes(position))return 100;if(position==='GK'||p.baseRole==='GK')return 15;return ['MF','AM','WG','FW'].includes(p.baseRole)&&['CM','AM','RW','LW','RM','LM','ST'].includes(position)?72:48;}
export const slotsFor=formation=>(formations[formation]||formations['433']).map(([position,y,rawX],i)=>({slotId:'slot-'+i,position,x:100-rawX,y}));
export const defaultRole=pos=>roleOptions[pos][0][0];
export const roleScore=(p,role)=>weighted(p,roleWeights[role]||roleWeights.playmaker);
export function slotScore(p,slot,role=defaultRole(slot.position)){return roleScore(p,role)*.72+positionFit(p,slot.position)*.28+(p.condition-80)*.12+(p.morale-60)*.06+(p.sharpness-50)*.05;}
export function autoLineup(players,formation='433'){const available=players.slice();return slotsFor(formation).map(slot=>{const roleId=defaultRole(slot.position);available.sort((a,b)=>slotScore(b,slot,roleId)-slotScore(a,slot,roleId));const chosen=available.shift();return{slotId:slot.slotId,playerId:chosen.id,roleId};});}
export function validateLineup(players,formation,slots,benchIds){
 if(!formations[formation]||!Array.isArray(slots)||slots.length!==11)throw Error('INVALID_LINEUP: A escalação precisa de 11 titulares.');
 const ids=slots.map(s=>s.playerId);if(new Set(ids).size!==11)throw Error('INVALID_LINEUP: Há jogadores repetidos.');
 const reference=slotsFor(formation);const pool=new Map(players.map(p=>[p.id,p]));const slotIds=new Set();
 for(const s of slots){const pos=reference.find(x=>x.slotId===s.slotId);const p=pool.get(s.playerId);if(!p)throw Error('INVALID_PLAYER: Jogador fora do seu elenco.');if(!pos||slotIds.has(s.slotId)||!roleOptions[pos.position].some(r=>r[0]===s.roleId))throw Error('INVALID_LINEUP: Posição ou função inválida.');slotIds.add(s.slotId);if((pos.position==='GK')!==(p.baseRole==='GK'))throw Error('INVALID_LINEUP: Use um goleiro na meta e jogadores de linha nas outras posições.');}
 if(!Array.isArray(benchIds)||benchIds.length!==players.length-11||new Set([...ids,...benchIds]).size!==players.length||benchIds.some(id=>!pool.has(id)))throw Error('INVALID_LINEUP: Reservas inválidos.');
 return true;
}
export const defaultTactics=()=>({identity:'control',pressing:55,tempo:55,freedom:55,risk:55,compactness:55});
export function validateTactics(input,current=defaultTactics()){const out={...current};for(const key of ['pressing','tempo','freedom','risk','compactness']){if(input[key]!==undefined){if(!Number.isFinite(input[key])||input[key]<0||input[key]>100)throw Error('INVALID_MESSAGE: Instrução fora de 0–100.');out[key]=input[key];}}if(input.identity!==undefined){if(!['control','vertical','compact','ego'].includes(input.identity))throw Error('INVALID_MESSAGE: Identidade inválida.');out.identity=input.identity;}return out;}
export function teamStrength(team){return average(team.lineup.map(s=>{const p=team.players.find(p=>p.id===s.playerId);return slotScore(p,slotsFor(team.formation).find(x=>x.slotId===s.slotId),s.roleId);}));}

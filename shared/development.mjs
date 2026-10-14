import {clamp,clone,random,weightedPick,hashSeed} from './rng.mjs';
import {migratePlayer,families,familyId} from './model.mjs';
import {rules} from './config.mjs';
export const readiness=(experience,preparation,assimilation)=>clamp(experience*.5+preparation*.3+assimilation*.2);
export const awakeningChance=value=>.04+.06*clamp((value-65)/35,0,1);
export function updateReadiness(player){const d=player.development;d.readiness=readiness(d.significantExperience,d.trainingPreparation,d.assimilation);return d.readiness;}
export function normalizeState(p){for(const k of ['condition','morale','sharpness','fatigue','pressure','focus'])p[k]=clamp(p[k]);for(const k of Object.keys(p.attributes))p.attributes[k]=clamp(p.attributes[k],1,100);for(const k of Object.keys(p.psychology))p.psychology[k]=clamp(p.psychology[k]);updateReadiness(p);}
export function visualEvolution(p){const thresholds=rules.compatibility.existing_stage_thresholds;while(p.stage<3&&p.awakening>=thresholds[p.stage+1]){p.stage++;p.evolutionTitle=['Talento bruto','Promessa','Especialista','Gênio'][p.stage];p.appearance=['Base','Postura confiante','Aura de especialista','Forma desperta'][p.stage];}}
export function trainSquad(players,{type='balanced',focusPlayerId}={}){
 if(!rules.training.family_exposure_distribution[type])throw Error('Treino inválido.');
 return players.map(input=>{const p=migratePlayer(input),boost=p.id===focusPlayerId?1.85:1,d=p.development,distribution=rules.training.family_exposure_distribution[type];
 if(type==='balanced'){p.sharpness+=4*boost;p.morale+=2;p.attributes.discipline+=.5;}
 if(type==='finishing'){p.attributes.finishing+=['FW','WG','AM'].includes(p.baseRole)?1.4*boost:.45;p.sharpness+=3;p.fatigue+=4;}
 if(type==='creation'){p.attributes.vision+=['MF','AM','WG'].includes(p.baseRole)?1.35*boost:.4;p.attributes.creativity+=.9*boost;p.fatigue+=3;}
 if(type==='defense'){p.attributes.defense+=['GK','DF','MF'].includes(p.baseRole)?1.4*boost:.45;p.attributes.discipline+=.7;p.fatigue+=3;}
 if(type==='ego'){p.attributes.ego+=1.2*boost;p.awakening+=7*boost;p.morale+=3;p.fatigue+=5;}
 if(type==='rest'){p.fatigue-=10;p.morale+=5;p.condition+=5;p.focus+=10;}
 else{d.trainingPreparation=clamp(d.trainingPreparation+(100-d.trainingPreparation)*.08*boost);for(const f of families){d.familyTraining[f]=clamp(d.familyTraining[f]+distribution[f]*6*boost);for(const power of d.powerInstances){if(power.status!=='latente'&&power.family===f)power.mastery=clamp(power.mastery+.4*distribution[f]*boost);}}}
 visualEvolution(p);normalizeState(p);return p;});
}
export const relationKey=(a,b)=>[a,b].sort().join('|');
export function relationship(state,a,b){const key=relationKey(a,b);if(!state.relationships[key]){const r=hashSeed(key);state.relationships[key]={personalAffinity:(r%101)-50,chemistry:40+(r%21),rivalry:r%25,history:[]};}return state.relationships[key];}
export function recordMemory(player,memory){
 if(player.memoryIds.includes(memory.id))return false;
 memory.effectsApplied=true;player.memoryIds.push(memory.id);player.memories.push(memory);
 if(player.memories.length>20){player.memories.shift();player.memorySummary.archived++;}
 return true;
}
export function learnFromDuel(state,p,{family,success,action,opponent,eventId,meaningful=false,importance=2}){
 const d=p.development;p.awakening+=success?2.2:1;p.styleCounters[action]=(p.styleCounters[action]||0)+(success?2:1);
 p.psychology.confidence+=success?.3:-.2;p.psychology.frustration+=success?-.5:.3;
 if(state.exhibition){normalizeState(p);return null;}
 d.familyExperience[family]=clamp(d.familyExperience[family]+(meaningful?2:.15));
 if(meaningful&&recordMemory(p,{id:eventId+':'+p.id,matchId:state.id,minute:state.minute,subjectPlayerId:p.id,relatedPlayerIds:[opponent.id],kind:success?'decisive_success':'countered_by_opponent',family,importance,outcome:success?'success':'failure',context:{action,competition:'offline'},effectsApplied:false})){
 d.meaningfulConfrontations++;d.significantExperience=clamp(d.significantExperience+(100-d.significantExperience)*.035);d.assimilation=clamp(d.assimilation+.12+p.personality.adaptability/500);
 }
 visualEvolution(p);normalizeState(p);
 if(!meaningful||d.readiness<65||d.meaningfulConfrontations<3||d.awakeningAttemptsByMatch[state.id])return null;
 d.awakeningAttemptsByMatch[state.id]=true;
 if(random(state)>=awakeningChance(d.readiness))return null;
 const normalize=o=>{const sum=families.reduce((s,f)=>s+(o[f]||0),0);return Object.fromEntries(families.map(f=>[f,sum?(o[f]||0)/sum:1/3]));};
 const personality={impact:p.attributes.physique+p.personality.ambition,creation:p.attributes.creativity+p.personality.adaptability,reading:p.attributes.vision+p.attributes.discipline};
 const sources=[[normalize(d.affinity),.4],[normalize(d.familyExperience),.35],[normalize(d.familyTraining),.2],[normalize(personality),.05]];
 const eligible=rules.skill_catalog.filter(skill=>!d.powerInstances.some(x=>x.id===skill.id)&&(!(p.baseRole==='GK')||skill.compatible_actions.includes('defend')));
 const eligibleFamilies=families.filter(f=>eligible.some(x=>x.family===f));if(!eligibleFamilies.length)return null;
 const chosenFamily=weightedPick(eligibleFamilies,f=>Math.max(.02,sources.reduce((s,[values,w])=>s+values[f]*w,0)),()=>random(state));
 const possible=eligible.filter(x=>x.family===chosenFamily);const skill=possible[Math.floor(random(state)*possible.length)];
 const signature=p.power&&familyId(p.power.category)===chosenFamily&&d.powerInstances.find(x=>x.id===p.power.id&&x.status==='latente');
 const instance=signature||{id:skill.id,name:skill.name,family:chosenFamily,mastery:0,status:'latente',signature:false};
 instance.status='conhecido';instance.mastery=10;if(!signature)d.powerInstances.push(instance);if(!p.skills.includes(instance.name))p.skills.push(instance.name);
 return instance;
}
export function talkToPlayer(input,approach,contextKey){
 const p=migratePlayer(input);p.conversations=p.conversations||{};if(p.conversations[contextKey])return{player:p,applied:false,summary:'A conversa desta semana já foi registrada.'};
 const traits=p.personality;let reaction;
 if(approach==='demand_protagonism')reaction=(p.attributes.ego+traits.ambition-110)/90;
 else if(approach==='protect_from_pressure')reaction=(p.pressure+100-traits.resilience)/100;
 else if(approach==='emphasize_collective')reaction=(traits.cooperation-50)/50;
 else if(approach==='challenge_individually')reaction=(traits.ambition+traits.resilience-p.psychology.frustration-120)/80;
 else throw Error('Abordagem inválida.');
 const moraleDelta=clamp(reaction*3,-3,3);p.morale+=moraleDelta;p.psychology.coachTrust+=clamp(reaction*5,-5,5);p.conversations[contextKey]=approach;normalizeState(p);
 return{player:p,applied:true,summary:moraleDelta>=0?'A conversa reforçou a confiança no plano.':'O jogador recebeu a cobrança com alguma reserva.'};
}

import {generateClub,editClub,validateClub,clubSvg,getPath} from '../shared/clubs.mjs';
const $=id=>document.getElementById(id), money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
let club,pools,coherence,presets,reroll=0,locks=[];
const definitions=[
 ['clubName','Nome do clube','text'],['shortName','Sigla','text'],['motto','Lema','text'],['origin.clubOriginType','Origem','origin'],
 ['origin.city','Cidade','text'],['origin.stateRegion','Estado ou região','text'],['colors.primaryColor','Cor principal','color'],['colors.secondaryColor','Cor secundária','color'],['colors.accentColor','Cor de destaque','color'],
 ['visualIdentity.crestShape','Formato do escudo',['escudo','redondo','brasao','moderno','diamante']],['visualIdentity.crestIcon','Símbolo','symbols'],
 ['visualIdentity.flagLayout','Bandeira',['horizontal','vertical','diagonal']],['visualIdentity.bannerPattern','Padrão do estandarte',['listras','diagonal','bicolor','chevron','cruz','quartelada']],
 ['stadium.stadiumName','Nome do estádio','text'],['stadium.capacity','Lotação','number'],['fanbase.localSupporters','Torcedores locais','number'],['fanbase.digitalFollowers','Seguidores digitais','number']
];
function showMessage(message,error=false){$('feedback').textContent=message;$('feedback').className='message'+(error?' error':'');}
function option(value,label){const o=document.createElement('option');o.value=value;o.textContent=label;return o;}
function buildFields(){
 $('fields').replaceChildren();
 for(const [key,label,type]of definitions){const row=document.createElement('div');row.className='edit-field';const wrapper=document.createElement('label');wrapper.textContent=label;
 let control;if(type==='origin'||type==='symbols'||Array.isArray(type)){control=document.createElement('select');const choices=type==='origin'?Object.keys(coherence.originProfiles):type==='symbols'?pools.symbolPool.map(x=>x.iconId):type;for(const c of choices)control.append(option(c,c));}else{control=document.createElement('input');control.type=type;if(type==='number')control.min=0;if(key==='stadium.capacity'){control.min=1500;control.max=60000;control.step=100;}if(key==='clubName')control.maxLength=40;}
 control.dataset.field=key;wrapper.append(control);const lock=document.createElement('label');lock.className='lock';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.lock=key;lock.append(checkbox,document.createTextNode('Travar'));
 checkbox.addEventListener('change',()=>{locks=checkbox.checked?[...new Set([...locks,key])]:locks.filter(k=>k!==key);});
 control.addEventListener('change',()=>{try{club=editClub(club,{[key]:type==='number'?Number(control.value):control.value},coherence);locks=[...new Set([...locks,key])];render();showMessage(club.coherence.valid?'Alteração preservada.':club.coherence.errors.join(' '),!club.coherence.valid);}catch(error){showMessage(error.message,true);}});
 row.append(wrapper,lock);$('fields').append(row);}
}
function stat(label,value){const el=document.createElement('div');el.className='stat';el.append(document.createTextNode(label));const b=document.createElement('strong');b.textContent=value;el.append(b);return el;}
function render(){
 $('clubName').textContent=club.clubName;$('motto').textContent=club.motto;$('origin').textContent=club.origin.city+' · '+club.origin.stateRegion+' · '+club.origin.clubOriginType;
 for(const kind of ['crest','flag','banner'])$(kind).innerHTML=clubSvg(club,kind);
 $('stadium').replaceChildren(stat(club.stadium.stadiumName,club.stadium.capacity.toLocaleString('pt-BR')+' lugares'));
 $('finances').replaceChildren(stat('Torcida local',club.fanbase.localSupporters.toLocaleString('pt-BR')),stat('Audiência digital',club.fanbase.digitalFollowers.toLocaleString('pt-BR')),stat('Público médio projetado',club.fanbase.averageHomeAttendance.toLocaleString('pt-BR')),stat('Ocupação',(club.fanbase.stadiumOccupancyRate*100).toFixed(0)+'%'),stat('Orçamento anual',money(club.economy.annualOperatingBudgetBRL)),stat('Folha anual',money(club.economy.annualPayrollBudgetBRL)),stat('Transferências anuais',money(club.economy.annualTransfersBudgetBRL)),stat('Financiamento',coherence.fundingTypes[club.economy.primaryFunding]?.label||club.economy.primaryFunding));
 const report=validateClub(club,coherence);$('coherence').textContent='Coerência '+report.score+'/100'+(report.warnings.length?' · '+report.warnings.join(' '):' · Nenhum alerta.');$('coherence').className='message';
 $('save').disabled=!report.valid;
 document.querySelectorAll('[data-field]').forEach(input=>input.value=getPath(club,input.dataset.field)??'');document.querySelectorAll('[data-lock]').forEach(input=>input.checked=locks.includes(input.dataset.lock));
}
function generate(group='all'){try{club=generateClub({seed:$('seed').value+(reroll?':'+reroll:''),theme:$('theme').value,pools,coherence,base:club,lockedFields:locks,group});render();showMessage('Clube gerado. Campos travados foram preservados.');}catch(error){showMessage(error.message,true);}}
$('generate').addEventListener('click',()=>{reroll=0;generate();});
$('visual').addEventListener('click',()=>{reroll++;generate('identidade');});
$('newClub').addEventListener('click',()=>{club=null;locks=[];reroll=0;$('preset').value='';$('seed').value=crypto.randomUUID();generate();});
$('preset').addEventListener('change',()=>{if(!$('preset').value)return;club=structuredClone(presets.find(c=>c.clubId===$('preset').value));locks=club.generation.lockedFields||[];render();showMessage('Clube predefinido carregado com sua identidade original.');});
$('save').addEventListener('click',()=>{const report=validateClub(club,coherence);if(!report.valid)return showMessage(report.errors.join(' '),true);try{localStorage.setItem('manager.club.v1',JSON.stringify(club));showMessage('Clube salvo. Use “Abrir o gerenciamento” para começar.');}catch{showMessage('O navegador não permitiu salvar o clube.',true);}});
try{
 [pools,coherence,presets]=await Promise.all(['parametros_criador_clubes_v1.json','config_coerencia_v1_1.json','clubes_exemplo_20_coerentes.json'].map(async file=>{const response=await fetch('dados/clubes/'+file);if(!response.ok)throw Error('Não foi possível carregar os clubes. Inicie com npm start.');return response.json();}));
 for(const [id,t]of Object.entries(pools.themes))$('theme').append(option(id,t.label));for(const p of presets)$('preset').append(option(p.clubId,p.clubName));
 buildFields();try{club=JSON.parse(localStorage.getItem('manager.club.v1')||'null');}catch{}if(club&&validateClub(club,coherence).valid){locks=club.generation.lockedFields||[];render();}else generate();
}catch(error){showMessage(error.message,true);for(const id of ['generate','visual','newClub','save'])$(id).disabled=true;}

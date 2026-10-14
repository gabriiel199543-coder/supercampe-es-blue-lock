import {rng,hashSeed,clamp,clone,weightedPick} from './rng.mjs';
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const between=(range,r)=>range[0]+(range[1]-range[0])*r();
const round100=n=>Math.round(n/100)*100;
export function getPath(obj,path){return path.split('.').reduce((v,k)=>v?.[k],obj);}
export function setPath(obj,path,value){const parts=path.split('.');let node=obj;for(const key of parts.slice(0,-1)){if(['__proto__','constructor','prototype'].includes(key))throw Error('INVALID_CLUB: Campo inválido.');node=node[key]??={};}const key=parts.at(-1);if(['__proto__','constructor','prototype'].includes(key))throw Error('INVALID_CLUB: Campo inválido.');node[key]=clone(value);}
export function contrast(a,b){const lum=c=>{const v=c.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function calculateEconomy(club,coherence){
 const profile=coherence.originProfiles[club.origin.clubOriginType];const f=club.fanbase,e=club.economy,cap=club.stadium.capacity;
 f.averageHomeAttendance=Math.min(cap,Math.round(f.localSupporters*f.attendanceParticipationRate));f.stadiumOccupancyRate=f.averageHomeAttendance/cap;f.estimatedMembers=Math.round(f.localSupporters*f.memberConversionRate);
 e.annualTicketRevenueBRL=Math.round(f.averageHomeAttendance*coherence.financialModel.homeMatchesPerYear*e.ticketNetPriceBRL);
 e.annualMemberRevenueBRL=Math.round(f.estimatedMembers*e.annualMembershipFeeBRL);
 e.annualDigitalRevenueBRL=Math.round(f.digitalFollowers*e.annualDigitalYieldPerFollowerBRL);
 e.annualGrossRevenueBRL=e.annualTicketRevenueBRL+e.annualMemberRevenueBRL+e.annualSponsorshipBRL+e.annualDigitalRevenueBRL+e.annualBackingBRL;
 e.annualOperatingBudgetBRL=Math.round(e.annualGrossRevenueBRL*.84/1000)*1000;e.annualPayrollBudgetBRL=Math.round(e.annualOperatingBudgetBRL*.58);e.annualStadiumOperationsBRL=Math.round(e.annualOperatingBudgetBRL*.28);e.annualTransfersBudgetBRL=e.annualOperatingBudgetBRL-e.annualPayrollBudgetBRL-e.annualStadiumOperationsBRL;
 if(!profile)throw Error('INVALID_CLUB: Origem desconhecida.');return club;
}
export function validateClub(club,config){
 const errors=[],warnings=[];const fail=(id,msg)=>errors.push(id+': '+msg);
 if(typeof club.clubId!=='string'||!club.clubId||club.clubId.length>100)fail('H05','Identificador inválido.');
 if(typeof club.clubName!=='string'||club.clubName.trim().length<2||club.clubName.length>40)fail('H08','Nome deve ter 2–40 caracteres.');
 if(!club.origin||!config.originProfiles[club.origin.clubOriginType])fail('H08','Escolha uma origem válida.');
 const cap=club.stadium?.capacity;if(!Number.isInteger(cap)||cap<1500||cap>60000||cap%100)fail('H01','Lotação deve ser múltipla de 100, entre 1.500 e 60.000.');
 if(!club.stadium?.stadiumName||club.stadium.stadiumName.length>60)fail('H08','Nome do estádio inválido.');
 for(const c of ['primaryColor','secondaryColor','accentColor'])if(!/^#[0-9a-f]{6}$/i.test(club.colors?.[c]||''))fail('H04','Paleta inválida.');
 const f=club.fanbase,e=club.economy;
 if(!f||!Number.isFinite(f.averageHomeAttendance)||f.averageHomeAttendance<0||f.averageHomeAttendance>cap)fail('H02','Público incompatível com lotação.');
 if(!f||['localSupporters','digitalFollowers'].some(k=>!Number.isFinite(f[k])||f[k]<0||f[k]>1e8))fail('H02','Torcida ou audiência inválida.');
 const amounts=['annualOperatingBudgetBRL','annualPayrollBudgetBRL','annualStadiumOperationsBRL','annualTransfersBudgetBRL'];
 if(!e||amounts.some(k=>!Number.isFinite(e[k])||e[k]<0)||e.annualPayrollBudgetBRL+e.annualStadiumOperationsBRL+e.annualTransfersBudgetBRL>e.annualOperatingBudgetBRL+1)fail('H03','Orçamento inconsistente.');
 if(e?.currency!=='BRL'||e?.period!=='annual')fail('H07','Orçamento deve ser BRL/ano.');
 if(f&&(f.stadiumOccupancyRate<.35||f.stadiumOccupancyRate>.9))warnings.push('S01: Público projetado fora da faixa de conforto de 35%–90%.');
 if(!errors.length&&contrast(club.colors.primaryColor,club.colors.secondaryColor)<2.5)warnings.push('S05: Cores com pouco contraste.');
 const profile=config.originProfiles[club.origin?.clubOriginType];if(profile&&(cap<profile.capacity[0]||cap>profile.capacity[1]))warnings.push('S04: Estádio fora da faixa típica da origem.');
 return{valid:errors.length===0,errors,warnings,score:100-warnings.reduce((s,w)=>s+(w.startsWith('S01')?15:w.startsWith('S05')?12:7),0)};
}
export function generateClub({seed='clube',theme,pools,coherence,base=null,lockedFields=[],group='all'}){
 const originRng=rng(seed+':origem'),fanRng=rng(seed+':torcida'),moneyRng=rng(seed+':financeiro'),visualRng=rng(seed+':identidade');
 if(!pools.themes[theme])theme=weightedPick(Object.keys(pools.themes),k=>pools.themes[k].weight,originRng);
 const t=pools.themes[theme],origin=pick(t.origins,originRng),profile=coherence.originProfiles[origin];
 const names=pool=>{const options=pools.namePools.filter(x=>x.pool===pool&&(x.theme===theme||x.theme==='all'));return options.length?weightedPick(options,x=>x.weight,originRng).text:'';};
 const clubName=[names('prefixo'),names('referencia'),names('sufixo')].filter(Boolean).join(' ').slice(0,40)||'União '+t.label+' FC';
 const palettes=pools.colorPalettes.filter(p=>contrast(p.primaryColor,p.secondaryColor)>=2.5),palette=pick(palettes,visualRng);
 const participation=between(profile.participation,fanRng),minFans=Math.max(profile.fans[0],Math.ceil(1500*.6/participation));
 const localSupporters=Math.round(between([minFans,Math.min(profile.fans[1],60000*.8/participation)],fanRng));
 const capacity=clamp(round100(localSupporters*participation/between([.58,.82],fanRng)),1500,60000);
 const scale=capacity<6000?'local':capacity<17000?'municipal':capacity<35000?'regional':'nacional',funding=pick(profile.preferredFunding,moneyRng),fundingCfg=coherence.fundingTypes[funding];
 const stadiumText=pool=>{const entries=pools.stadiumPools.filter(x=>x.pool===pool&&(x.theme===theme||x.theme==='all'));return entries.length?weightedPick(entries,x=>x.weight,originRng).text:'';};
 let result={schemaVersion:'1.1.0',clubId:base?.clubId||'clube-'+hashSeed(seed).toString(36),clubName,shortName:clubName.split(/\s+/).map(x=>x[0]).join('').slice(0,4).toUpperCase(),nickname:t.label,motto:pick(pools.mottoPools.filter(x=>x.theme===theme||x.theme==='all'),originRng)?.motto||'Até o último minuto',foundationYear:1950+Math.floor(originRng()*76),
 origin:{country:'Brasil',stateRegion:'RS',city:'Cidade Livre',district:'Centro',clubOriginType:origin},colors:{primaryColor:palette.primaryColor,secondaryColor:palette.secondaryColor,accentColor:palette.accentColor},
 visualIdentity:{crestShape:pick(coherence.visualModel.shapeGuide[origin],visualRng),crestIcon:pick(t.symbols,visualRng),crestStyle:pick(t.styles,visualRng),crestTextMode:'sigla',bannerStyle:'torcida',bannerPattern:pick(t.patterns,visualRng),bannerSymbolFocus:true,bannerMottoVisible:true,flagLayout:pick(['horizontal','vertical','diagonal'],visualRng),flagSymbol:'mesmo-do-escudo',flagStyle:'institucional'},
 stadium:{stadiumName:[stadiumText('tipo'),stadiumText('referencia')].filter(Boolean).join(' ')||'Arena '+clubName,capacity,pitchType:'grama-natural',stadiumStyle:'moderno',atmosphere:pick(t.atmospheres,originRng),supporterCulture:pick(profile.crowd,originRng)},
 generation:{mode:'aleatorio-por-tema',theme,seed:String(seed),lockedFields:lockedFields.slice()},
 fanbase:{localSupporters,digitalFollowers:Math.round(between(profile.digital,fanRng)),averageHomeAttendance:0,stadiumOccupancyRate:0,attendanceParticipationRate:participation,memberConversionRate:between(profile.members,fanRng)},
 economy:{currency:'BRL',period:'annual',scale,primaryFunding:funding,annualSponsorshipBRL:Math.round(between(coherence.scales[scale].sponsorBase,moneyRng)*profile.sponsor*between(fundingCfg.sponsorFactor,moneyRng)),annualBackingBRL:Math.round(between(fundingCfg.external,moneyRng)),ticketNetPriceBRL:Math.round(between(profile.price,moneyRng)),annualMembershipFeeBRL:Math.round(between(coherence.financialModel.annualMembershipFeeBRL,moneyRng)),annualDigitalYieldPerFollowerBRL:between(coherence.financialModel.digitalAnnualIncomePerFollowerBRL,moneyRng),stadiumOwnership:pick(['proprio','alugado','compartilhado'],moneyRng)}
 };
 if(base&&group==='identidade'){const visual=result;result=clone(base);result.colors=visual.colors;result.visualIdentity=visual.visualIdentity;result.generation={...base.generation,seed:String(seed),lockedFields:lockedFields.slice()};}
 else if(base&&group==='financeiro'){const next=result;result=clone(base);result.economy=next.economy;}
 for(const field of lockedFields){const value=base&&getPath(base,field);if(value!==undefined)setPath(result,field,value);}
 if(group!=='identidade'&&lockedFields.includes('stadium.capacity')&&!lockedFields.includes('fanbase.localSupporters'))result.fanbase.localSupporters=Math.round(result.stadium.capacity*between([.58,.82],fanRng)/result.fanbase.attendanceParticipationRate);
 if(group!=='identidade')calculateEconomy(result,coherence);
 const report=validateClub(result,coherence);result.coherence={generatorVersion:'1.1.0',...report,exceptions:report.warnings.filter(w=>w.startsWith('S01')).map(w=>({reason:'Estádio compartilhado ou estrutura de formação; público local é independente da audiência digital.'}))};return result;
}
export function editClub(club,updates,coherence){const out=clone(club);const allowed=['clubName','shortName','motto','origin.clubOriginType','origin.city','origin.stateRegion','colors.primaryColor','colors.secondaryColor','colors.accentColor','visualIdentity.crestShape','visualIdentity.crestIcon','visualIdentity.flagLayout','visualIdentity.bannerPattern','stadium.stadiumName','stadium.capacity','fanbase.localSupporters','fanbase.digitalFollowers','economy.primaryFunding'];for(const [key,value]of Object.entries(updates)){if(!allowed.includes(key))throw Error('INVALID_CLUB: Campo não editável.');setPath(out,key,value);out.generation.lockedFields=[...new Set([...out.generation.lockedFields,key])];}calculateEconomy(out,coherence);out.coherence={...out.coherence,...validateClub(out,coherence)};return out;}
const xml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function clubSvg(club,kind='crest'){
 const p=xml(club.colors.primaryColor),s=xml(club.colors.secondaryColor),a=xml(club.colors.accentColor),name=xml(club.shortName),symbol=xml(club.visualIdentity.crestIcon),motto=xml(club.motto);
 const star='<path d="M50 21l7 15 17 2-12 12 3 17-15-8-15 8 3-17-12-12 17-2z"/>';
 const book='<path d="M24 28q13-7 26 0q13-7 26 0v36q-13-7-26 0q-13-7-26 0z" fill="none" stroke-width="4"/><path d="M50 28v36" fill="none" stroke-width="3"/>';
 const sun='<circle cx="50" cy="45" r="15"/><path d="M50 20v-6m0 56v6M25 45h-8m58 0h8M32 27l-5-5m41 46 5 5M32 63l-5 5m41-46 5-5" fill="none" stroke-width="4"/>';
 const ball='<circle cx="50" cy="45" r="22" fill="none" stroke-width="3"/><path d="M50 32l12 9-4 15H42l-4-15z"/>';
 const motifs={
 estrela:star,livro:book,sol:sun,bola:ball,
 coruja:'<path d="M25 20l10 8h30l10-8v40L50 74 25 60z"/><circle cx="39" cy="43" r="9" fill="'+p+'"/><circle cx="61" cy="43" r="9" fill="'+p+'"/>',
 tocha:'<path d="M43 45h14l-4 29h-6zM50 15c-20 20-14 29 0 29s20-14 0-29z"/>',
 coroa:'<path d="M25 28l12 15 13-23 13 23 12-15-7 37H32z"/>',
 raio:'<path d="M53 15L29 49h18l-3 25 29-39H55l10-20z"/>',
 engrenagem:'<path d="M44 20h12l3 9 10 2 6 10-6 8 1 12-11 5-3 9H44l-3-9-11-5 1-12-6-8 6-10 10-2z"/><circle cx="50" cy="47" r="12" fill="'+p+'"/>',
 asa:'<path d="M25 70q15-42 52-47L64 40l11 2-18 11 8 4-30 11z"/>',
 louro:'<path d="M40 70Q12 47 30 23M60 70Q88 47 70 23" fill="none" stroke-width="4"/><path d="M25 30l-10-5 5 14 11 1M21 45l-9 2 9 11 10-4M75 30l10-5-5 14-11 1M79 45l9 2-9 11-10-4"/>',
 trem:'<rect x="28" y="22" width="44" height="40" rx="5"/><rect x="35" y="29" width="30" height="16" fill="'+p+'"/><circle cx="37" cy="65" r="7"/><circle cx="63" cy="65" r="7"/>',
 punho:'<path d="M35 67l-7-25 7-12h8v-8h10v5h10v6h9v23L56 71z"/>',
 leao:'<path d="M50 17l14 7 10 13-2 21-22 17-22-17-2-21 10-13z"/><path d="M36 35l10 5m18-5-10 5m-8 14h8l-4 9z" fill="none" stroke="'+p+'" stroke-width="4"/>',
 lobo:'<path d="M24 20l17 12h18l17-12-4 36-22 20-22-20z"/><path d="M36 40l10 5m18-5-10 5m-9 10h10l-5 8z" stroke="'+p+'" stroke-width="3"/>',
 dragao:'<path d="M25 71l9-20-8-14 20-8 9-14 8 12 18 5-13 12 7 12-20-4-7 17z"/><circle cx="62" cy="33" r="3" fill="'+p+'"/>',
 fenix:'<path d="M50 18l9 16 25-7-15 23 9 17-22-7-6 16-6-16-22 7 9-17-15-23 25 7z"/>',
 meteoro:'<path d="M22 22l39 17-22 22z"/><circle cx="61" cy="60" r="17"/><path d="M38 22l31 16M22 38l16 31" stroke-width="3"/>',
 cometa:'<path d="M20 18l51 34-18 19z"/><circle cx="64" cy="60" r="15"/>',
 pixel:'<path d="M25 25h15v15H25zm20 0h15v15H45zm20 0h15v15H65zM25 45h15v15H25zm20 0h15v15H45zm20 0h15v15H65zM25 65h15v10H25zm20 0h15v10H45z"/>',
 cursor:'<path d="M30 20l43 33-22 2-11 21z"/>',
 controle:'<rect x="20" y="29" width="60" height="37" rx="15"/><path d="M33 38v18m-9-9h18" stroke="'+p+'" stroke-width="4"/><circle cx="64" cy="42" r="4" fill="'+p+'"/><circle cx="70" cy="54" r="4" fill="'+p+'"/>',
 orbita:'<circle cx="50" cy="45" r="12"/><ellipse cx="50" cy="45" rx="32" ry="15" transform="rotate(-35 50 45)" fill="none" stroke-width="3"/>',
 rio:'<path d="M22 30q14-14 28 0t28 0M22 48q14-14 28 0t28 0M22 66q14-14 28 0t28 0" fill="none" stroke-width="5"/>',
 araucaria:'<path d="M50 18l14 18H56l21 16H56l20 10H53v15h-6V62H24l20-10H23l21-16h-8z"/>',
 cafe:'<path d="M27 35h38v29H27z"/><path d="M65 40h10v18H65M25 70h45M38 20v10m12-10v10" fill="none" stroke-width="4"/>',
 relogio:'<circle cx="50" cy="45" r="27" fill="none" stroke-width="4"/><path d="M50 26v20l15 9" fill="none" stroke-width="4"/>',
 'flor-de-lis':'<path d="M50 18q-13 16-5 30-22-27-25-3 0 16 21 12l-10 16h38L59 57q21 4 21-12-3-24-25 3 8-14-5-30z"/>'
};
 const motif=motifs[club.visualIdentity.crestIcon]||star;
 const badge='<g fill="'+a+'" stroke="'+a+'">'+motif+'</g><text x="50" y="86" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="700" fill="'+s+'">'+name+'</text>';
 if(kind==='crest'){const shapes={redondo:'<circle cx="50" cy="51" r="46"/>',diamante:'<path d="M50 3L97 51 50 106 3 51z"/>',moderno:'<path d="M20 5h60l16 16v46l-46 36L4 67V21z"/>',brasao:'<path d="M16 5h68l-5 45q20 10 6 30L50 103 15 80q-14-20 6-30z"/>',escudo:'<path d="M8 8h84v52Q90 88 50 101Q10 88 8 60z"/>'};const shape='<g fill="'+p+'" stroke="'+s+'" stroke-width="4">'+(shapes[club.visualIdentity.crestShape]||shapes.escudo)+'</g>';return'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" role="img" aria-label="Escudo"><title>'+xml(club.clubName)+' · '+symbol+'</title>'+shape+badge+'</svg>';}
 const flag=kind==='flag',width=flag?150:100,height=flag?100:150;
 const bannerPatterns={
 listras:'<path d="M15 0v150M45 0v150M75 0v150" stroke="'+s+'" stroke-width="15"/>',
 diagonal:'<path d="M0 0l100 100v50L0 50z" fill="'+s+'"/>',
 bicolor:'<rect y="75" width="100" height="75" fill="'+s+'"/>',
 chevron:'<path d="M0 25l50 35 50-35v25L50 85 0 50z" fill="'+s+'"/>',
 cruz:'<path d="M40 0h20v150H40zM0 55h100v25H0z" fill="'+s+'"/>',
 quartelada:'<path d="M0 0h50v75H0zM50 75h50v75H50z" fill="'+s+'"/>'
 };
 const stripe=!flag?(bannerPatterns[club.visualIdentity.bannerPattern]||bannerPatterns.bicolor):club.visualIdentity.flagLayout==='vertical'?'<rect x="50" width="50" height="'+height+'" fill="'+s+'"/>':club.visualIdentity.flagLayout==='diagonal'?'<path d="M0 0L'+width+' '+height+'H0z" fill="'+s+'"/>':'<rect y="'+height/2+'" width="'+width+'" height="'+height/2+'" fill="'+s+'"/>';
 return'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="'+(flag?'Bandeira':'Estandarte')+'"><title>'+xml(club.clubName)+'</title><rect width="'+width+'" height="'+height+'" fill="'+p+'"/>'+stripe+'<g transform="translate('+(flag?35:10)+' '+(flag?4:12)+') scale(.8)"><path d="M8 8h84v52Q90 88 50 101Q10 88 8 60z" fill="'+p+'" stroke="'+a+'" stroke-width="3"/>'+badge+'</g>'+(!flag?'<text x="50" y="126" text-anchor="middle" font-size="6" fill="'+p+'">'+motto.slice(0,70)+'</text>':'')+'</svg>';
}

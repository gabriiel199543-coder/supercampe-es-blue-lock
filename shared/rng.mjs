export const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,Number(n)));
export const clone=value=>JSON.parse(JSON.stringify(value));
export function hashSeed(value){let h=2166136261;for(const c of String(value)){h=Math.imul(h^c.charCodeAt(0),16777619);}return h>>>0;}
export function random(state){state.rngState=((state.rngState??1)+0x6d2b79f5)>>>0;let t=state.rngState;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}
export function rng(seed){const s={rngState:hashSeed(seed)};return()=>random(s);}
export function weightedPick(items,weight,roll){const weights=items.map(x=>Math.max(0,weight(x)));let cursor=roll()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<items.length;i++){cursor-=weights[i];if(cursor<=0)return items[i];}return items.at(-1);}
export const average=list=>list.reduce((a,b)=>a+b,0)/(list.length||1);
export const sigmoid=n=>1/(1+Math.exp(-n));

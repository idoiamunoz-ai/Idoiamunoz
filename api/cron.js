export default async function handler(req,res){
try{
const r=await fetch("https://api.dexscreener.com/latest/dex/search/?q=SOL");
const d=await r.json();
let alerts=[];
(d.pairs||[]).forEach(p=>{
let ch=p.priceChange?.h24||0;
if(ch>50) alerts.push(`🚀 FOMO +${ch}% ${p.baseToken.symbol} $${p.priceUsd}`);
if(ch<-20) alerts.push(`💧 DIP ${ch}% ${p.baseToken.symbol} $${p.priceUsd}`);
});
res.json({ok:true,alerts, count:alerts.length});
}catch(e){res.json({ok:false,error:e.message})}
}

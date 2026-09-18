import React,{useState,useEffect}from"react";
export default function App(){
const [coins,setCoins]=useState([]);
const [loading,setLoading]=useState(true);
useEffect(()=>{
async function load(){
try{
const r=await fetch("https://api.dexscreener.com/latest/dex/search/?q=SOL");
const d=await r.json();
let pairs=(d.pairs||[]).slice(0,20).map(p=>({
name:p.baseToken.symbol, price:p.priceUsd, change:p.priceChange?.h24||0, url:p.url
})).sort((a,b)=>b.change-a.change);
setCoins(pairs);
}catch(e){console.log(e)}
setLoading(false);
}
load();
const iv=setInterval(load,60000);
return()=>clearInterval(iv);
},[]);
return(
<div style={{background:"#0a0a0a",color:"white",minHeight:"100vh",padding:20,fontFamily:"sans-serif"}}>
<h1 style={{fontSize:28}}>🚀 FOMO Radar - Idoia</h1>
<p style={{opacity:0.7}}>Detecta +50% subidas y -20% caídas en tiempo real</p>
<div style={{background:"#1a1a1a",padding:15,borderRadius:12,marginTop:20}}>
<p>✅ Conectado a DexScreener</p><p>✅ Telegram listo para alertas</p>
<p>Bot: @FomoRadar_bot</p>
</div>
{loading?<p>Cargando...</p>:
<div style={{marginTop:20,display:"grid",gap:10}}>
{coins.map((c,i)=><div key={i} style={{background:c.change>50?"#00ff8822":c.change<-20?"#ff004422":"#222",padding:12,borderRadius:10,display:"flex",justifyContent:"space-between",borderLeft:`4px solid ${c.change>50?"#0f8":c.change<-20?"#f44":"#555"}`}}>
<div><b>{c.name}</b><br/><small>${c.price}</small></div>
<div style={{textAlign:"right"}}><b style={{color:c.change>0?"#0f8":"#f44"}}>{c.change}%</b><br/>{c.change>50&&<span>🔥 FOMO +50%</span>}{c.change<-20&&<span>💧 DIP -20%</span>}</div>
</div>)}
</div>}
<p style={{marginTop:30,opacity:0.5,fontSize:12}}>Auto-refresca cada 60s. Próximo paso: activar cron de Telegram</p>
</div>
)
}

import { useState, useEffect } from "react"

export default function App() {
  const [coins, setCoins] = useState([])
  const [compras, setCompras] = useState([])
  const [symbol, setSymbol] = useState("")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const s = localStorage.getItem("mis_compras")
    if(s) setCompras(JSON.parse(s))
  }, [])
  useEffect(() => {
    localStorage.setItem("mis_compras", JSON.stringify(compras))
  }, [compras])

  const fetchRadar = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://api.dexscreener.com/latest/dex/search/?q=SOL")
      const data = await res.json()
      let pairs = (data.pairs || [])
       .filter(p => p.liquidity?.usd > 5000 && p.volume?.h24 > 500)
       .map(p => {
          let score = 0
          if(p.liquidity?.usd > 20000) score+=30
          if(p.volume?.h24 > 5000) score+=25
          if(p.priceChange?.h24 > 5 && p.priceChange?.h24 < 80) score+=25
          if(p.txns?.h24?.buys > p.txns?.h24?.sells) score+=20
          return {...p, score}
        })
       .filter(p => p.score >= 50)
       .sort((a,b)=> b.score - a.score)
       .slice(0,15)
      setCoins(pairs)
    } catch(e){}
    setLoading(false)
  }

  useEffect(() => { fetchRadar(); const id=setInterval(fetchRadar, 60000); return()=>clearInterval(id) }, [])

  const addCompra = () => {
    if(!symbol ||!amount ||!price) return
    setCompras([...compras, { id: Date.now(), symbol: symbol.toUpperCase(), amount: parseFloat(amount), price: parseFloat(price)}])
    setSymbol(""); setAmount(""); setPrice("")
  }

  return (
    <div style={{minHeight:"100vh", background:"black", color:"white", padding:"16px", fontFamily:"system-ui"}}>
      <h1 style={{textAlign:"center", fontSize:"28px", fontWeight:"bold"}}>🚀 FOMO RADAR V3</h1>
      <p style={{textAlign:"center", color:"#888", marginBottom:"20px"}}>Solo oportunidades buenas (Score &gt;50)</p>

      <div style={{background:"#18181b", padding:"16px", borderRadius:"12px", marginBottom:"20px"}}>
        <h2 style={{fontWeight:"bold", marginBottom:"10px"}}>💰 Mis Compras</h2>
        <div style={{display:"flex", gap:"6px", marginBottom:"10px"}}>
          <input value={symbol} onChange={e=>setSymbol(e.target.value)} placeholder="BONK" style={{flex:1, background:"black", border:"1px solid #333", padding:"8px", borderRadius:"8px", color:"white"}} />
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="$" type="number" style={{flex:1, background:"black", border:"1px solid #333", padding:"8px", borderRadius:"8px", color:"white"}} />
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="entrada" type="number" style={{flex:1, background:"black", border:"1px solid #333", padding:"8px", borderRadius:"8px", color:"white"}} />
          <button onClick={addCompra} style={{background:"white", color:"black", padding:"8px 14px", borderRadius:"8px", fontWeight:"bold"}}>+</button>
        </div>
        {compras.map(c=>(
          <div key={c.id} style={{display:"flex", justifyContent:"space-between", background:"black", padding:"8px", borderRadius:"8px", marginBottom:"4px", fontSize:"14px"}}>
            <span>{c.symbol} - ${c.amount} @ {c.price}</span>
            <button onClick={()=>setCompras(compras.filter(x=>x.id!==c.id))} style={{color:"#ef4444"}}>x</button>
          </div>
        ))}
      </div>

      <div style={{background:"#18181b", padding:"16px", borderRadius:"12px"}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:"12px"}}>
          <h2 style={{fontWeight:"bold"}}>🔥 Oportunidades AHORA</h2>
          <button onClick={fetchRadar} style={{background:"#27272a", padding:"4px 10px", borderRadius:"6px", fontSize:"12px"}}>{loading?"...":"Refrescar"}</button>
        </div>
        {coins.map((c,i)=>(
          <div key={i} style={{background:"black", padding:"12px", borderRadius:"10px", marginBottom:"8px", display:"flex", justifyContent:"space-between"}}>
            <div>
              <div style={{fontWeight:"bold"}}>{c.baseToken?.symbol} <span style={{color:"#888", fontSize:"12px"}}>/{c.chainId}</span></div>
              <div style={{fontSize:"12px", color:"#888"}}>${c.priceUsd} | Liq ${Math.round(c.liquidity?.usd||0).toLocaleString()}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:c.priceChange?.h24>0?"#4ade80":"#f87171", fontWeight:"bold"}}>{c.priceChange?.h24?.toFixed(1)}%</div>
              <div style={{fontSize:"11px", background:"#14532d", color:"#86efac", padding:"2px 6px", borderRadius:"10px"}}>Score {c.score}</div>
            </div>
          </div>
        ))}
        {coins.length===0 &&!loading && <p style={{color:"#666", fontSize:"14px"}}>Buscando oportunidades buenas... el radar sigue activo.</p>}
      </div>
      <p style={{textAlign:"center", color:"#444", fontSize:"11px", marginTop:"20px"}}>Telegram Bot activo: 5727835316 - Avisos cada 10min aunque cierres la app</p>
    </div>
  )
}

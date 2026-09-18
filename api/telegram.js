export default async function handler(req, res) {
  const BOT = process.env.TELEGRAM_BOT_TOKEN || "8912659632:AAG5oMbbiQyAni9SPsAsp2OxHDg2vOPz4zk"
  const CHAT = process.env.TELEGRAM_CHAT_ID || "5727835316"
  
  const msg = `🚀 FOMO RADAR V3 activo\n🔥 Buscando oportunidades con Score >50\nTu app: https://idoiamunoz.vercel.app\nAviso cada 10min`

  await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({chat_id: CHAT, text: msg})
  })

  res.json({ok:true})
}

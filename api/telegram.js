export default async function handler(req,res){
const BOT="TU_TOKEN_AQUI";
const CHAT="TU_CHAT_ID";
const {msg}=req.query;
if(!msg) return res.status(200).json({ok:true,msg:"FOMO Radar listo"});
await fetch(`https://api.telegram.org/bot${BOT}/sendMessage?chat_id=${CHAT}&text=${encodeURIComponent(msg)}`);
res.json({sent:true});
}

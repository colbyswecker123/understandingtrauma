function json(data,status=200){
return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
}
function clean(value,maxLength){
return String(value||"").replace(/\s+/g," ").trim().slice(0,maxLength);
}
export async function onRequestPost({request,env}){
try{
if(!env.DB){return json({error:"Database is not configured yet."},503);}
const body=await request.json().catch(()=>null);
const message=clean(body?.message,280);
const displayName=clean(body?.displayName,40)||null;
if(message.length<8){return json({error:"Message is too short."},400);}
if(/https?:\/\//i.test(message)){return json({error:"Links are not allowed in messages."},400);}
await env.DB.prepare("INSERT INTO messages (message, display_name, status, created_at) VALUES (?, ?, 'pending', datetime('now'))").bind(message,displayName).run();
return json({ok:true,status:"pending"},201);
}catch(error){
return json({error:"Unable to submit message."},500);
}
}
export function onRequestGet(){
return json({error:"Method not allowed."},405);
}

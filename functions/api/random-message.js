const fallbackMessages=[
"You are not alone in what you’re feeling.",
"You are allowed to take this day one breath at a time.",
"You do not have to earn rest. You are allowed to receive it.",
"You are more than what happened to you."
];
function json(data,status=200){
return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
}
export async function onRequestGet({env}){
try{
if(!env.DB){return json({message:fallbackMessages[Math.floor(Math.random()*fallbackMessages.length)],source:"fallback"});}
const row=await env.DB.prepare("SELECT message FROM messages WHERE status = 'approved' ORDER BY RANDOM() LIMIT 1").first();
if(row&&row.message){return json({message:row.message,source:"database"});}
return json({message:fallbackMessages[Math.floor(Math.random()*fallbackMessages.length)],source:"fallback"});
}catch(error){
return json({message:fallbackMessages[Math.floor(Math.random()*fallbackMessages.length)],source:"fallback"});
}
}

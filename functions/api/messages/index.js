function json(data,status=200){
return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
}
function clean(value,maxLength){
return String(value||"").replace(/\s+/g," ").trim().slice(0,maxLength);
}
async function sendSubmissionNotification(env,{message,displayName}){
if(!env.RESEND_API_KEY||!env.NOTIFY_EMAIL)return {sent:false,reason:"Notification is not configured."};
const from=env.FROM_EMAIL||"Understanding Trauma <onboarding@resend.dev>";
const siteUrl=(env.SITE_URL||"https://understandingtrauma.org").replace(/\/+$/,"");
const name=displayName||"Anonymous";
const subject="New Understanding Trauma message submission";
const text=[
"New message submitted for review.",
"",
`From: ${name}`,
"",
"Message:",
message,
"",
`Review pending messages: ${siteUrl}/admin/messages/`
].join("\n");
try{
const res=await fetch("https://api.resend.com/emails",{
method:"POST",
headers:{
"Authorization":`Bearer ${env.RESEND_API_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
from,
to:[env.NOTIFY_EMAIL],
subject,
text
})
});
if(!res.ok){return {sent:false,reason:`Email provider returned ${res.status}.`};}
return {sent:true};
}catch(error){
return {sent:false,reason:"Unable to send notification."};
}
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
const notification=await sendSubmissionNotification(env,{message,displayName});
return json({ok:true,status:"pending",notification},201);
}catch(error){
return json({error:"Unable to submit message."},500);
}
}
export function onRequestGet(){
return json({error:"Method not allowed."},405);
}

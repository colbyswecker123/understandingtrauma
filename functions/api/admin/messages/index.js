function json(data,status=200){
return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
}
function authorized(request,env){
const header=request.headers.get("Authorization")||"";
const token=header.replace(/^Bearer\s+/i,"").trim();
return Boolean(env.ADMIN_TOKEN&&token&&token===env.ADMIN_TOKEN);
}
export async function onRequestGet({request,env}){
try{
if(!authorized(request,env)){return json({error:"Unauthorized."},401);}
if(!env.DB){return json({error:"Database is not configured yet."},503);}
const result=await env.DB.prepare("SELECT id, message, display_name, status, created_at FROM messages WHERE status = 'pending' ORDER BY created_at ASC LIMIT 100").all();
return json({messages:result.results||[]});
}catch(error){
return json({error:"Unable to load messages."},500);
}
}

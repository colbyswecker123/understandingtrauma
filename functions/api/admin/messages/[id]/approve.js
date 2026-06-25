function json(data,status=200){
return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
}
function authorized(request,env){
const header=request.headers.get("Authorization")||"";
const token=header.replace(/^Bearer\s+/i,"").trim();
return Boolean(env.ADMIN_TOKEN&&token&&token===env.ADMIN_TOKEN);
}
export async function onRequestPost({request,env,params}){
try{
if(!authorized(request,env)){return json({error:"Unauthorized."},401);}
if(!env.DB){return json({error:"Database is not configured yet."},503);}
const id=Number(params.id);
if(!Number.isInteger(id)||id<1){return json({error:"Invalid message id."},400);}
await env.DB.prepare("UPDATE messages SET status = 'approved', reviewed_at = datetime('now') WHERE id = ?").bind(id).run();
return json({ok:true,status:"approved"});
}catch(error){
return json({error:"Unable to approve message."},500);
}
}

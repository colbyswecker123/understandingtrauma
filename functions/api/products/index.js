function json(data,status=200){
return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
}
export async function onRequestGet({env}){
try{
if(!env.DB){return json({products:[]});}
const result=await env.DB.prepare("SELECT id, name, description, price_cents, image_url, checkout_url, sort_order FROM products WHERE status = 'active' ORDER BY sort_order ASC, created_at DESC").all();
return json({products:result.results||[]});
}catch(error){
return json({products:[]});
}
}

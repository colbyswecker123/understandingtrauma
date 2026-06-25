const COOKIE_NAME="ut_admin_session";
const SESSION_TTL_SECONDS=60*60*24*7;
const encoder=new TextEncoder();
function json(data,status=200,extraHeaders={}){
return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...extraHeaders}});
}
function base64url(input){
const bytes=typeof input==="string"?encoder.encode(input):new Uint8Array(input);
let binary="";
bytes.forEach((byte)=>binary+=String.fromCharCode(byte));
return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function base64urlDecode(value){
value=value.replace(/-/g,"+").replace(/_/g,"/");
while(value.length%4)value+="=";
const binary=atob(value);
const bytes=new Uint8Array(binary.length);
for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
return new TextDecoder().decode(bytes);
}
async function sign(value,secret){
const key=await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
const signature=await crypto.subtle.sign("HMAC",key,encoder.encode(value));
return base64url(signature);
}
function timingSafeEqual(a,b){
if(typeof a!=="string"||typeof b!=="string"||a.length!==b.length)return false;
let result=0;
for(let i=0;i<a.length;i++)result|=a.charCodeAt(i)^b.charCodeAt(i);
return result===0;
}
function getCookie(request,name){
const cookie=request.headers.get("Cookie")||"";
return cookie.split(";").map(part=>part.trim()).find(part=>part.startsWith(`${name}=`))?.slice(name.length+1)||"";
}
function expectedUsername(env){return env.ADMIN_USERNAME||"admin";}
function sessionSecret(env){return env.ADMIN_SESSION_SECRET||env.ADMIN_TOKEN||env.ADMIN_PASSWORD||"";}
async function validSession(request,env){
const secret=sessionSecret(env);
if(!secret)return false;
const token=getCookie(request,COOKIE_NAME);
if(!token||!token.includes("."))return false;
const [payload,sig]=token.split(".");
if(!payload||!sig)return false;
const expectedSig=await sign(payload,secret);
if(!timingSafeEqual(sig,expectedSig))return false;
let data;
try{data=JSON.parse(base64urlDecode(payload));}catch(error){return false;}
if(!data||data.u!==expectedUsername(env))return false;
if(!data.exp||data.exp<Math.floor(Date.now()/1000))return false;
return true;
}
async function authorized(request,env){
if(await validSession(request,env))return true;
const header=request.headers.get("Authorization")||"";
const token=header.replace(/^Bearer\s+/i,"").trim();
return Boolean(env.ADMIN_TOKEN&&token&&token===env.ADMIN_TOKEN);
}
function clean(value,maxLength){
return String(value||"").replace(/\s+/g," ").trim().slice(0,maxLength);
}
function normalizeUrl(value,maxLength=500){
const url=clean(value,maxLength);
if(!url)return "";
if(url.startsWith("/"))return url;
try{
const parsed=new URL(url);
if(parsed.protocol==="https:"||parsed.protocol==="http:")return parsed.toString();
return "";
}catch(error){return "";}
}

function productBody(body){
return {
name:clean(body?.name,120),
description:clean(body?.description,500),
price_cents:Math.max(0,Number.parseInt(body?.price_cents||0,10)||0),
image_url:normalizeUrl(body?.image_url,500)||null,
checkout_url:normalizeUrl(body?.checkout_url,500)||null,
status:["active","draft"].includes(body?.status)?body.status:"draft",
sort_order:Number.parseInt(body?.sort_order||0,10)||0
};
}
export async function onRequestGet({request,env}){
try{
if(!(await authorized(request,env))){return json({error:"Unauthorized."},401);}
if(!env.DB){return json({error:"Database is not configured yet."},503);}
const result=await env.DB.prepare("SELECT id, name, description, price_cents, image_url, checkout_url, status, sort_order, created_at, updated_at FROM products ORDER BY sort_order ASC, created_at DESC").all();
return json({products:result.results||[]});
}catch(error){
return json({error:"Unable to load products. Make sure the products table migration has been run."},500);
}
}
export async function onRequestPost({request,env}){
try{
if(!(await authorized(request,env))){return json({error:"Unauthorized."},401);}
if(!env.DB){return json({error:"Database is not configured yet."},503);}
const body=await request.json().catch(()=>({}));
const product=productBody(body);
if(product.name.length<2){return json({error:"Product name is required."},400);}
const result=await env.DB.prepare("INSERT INTO products (name, description, price_cents, image_url, checkout_url, status, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))").bind(product.name,product.description,product.price_cents,product.image_url,product.checkout_url,product.status,product.sort_order).run();
return json({ok:true,id:result.meta?.last_row_id||null},201);
}catch(error){
return json({error:"Unable to create product. Make sure the products table migration has been run."},500);
}
}

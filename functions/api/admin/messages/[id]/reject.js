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
function expectedUsername(env){
return env.ADMIN_USERNAME||"admin";
}
function expectedPassword(env){
return env.ADMIN_PASSWORD||env.ADMIN_TOKEN||"";
}
function sessionSecret(env){
return env.ADMIN_SESSION_SECRET||env.ADMIN_TOKEN||env.ADMIN_PASSWORD||"";
}
async function makeSessionCookie(env,username){
const secret=sessionSecret(env);
if(!secret)throw new Error("Missing ADMIN_SESSION_SECRET.");
const payload=base64url(JSON.stringify({u:username,exp:Math.floor(Date.now()/1000)+SESSION_TTL_SECONDS}));
const sig=await sign(payload,secret);
return `${COOKIE_NAME}=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}
function clearSessionCookie(){
return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
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

export async function onRequestPost({request,env,params}){
try{
if(!(await authorized(request,env))){return json({error:"Unauthorized."},401);}
if(!env.DB){return json({error:"Database is not configured yet."},503);}
const id=Number(params.id);
if(!Number.isInteger(id)||id<1){return json({error:"Invalid message id."},400);}
await env.DB.prepare("UPDATE messages SET status = 'rejected', reviewed_at = datetime('now') WHERE id = ?").bind(id).run();
return json({ok:true,status:"rejected"});
}catch(error){
return json({error:"Unable to reject message."},500);
}
}

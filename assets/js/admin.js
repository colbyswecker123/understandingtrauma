const loginPanel=document.getElementById("loginPanel");
const portalPanel=document.getElementById("portalPanel");
const reviewPanel=document.getElementById("reviewPanel");
const loginForm=document.getElementById("loginForm");
const loginStatus=document.getElementById("loginStatus");
const portalStatus=document.getElementById("portalStatus");
const logoutButton=document.getElementById("logoutButton");
const refreshButton=document.getElementById("refreshButton");
const list=document.getElementById("messageList");
const statusEl=document.getElementById("adminStatus");
const isMessagesPage=Boolean(reviewPanel&&list);
function setLoginStatus(message){if(loginStatus)loginStatus.textContent=message;}
function setPortalStatus(message){if(portalStatus)portalStatus.textContent=message;}
function status(message){if(statusEl)statusEl.textContent=message;}
function showLogin(){
loginPanel?.classList.remove("is-hidden");
portalPanel?.classList.add("is-hidden");
reviewPanel?.classList.add("is-hidden");
}
function showPortal(){
loginPanel?.classList.add("is-hidden");
portalPanel?.classList.remove("is-hidden");
}
function showReview(){
loginPanel?.classList.add("is-hidden");
portalPanel?.classList.add("is-hidden");
reviewPanel?.classList.remove("is-hidden");
}
function loginUrl(){
return `/admin/?return=${encodeURIComponent(location.pathname)}`;
}
function returnPath(){
const params=new URLSearchParams(location.search);
const value=params.get("return");
if(value&&value.startsWith("/admin/"))return value;
return "/admin/";
}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));}
async function api(path,options={}){
const res=await fetch(path,{credentials:"include",...options,headers:{"Accept":"application/json",...options.headers}});
const data=await res.json().catch(()=>({}));
if(!res.ok)throw new Error(data.error||"Request failed");
return data;
}
function render(messages){
if(!list)return;
list.innerHTML="";
if(!messages.length){
status("No pending messages right now.");
const empty=document.createElement("article");
empty.className="empty-state";
empty.innerHTML="<strong>All clear.</strong><span>There are no messages waiting for review.</span>";
list.appendChild(empty);
return;
}
status(`${messages.length} pending message${messages.length===1?"":"s"}.`);
messages.forEach((msg)=>{
const card=document.createElement("article");
card.className="review-card";
card.innerHTML=`<p>${escapeHtml(msg.message)}</p><div class="review-meta">${escapeHtml(msg.display_name||"Anonymous")} • ${escapeHtml(msg.created_at||"")}</div><div class="review-actions"><button class="control-button primary-control" data-action="approve" data-id="${msg.id}"><span class="control-icon" aria-hidden="true">✓</span><span>Approve</span></button><button class="control-button" data-action="reject" data-id="${msg.id}"><span class="control-icon" aria-hidden="true">×</span><span>Reject</span></button></div>`;
list.appendChild(card);
});
}
async function loadMessages(){
try{
showReview();
status("Loading pending messages…");
const data=await api("/api/admin/messages");
render(data.messages||[]);
}catch(error){
status(error.message||"Could not load messages.");
if(String(error.message||"").toLowerCase().includes("unauthorized"))location.href=loginUrl();
}
}
async function checkSession(){
try{
await api("/api/admin/session");
if(isMessagesPage){loadMessages();}
else{showPortal();setPortalStatus("");}
}catch(error){
if(isMessagesPage){location.href=loginUrl();}
else{showLogin();}
}
}
if(loginForm){
loginForm.addEventListener("submit",async(event)=>{
event.preventDefault();
const formData=new FormData(loginForm);
const username=String(formData.get("username")||"").trim();
const password=String(formData.get("password")||"");
setLoginStatus("Signing in…");
try{
await api("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
setLoginStatus("");
loginForm.reset();
const destination=returnPath();
if(destination!=="/admin/"&&destination!==location.pathname){location.href=destination;return;}
showPortal();
}catch(error){
setLoginStatus(error.message||"Could not sign in.");
}
});
}
async function logout(){
try{await api("/api/admin/logout",{method:"POST"});}catch(error){}
if(isMessagesPage){location.href="/admin/";return;}
showLogin();
setPortalStatus("");
status("");
if(list)list.innerHTML="";
}
if(logoutButton)logoutButton.addEventListener("click",logout);
if(refreshButton)refreshButton.addEventListener("click",loadMessages);
if(list){
list.addEventListener("click",async(event)=>{
const button=event.target.closest("button[data-action]");
if(!button)return;
const id=button.dataset.id;
const action=button.dataset.action;
button.disabled=true;
try{
await api(`/api/admin/messages/${id}/${action}`,{method:"POST"});
await loadMessages();
}catch(error){
status(error.message||"Could not update message.");
button.disabled=false;
}
});
}
checkSession();

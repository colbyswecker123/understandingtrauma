const loginPanel=document.getElementById("loginPanel");
const reviewPanel=document.getElementById("reviewPanel");
const loginForm=document.getElementById("loginForm");
const loginStatus=document.getElementById("loginStatus");
const logoutButton=document.getElementById("logoutButton");
const list=document.getElementById("messageList");
const statusEl=document.getElementById("adminStatus");
function setLoginStatus(message){if(loginStatus)loginStatus.textContent=message;}
function status(message){if(statusEl)statusEl.textContent=message;}
function showLogin(){
loginPanel?.classList.remove("is-hidden");
reviewPanel?.classList.add("is-hidden");
}
function showReview(){
loginPanel?.classList.add("is-hidden");
reviewPanel?.classList.remove("is-hidden");
}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));}
async function api(path,options={}){
const res=await fetch(path,{credentials:"include",...options,headers:{"Accept":"application/json",...options.headers}});
const data=await res.json().catch(()=>({}));
if(!res.ok)throw new Error(data.error||"Request failed");
return data;
}
function render(messages){
list.innerHTML="";
if(!messages.length){status("No pending messages right now.");return;}
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
status("Loading pending messages…");
const data=await api("/api/admin/messages");
render(data.messages||[]);
}catch(error){
status(error.message||"Could not load messages.");
if(String(error.message||"").toLowerCase().includes("unauthorized"))showLogin();
}
}
async function checkSession(){
try{
await api("/api/admin/session");
showReview();
loadMessages();
}catch(error){
showLogin();
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
showReview();
loadMessages();
}catch(error){
setLoginStatus(error.message||"Could not sign in.");
}
});
}
if(logoutButton){
logoutButton.addEventListener("click",async()=>{
try{await api("/api/admin/logout",{method:"POST"});}catch(error){}
showLogin();
status("");
if(list)list.innerHTML="";
});
}
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

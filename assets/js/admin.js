const tokenForm=document.getElementById("tokenForm");
const tokenInput=document.getElementById("token");
const list=document.getElementById("messageList");
const statusEl=document.getElementById("adminStatus");
let adminToken=sessionStorage.getItem("ut_admin_token")||"";
if(tokenInput)tokenInput.value=adminToken;
function status(message){statusEl.textContent=message;}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));}
async function api(path,options={}){
const res=await fetch(path,{...options,headers:{"Accept":"application/json","Authorization":`Bearer ${adminToken}`,...options.headers}});
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
card.innerHTML=`<p>${escapeHtml(msg.message)}</p><div class="review-meta">${escapeHtml(msg.display_name||"Anonymous")} • ${escapeHtml(msg.created_at||"")}</div><div class="review-actions"><button class="button button-primary" data-action="approve" data-id="${msg.id}">Approve</button><button class="button button-danger" data-action="reject" data-id="${msg.id}">Reject</button></div>`;
list.appendChild(card);
});
}
async function loadMessages(){
try{
status("Loading pending messages…");
const data=await api("/api/admin/messages");
render(data.messages||[]);
}catch(error){status(error.message||"Could not load messages.");}
}
if(tokenForm){
tokenForm.addEventListener("submit",(event)=>{
event.preventDefault();
adminToken=tokenInput.value.trim();
sessionStorage.setItem("ut_admin_token",adminToken);
loadMessages();
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
}catch(error){status(error.message||"Could not update message.");button.disabled=false;}
});
}
if(adminToken)loadMessages();

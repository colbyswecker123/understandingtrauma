const form=document.getElementById("messageForm");
const statusEl=document.getElementById("formStatus");
function setStatus(message,type="info"){
statusEl.textContent=message;
statusEl.dataset.type=type;
}
if(form){
form.addEventListener("submit",async(event)=>{
event.preventDefault();
const formData=new FormData(form);
const message=String(formData.get("message")||"").trim();
const displayName=String(formData.get("displayName")||"").trim();
if(message.length<8){setStatus("Please write a little more before submitting.","error");return;}
setStatus("Submitting your message…");
try{
const res=await fetch("/api/messages",{
method:"POST",
headers:{"Content-Type":"application/json","Accept":"application/json"},
body:JSON.stringify({message,displayName})
});
const data=await res.json().catch(()=>({}));
if(!res.ok)throw new Error(data.error||"Could not submit message");
form.reset();
setStatus("Thank you. Your message was submitted for review.","success");
}catch(error){
setStatus("The message could not be submitted yet. Please try again later.","error");
}
});
}

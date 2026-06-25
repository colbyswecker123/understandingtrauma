const fallbackMessages=[
"You are not alone in what you’re feeling.",
"You are allowed to take this day one breath at a time.",
"You do not have to earn rest. You are allowed to receive it.",
"There is still tenderness for you, even here.",
"You are more than what happened to you.",
"A hard day does not mean a hopeless life.",
"You can be healing and hurting at the same time.",
"Your story still has soft places ahead."
];
const noteEl=document.getElementById("noteMessage");
const newNoteButton=document.getElementById("newNoteButton");
const musicButton=document.getElementById("musicButton");
const audio=document.getElementById("siteAudio");
let lastMessage="";
function localNote(){
let msg=fallbackMessages[Math.floor(Math.random()*fallbackMessages.length)];
if(fallbackMessages.length>1){while(msg===lastMessage){msg=fallbackMessages[Math.floor(Math.random()*fallbackMessages.length)];}}
lastMessage=msg;
return msg;
}
async function loadNote(){
if(!noteEl)return;
noteEl.classList.add("is-changing");
try{
const res=await fetch("/api/random-message",{headers:{"Accept":"application/json"}});
if(!res.ok)throw new Error("No API message available");
const data=await res.json();
noteEl.textContent=data.message||localNote();
lastMessage=noteEl.textContent;
}catch(error){
noteEl.textContent=localNote();
}finally{
window.setTimeout(()=>noteEl.classList.remove("is-changing"),150);
}
}
if(newNoteButton){newNoteButton.addEventListener("click",loadNote);}
if(musicButton&&audio){
musicButton.addEventListener("click",async()=>{
try{
if(audio.paused){await audio.play();musicButton.setAttribute("aria-pressed","true");musicButton.querySelector("span:last-child").textContent="Music is playing";}
else{audio.pause();musicButton.setAttribute("aria-pressed","false");musicButton.querySelector("span:last-child").textContent="Press for relaxing music";}
}catch(error){
musicButton.querySelector("span:last-child").textContent="Add relaxing-music.mp3 to enable music";
}
});
}
loadNote();

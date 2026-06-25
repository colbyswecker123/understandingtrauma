function runFooterMusic(){
const musicButton=document.getElementById("footerMusicButton");
const audio=document.getElementById("siteAudio");

if(!musicButton||!audio)return;

const label=musicButton.querySelector(".footer-music-label");
const icon=musicButton.querySelector(".footer-music-icon");

function updateButton(){
if(audio.paused){
musicButton.setAttribute("aria-pressed","false");
if(label)label.textContent="Music off";
if(icon)icon.textContent="♪";
}else{
musicButton.setAttribute("aria-pressed","true");
if(label)label.textContent="Music on";
if(icon)icon.textContent="Ⅱ";
}
}

musicButton.addEventListener("click",async()=>{
try{
if(audio.paused){
await audio.play();
}else{
audio.pause();
}
updateButton();
}catch(error){
if(label)label.textContent="Add music file";
musicButton.classList.add("music-error");
}
});

audio.addEventListener("play",updateButton);
audio.addEventListener("pause",updateButton);
updateButton();
}

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",runFooterMusic);
}else{
runFooterMusic();
}

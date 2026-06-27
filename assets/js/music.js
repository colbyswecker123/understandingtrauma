(function(){
if(window.utMusicControllerLoaded)return;
window.utMusicControllerLoaded=true;

const MUSIC_SRC="/assets/audio/relaxing-music.mp3";
const MUSIC_VOLUME=.45;

function getAudio(){
let audio=window.utSiteMusicAudio||document.getElementById("utSiteMusicAudio");

if(!audio){
audio=document.createElement("audio");
audio.id="utSiteMusicAudio";
audio.src=MUSIC_SRC;
audio.preload="auto";
audio.loop=true;
audio.volume=MUSIC_VOLUME;
audio.style.display="none";
document.body.appendChild(audio);
}

audio.loop=true;
audio.volume=MUSIC_VOLUME;
window.utSiteMusicAudio=audio;
return audio;
}

function getButtons(){
return Array.from(document.querySelectorAll("#musicToggle,.footer-music-button,[data-music-toggle]"));
}

function setButtonState(){
const audio=getAudio();
const isPlaying=!audio.paused&&!audio.ended;

getButtons().forEach((button)=>{
button.setAttribute("aria-pressed",isPlaying?"true":"false");
button.classList.toggle("is-playing",isPlaying);

const label=button.querySelector(".footer-music-label,.music-label,[data-music-label]");
if(label){
label.textContent=isPlaying?"Pause music":"Play music";
}
});
}

async function toggleMusic(){
const audio=getAudio();

try{
if(audio.paused||audio.ended){
await audio.play();
}else{
audio.pause();
}
}catch(error){
getButtons().forEach((button)=>{
button.classList.add("music-error");
const label=button.querySelector(".footer-music-label,.music-label,[data-music-label]");
if(label)label.textContent="Tap again";
});
return;
}

setButtonState();
}

function bindAudioEvents(){
const audio=getAudio();
if(audio.dataset.utEventsBound==="true")return;
audio.dataset.utEventsBound="true";
audio.addEventListener("play",setButtonState);
audio.addEventListener("pause",setButtonState);
audio.addEventListener("ended",setButtonState);
audio.addEventListener("error",()=>{
getButtons().forEach((button)=>{
button.classList.add("music-error");
const label=button.querySelector(".footer-music-label,.music-label,[data-music-label]");
if(label)label.textContent="Audio missing";
});
});
}

function initMusic(){
bindAudioEvents();
setButtonState();
}

document.addEventListener("click",(event)=>{
const button=event.target.closest("#musicToggle,.footer-music-button,[data-music-toggle]");
if(!button)return;
event.preventDefault();
toggleMusic();
});

function shouldSoftNavigate(link){
if(!link||!link.href)return false;
if(link.target&&link.target!=="_self")return false;
if(link.hasAttribute("download"))return false;

const url=new URL(link.href,window.location.href);
if(url.origin!==window.location.origin)return false;

const path=url.pathname;
if(path.startsWith("/admin"))return false;
if(path.startsWith("/api"))return false;
if(/\.(pdf|zip|png|jpg|jpeg|webp|gif|svg|mp3|mp4|mov|docx|xlsx|pptx)$/i.test(path))return false;
if(url.pathname==="/store/" || url.pathname.startsWith("/store/")){return false;
}
  
return true;
}

async function softNavigate(url){
try{
document.dispatchEvent(new CustomEvent("ut:beforepagechange"));

const response=await fetch(url,{headers:{"Accept":"text/html"}});
if(!response.ok)throw new Error("Page load failed");

const html=await response.text();
const doc=new DOMParser().parseFromString(html,"text/html");

const newMain=doc.querySelector("main");
const currentMain=document.querySelector("main");

if(!newMain||!currentMain){
window.location.href=url;
return;
}

currentMain.replaceWith(newMain);
document.title=doc.title||document.title;

if(doc.body&&doc.body.className){
document.body.className=doc.body.className;
}

history.pushState({},document.title,url);

if(typeof window.renderSiteFooter==="function"){
window.renderSiteFooter();
}

document.dispatchEvent(new CustomEvent("ut:pagechange"));

if(typeof window.runHomeNote==="function")window.runHomeNote();
if(typeof window.runFaithMessages==="function")window.runFaithMessages();
if(typeof window.runDestress==="function")window.runDestress();
if(typeof window.runSupport==="function")window.runSupport();
if(typeof window.runSubmitForm==="function")window.runSubmitForm();
if(typeof window.runStoreProducts==="function")window.runStoreProducts();

initMusic();
window.scrollTo({top:0,behavior:"smooth"});
}catch(error){
window.location.href=url;
}
}

document.addEventListener("click",(event)=>{
const link=event.target.closest("a");
if(!shouldSoftNavigate(link))return;
event.preventDefault();
softNavigate(link.href);
});

window.addEventListener("popstate",()=>{
window.location.reload();
});

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",initMusic);
}else{
initMusic();
}

document.addEventListener("ut:footerready",initMusic);
document.addEventListener("ut:pagechange",initMusic);
})();

(function(){
let isSoftNavigating=false;

function runFooterMusic(){
const musicButton=document.getElementById("footerMusicButton");
const audio=document.getElementById("siteAudio");

if(!musicButton||!audio)return;

audio.loop=true;

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

if(musicButton.dataset.utMusicBound!=="true"){
musicButton.dataset.utMusicBound="true";
musicButton.addEventListener("click",async()=>{
try{
if(audio.paused){
await audio.play();
}else{
audio.pause();
}
updateButton();
}catch(error){
if(label)label.textContent="Tap again";
musicButton.classList.add("music-error");
}
});
audio.addEventListener("play",updateButton);
audio.addEventListener("pause",updateButton);
}

updateButton();
}

function closeMenu(){
const siteMenu=document.getElementById("siteMenu");
const menuToggle=document.getElementById("menuToggle");
if(siteMenu)siteMenu.classList.remove("is-open");
if(menuToggle)menuToggle.setAttribute("aria-expanded","false");
document.body.classList.remove("menu-open");
}

function setActiveNav(pathname){
document.querySelectorAll(".site-menu a").forEach((link)=>{
const href=link.getAttribute("href")||"";
try{
const url=new URL(href,window.location.origin);
const active=(pathname==="/"&&url.pathname==="/")||(pathname!=="/"&&url.pathname!=="/"&&pathname.startsWith(url.pathname));
link.classList.toggle("is-active",active);
}catch(error){
link.classList.remove("is-active");
}
});
}

function shouldSoftNavigate(anchor,url,event){
if(event.defaultPrevented)return false;
if(event.button!==0)return false;
if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return false;
if(anchor.target&&anchor.target!=="_self")return false;
if(anchor.hasAttribute("download"))return false;
if(url.origin!==window.location.origin)return false;
if(url.pathname.startsWith("/api/"))return false;
if(url.pathname.startsWith("/admin/")||url.pathname==="/admin")return false;
if(url.pathname.match(/\.(zip|pdf|mp3|jpg|jpeg|png|webp|svg)$/i))return false;
return true;
}

function initPageFeatures(){
if(window.runHomeNote)window.runHomeNote();
if(window.runFaithMessages)window.runFaithMessages();
if(window.runSupportLinks)window.runSupportLinks();
if(window.runSubmitForm)window.runSubmitForm();
if(window.runStoreProducts)window.runStoreProducts();
if(window.runDestress)window.runDestress();
document.dispatchEvent(new CustomEvent("ut:pagechange"));
}

async function softNavigate(url,replace=false){
if(isSoftNavigating)return;
isSoftNavigating=true;
document.dispatchEvent(new CustomEvent("ut:beforepagechange"));
closeMenu();

try{
const res=await fetch(url.href,{headers:{"Accept":"text/html","X-UT-Soft-Navigation":"1"}});
if(!res.ok)throw new Error("Navigation failed");
const html=await res.text();
const nextDoc=new DOMParser().parseFromString(html,"text/html");
const currentMain=document.getElementById("main");
const nextMain=nextDoc.getElementById("main");
if(!currentMain||!nextMain)throw new Error("Missing page content");

currentMain.replaceWith(nextMain);

const nextBody=nextDoc.body;
if(nextBody)document.body.className=nextBody.className;

const currentShell=document.querySelector(".app-shell");
const nextShell=nextDoc.querySelector(".app-shell");
if(currentShell&&nextShell)currentShell.className=nextShell.className;

document.title=nextDoc.title||document.title;

const nextDescription=nextDoc.querySelector('meta[name="description"]');
const currentDescription=document.querySelector('meta[name="description"]');
if(nextDescription&&currentDescription)currentDescription.setAttribute("content",nextDescription.getAttribute("content")||"");

if(replace){
history.replaceState({soft:true},document.title,url.href);
}else{
history.pushState({soft:true},document.title,url.href);
}

setActiveNav(url.pathname);
window.scrollTo({top:0,behavior:"instant"});
initPageFeatures();
}catch(error){
window.location.href=url.href;
}finally{
isSoftNavigating=false;
}
}

function setupSoftNavigation(){
if(document.documentElement.dataset.utSoftNavBound==="true")return;
document.documentElement.dataset.utSoftNavBound="true";
history.replaceState({soft:true},document.title,window.location.href);
setActiveNav(window.location.pathname);

document.addEventListener("click",(event)=>{
const anchor=event.target.closest&&event.target.closest("a[href]");
if(!anchor)return;
const url=new URL(anchor.getAttribute("href"),window.location.href);
if(!shouldSoftNavigate(anchor,url,event))return;
event.preventDefault();
softNavigate(url,false);
});

window.addEventListener("popstate",()=>{
softNavigate(new URL(window.location.href),true);
});
}

window.UTInitAll=initPageFeatures;

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",()=>{
runFooterMusic();
setupSoftNavigation();
initPageFeatures();
});
}else{
runFooterMusic();
setupSoftNavigation();
initPageFeatures();
}
})();
/* v32 dynamic footer music button fix */
(function(){
if(window.utMusicDynamicFooterFixLoaded)return;
window.utMusicDynamicFooterFixLoaded=true;

function getMusicAudio(){
let audio=window.utMusicAudio;
if(audio)return audio;

audio=document.getElementById("utSiteMusicAudio");

if(!audio){
audio=document.createElement("audio");
audio.id="utSiteMusicAudio";
audio.src="/assets/audio/relaxing-music.mp3";
audio.preload="auto";
audio.loop=true;
audio.volume=.45;
audio.style.display="none";
document.body.appendChild(audio);
}

audio.loop=true;
window.utMusicAudio=audio;
return audio;
}

function updateMusicButtons(){
const audio=getMusicAudio();
const buttons=document.querySelectorAll("#musicToggle,.footer-music-button");

buttons.forEach((button)=>{
const isPlaying=!audio.paused;
button.setAttribute("aria-pressed",isPlaying ? "true" : "false");

const label=button.querySelector(".footer-music-label");
if(label){
label.textContent=isPlaying ? "Pause music" : "Play music";
}
});
}

async function toggleMusic(){
const audio=getMusicAudio();

try{
if(audio.paused){
await audio.play();
}else{
audio.pause();
}
}catch(error){
const buttons=document.querySelectorAll("#musicToggle,.footer-music-button");
buttons.forEach((button)=>{
button.classList.add("music-error");
const label=button.querySelector(".footer-music-label");
if(label)label.textContent="Tap again";
});
}

updateMusicButtons();
}

function bindMusicButtons(){
getMusicAudio();

const buttons=document.querySelectorAll("#musicToggle,.footer-music-button");

buttons.forEach((button)=>{
if(button.dataset.utMusicBound==="true")return;
button.dataset.utMusicBound="true";
button.addEventListener("click",toggleMusic);
});

updateMusicButtons();
}

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",bindMusicButtons);
}else{
bindMusicButtons();
}

document.addEventListener("ut:footerready",bindMusicButtons);
document.addEventListener("ut:pagechange",bindMusicButtons);
})();

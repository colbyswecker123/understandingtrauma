const menuToggle=document.getElementById("menuToggle");
const menuClose=document.getElementById("menuClose");
const siteMenu=document.getElementById("siteMenu");
function setMenu(open){
if(!siteMenu||!menuToggle)return;
siteMenu.classList.toggle("is-open",open);
menuToggle.setAttribute("aria-expanded",String(open));
document.body.classList.toggle("menu-open",open);
}
if(menuToggle)menuToggle.addEventListener("click",()=>setMenu(true));
if(menuClose)menuClose.addEventListener("click",()=>setMenu(false));
if(siteMenu){
siteMenu.addEventListener("click",(event)=>{
if(event.target===siteMenu||event.target.closest("a"))setMenu(false);
});
}
document.addEventListener("keydown",(event)=>{
if(event.key==="Escape")setMenu(false);
});

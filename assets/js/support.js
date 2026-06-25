const SUPPORT_LINKS={
coffee:"",
note:"",
peace:"",
custom:""
};
const statusEl=document.getElementById("supportStatus");
function setStatus(message){
if(statusEl)statusEl.textContent=message;
}
document.querySelectorAll("[data-square-link]").forEach((button)=>{
const key=button.dataset.squareLink;
const url=SUPPORT_LINKS[key]||"";
if(url){
button.href=url;
button.target="_blank";
button.rel="noopener";
}else{
button.addEventListener("click",(event)=>{
event.preventDefault();
setStatus("Square support links are almost ready. Once connected, this button will open a secure Square payment page.");
});
}
});

const SUPPORT_LINKS={
coffee:"https://square.link/u/n12Mckni",
note:"https://square.link/u/l9QhSqIH",
peace:"https://square.link/u/H2LHHdmd"
};

(function(){
function runSupportLinks(){
const statusEl=document.getElementById("supportStatus");

function setStatus(message){
if(statusEl)statusEl.textContent=message;
}

document.querySelectorAll('[data-square-link="custom"]').forEach((button)=>{
const card=button.closest(".support-option");
if(card)card.remove();
});

document.querySelectorAll("[data-square-link]").forEach((button)=>{
const key=button.dataset.squareLink;
const url=SUPPORT_LINKS[key]||"";

if(url){
button.href=url;
button.target="_blank";
button.rel="noopener";
}else if(button.dataset.utSupportBound!=="true"){
button.dataset.utSupportBound="true";
button.addEventListener("click",(event)=>{
event.preventDefault();
setStatus("This support option is almost ready. Once connected, this button will open a secure Square payment page.");
});
}
});
}

window.runSupportLinks=runSupportLinks;

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",runSupportLinks);
}else{
runSupportLinks();
}

document.addEventListener("ut:pagechange",runSupportLinks);
})();

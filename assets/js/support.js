const SUPPORT_LINKS={
coffee:"https://square.link/u/n12Mckni",
note:"https://square.link/u/l9QhSqIH",
peace:"https://square.link/u/H2LHHdmd"
};

function runSupportLinks(){
const statusEl=document.getElementById("supportStatus");

function setStatus(message){
if(statusEl)statusEl.textContent=message;
}

// Remove the custom / any amount card completely.
document.querySelectorAll('[data-square-link="custom"]').forEach((button)=>{
const card=button.closest(".support-option");
if(card)card.remove();
});

// Connect the remaining Square buttons.
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
setStatus("This support option is almost ready. Once connected, this button will open a secure Square payment page.");
});
}
});
}

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",runSupportLinks);
}else{
runSupportLinks();
}

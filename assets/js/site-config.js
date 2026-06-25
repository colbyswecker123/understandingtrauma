window.UT_SITE_CONFIG={
BUY_ME_A_COFFEE_URL:"https://www.buymeacoffee.com/understandingtrauma"
};
document.addEventListener("DOMContentLoaded",()=>{
const url=window.UT_SITE_CONFIG?.BUY_ME_A_COFFEE_URL||"";
document.querySelectorAll(".buy-coffee-link").forEach((link)=>{
if(url){link.href=url;link.target="_blank";link.rel="noopener";}
});
});

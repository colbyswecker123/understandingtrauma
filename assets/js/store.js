(function(){
function money(cents){
const amount=Number(cents||0)/100;
return amount>0?amount.toLocaleString(undefined,{style:"currency",currency:"USD"}):"Price coming soon";
}

function escapeHtml(value){
return String(value||"").replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]||char));
}

function renderProducts(grid,products){
if(!grid)return;
grid.innerHTML="";
if(!products.length){
grid.innerHTML=`<section class="store-coming-soon-page">
<div class="store-coming-soon-card-clean">
<p class="store-eyebrow">Understanding Trauma Store</p>
<h2>Store coming soon.</h2>
<p class="store-coming-copy">We’re preparing meaningful items connected to encouragement, healing, faith, and daily reminders. Products will appear here once they are added and marked active.</p>
<div class="store-coming-actions">
<a class="control-button primary-control" href="/support/">
<span class="control-icon" aria-hidden="true">☕</span>
<span>Support the mission</span>
</a>
<a class="control-button secondary-control" href="/user_messages/">
<span class="control-icon" aria-hidden="true">✎</span>
<span>Submit a message</span>
</a>
</div>
</div>
</section>`;
return;
}
products.forEach((product)=>{
const card=document.createElement("article");
card.className="store-card";
const image=product.image_url?`<img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}">`:`<div class="store-placeholder" aria-hidden="true"><span>UT</span></div>`;
const checkout=product.checkout_url?`<a class="control-button primary-control" href="${escapeHtml(product.checkout_url)}" target="_blank" rel="noopener"><span class="control-icon" aria-hidden="true">→</span><span>Checkout</span></a>`:`<button class="control-button secondary-control" type="button" disabled><span class="control-icon" aria-hidden="true">•</span><span>Checkout coming soon</span></button>`;
card.innerHTML=`${image}<div class="store-card-body"><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.description||"")}</p><strong>${money(product.price_cents)}</strong>${checkout}</div>`;
grid.appendChild(card);
});
}

async function loadProducts(){
const grid=document.getElementById("storeGrid");
if(!grid||grid.dataset.utLoaded==="true")return;
grid.dataset.utLoaded="true";
try{
const res=await fetch("/api/products",{headers:{"Accept":"application/json"}});
const data=await res.json().catch(()=>({}));
if(!res.ok)throw new Error(data.error||"Could not load products");
renderProducts(grid,data.products||[]);
}catch(error){
grid.innerHTML=`<article class="content-card store-empty"><h2>Store coming soon.</h2><p>Products could not be loaded right now. Please check back later.</p></article>`;
}
}

window.runStoreProducts=loadProducts;

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",loadProducts);
}else{
loadProducts();
}

document.addEventListener("ut:pagechange",loadProducts);
})();

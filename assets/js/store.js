const grid=document.getElementById("storeGrid");
function money(cents){
const amount=Number(cents||0)/100;
return amount>0?amount.toLocaleString(undefined,{style:"currency",currency:"USD"}):"Price coming soon";
}
function escapeHtml(value){return String(value||"").replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));}
function renderProducts(products){
if(!grid)return;
grid.innerHTML="";
if(!products.length){
grid.innerHTML=`<article class="content-card store-empty"><h2>Understanding Trauma merchandise coming soon.</h2><p>No items are available right now, but future products will appear here once they are added through the admin portal.</p></article>`;
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
if(!grid)return;
try{
const res=await fetch("/api/products",{headers:{"Accept":"application/json"}});
const data=await res.json().catch(()=>({}));
if(!res.ok)throw new Error(data.error||"Could not load products");
renderProducts(data.products||[]);
}catch(error){
grid.innerHTML=`<article class="content-card store-empty"><h2>Store coming soon.</h2><p>Products could not be loaded right now. Please check back later.</p></article>`;
}
}
loadProducts();

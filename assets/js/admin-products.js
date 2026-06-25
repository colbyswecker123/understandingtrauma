const productForm=document.getElementById("productForm");
const list=document.getElementById("productAdminList");
const productStatusText=document.getElementById("productStatusText");
const productsLoadStatus=document.getElementById("productsLoadStatus");
const clearButton=document.getElementById("clearProductForm");
const logoutButton=document.getElementById("logoutButton");
function status(el,message){if(el)el.textContent=message;}
function escapeHtml(value){return String(value||"").replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));}
function moneyFromCents(cents){return (Number(cents||0)/100).toFixed(2);}
function centsFromDollars(value){const num=Number(value||0);return Number.isFinite(num)?Math.max(0,Math.round(num*100)):0;}
async function api(path,options={}){
const res=await fetch(path,{credentials:"include",...options,headers:{"Accept":"application/json",...options.headers}});
const data=await res.json().catch(()=>({}));
if(!res.ok)throw new Error(data.error||"Request failed");
return data;
}
async function ensureSession(){
try{await api("/api/admin/session");}
catch(error){location.href=`/admin/?return=${encodeURIComponent(location.pathname)}`;}
}
function clearForm(){
productForm.reset();
document.getElementById("productId").value="";
document.getElementById("productStatus").value="draft";
status(productStatusText,"");
}
function fillForm(product){
document.getElementById("productId").value=product.id;
document.getElementById("productName").value=product.name||"";
document.getElementById("productDescription").value=product.description||"";
document.getElementById("productPrice").value=moneyFromCents(product.price_cents);
document.getElementById("productSort").value=product.sort_order??"";
document.getElementById("productImage").value=product.image_url||"";
document.getElementById("productCheckout").value=product.checkout_url||"";
document.getElementById("productStatus").value=product.status||"draft";
window.scrollTo({top:0,behavior:"smooth"});
}
function render(products){
if(!list)return;
list.innerHTML="";
if(!products.length){
list.innerHTML=`<article class="empty-state"><strong>No products yet.</strong><span>Add your first product above. Keep it in Draft until you are ready for it to appear publicly.</span></article>`;
return;
}
products.forEach((product)=>{
const card=document.createElement("article");
card.className="admin-product-card";
const badge=product.status==="active"?"Active":"Draft";
card.innerHTML=`<div><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.description||"No description.")}</p><span class="product-badge">${badge}</span><strong>${moneyFromCents(product.price_cents)}</strong></div><div class="admin-product-actions"><button class="mini-link" data-action="edit" data-id="${product.id}">Edit</button><button class="mini-link" data-action="delete" data-id="${product.id}">Delete</button></div>`;
card.dataset.product=JSON.stringify(product);
list.appendChild(card);
});
}
async function loadProducts(){
try{
status(productsLoadStatus,"Loading products…");
const data=await api("/api/admin/products");
render(data.products||[]);
status(productsLoadStatus,`${(data.products||[]).length} product${(data.products||[]).length===1?"":"s"} loaded.`);
}catch(error){
status(productsLoadStatus,error.message||"Could not load products.");
}
}
if(productForm){
productForm.addEventListener("submit",async(event)=>{
event.preventDefault();
const id=document.getElementById("productId").value.trim();
const body={
name:document.getElementById("productName").value.trim(),
description:document.getElementById("productDescription").value.trim(),
price_cents:centsFromDollars(document.getElementById("productPrice").value),
sort_order:Number(document.getElementById("productSort").value||0),
image_url:document.getElementById("productImage").value.trim(),
checkout_url:document.getElementById("productCheckout").value.trim(),
status:document.getElementById("productStatus").value
};
try{
status(productStatusText,"Saving product…");
if(id){await api(`/api/admin/products/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});}
else{await api("/api/admin/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});}
clearForm();
status(productStatusText,"Product saved.");
await loadProducts();
}catch(error){
status(productStatusText,error.message||"Could not save product.");
}
});
}
if(clearButton)clearButton.addEventListener("click",clearForm);
if(list){
list.addEventListener("click",async(event)=>{
const button=event.target.closest("button[data-action]");
if(!button)return;
const card=button.closest(".admin-product-card");
const product=JSON.parse(card.dataset.product||"{}");
if(button.dataset.action==="edit"){fillForm(product);return;}
if(button.dataset.action==="delete"){
if(!confirm(`Delete ${product.name}?`))return;
try{
await api(`/api/admin/products/${product.id}`,{method:"DELETE"});
await loadProducts();
}catch(error){status(productsLoadStatus,error.message||"Could not delete product.");}
}
});
}
if(logoutButton){
logoutButton.addEventListener("click",async()=>{
try{await api("/api/admin/logout",{method:"POST"});}catch(error){}
location.href="/admin/";
});
}
ensureSession().then(loadProducts);

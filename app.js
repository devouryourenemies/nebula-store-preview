
const products = window.NEBULA_PRODUCTS || [];
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const money = n => `$${Number(n).toFixed(2)}`;
let cart = JSON.parse(localStorage.getItem('nebulaCart') || '[]');
let activeCategory = 'All';
let query = '';

function initAgeGate(){
  const gate = $('#ageGate');
  if(localStorage.getItem('nebulaAgeOk') === 'yes') gate.classList.add('hidden');
  $('#enterSite').addEventListener('click',()=>{localStorage.setItem('nebulaAgeOk','yes'); gate.classList.add('hidden');});
}
function categories(){ return ['All', ...new Set(products.map(p=>p.category))]; }
function renderFilters(){
  const select = $('#categoryFilter');
  const pills = $('#categoryPills');
  select.innerHTML = categories().map(c=>`<option value="${c}">${c}</option>`).join('');
  pills.innerHTML = categories().map(c=>`<button class="pill ${c===activeCategory?'active':''}" data-cat="${c}">${c}</button>`).join('');
  pills.addEventListener('click', e=>{ const btn=e.target.closest('[data-cat]'); if(!btn) return; activeCategory=btn.dataset.cat; select.value=activeCategory; renderProducts(); renderFilters(); });
  select.addEventListener('change', e=>{ activeCategory=e.target.value; renderProducts(); renderFilters(); });
  $('#searchInput').addEventListener('input', e=>{ query=e.target.value.toLowerCase().trim(); renderProducts(); });
}
function productCard(p){
  return `<article class="product-card" style="--accent:${p.accent}">
    <div class="label-art"><span class="tag">${p.tag}</span><div class="label-vial">${p.name}<br>${p.spec}</div></div>
    <div class="product-info">
      <span class="formula">${p.category}</span><h3>${p.name}</h3><span class="formula">${p.formula}</span>
      <p class="summary">${p.summary}</p>
      <div class="price-row"><span class="price">${money(p.price)}</span><span class="spec">${p.spec}</span></div>
      <div class="card-actions"><button class="tiny-btn" data-details="${p.id}">Details</button><button class="tiny-btn primary" data-add="${p.id}">Add</button></div>
    </div>
  </article>`;
}
function filtered(){
  return products.filter(p=>{
    const inCat = activeCategory==='All' || p.category===activeCategory;
    const text = `${p.name} ${p.formula} ${p.category} ${p.summary} ${p.tag}`.toLowerCase();
    return inCat && (!query || text.includes(query));
  });
}
function renderProducts(){
  const grid = $('#productGrid');
  const list = filtered();
  grid.innerHTML = list.length ? list.map(productCard).join('') : `<div class="empty">No products match that search.</div>`;
}
function addToCart(id){
  const item = cart.find(x=>x.id===id);
  if(item) item.qty += 1; else cart.push({id,qty:1});
  saveCart(); openCart();
}
function saveCart(){ localStorage.setItem('nebulaCart', JSON.stringify(cart)); renderCart(); }
function renderCart(){
  $('#cartCount').textContent = cart.reduce((s,x)=>s+x.qty,0);
  const wrap = $('#cartItems');
  if(!cart.length){ wrap.innerHTML = `<div class="empty">Your preview cart is empty.</div>`; $('#cartTotal').textContent = '$0.00'; return; }
  let total = 0;
  wrap.innerHTML = cart.map(item=>{
    const p = products.find(x=>x.id===item.id) || {name:item.id,price:0,spec:''}; total += p.price*item.qty;
    return `<div class="cart-item"><div><b>${p.name}</b><small>${p.spec} • ${money(p.price)} each</small></div><div class="qty-controls"><button data-dec="${item.id}">−</button><span>${item.qty}</span><button data-inc="${item.id}">+</button></div></div>`;
  }).join('');
  $('#cartTotal').textContent = money(total);
}
function openCart(){ $('#cartDrawer').classList.add('open'); $('#scrim').classList.add('open'); }
function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#scrim').classList.remove('open'); }
function openDetails(id){
  const p = products.find(x=>x.id===id); if(!p) return;
  $('#modalBody').innerHTML = `<div class="modal-product"><div class="label-art modal-art" style="--accent:${p.accent}"><span class="tag">${p.tag}</span><div class="label-vial">${p.name}<br>${p.spec}</div></div><div class="modal-details"><span class="formula">${p.category}</span><h2>${p.name}</h2><p class="formula">${p.formula}</p><p class="price">${money(p.price)}</p><p>${p.summary}</p><div class="detail-list"><div><b>Research Protocol Reference</b><span>${p.protocol}</span></div><div><b>Storage</b><span>${p.storage}</span></div><div><b>Compliance</b><span>For research purposes only, not for human consumption. No medical claims are made.</span></div></div><button class="primary-btn" data-add="${p.id}">Add to Cart</button></div></div>`;
  $('#productModal').classList.add('open');
}
function closeDetails(){ $('#productModal').classList.remove('open'); }
function bindEvents(){
  document.addEventListener('click', e=>{
    const add = e.target.closest('[data-add]'); if(add){ addToCart(add.dataset.add); return; }
    const details = e.target.closest('[data-details]'); if(details){ openDetails(details.dataset.details); return; }
    const inc = e.target.closest('[data-inc]'); if(inc){ const it=cart.find(x=>x.id===inc.dataset.inc); if(it){it.qty++; saveCart();} return; }
    const dec = e.target.closest('[data-dec]'); if(dec){ const it=cart.find(x=>x.id===dec.dataset.dec); if(it){it.qty--; if(it.qty<=0) cart=cart.filter(x=>x.id!==dec.dataset.dec); saveCart();} return; }
  });
  $('#openCart').addEventListener('click', openCart); $('#openCartBottom').addEventListener('click', openCart); $('#closeCart').addEventListener('click', closeCart); $('#scrim').addEventListener('click', closeCart);
  $('#modalClose').addEventListener('click', closeDetails); $('#productModal').addEventListener('click', e=>{ if(e.target.id==='productModal') closeDetails(); });
  $('#checkoutBtn').addEventListener('click',()=>{
    if(!cart.length){ alert('Add products before requesting checkout.'); return; }
    const lines = cart.map(item=>{const p=products.find(x=>x.id===item.id); return `${item.qty}x ${p.name} (${p.spec}) - ${money(p.price*item.qty)}`;}).join('\n');
    const total = cart.reduce((s,item)=>s+(products.find(p=>p.id===item.id)?.price||0)*item.qty,0);
    location.href = `mailto:support@nebulahyping.com?subject=Nebula%20Secure%20Checkout%20Request&body=${encodeURIComponent('Cart request:\n\n'+lines+'\n\nTotal: '+money(total)+'\n\nPlease send secure checkout link.')}`;
  });
  $('#coaDemo').addEventListener('click',()=> $('#coaResult').textContent = 'Preview confirmed. Production connects batch verification records here.');
  $$('.plan-add').forEach(btn=>btn.addEventListener('click',()=>alert(`${btn.dataset.plan} added to production scope. Payment setup connects through WooCommerce/Stripe hosting.`)));
}
initAgeGate(); renderFilters(); renderProducts(); renderCart(); bindEvents();

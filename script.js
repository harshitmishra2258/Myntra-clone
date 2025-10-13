/* script.js */
const products = [
  {id:1, title:"Men's Casual Shirt", brand:'Roadster', price:799, img:'https://images.unsplash.com/photo-1520975698510-8c5a5e3c7f9b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Men', desc:'Comfortable cotton shirt, slim fit'},
  {id:2, title:"Women's Sneakers", brand:'Nike', price:2499, img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Women', desc:'Lightweight and breathable sneakers'},
  {id:3, title:'Denim Jeans', brand:'Levis', price:1599, img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Men', desc:'Classic straight-fit denim'},
  {id:4, title:'Running Shorts', brand:'Puma', price:599, img:'https://images.unsplash.com/photo-1618354697767-2d7b1fe2e9d9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Sports', desc:'Quick-dry running shorts'},
  {id:5, title:'Floral Dress', brand:'Zara', price:2999, img:'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Women', desc:'Summer-ready floral midi dress'},
  {id:6, title:'Backpack', brand:'Wildcraft', price:1299, img:'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Bags', desc:'20L durable backpack for daily use'},
  {id:7, title:'Smart Watch', brand:'Boat', price:3499, img:'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Gadgets', desc:'Fitness tracking watch'},
  {id:8, title:'Sunglasses', brand:'RayBan', price:1999, img:'https://images.unsplash.com/photo-1503342452485-86f7b4b8f8f4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', cat:'Accessories', desc:'UV protection sunglasses'}
];

const categories = ['All','Men','Women','Sports','Bags','Gadgets','Accessories'];
const state = {cart:{}};

const productGrid = document.getElementById('productGrid');
const resultCount = document.getElementById('resultCount');
const categoriesWrap = document.getElementById('categories');
const cartPanel = document.getElementById('cartPanel');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsWrap = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const overlay = document.getElementById('overlay');

categories.forEach(cat=>{
  const el = document.createElement('button');
  el.className='cat';
  el.innerText=cat;
  el.addEventListener('click',()=>{filterBy(cat)});
  categoriesWrap.appendChild(el);
});

document.getElementById('searchBtn').addEventListener('click',()=>{
  const q = document.getElementById('searchInput').value.trim();
  search(q);
});
document.getElementById('searchInput').addEventListener('keydown',e=>{
  if(e.key==='Enter') document.getElementById('searchBtn').click();
});

function renderProducts(list){
  productGrid.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <img class="thumb" src="${p.img}" alt="${p.title}" />
      <div class="brand muted">${p.brand}</div>
      <div class="title">${p.title}</div>
      <div class="row"><div class="price">₹${p.price}</div><button class="add" data-id="${p.id}">Add</button></div>
    `;
    card.querySelector('.thumb').addEventListener('click',()=>openModal(p));
    card.querySelector('.add').addEventListener('click',()=>addToCart(p.id));
    productGrid.appendChild(card);
  });
  resultCount.innerText = list.length;
}

function filterBy(cat){
  if(cat==='All') renderProducts(products);
  else renderProducts(products.filter(p=>p.cat===cat));
}

function search(q){
  if(!q) return renderProducts(products);
  const s = q.toLowerCase();
  renderProducts(products.filter(p=> (p.title+p.brand+p.desc).toLowerCase().includes(s)));
}

function addToCart(id,qty=1){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  state.cart[id] = (state.cart[id] || 0) + qty;
  updateCartUI();
  openCart();
}
function removeFromCart(id){ delete state.cart[id]; updateCartUI(); }
function changeQty(id,delta){ if(!state.cart[id]) return; state.cart[id]+=delta; if(state.cart[id]<=0) delete state.cart[id]; updateCartUI(); }

function updateCartUI(){
  cartItemsWrap.innerHTML='';
  const keys = Object.keys(state.cart);
  let sub=0, totalItems=0;
  keys.forEach(k=>{
    const p = products.find(x=>x.id==k);
    const qty = state.cart[k];
    totalItems += qty;
    sub += p.price * qty;
    const it = document.createElement('div'); it.className='cart-item';
    it.innerHTML = `
      <img src="${p.img}" />
      <div style="flex:1">
        <div style="font-weight:700">${p.title}</div>
        <div class="muted">${p.brand}</div>
        <div style="margin-top:6px;display:flex;align-items:center;gap:8px">
          <button class="pill" data-op="dec" data-id="${k}">-</button>
          <div>${qty}</div>
          <button class="pill" data-op="inc" data-id="${k}">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800">₹${p.price * qty}</div>
        <button class="pill" data-op="rm" data-id="${k}" style="margin-top:8px">Remove</button>
      </div>
    `;
    cartItemsWrap.appendChild(it);
  });
  cartCount.innerText = totalItems;
  subtotalEl.innerText = `₹${sub}`;
  cartItemsWrap.querySelectorAll('button').forEach(btn=>{
    const op = btn.getAttribute('data-op');
    const id = Number(btn.getAttribute('data-id'));
    if(op==='dec') btn.addEventListener('click',()=>changeQty(id,-1));
    if(op==='inc') btn.addEventListener('click',()=>changeQty(id,1));
    if(op==='rm') btn.addEventListener('click',()=>removeFromCart(id));
  });
}

function openCart(){ cartPanel.classList.add('open'); cartPanel.setAttribute('aria-hidden','false'); }
function closeCart(){ cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden','true'); }
openCartBtn.addEventListener('click',openCart);
closeCartBtn.addEventListener('click',closeCart);

const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalBrand = document.getElementById('modalBrand');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalAdd = document.getElementById('modalAdd');
let currentModalProduct = null;

function openModal(p){
  currentModalProduct = p;
  modalImg.src = p.img;
  modalTitle.innerText = p.title;
  modalBrand.innerText = p.brand;
  modalDesc.innerText = p.desc;
  modalPrice.innerText = `₹${p.price}`;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
}
document.getElementById('modalClose').addEventListener('click',()=>{ overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true'); });
overlay.addEventListener('click',e=>{ if(e.target===overlay) { overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true'); } });
modalAdd.addEventListener('click',()=>{ if(currentModalProduct){ addToCart(currentModalProduct.id); overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true'); } });

renderProducts(products);
updateCartUI();

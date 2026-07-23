
/* ---------------------------------------------------------
   DATOS
--------------------------------------------------------- */
const TOUR = [
  {date:'14', mon:'SEP 2026', city:'Madrid, España', venue:'WiZink Center', price:'Desde $45'},
  {date:'21', mon:'SEP 2026', city:'Barcelona, España', venue:'Palau Sant Jordi', price:'Desde $45'},
  {date:'03', mon:'OCT 2026', city:'Ciudad de México, México', venue:'Auditorio Nacional', price:'Desde $38'},
  {date:'10', mon:'OCT 2026', city:'Bogotá, Colombia', venue:'Movistar Arena', price:'Desde $35'},
  {date:'17', mon:'OCT 2026', city:'Buenos Aires, Argentina', venue:'Movistar Arena', price:'Desde $35'},
];

const PHOTO_CAPS = [
  ['Backstage — Madrid', 'linear-gradient(160deg,#ffb6d5,#7fe9d4)'],
  ['Sesión de estudio', 'linear-gradient(160deg,#c6a6f2,#ffe1a1)'],
  ['HOLOGRAMA — Portada alterna', 'linear-gradient(160deg,#7fe9d4,#c6a6f2)'],
  ['En vivo — Barcelona', 'linear-gradient(160deg,#ffb6d5,#ffe1a1)'],
  ['Detrás de cámaras', 'linear-gradient(160deg,#c6a6f2,#7fe9d4)'],
  ['Retrato — Luz de luna', 'linear-gradient(160deg,#ffe1a1,#ffb6d5)'],
  ['Ensayo general', 'linear-gradient(160deg,#7fe9d4,#ffb6d5)'],
  ['Con la banda', 'linear-gradient(160deg,#ffb6d5,#c6a6f2)'],
  ['Última gira', 'linear-gradient(160deg,#c6a6f2,#ffb6d5)'],
];

const VIDEO_CAPS = [
  ['HOLOGRAMA (Video oficial)', '3:42', 'linear-gradient(160deg,#7fe9d4,#ffb6d5)'],
  ['Luz de Luna (Acústico)', '2:58', 'linear-gradient(160deg,#ffe1a1,#c6a6f2)'],
  ['En vivo — WiZink Center', '4:15', 'linear-gradient(160deg,#c6a6f2,#7fe9d4)'],
  ['Detrás de cámaras: HOLOGRAMA', '6:20', 'linear-gradient(160deg,#ffb6d5,#ffe1a1)'],
  ['Sesión Vevo', '3:30', 'linear-gradient(160deg,#7fe9d4,#c6a6f2)'],
  ['Ensayo — cuerdas', '2:10', 'linear-gradient(160deg,#ffe1a1,#ffb6d5)'],
];

const PRODUCTS = [
  {id:'p1', name:'Camiseta "Holograma"', price:32, sizes:['S','M','L','XL'], grad:'linear-gradient(150deg,#7fe9d4,#ffb6d5)'},
  {id:'p2', name:'Hoodie "Luz de Luna"', price:58, sizes:['S','M','L','XL'], grad:'linear-gradient(150deg,#c6a6f2,#ffe1a1)'},
  {id:'p3', name:'Vinilo — HOLOGRAMA (LP)', price:34, sizes:null, grad:'linear-gradient(150deg,#0a0b1e,#c6a6f2)'},
  {id:'p4', name:'CD firmado — HOLOGRAMA', price:22, sizes:null, grad:'linear-gradient(150deg,#ffb6d5,#7fe9d4)'},
  {id:'p5', name:'Póster holográfico', price:18, sizes:null, grad:'linear-gradient(150deg,#ffe1a1,#c6a6f2)'},
  {id:'p6', name:'Set de pines esmaltados', price:16, sizes:null, grad:'linear-gradient(150deg,#7fe9d4,#c6a6f2)'},
  {id:'p7', name:'Tote bag bordado', price:24, sizes:null, grad:'linear-gradient(150deg,#ffb6d5,#ffe1a1)'},
  {id:'p8', name:'Gorra bordada', price:28, sizes:['Única'], grad:'linear-gradient(150deg,#c6a6f2,#7fe9d4)'},
];

/* ---------------------------------------------------------
   ESTADO
--------------------------------------------------------- */
let cart = [];
let currentUser = null; // {name, email}

/* ---------------------------------------------------------
   STORAGE HELPERS  (window.storage — persiste entre sesiones)
--------------------------------------------------------- */
async function stGet(key, shared){
  try{
    const r = await window.storage.get(key, shared);
    return r ? JSON.parse(r.value) : null;
  }catch(e){ return null; }
}
async function stSet(key, value, shared){
  try{ await window.storage.set(key, JSON.stringify(value), shared); return true; }
  catch(e){ return false; }
}
async function stDelete(key, shared){
  try{ await window.storage.delete(key, shared); }catch(e){}
}

/* ---------------------------------------------------------
   RENDER: TOUR / FOTOS / VIDEOS
--------------------------------------------------------- */
function renderTour(){
  const el = document.getElementById('tourList');
  el.innerHTML = TOUR.map((t,i) => `
    <div class="tour-row facet">
      <div class="tour-date">${t.date}<span>${t.mon}</span></div>
      <div class="tour-place"><strong>${t.city}</strong><div>${t.venue}</div></div>
      <div class="tour-price">${t.price}</div>
      <button class="btn btn-primary" onclick="addTicketToCart(${i})">Comprar entradas</button>
    </div>
  `).join('');
}

function renderGrid(targetId, items, isVideo){
  const el = document.getElementById(targetId);
  el.innerHTML = items.map(item => {
    const [cap, gradOrDur, grad] = isVideo ? [item[0], item[1], item[2]] : [item[0], null, item[1]];
    return `
      <div class="media-tile facet">
        <div class="tint" style="background:${grad}"></div>
        ${isVideo ? `<div class="play-badge">▶</div><div class="dur">${gradOrDur}</div>` : ''}
        <div class="cap">${cap}</div>
      </div>
    `;
  }).join('');
}

/* ---------------------------------------------------------
   RENDER: TIENDA
--------------------------------------------------------- */
function renderProducts(){
  const el = document.getElementById('productGrid');
  el.innerHTML = PRODUCTS.map(p => `
    <div class="product-card facet">
      <div class="product-img" style="background:${p.grad}"></div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <div class="product-controls">
          ${p.sizes ? `<select class="size-select" id="size-${p.id}">${p.sizes.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>` : ''}
          <button class="btn-add" onclick="addProductToCart('${p.id}')">Añadir</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------------------------------------------------------
   CARRITO
--------------------------------------------------------- */
function addTicketToCart(i){
  const t = TOUR[i];
  const priceNum = parseInt(t.price.replace(/\D/g,''));
  addToCart({id:'ticket-'+i, name:'Entrada — '+t.city, price:priceNum, size:t.date+' '+t.mon, grad:'linear-gradient(150deg,#7fe9d4,#ffb6d5)'});
}

function addProductToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const sizeEl = document.getElementById('size-'+id);
  const size = sizeEl ? sizeEl.value : null;
  addToCart({id:p.id, name:p.name, price:p.price, size:size, grad:p.grad});
}

function addToCart(item){
  const existing = cart.find(c => c.id === item.id && c.size === item.size);
  if(existing){ existing.qty += 1; }
  else{ cart.push({...item, qty:1}); }
  saveCart();
  renderCart();
  toast('Añadido al carrito ✧');
}

function changeQty(idx, delta){
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx,1);
  saveCart(); renderCart();
}
function removeItem(idx){ cart.splice(idx,1); saveCart(); renderCart(); }

function cartTotal(){ return cart.reduce((s,c)=>s + c.price*c.qty, 0); }
function cartCount(){ return cart.reduce((s,c)=>s + c.qty, 0); }

async function saveCart(){ await stSet('cart', cart, false); }
async function loadCart(){ const c = await stGet('cart', false); if(c) cart = c; }

function renderCart(){
  const badge = document.getElementById('cartBadge');
  const count = cartCount();
  badge.style.display = count > 0 ? 'flex' : 'none';
  badge.textContent = count;

  document.getElementById('drawerTitle').textContent = 'Tu carrito';
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');

  if(cart.length === 0){
    body.innerHTML = `<div class="empty-state">Tu carrito está vacío.<br>Explora la tienda ✧</div>`;
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map((c,idx) => `
    <div class="cart-item">
      <div class="cart-thumb" style="background:${c.grad}"></div>
      <div>
        <h4>${c.name}</h4>
        ${c.size ? `<div class="meta">${c.size}</div>` : ''}
        <div class="qty-ctrl">
          <button onclick="changeQty(${idx},-1)">−</button>
          <span>${c.qty}</span>
          <button onclick="changeQty(${idx},1)">+</button>
        </div>
      </div>
      <div>
        <div class="cart-item-price">$${(c.price*c.qty).toFixed(2)}</div>
        <button class="remove-link" onclick="removeItem(${idx})">Quitar</button>
      </div>
    </div>
  `).join('');

  foot.innerHTML = `
    <div class="subtotal-row"><span>Subtotal</span><strong>$${cartTotal().toFixed(2)}</strong></div>
    <button class="btn btn-primary btn-full" onclick="openCheckout()">Finalizar compra</button>
  `;
}

function openCart(){ document.getElementById('overlay').classList.add('open'); document.getElementById('cartDrawer').classList.add('open'); }
function closeCart(){ document.getElementById('overlay').classList.remove('open'); document.getElementById('cartDrawer').classList.remove('open'); }

/* ---------------------------------------------------------
   CHECKOUT
--------------------------------------------------------- */
function openCheckout(){
  if(cart.length === 0) return;
  document.getElementById('drawerTitle').textContent = 'Finalizar compra';
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');

  body.innerHTML = `
    <form id="checkoutForm">
      <div class="field"><label>Nombre completo</label><input type="text" id="coName" required value="${currentUser ? currentUser.name : ''}"></div>
      <div class="field"><label>Correo</label><input type="email" id="coEmail" required value="${currentUser ? currentUser.email : ''}"></div>
      <div class="field"><label>Dirección</label><input type="text" id="coAddress" required></div>
      <div class="field-row">
        <div class="field"><label>Ciudad</label><input type="text" id="coCity" required></div>
        <div class="field"><label>Código postal</label><input type="text" id="coZip" required></div>
      </div>
      <div class="field"><label>País</label><input type="text" id="coCountry" required></div>
      <div class="field"><label>Número de tarjeta</label><input type="text" id="coCard" placeholder="0000 0000 0000 0000" maxlength="19" required></div>
      <div class="field-row">
        <div class="field"><label>Vencimiento</label><input type="text" id="coExp" placeholder="MM/AA" maxlength="5" required></div>
        <div class="field"><label>CVV</label><input type="text" id="coCvv" placeholder="123" maxlength="4" required></div>
      </div>
      <div class="form-error" id="checkoutError"></div>
    </form>
  `;
  foot.innerHTML = `
    <div class="subtotal-row"><span>Total a pagar</span><strong>$${cartTotal().toFixed(2)}</strong></div>
    <button class="btn btn-primary btn-full" id="payBtn">Pagar ahora</button>
  `;
  document.getElementById('payBtn').addEventListener('click', submitCheckout);
}

async function submitCheckout(e){
  e.preventDefault();
  const errEl = document.getElementById('checkoutError');
  const card = document.getElementById('coCard').value.replace(/\s/g,'');
  const exp = document.getElementById('coExp').value;
  const cvv = document.getElementById('coCvv').value;

  const required = ['coName','coEmail','coAddress','coCity','coZip','coCountry'];
  for(const id of required){
    if(!document.getElementById(id).value.trim()){
      errEl.textContent = 'Completa todos los campos para continuar.';
      return;
    }
  }
  if(!/^\d{13,19}$/.test(card)){ errEl.textContent = 'Revisa el número de tarjeta.'; return; }
  if(!/^\d{2}\/\d{2}$/.test(exp)){ errEl.textContent = 'Formato de vencimiento inválido (MM/AA).'; return; }
  if(!/^\d{3,4}$/.test(cvv)){ errEl.textContent = 'CVV inválido.'; return; }

  const order = {
    id: 'LM-' + Date.now().toString().slice(-8),
    date: new Date().toLocaleDateString('es-ES', {day:'2-digit', month:'short', year:'numeric'}),
    items: cart.map(c => ({name:c.name, size:c.size, qty:c.qty, price:c.price})),
    total: cartTotal(),
  };

  await saveOrder(order);
  cart = [];
  await saveCart();
  renderCart();
  showConfirmation(order);
}

async function saveOrder(order){
  if(currentUser){
    const key = 'orders:' + currentUser.email.toLowerCase();
    const existing = (await stGet(key, true)) || [];
    existing.unshift(order);
    await stSet(key, existing, true);
  }else{
    const existing = (await stGet('guestOrders', false)) || [];
    existing.unshift(order);
    await stSet('guestOrders', existing, false);
  }
}

function showConfirmation(order){
  document.getElementById('drawerTitle').textContent = 'Pedido confirmado';
  document.getElementById('drawerBody').innerHTML = `
    <div class="confirm">
      <div class="check">✓</div>
      <h3 style="font-family:'Fraunces',serif;font-size:1.2rem;">¡Gracias por tu compra!</h3>
      <p style="color:var(--dim);margin-top:8px;font-size:0.88rem;">Pedido <strong style="color:var(--mint);">${order.id}</strong><br>Total: $${order.total.toFixed(2)}</p>
      ${!currentUser ? `<p style="color:var(--dim);font-size:0.8rem;margin-top:14px;">Crea una cuenta en el Secret Club para ver este pedido en tu historial la próxima vez.</p>` : ''}
    </div>
  `;
  document.getElementById('drawerFoot').innerHTML = `<button class="btn btn-ghost btn-full" onclick="closeCart()">Seguir explorando</button>`;
  if(currentUser) renderOrders();
}

/* ---------------------------------------------------------
   AUTENTICACIÓN — Secret Club
--------------------------------------------------------- */
function setAuthTab(which){
  document.getElementById('toggleLogin').classList.toggle('active', which==='login');
  document.getElementById('toggleRegister').classList.toggle('active', which==='register');
  document.getElementById('loginPanel').classList.toggle('active', which==='login');
  document.getElementById('registerPanel').classList.toggle('active', which==='register');
}

async function handleLogin(e){
  e.preventDefault();
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const user = await stGet('users:' + email, true);
  if(!user){ errEl.textContent = 'No encontramos una cuenta con este correo.'; return; }
  if(user.password !== password){ errEl.textContent = 'Contraseña incorrecta.'; return; }

  currentUser = {name:user.name, email:user.email};
  await stSet('session', currentUser, false);
  await enterClub();
  toast('Bienvenida de vuelta ✧');
}

async function handleRegister(e){
  e.preventDefault();
  const errEl = document.getElementById('registerError');
  errEl.textContent = '';
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const password2 = document.getElementById('regPassword2').value;

  if(!name || !email){ errEl.textContent = 'Completa tu nombre y correo.'; return; }
  if(!/^\S+@\S+\.\S+$/.test(email)){ errEl.textContent = 'Ingresa un correo válido.'; return; }
  if(password.length < 6){ errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }
  if(password !== password2){ errEl.textContent = 'Las contraseñas no coinciden.'; return; }

  const existing = await stGet('users:' + email, true);
  if(existing){ errEl.textContent = 'Ya existe una cuenta con este correo.'; return; }

  const user = {name, email, password};
  await stSet('users:' + email, user, true);
  currentUser = {name, email};
  await stSet('session', currentUser, false);
  await enterClub();
  toast('Cuenta creada — bienvenida ✧');
}

async function enterClub(){
  document.getElementById('clubLoggedOut').style.display = 'none';
  document.getElementById('clubLoggedIn').style.display = 'block';
  document.getElementById('memberName').textContent = currentUser.name;
  document.getElementById('storeNote').style.display = 'none';
  await renderOrders();
}

async function renderOrders(){
  if(!currentUser) return;
  const orders = (await stGet('orders:' + currentUser.email.toLowerCase(), true)) || [];
  const el = document.getElementById('ordersList');
  if(orders.length === 0){
    el.innerHTML = `<div class="empty-state" style="padding:30px 10px;">Aún no tienes pedidos. Visita la tienda ✧</div>`;
    return;
  }
  el.innerHTML = orders.map(o => `
    <div class="order-row facet">
      <div>
        <div>${o.items.map(i=>i.name).join(', ').slice(0,60)}${o.items.length>1?'…':''}</div>
        <div class="oid">${o.id} · ${o.date}</div>
      </div>
      <strong style="color:var(--mint);">$${o.total.toFixed(2)}</strong>
    </div>
  `).join('');
}

async function handleLogout(){
  currentUser = null;
  await stDelete('session', false);
  document.getElementById('clubLoggedIn').style.display = 'none';
  document.getElementById('clubLoggedOut').style.display = 'block';
  document.getElementById('storeNote').style.display = 'flex';
  document.getElementById('loginPanel').reset();
  document.getElementById('registerPanel').reset();
  toast('Sesión cerrada');
}

/* ---------------------------------------------------------
   NAV / TABS
--------------------------------------------------------- */
function switchTab(tab){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + tab).classList.add('active');
  document.querySelectorAll('nav.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  window.scrollTo({top:0, behavior:'smooth'});
}

document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab(el.dataset.tab === 'inicio' ? 'inicio' : el.dataset.tab);
  });
});

/* ---------------------------------------------------------
   TOAST
--------------------------------------------------------- */
let toastTimer;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.remove('show'), 2200);
}

/* ---------------------------------------------------------
   EVENTOS
--------------------------------------------------------- */
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeDrawer').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);
document.getElementById('toggleLogin').addEventListener('click', ()=>setAuthTab('login'));
document.getElementById('toggleRegister').addEventListener('click', ()=>setAuthTab('register'));
document.getElementById('loginPanel').addEventListener('submit', handleLogin);
document.getElementById('registerPanel').addEventListener('submit', handleRegister);
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */
async function init(){
  renderTour();
  renderGrid('photoGrid', PHOTO_CAPS, false);
  renderGrid('videoGrid', VIDEO_CAPS, true);
  renderProducts();

  await loadCart();
  renderCart();

  const session = await stGet('session', false);
  if(session){
    currentUser = session;
    await enterClub();
  }
}
init();

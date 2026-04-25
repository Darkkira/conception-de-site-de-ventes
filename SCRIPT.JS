
const PRODUCTS = [
  { id: 1,  name: "Gateau a la fraise",      price: 1000, image: "img/1.jpeg"  },
  { id: 2,  name: "Triple gourmande au chocolat",      price: 1500, image: "img/2.jpeg"  },
  { id: 3,  name: "Churros au chocolat",    price: 1500, image: "img/3.jpeg"  },
  { id: 4,  name: "Dessert a la moutarde cafe",   price: 2000, image: "img/4.jpeg"  },
  { id: 5,  name: "Mille feuille",   price: 1500, image: "img/5.jpeg"  },
  { id: 6,  name: "Crepes au sirop et au miel ",   price: 1500, image: "img/6.jpeg"  },
  { id: 7,  name: "Macaron",   price: 5000, image: "img/14.jpg"  },
  { id: 8,  name: "Pancakes aux fruits rouge",   price: 1500, image: "img/9.jpeg"  },
  { id: 9,  name: "Glasse vanille chocolat",   price: 2000, image: "img/10.jpeg"  },
  { id: 10, name: "Glasse au chocolat",  price: 1500, image: "img/11.jpeg" },
  { id: 11, name: "Glasse caramiellise",  price: 2200, image: "img/8.jpeg" }
];


const FALLBACK_EMOJIS = [];

let cart = {};

function fmt(n) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  PRODUCTS.forEach((product, index) => {
    const isSelected = !!cart[product.id];

    const card = document.createElement('div');
    card.className = 'product-card' + (isSelected ? ' selected' : '');
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="check-badge">✓</div>
      <div class="product-img">
        <img
          src="${product.image}"
          alt="${product.name}"
          onerror="this.style.display='none'; this.parentElement.textContent='${FALLBACK_EMOJIS[index % FALLBACK_EMOJIS.length]}'"
        >
      </div>
      <div class="p-name">${product.name}</div>
      <div class="p-price">${fmt(product.price)}</div>
    `;

    card.addEventListener('click', () => toggleProduct(product.id));
    grid.appendChild(card);
  });
}

function toggleProduct(id) {
  if (cart[id]) {
    delete cart[id];
  } else {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    cart[id] = { product, qty: 1 };
  }
  renderProducts();
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;

  if (cart[id].qty <= 0) {
    delete cart[id];
    renderProducts(); 
  }
  renderCart();
}


function resetCart() {
  cart = {};
  renderProducts();
  renderCart();
}

function renderCart() {
  const listEl    = document.getElementById('cart-list');
  const calcEl    = document.getElementById('calc-section');
  const btnConfirm = document.getElementById('btn-confirm');
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    listEl.innerHTML = '<p class="cart-empty">Aucun produit sélectionné</p>';
    calcEl.classList.add('hidden');
    btnConfirm.disabled = true;
    return;
  }
  calcEl.classList.remove('hidden');
  btnConfirm.disabled = false;
  listEl.innerHTML = '';

  let total = 0;
  let totalArticles = 0;

  ids.forEach(id => {
    const { product: p, qty } = cart[id];
    const subtotal = p.price * qty;
    total += subtotal;
    totalArticles += qty;

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <span class="cart-item-name">${p.name}</span>
      <div class="qty-ctrl">
        <button class="qty-btn" data-id="${id}" data-delta="-1">−</button>
        <span class="qty-val">${qty}</span>
        <button class="qty-btn" data-id="${id}" data-delta="1">+</button>
      </div>
      <span class="item-subtotal">${fmt(subtotal)}</span>
    `;
    listEl.appendChild(item);
  });

  document.getElementById('calc-count').textContent =
    totalArticles + ' article' + (totalArticles > 1 ? 's' : '');
  document.getElementById('calc-sub').textContent  = fmt(total);
  document.getElementById('calc-total').textContent = fmt(total);
}

function openModal() {
  const total = Object.values(cart).reduce(
    (sum, { product: p, qty }) => sum + p.price * qty, 0
  );
  document.getElementById('modal-total').textContent = fmt(total);
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  resetCart();
}
document.addEventListener('DOMContentLoaded', () => {

  renderProducts();
  renderCart();
  document.getElementById('cart-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const id    = parseInt(btn.dataset.id, 10);
    const delta = parseInt(btn.dataset.delta, 10);
    changeQty(id, delta);
  });
  document.getElementById('btn-confirm').addEventListener('click', openModal);
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('btn-reset').addEventListener('click', resetCart);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('modal').classList.add('hidden');
    }
  });
});

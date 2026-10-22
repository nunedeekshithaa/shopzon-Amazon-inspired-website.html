// ===== 1. PRODUCTS DATA =====
const products = [
    {id:1, title:"Wireless Noise Cancelling Headphones Bluetooth 5.3", cat:"Electronics", rating:4.5, price:2999, orig:5999, disc:50, img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"},
    {id:2, title:"Men's Slim Fit Casual Shirt", cat:"Fashion", rating:4.2, price:799, orig:1999, disc:60, img:"https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400"},
    {id:3, title:"Smart Air Fryer 4.5L Digital", cat:"Home", rating:4.6, price:5499, orig:8999, disc:39, img:"https://images.unsplash.com/photo-1585515656627-1c5d25eacfa5?w=400"},
    {id:4, title:"The Psychology of Money Book", cat:"Books", rating:4.8, price:299, orig:399, disc:25, img:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"},
    {id:5, title:"Women's Running Shoes Lightweight", cat:"Sports", rating:4.3, price:1899, orig:3499, disc:45, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"},
    {id:6, title:"5G Smartphone 128GB", cat:"Electronics", rating:4.4, price:15999, orig:20999, disc:24, img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400"},
    {id:7, title:"Stainless Steel Kitchen Set 6 Pcs", cat:"Home", rating:4.1, price:1299, orig:2499, disc:48, img:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400"},
    {id:8, title:"Designer Saree with Blouse", cat:"Fashion", rating:4.0, price:2499, orig:5999, disc:58, img:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"},
    {id:9, title:"Yoga Mat Non-Slip 6mm", cat:"Sports", rating:4.6, price:699, orig:1299, disc:46, img:"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"},
    {id:10, title:"Bluetooth Smart Watch AMOLED", cat:"Electronics", rating:4.3, price:1999, orig:4999, disc:60, img:"https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400"},
    {id:11, title:"Atomic Habits Book", cat:"Books", rating:4.9, price:350, orig:550, disc:36, img:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400"},
    {id:12, title:"Ceramic Coffee Mug Set of 4", cat:"Home", rating:4.2, price:599, orig:999, disc:40, img:"https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400"},
    {id:13, title:"Men's Denim Jacket", cat:"Fashion", rating:4.4, price:1799, orig:3999, disc:55, img:"https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400"},
    {id:14, title:"Wireless Earbuds Pro", cat:"Electronics", rating:4.5, price:1299, orig:2999, disc:57, img:"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400"},
    {id:15, title:"Dumbbells Pair 10KG", cat:"Sports", rating:4.1, price:2199, orig:3599, disc:39, img:"https://images.unsplash.com/photo-1638536532686-d610adfc8ea7?w=400"},
    {id:16, title:"Recipe Book Cook with Confidence", cat:"Books", rating:4.3, price:420, orig:699, disc:40, img:"https://images.unsplash.com/photo-1589998059171-988d887df646?w=400"},
];

// ===== 2. GLOBAL VARIABLES =====
let cart = JSON.parse(localStorage.getItem('sz_cart') || '[]');
let currentCat = 'All';
let searchTerm = '';

// ===== 3. RENDER PRODUCTS =====
function renderProducts() {
    let list = [...products];

    // Filter by category
    if (currentCat!== 'All') {
        list = list.filter(p => p.cat === currentCat);
    }

    // Filter by search
    if (searchTerm) {
        list = list.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sorting
    let sort = document.getElementById('sortSelect').value;
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'discount') list.sort((a, b) => b.disc - a.disc);

    // Render HTML
    document.getElementById('productGrid').innerHTML = list.map(p => `
        <div class="pcard">
            <img src="${p.img}">
            <div class="title">${p.title}</div>
            <div class="rating">${'★'.repeat(Math.floor(p.rating))} ${p.rating}</div>
            <div class="price-row">
                <span class="curr">₹${p.price}</span>
                <span class="orig">₹${p.orig}</span>
                <span class="disc">${p.disc}% off</span>
            </div>
            <button class="add" onclick="addToCart(${p.id}, this)">Add to Cart</button>
        </div>
    `).join('');
}

// ===== 4. CART FUNCTIONS =====
function addToCart(id, btn) {
    let item = products.find(p => p.id === id);
    let ex = cart.find(c => c.id === id);

    if (ex) {
        ex.qty++;
    } else {
        cart.push({...item, qty: 1 });
    }

    localStorage.setItem('sz_cart', JSON.stringify(cart));
    updateCartUI();

    if (btn) {
        btn.textContent = 'Added ✓';
        btn.classList.add('added');
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.classList.remove('added');
        }, 1000);
    }
    openCart();
}

function updateCartUI() {
    document.getElementById('cartCount').innerText = cart.reduce((s, i) => s + i.qty, 0);

    let div = document.getElementById('cartItems');
    let totalEl = document.getElementById('cartTotal');

    if (cart.length === 0) {
        div.innerHTML = '<p style="padding:20px;text-align:center">Cart empty</p>';
        totalEl.innerText = '₹0';
        return;
    }

    let total = 0;
    div.innerHTML = cart.map(c => {
        total += c.price * c.qty;
        return `
        <div class="cart-item" style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #eee">
            <img src="${c.img}" style="width:60px;height:60px">
            <div style="flex:1">
                <div style="font-size:13px">${c.title.slice(0, 50)}</div>
                <div style="font-weight:700">₹${c.price}</div>
                <div style="display:flex;gap:8px;margin-top:6px">
                    <button onclick="changeQty(${c.id}, -1)">-</button>
                    <span>${c.qty}</span>
                    <button onclick="changeQty(${c.id}, 1)">+</button>
                    <button onclick="removeItem(${c.id})" style="margin-left:auto;color:red;background:none;border:0">Delete</button>
                </div>
            </div>
        </div>`;
    }).join('');

    totalEl.innerText = '₹' + total.toLocaleString('en-IN');
}

function changeQty(id, d) {
    let it = cart.find(c => c.id === id);
    if (!it) return;
    it.qty += d;
    if (it.qty <= 0) cart = cart.filter(c => c.id!== id);
    localStorage.setItem('sz_cart', JSON.stringify(cart));
    updateCartUI();
}

function removeItem(id) {
    cart = cart.filter(c => c.id!== id);
    localStorage.setItem('sz_cart', JSON.stringify(cart));
    updateCartUI();
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('show');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

// ===== 5. SLIDER =====
let slideIdx = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    slideIdx = (n + slides.length) % slides.length;
    slides[slideIdx].classList.add('active');
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === slideIdx));
}

const dotsDiv = document.getElementById('dots');
slides.forEach((_, i) => {
    let d = document.createElement('div');
    d.className = 'dot' + (i === 0? ' active' : '');
    d.onclick = () => showSlide(i);
    dotsDiv.appendChild(d);
});

document.getElementById('nextSlide').onclick = () => showSlide(slideIdx + 1);
document.getElementById('prevSlide').onclick = () => showSlide(slideIdx - 1);
setInterval(() => showSlide(slideIdx + 1), 4000);

// ===== 6. SEARCH, FILTER, EVENTS =====
document.getElementById('searchInput').addEventListener('input', e => {
    searchTerm = e.target.value;
    renderProducts();
});

document.getElementById('searchBtn').addEventListener('click', () => {
    searchTerm = document.getElementById('searchInput').value;
    renderProducts();
});

document.getElementById('sortSelect').addEventListener('change', renderProducts);

document.querySelectorAll('.fbtn').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.fbtn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        currentCat = b.dataset.cat;
        renderProducts();
    });
});

document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        currentCat = el.dataset.filter;
        renderProducts();
    });
});

document.getElementById('cartIcon').onclick = openCart;
document.getElementById('closeCart').onclick = closeCart;
document.getElementById('overlay').onclick = closeCart;
document.getElementById('backTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ===== 7. INITIAL LOAD =====
renderProducts();
updateCartUI();
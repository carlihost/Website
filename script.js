function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}

let allProducts = [];

function loadProducts() {
  fetch("https://api.mascarli.biz.id/api/products")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderProducts();
    });
}

function renderProducts() {
  const filterStock = document.getElementById("filterStock")?.value;
  const filterDiscount = document.getElementById("filterDiscount")?.value;
  const sortPrice = document.getElementById("sortPrice")?.value;
  const searchQuery = document.getElementById("searchInput")?.value.toLowerCase();

  let products = [...allProducts];

  if(filterStock === "available") products = products.filter(p => p.stock > 0);
  if(filterStock === "soldout") products = products.filter(p => p.stock <= 0);
  if(filterDiscount === "discount") products = products.filter(p => p.discount > 0);
  if(searchQuery) products = products.filter(p => p.name.toLowerCase().includes(searchQuery));

  if(sortPrice === "asc") products.sort((a,b)=>{
    const pa = a.discount>0 ? a.price - a.price*a.discount/100 : a.price;
    const pb = b.discount>0 ? b.price - b.price*b.discount/100 : b.price;
    return pa - pb;
  });
  if(sortPrice === "desc") products.sort((a,b)=>{
    const pa = a.discount>0 ? a.price - a.price*a.discount/100 : a.price;
    const pb = b.discount>0 ? b.price - b.price*b.discount/100 : b.price;
    return pb - pa;
  });

  const el = document.getElementById("products");
  if(!el) return;

  el.innerHTML = products.map(p => {
    const finalPrice = p.discount>0 ? p.price - (p.price*p.discount/100) : p.price;
    const waText = encodeURIComponent(`Halo Admin, saya ingin membeli:\nProduk: ${p.name}\nHarga: Rp ${finalPrice}`);
    const discountLabel = p.discount>0 ? `<div class="discount-label">-${p.discount}%</div>` : "";
    const soldoutLabel = p.stock<=0 ? `<div class="soldout-label">HABIS</div>` : "";

    return `
      <div class="card">
        ${discountLabel}
        ${soldoutLabel}
        <img src="https://api.mascarli.biz.id${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        ${p.discount>0 ? `<div class="old">Rp ${p.price}</div>` : ""}
        <div class="price">Rp ${finalPrice}</div>
        <small>Stok: ${p.stock}</small>
        <a href="https://wa.me/6283125648754?text=${waText}" target="_blank">
          <button ${p.stock<=0 ? "disabled" : ""}>${p.stock<=0 ? "HABIS" : "ORDER"}</button>
        </a>
      </div>
    `;
  }).join("");
}

document.getElementById("filterStock")?.addEventListener("change", renderProducts);
document.getElementById("filterDiscount")?.addEventListener("change", renderProducts);
document.getElementById("sortPrice")?.addEventListener("change", renderProducts);
document.getElementById("searchInput")?.addEventListener("input", renderProducts);

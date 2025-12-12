class Product {
  constructor(id, name, price, category, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.image = image;
    this.isFavorite = false;
    this.isInCart = false;
    this.quantity = 1;
  }
}

const products = [
  new Product(1, "Golden Watch", 400, "Watches", "../images/img7.jpg"),
  new Product(2, "Silver necklace", 150, "Necklace", "../images/img2.jpg"),
  new Product(3, "Golden Earrings", 200, "Earrings", "../images/img6.jpg"),
  new Product(4, "Black Watch", 350, "Watches", "../images/img8.jpg"),
  new Product(5, "Silver Set Rings", 580, "Rings", "../images/img4.jpg"),
  new Product(6, "Silver necklace", 150, "Necklace", "../images/img5.jpg"),
  new Product(7, "Black bracelet", 100, "Bracelet", "../images/img3.jpg"),
  new Product(8, "Black bracelet", 500, "Necklace", "../images/img1.jpg"),
  new Product(9, "Set Necklace", 300, "Bracelet", "../images/img9.jpg"),
];

function renderProducts(productList) {
  const productsRow = document.getElementById("products-row");
  productsRow.innerHTML = "";

  productList.forEach((product) => {
    const productCard = `
        <div class="Product">
          <img src="${product.image}" alt="${
      product.name
    }" width="100%" height="50%">
          <h2 class="Product-title">${product.name}</h2>
          <p class="p-Product">Price: $${product.price}</p>
          <p class="p-Product">Category: ${product.category}</p>
          <a href="javascript:void(0);" class="a-Product1 a-i">
            <i class="fa-solid fa-heart i-fav ${
              product.isFavorite ? "active" : ""
            }" onclick="toggleFavorite(${product.id})"></i>
          </a>
          <button 
            class="${product.isInCart ? "btn-Product2" : "btn-Product1"}"
            onclick="toggleCart(${product.id})">
            ${product.isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>

        </div>
      `;
    productsRow.insertAdjacentHTML("beforeend", productCard);
  });
}

function searchProducts() {
  const searchType = document.getElementById("searchType").value;
  const searchText = document.getElementById("searchBox").value.toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (searchType === "name") {
      return product.name.toLowerCase().includes(searchText);
    } else if (searchType === "category") {
      return product.category.toLowerCase().includes(searchText);
    }
    return false;
  });

  renderProducts(filteredProducts);
}

function toggleFavorite(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    product.isFavorite = !product.isFavorite;
    renderProducts(products);
  }
}

function toggleCart(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    product.isInCart = !product.isInCart;
    renderProducts(products);
  }
}

window.onload = () => {
  renderProducts(products);
};
//////////////////////////////////////////////////////////////////////

let loggedIn = false;

function register() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!firstName || !lastName || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users")) || {};
  users[email] = { password, firstName, lastName };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully!");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[email] && users[email].password === password) {
    localStorage.setItem("loggedInUser", JSON.stringify(users[email]));
    loggedIn = true;
    localStorage.setItem("loggedIn", loggedIn);
    window.location.href = "loggedin.html";
  } else {
    alert("Invalid email or password.");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedIn");
  loggedIn = false;
  // localStorage.clear();
  localStorage.removeItem("cart");
  localStorage.removeItem("favorites");
  window.location.href = "index.html";
}
/*-----------------------------------------------------------------------*/
let cartCount = 0;

function toggleCart(productId) {
  const isLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  //................testtt........

  console.log("Toggle Cart Clicked. Logged in:", isLoggedIn);

  if (!isLoggedIn) {
    //................testtt........
    console.log("Redirecting to login.html");
    redirectTo("login.html");
    return;
  }
  const product = products.find((p) => p.id === productId);
  //l array el ha store feh el products el selected
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (product.isInCart) {
    product.isInCart = false;
    product.quantity = 0;
    const index = cart.findIndex((p) => p.id === productId);
    if (index > -1) cart.splice(index, 1);
  } else {
    product.isInCart = true;
    product.quantity = 1;
    //l2eto hada5lo fl array
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: product.quantity,
    });
  }
  //save in local storage
  localStorage.setItem("cart", JSON.stringify(cart));
  saveCartAndFavorites();
  updateCartDropdown();
  updateCartCount();
  renderProducts(products);
}
function toggleFavorite(productId) {
  const isLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  console.log("Toggle Favorite Clicked. Logged in:", isLoggedIn);

  if (!isLoggedIn) {
    console.log("Redirecting to login.html");
    redirectTo("login.html");
    return;
  }
  const product = products.find((p) => p.id === productId);
  if (product.isFavorite) {
    removeFavorite(productId);
  } else {
    product.isFavorite = true;
    saveCartAndFavorites();
    const productCardHeart = document.querySelector(
      `.fa-heart[onclick="toggleFavorite(${productId})"]`
    );
    if (productCardHeart) {
      productCardHeart.classList.add("active");
    }
  }
  renderProducts(products);
  if (window.location.href.includes("cart.html")) {
    renderFavoriteItems();
  }
}
function toggleCartDropdown() {
  const cartDropdown =
    document.getElementById("cartDropdown").nextElementSibling;
  cartDropdown.classList.toggle("show");
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").textContent = cartCount;
}
function updateCartDropdown() {
  const cartItems = products.filter((product) => product.isInCart);
  const cartDropdownItems = document.getElementById("cartDropdownItems");
  cartDropdownItems.innerHTML = "";
  if (cartItems.length === 0) {
    cartDropdownItems.innerHTML =
      '<p style="text-align: center;">Your cart is empty.</p>';
  } else {
    cartItems.forEach((item) => {
      const cartItem = `
                <div class="cart-dropdown__item-content">
                    <div class="cart-item__details">
                        <h6 class="cart-item__name">${item.name}</h6>
                        <p class="cart-item__price">Price: $<span id="itemPrice${
                          item.id
                        }">${item.price * item.quantity}</span></p>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" onclick="decreaseQuantity(${
                          item.id
                        })">-</button>
                        <span id="itemQuantity${
                          item.id
                        }" class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" onclick="increaseQuantity(${
                          item.id
                        })">+</button>
                    </div>
                </div>`;
      cartDropdownItems.insertAdjacentHTML("beforeend", cartItem);
    });
  }
  updateCartCount();
}
function increaseQuantity(productId) {
  const product = products.find((p) => p.id === productId);
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  product.quantity++;
  const cartItem = cart.find((p) => p.id === productId);
  if (cartItem) {
    cartItem.quantity = product.quantity;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  const quantityEl = document.getElementById(`itemQuantity${productId}`);
  const priceEl = document.getElementById(`itemPrice${productId}`);
  if (quantityEl) quantityEl.textContent = product.quantity;
  if (priceEl)
    priceEl.textContent = (product.price * product.quantity).toFixed(2);
  updateCartDropdown();
  // Assuming renderCartItems is only called on 'cart.html' which calls updateTotalPrice inside
  if (window.location.href.includes("cart.html")) renderCartItems();
}
function decreaseQuantity(productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find((p) => p.id === productId);
  if (product && product.isInCart) {
    product.quantity--;
    if (product.quantity <= 0) {
      product.isInCart = false;
      const index = cart.findIndex((p) => p.id === productId);
      if (index > -1) {
        cart.splice(index, 1);
      }
      const productCardButton = document.querySelector(
        `button[onclick="toggleCart(${productId})"]`
      );
      if (productCardButton) {
        productCardButton.textContent = "Add to Cart";
        productCardButton.classList.remove("btn-Product2");
        productCardButton.classList.add("btn-Product1");
      }
      const cartItemCard = document.querySelector(
        `#cart-items .cart-item__card[data-product-id="${productId}"]`
      );
      if (cartItemCard) {
        cartItemCard.remove();
      }
    } else {
      const cartItem = cart.find((p) => p.id === productId);
      if (cartItem) {
        cartItem.quantity = product.quantity;
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    const quantityEl = document.getElementById(`itemQuantity${productId}`);
    const priceEl = document.getElementById(`itemPrice${productId}`);
    if (quantityEl) quantityEl.textContent = product.quantity;
    if (priceEl)
      priceEl.textContent = (product.price * product.quantity).toFixed(2);
    updateCartDropdown();
    // Assuming renderCartItems is only called on 'cart.html' which calls updateTotalPrice inside
    if (window.location.href.includes("cart.html")) {
      renderCartItems();
      updateTotalPrice();
    }
  }
}
function saveCartAndFavorites() {
  const cart = products.filter((product) => product.isInCart);
  const favorites = products.filter((product) => product.isFavorite);
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
function loadCartAndFavorites() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  products.forEach((product) => {
    const cartProduct = cart.find((p) => p.id === product.id);
    const favoriteProduct = favorites.find((p) => p.id === product.id);
    if (cartProduct) {
      product.isInCart = true;
      product.quantity = cartProduct.quantity;
    } else {
      product.isInCart = false;
      product.quantity = 0;
    }
    product.isFavorite = !!favoriteProduct;
  });
}
//-----------------------------------------------------------
function renderCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart-message">Your cart is empty.</p>';
    return;
  }
  const cartItemsHtml = cartItems
    .map(
      (item) => `
        <div class="cart-item__col" data-product-id="${item.id}">
            <div class="cart-item__card">
                <img src="${item.image}" class="cart-item__image" alt="${
        item.name
      }">
                <div class="cart-item__body">
                    <h5 class="cart-item__title">${item.name}</h5>
                    <p class="cart-item__text">Category: ${
                      item.category || "N/A"
                    }</p>
                    <p class="cart-item__text">Price: $<span id="itemPrice${
                      item.id
                    }">${(item.price * item.quantity).toFixed(2)}</span></p>
                    <div class="quantity-control-full">
                        <button class="quantity-btn decrease-btn" onclick="decreaseQuantity(${
                          item.id
                        })">-</button>
                        <span id="itemQuantity${
                          item.id
                        }" class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" onclick="increaseQuantity(${
                          item.id
                        })">+</button>
                        <button class="remove-item-btn" onclick="removeFromCart(${
                          item.id
                        })">Remove from Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
  cartItemsContainer.innerHTML = `
        <div class="cart-items__row">
            ${cartItemsHtml}
        </div>
    `;

  updateTotalPrice();
}
function renderFavoriteItems() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoriteItemsContainer = document.getElementById("favorite-items");
  favoriteItemsContainer.innerHTML = "";
  if (favorites.length === 0) {
    favoriteItemsContainer.innerHTML =
      '<p class="text-center">You have no favorite items.</p>';
    return;
  }
  const favoriteItemsHtml = favorites
    .map(
      (item) => `
        <div class="favorite-item__card" data-product-id="${item.id}">
            <img src="${item.image}" class="favorite-item__image" alt="${
        item.name
      }">
            <div class="favorite-item__body">
                <h5 class="favorite-item__title">${item.name}</h5>
                <p class="favorite-item__text">Category: ${
                  item.category || "N/A"
                }</p>
                <i class="fas fa-heart ${
                  item.isFavorite ? "active" : ""
                }" onclick="toggleFavorite(${item.id})"></i>
            </div>
        </div>
    `
    )
    .join("");
  favoriteItemsContainer.innerHTML = favoriteItemsHtml;
}

function updateTotalPrice() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
}

function removeFromCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    product.isInCart = false;
    product.quantity = 0;
    saveCartAndFavorites();
    updateCartDropdown();

    // Update main products page button if it exists
    const productCardButton = document.querySelector(
      `button[onclick="toggleCart(${productId})"]`
    );
    if (productCardButton) {
      productCardButton.textContent = "Add to Cart";
      productCardButton.classList.remove("remove-from-cart-btn");
      productCardButton.classList.add("add-to-cart-btn");
    }

    // Remove from cart page or dropdown immediately
    if (window.location.href.includes("cart.html")) {
      const cartItemCard = document.querySelector(
        `#cart-items .cart-item__col[data-product-id="${productId}"]`
      );
      if (cartItemCard) cartItemCard.remove();
      renderCartItems(); // Re-render to update total/empty message
    } else {
      // If on home page, update dropdown and re-render product list
      renderProducts(products);
    }
  }
}

function removeFavorite(productId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const product = products.find((p) => p.id === productId);

  if (product && product.isFavorite) {
    product.isFavorite = false;
    const index = favorites.findIndex((p) => p.id === productId);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    const productCardHeart = document.querySelector(
      `.fa-heart[onclick="toggleFavorite(${productId})"]`
    );
    if (productCardHeart) {
      productCardHeart.classList.remove("active");
    }
    // Remove from favorite page immediately
    const favoriteItemCard = document.querySelector(
      `#favorite-items .favorite-item__card[data-product-id="${productId}"]`
    );
    if (favoriteItemCard) {
      favoriteItemCard.remove();
    }
    // Re-render favorites list if on cart.html
    if (window.location.href.includes("cart.html")) {
      renderFavoriteItems();
    } else {
      renderProducts(products); // Re-render product list on home page
    }
  }
}

//-----------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  if (loggedInUser && isLoggedIn) {
    loggedIn = true;
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay)
      usernameDisplay.textContent = `Hello, ${loggedInUser.firstName}`;
  } else {
    loggedIn = false;
  }
  //................testtt........
  console.log("DOM fully loaded and parsed");
  loadCartAndFavorites();
  // Assuming renderProducts is defined elsewhere and needed for the main page
  // if (typeof renderProducts === 'function') renderProducts(products);
  updateCartDropdown();
  updateCartCount();
  if (window.location.href.includes("cart.html")) {
    renderFavoriteItems();
    renderCartItems(); // Make sure to render cart items on the cart page
  }

  const cartIconContainer = document.getElementById("cartDropdown");
  if (cartIconContainer) {
    cartIconContainer.addEventListener("click", toggleCartDropdown);
  }
});

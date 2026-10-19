
"use strict";

// ================================
// 1. Product data
// ================================

const products = [
    {
        id: 1,
        name: "Galaxy S22 Ultra",
        category: "Electronics",
        price: 729,
        oldPrice: 929,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        name: "Galaxy M13 4GB / 64GB",
        category: "Electronics",
        price: 149,
        oldPrice: 199,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        name: "Galaxy M33 6GB / 128GB",
        category: "Electronics",
        price: 299,
        oldPrice: 399,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        name: "Galaxy M53 8GB / 128GB",
        category: "Electronics",
        price: 349,
        oldPrice: 449,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        name: "Galaxy S22 Green",
        category: "Electronics",
        price: 599,
        oldPrice: 799,
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        name: "Smart Watch",
        category: "Electronics",
        price: 89,
        oldPrice: 129,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 7,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 59,
        oldPrice: 89,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 8,
        name: "Beauty Care Set",
        category: "Beauty",
        price: 25,
        oldPrice: 39,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 9,
        name: "Home Decor Plant",
        category: "Home",
        price: 19,
        oldPrice: 29,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 10,
        name: "Fashion Accessories",
        category: "Fashion",
        price: 15,
        oldPrice: 25,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80"
    }
];

// ================================
// 2. Get HTML elements
// ================================

const productGrid = document.getElementById("product-grid");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const emptyMessage = document.getElementById("empty-message");

const cartCount = document.getElementById("cart-count");
const cartDialog = document.getElementById("cart-dialog");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const categoryButtons = document.querySelectorAll(".category-card");
const navLinks = document.querySelectorAll(".nav-link");

const cartButton = document.getElementById("cart-btn");
const closeCartButton = document.getElementById("close-cart");
const checkoutButton = document.getElementById("checkout-btn");

// ================================
// 3. Shopping cart
// ================================

const cart = [];

// ================================
// 4. Display products
// ================================

function displayProducts(productsToDisplay) {
    productGrid.replaceChildren();

    emptyMessage.hidden = productsToDisplay.length !== 0;

    productsToDisplay.forEach(function (product) {
        const discount = Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100
        );

        const card = document.createElement("article");
        card.className = "product-card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "product-image-wrap";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        // Show a placeholder if an image cannot load.
        image.addEventListener("error", function () {
            image.alt = product.name + " image unavailable";
            image.style.display = "none";
            imageWrap.style.background = "#eaf6fb";
            imageWrap.textContent = "Image unavailable";
        }, { once: true });

        const badge = document.createElement("span");
        badge.className = "discount-badge";
        badge.textContent = discount + "% OFF";

        imageWrap.append(image, badge);

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const prices = document.createElement("div");
        prices.className = "product-price";

        const currentPrice = document.createElement("span");
        currentPrice.className = "current-price";
        currentPrice.textContent = "$" + product.price.toFixed(2);

        const oldPrice = document.createElement("span");
        oldPrice.className = "old-price";
        oldPrice.textContent = "$" + product.oldPrice.toFixed(2);

        prices.append(currentPrice, oldPrice);

        const saving = document.createElement("p");
        saving.className = "product-saving";
        saving.textContent = "Save $" +
            (product.oldPrice - product.price).toFixed(2);

        const addButton = document.createElement("button");
        addButton.className = "add-cart-btn";
        addButton.textContent = "Add to Cart";
        addButton.addEventListener("click", function () {
            addToCart(product.id);
        });

        card.append(imageWrap, name, prices, saving, addButton);
        productGrid.appendChild(card);
    });
}

// ================================
// 5. Search products
// ================================

function searchProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const matchingProducts = products.filter(function (product) {
        const matchesName = product.name.toLowerCase().includes(searchTerm);

        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        return matchesName && matchesCategory;
    });

    displayProducts(matchingProducts);
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchProducts();
});

searchInput.addEventListener("input", searchProducts);

// ================================
// 6. Filter by category
// ================================

let activeCategory = "All";

function selectCategory(category) {
    activeCategory = category;

    categoryButtons.forEach(function (button) {
        button.classList.toggle(
            "selected",
            button.dataset.category === category
        );
    });

    navLinks.forEach(function (link) {
        link.classList.toggle(
            "active",
            link.dataset.category === category
        );
    });

    searchProducts();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectCategory(button.dataset.category);
    });
});

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        selectCategory(link.dataset.category);
    });
});

// ================================
// 7. Add products to cart
// ================================

function addToCart(productId) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// ================================
// 8. Update cart display
// ================================

function updateCart() {
    const totalItems = cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);

    const totalPrice = cart.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    cartCount.textContent = totalItems;
    cartItems.replaceChildren();

    if (cart.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Your cart is empty.";
        cartItems.appendChild(message);
    }

    cart.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("p");
        name.textContent = item.name;

        const details = document.createElement("small");
        details.textContent =
            "$" + item.price.toFixed(2) + " × " + item.quantity;

        info.append(name, details);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label",
            "Remove " + item.name + " from cart"
        );

        removeButton.addEventListener("click", function () {
            removeFromCart(item.id);
        });

        row.append(info, removeButton);
        cartItems.appendChild(row);
    });

    cartTotal.textContent = "$" + totalPrice.toFixed(2);
}

// ================================
// 9. Remove products from cart
// ================================

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(function (item) {
        return item.id === productId;
    });

    if (itemIndex === -1) {
        return;
    }

    cart.splice(itemIndex, 1);
    updateCart();
}

// ================================
// 10. Open and close cart
// ================================

cartButton.addEventListener("click", function () {
    updateCart();
    cartDialog.showModal();
});

closeCartButton.addEventListener("click", function () {
    cartDialog.close();
});

cartDialog.addEventListener("click", function (event) {
    if (event.target === cartDialog) {
        cartDialog.close();
    }
});

checkoutButton.addEventListener("click", function () {
    alert("This is a demo store. Online checkout is not available yet.");
});

// ================================
// 11. Hero banner slider
// ================================

const slides = [
    {
        eyebrow: "Best Deal Online on Smart Watches",
        title: "SMART WEARABLE.",
        offer: "UP TO 80% OFF",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
        alt: "Featured smartwatch"
    },
    {
        eyebrow: "Discover the Latest Smartphones",
        title: "SMART PHONES.",
        offer: "GREAT DEALS ONLINE",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85",
        alt: "Featured smartphone"
    },
    {
        eyebrow: "Upgrade Your Everyday Style",
        title: "TECH ESSENTIALS.",
        offer: "SHOP THE LATEST",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
        alt: "Featured headphones"
    }
];

let currentSlide = 0;

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    const slide = slides[currentSlide];

    document.getElementById("hero-eyebrow").textContent = slide.eyebrow;
    document.getElementById("hero-title").textContent = slide.title;
    document.getElementById("hero-offer").textContent = slide.offer;

    const heroImage = document.getElementById("hero-product-image");
    heroImage.src = slide.image;
    heroImage.alt = slide.alt;

    document.querySelectorAll(".hero-dot").forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === currentSlide);
    });
}

document.getElementById("previous-slide").addEventListener("click", function () {
    showSlide(currentSlide - 1);
});

document.getElementById("next-slide").addEventListener("click", function () {
    showSlide(currentSlide + 1);
});

document.querySelectorAll(".hero-dot").forEach(function (dot) {
    dot.addEventListener("click", function () {
        showSlide(Number(dot.dataset.slide));
    });
});

// ================================
// 12. View all products
// ================================

document.getElementById("view-all-products").addEventListener("click", function () {
    activeCategory = "All";
    searchInput.value = "";

    categoryButtons.forEach(function (button) {
        button.classList.toggle(
            "selected",
            button.dataset.category === "All"
        );
    });

    navLinks.forEach(function (link) {
        link.classList.toggle(
            "active",
            link.dataset.category === "All"
        );
    });

    displayProducts(products);
});

// ================================
// 13. Sign-in demo
// ================================

document.getElementById("signin-btn").addEventListener("click", function () {
    alert("Welcome to MegaMart! Sign-in functionality is a demo only.");
});

// ================================
// 14. Initial setup
// ================================

document.getElementById("current-year").textContent =
    new Date().getFullYear();

displayProducts(products);
updateCart();
showSlide(0);

console.log("MegaMart website is ready!");

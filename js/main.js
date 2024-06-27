document.addEventListener("DOMContentLoaded", () => {
  let products = [];
  let displayedProducts = 10;
  const apiEndpoint = "https://fakestoreapi.com/products";
  const productListElement = document.getElementById('product-list');
  const loadMoreButton = document.getElementById('load-more');

  const categorySelect = document.getElementById('category');
  const sortSelect = document.getElementById('sort');
  const searchInput = document.getElementById('search');

  const priceRangeMin = document.getElementById('price-range-min');
  const priceRangeMax = document.getElementById('price-range-max');


  const fetchProducts = async () => {
    try {
      const response = await fetch(apiEndpoint);
      products = await response.json();
      displayProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const displayProducts = () => {
    productListElement.innerHTML = '';
    const filteredProducts = applyFilters();
    const sortedProducts = applySorting(filteredProducts);
    const visibleProducts = sortedProducts.slice(0, displayedProducts);

    visibleProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.price}</p>
            `;
      productListElement.appendChild(productCard);
    });
  };

  const applyFilters = () => {
    let filteredProducts = products;
    const selectedCategory = categorySelect.value;
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }
    const searchQuery = searchInput.value.toLowerCase();
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery)
      );
    }
    const minPrice = parseFloat(priceRangeMin.value) || 0;
    const maxPrice = parseFloat(priceRangeMax.value) || Infinity;
    filteredProducts = filteredProducts.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );

    return filteredProducts;
  };

  const applySorting = (products) => {
    const sortValue = sortSelect.value;
    if (sortValue === 'price-asc') {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      return products.sort((a, b) => b.price - a.price);
    }
    return products;
  };

  loadMoreButton.addEventListener('click', () => {
    displayedProducts += 10;
    displayProducts();
  });

  categorySelect.addEventListener('change', displayProducts);
  sortSelect.addEventListener('change', displayProducts);
  searchInput.addEventListener('input', displayProducts);
  priceRangeMin.addEventListener('input', displayProducts);
  priceRangeMax.addEventListener('input', displayProducts);

  fetchProducts();
});

// js/main.js
import { supabase } from './supabase-client.js';

const WHATSAPP_NUMBER = '1234567890'; // IMPORTANT: Client ka WhatsApp number (country code ke saath, bina + ke)

// --- General Functions ---
const initNavbar = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('toggle');
        });
    }
};

const createWatchCard = (watch) => {
    const price = (typeof watch.price === 'number') ? watch.price.toFixed(2) : 'N/A';
    const encodedTitle = encodeURIComponent(watch.name);
    const encodedText = encodeURIComponent(`I am interested to buy this watch: ${watch.name}`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${watch.image_url}" alt="${watch.name}">
            </div>
            <div class="product-info">
                <h3>${watch.name}</h3>
                <p class="description">${watch.description}</p>
                <div class="product-price">$${price}</div>
                <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp">Buy on WhatsApp</a>
            </div>
        </div>
    `;
};

// --- Homepage Logic ---
const initHomepage = async () => {
    const sliderContainer = document.getElementById('hero-slider');
    const featuredGrid = document.getElementById('featured-watches-grid');

    // Load Banners
    if (sliderContainer) {
        const { data: banners, error: bannerError } = await supabase
            .from('banners')
            .select('*')
            .order('created_at');
        
        if (bannerError) {
            console.error("Error fetching banners:", bannerError);
        } else {
            sliderContainer.innerHTML = banners.map((banner, index) => `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <img src="${banner.image_url}" alt="${banner.title || 'Banner'}">
                    <div class="slide-content">
                        ${banner.title ? `<h1>${banner.title}</h1>` : ''}
                        ${banner.subtitle ? `<p>${banner.subtitle}</p>` : ''}
                    </div>
                </div>
            `).join('') + sliderContainer.innerHTML;
            
            // Slider functionality
            const slides = document.querySelectorAll('.slide');
            const nextBtn = document.getElementById('next-slide');
            const prevBtn = document.getElementById('prev-slide');
            let currentSlide = 0;

            const showSlide = (index) => {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
            };

            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }
    }

    // Load Featured Watches
    if (featuredGrid) {
        const { data: featured, error: featuredError } = await supabase
            .from('watches')
            .select('*')
            .eq('is_featured', true)
            .limit(4);
            
        if (featuredError) {
            console.error("Error fetching featured watches:", featuredError);
            featuredGrid.innerHTML = `<p>Could not load featured watches.</p>`;
        } else {
            featuredGrid.innerHTML = featured.map(createWatchCard).join('');
        }
    }
};

// --- Collection Page Logic ---
const initCollectionPage = async () => {
    const watchesGrid = document.getElementById('all-watches-grid');
    const categoryFilter = document.getElementById('category-filter');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const resetBtn = document.getElementById('reset-filters');
    const paginationContainer = document.getElementById('pagination');
    const productCountEl = document.getElementById('product-count');

    let allWatches = [];
    let categories = new Set();
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;
    
    // Fetch all data once
    const { data, error } = await supabase.from('watches').select('*').order('created_at', { ascending: false });
    if(error) {
        console.error("Error fetching watches:", error);
        watchesGrid.innerHTML = `<p>Could not load watches.</p>`;
        return;
    }
    allWatches = data;
    allWatches.forEach(watch => categories.add(watch.category));

    // Populate category filter
    categoryFilter.innerHTML = `<li><label><input type="radio" name="category" value="all" checked> All</label></li>`;
    categories.forEach(cat => {
        categoryFilter.innerHTML += `<li><label><input type="radio" name="category" value="${cat}"> ${cat}</label></li>`;
    });

    // Main render function
    const renderWatches = () => {
        // Apply filters
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        const maxPrice = parseFloat(priceRange.value);

        let filteredWatches = allWatches.filter(watch => {
            const categoryMatch = selectedCategory === 'all' || watch.category === selectedCategory;
            const priceMatch = watch.price <= maxPrice;
            return categoryMatch && priceMatch;
        });

        // Apply pagination
        const totalPages = Math.ceil(filteredWatches.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedWatches = filteredWatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        // Render watches and update count
        watchesGrid.innerHTML = paginatedWatches.map(createWatchCard).join('') || `<p>No watches match your criteria.</p>`;
        productCountEl.textContent = `Showing ${paginatedWatches.length} of ${filteredWatches.length} products`;
        
        // Render pagination
        renderPagination(totalPages);
    };

    const renderPagination = (totalPages) => {
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) btn.classList.add('active');
            btn.addEventListener('click', () => {
                currentPage = i;
                renderWatches();
            });
            paginationContainer.appendChild(btn);
        }
    };
    
    // Event listeners
    categoryFilter.addEventListener('change', () => { currentPage = 1; renderWatches(); });
    priceRange.addEventListener('input', () => { priceValue.textContent = priceRange.value; });
    priceRange.addEventListener('change', () => { currentPage = 1; renderWatches(); });
    resetBtn.addEventListener('click', () => {
        document.querySelector('input[name="category"][value="all"]').checked = true;
        priceRange.value = 5000;
        priceValue.textContent = 5000;
        currentPage = 1;
        renderWatches();
    });

    // Initial render
    renderWatches();
};

// --- Page Router ---
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html')) {
        initHomepage();
    } else if (path.endsWith('collection.html')) {
        initCollectionPage();
    }
});

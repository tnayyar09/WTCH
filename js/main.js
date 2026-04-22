// js/main.js
import { supabase } from './supabase-client.js';

// --- IMPORTANT: REPLACE WITH CLIENT'S WHATSAPP NUMBER ---
const WHATSAPP_NUMBER = '1234567890'; // Country code ke saath, bina '+' ya spaces ke

// =================================================================
// --- UI/UX & GENERAL FUNCTIONS ---
// =================================================================

const initNavbar = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('toggle');
        });
    }
};

const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
};

const createWatchCard = (watch) => {
    // Safety check
    if (!watch) return ''; 

    const price = (typeof watch.price === 'number') ? watch.price.toFixed(2) : 'N/A';
    const encodedText = encodeURIComponent(`I am interested to buy this watch: ${watch.name} (Price: $${price})`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    // Debugging log to ensure data is correct
    console.log(`Creating card for: ${watch.name}, Image URL: ${watch.image_url}`);

    return `
        <div class="product-card fade-in">
            <div class="product-image">
                <img src="${watch.image_url}" alt="${watch.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${watch.name}</h3>
                <p class="description">${watch.description || 'A masterpiece of precision and style.'}</p>
                <div class="product-price">$${price}</div>
                <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp">Buy on WhatsApp</a>
            </div>
        </div>
    `;
};

// =================================================================
// --- HOMEPAGE LOGIC ---
// =================================================================

const initHomepage = async () => {
    const sliderContainer = document.getElementById('hero-slider');
    const featuredGrid = document.getElementById('featured-watches-grid');

    if (sliderContainer) {
        const { data: banners, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
        if (error) { console.error("Error fetching banners:", error); } 
        else if (banners && banners.length > 0) {
            sliderContainer.innerHTML = banners.map((banner, index) => `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <img src="${banner.image_url}" class="slide-image" alt="${banner.title || 'Banner'}">
                    <div class="slide-content">
                        <h1>${banner.title || ''}</h1>
                        <p>${banner.subtitle || ''}</p>
                        <a href="collection.html" class="btn">Explore Collection</a>
                    </div>
                </div>
            `).join('') + `
            <div class="slider-nav">
                <button class="slider-btn" id="prev-slide">‹</button>
                <button class="slider-btn" id="next-slide">›</button>
            </div>`;
            
            const slides = document.querySelectorAll('.slide');
            if (slides.length > 1) {
                const nextBtn = document.getElementById('next-slide');
                const prevBtn = document.getElementById('prev-slide');
                let currentSlide = 0;
                let slideInterval;

                const nextSlide = () => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                };

                const showSlide = (index) => {
                    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
                    clearInterval(slideInterval);
                    slideInterval = setInterval(nextSlide, 7000);
                };
                
                slideInterval = setInterval(nextSlide, 7000);
                nextBtn.addEventListener('click', nextSlide);
                prevBtn.addEventListener('click', () => {
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    showSlide(currentSlide);
                });
            }
        }
    }

    if (featuredGrid) {
        const { data, error } = await supabase.from('watches').select('*').eq('is_featured', true).limit(3).order('created_at', { ascending: false });
        if (error) { 
            console.error("Error fetching featured watches:", error);
            featuredGrid.innerHTML = `<p style="color:red;">Could not load featured watches.</p>`;
        }
        else {
            featuredGrid.innerHTML = data.map(createWatchCard).join('');
        }
    }
};

// =================================================================
// --- COLLECTION PAGE LOGIC ---
// =================================================================

const initCollectionPage = async () => {
    const watchesGrid = document.getElementById('all-watches-grid');
    const categoryFilter = document.getElementById('category-filter');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const resetBtn = document.getElementById('reset-filters');
    const paginationContainer = document.getElementById('pagination');
    const productCountEl = document.getElementById('product-count');

    if (!watchesGrid) return;

    let allWatches = [];
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;
    
    watchesGrid.innerHTML = `<p>Loading collection...</p>`;
    const { data, error } = await supabase.from('watches').select('*').order('created_at', { ascending: false });
    
    if(error) {
        console.error("Error fetching watches:", error);
        watchesGrid.innerHTML = `<p style="color:red;">Could not load watches. Please try again later.</p>`;
        return;
    }
    allWatches = data;

    const categories = [...new Set(allWatches.map(watch => watch.category))];
    categoryFilter.innerHTML = `<li><label><input type="radio" name="category" value="all" checked> All Categories</label></li>`;
    categories.forEach(cat => {
        categoryFilter.innerHTML += `<li><label><input type="radio" name="category" value="${cat}"> ${cat}</label></li>`;
    });

    const renderWatches = () => {
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        const maxPrice = parseFloat(priceRange.value);

        let filteredWatches = allWatches.filter(watch => {
            const categoryMatch = selectedCategory === 'all' || watch.category === selectedCategory;
            const priceMatch = watch.price <= maxPrice;
            return categoryMatch && priceMatch;
        });

        const totalPages = Math.ceil(filteredWatches.length / ITEMS_PER_PAGE);
        currentPage = Math.min(currentPage, totalPages) || 1;
        
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedWatches = filteredWatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        console.log("Rendering these watches:", paginatedWatches);

        watchesGrid.innerHTML = paginatedWatches.length > 0 ? paginatedWatches.map(createWatchCard).join('') : `<p>No watches match your criteria.</p>`;
        productCountEl.textContent = `Showing ${paginatedWatches.length} of ${filteredWatches.length} products`;
        
        renderPagination(totalPages);
    };

    const renderPagination = (totalPages) => {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) btn.classList.add('active');
            btn.addEventListener('click', () => {
                currentPage = i;
                renderWatches();
                document.querySelector('.collection-page').scrollIntoView({ behavior: 'smooth' });
            });
            paginationContainer.appendChild(btn);
        }
    };
    
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

    renderWatches();
};

// =================================================================
// --- PAGE ROUTER (Runs on every page load) ---
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html')) {
        initHomepage();
    } else if (path.endsWith('collection.html')) {
        initCollectionPage();
    }
    
    initScrollAnimations();
});

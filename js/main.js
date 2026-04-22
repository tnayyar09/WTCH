// js/main.js
import { supabase } from './supabase-client.js';

const WHATSAPP_NUMBER = '1234567890'; // IMPORTANT: Client's number (no + or spaces)

// --- UI/UX Enhancements ---
const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
};

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
    const encodedText = encodeURIComponent(`I am interested to buy this watch: ${watch.name} (Price: $${price})`);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

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

// --- Homepage Logic ---
const initHomepage = async () => {
    const sliderContainer = document.getElementById('hero-slider');
    const featuredGrid = document.getElementById('featured-watches-grid');

    if (sliderContainer) {
        const { data: banners, error } = await supabase.from('banners').select('*').order('created_at');
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
            const nextBtn = document.getElementById('next-slide');
            const prevBtn = document.getElementById('prev-slide');
            let currentSlide = 0;
            let slideInterval = setInterval(nextSlide, 7000); // Auto-slide

            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }

            function showSlide(index) {
                slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 7000);
            }

            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }
    }

    if (featuredGrid) {
        const { data, error } = await supabase.from('watches').select('*').eq('is_featured', true).limit(3);
        if (error) { console.error("Error fetching featured watches:", error); }
        else {
            featuredGrid.innerHTML = data.map(createWatchCard).join('');
            initScrollAnimations();
        }
    }
};

// --- Collection Page Logic ---
const initCollectionPage = async () => {
    // ... [Collection page logic yahan waisa hi rahega jaisa pehle tha] ...
    // Note: Add 'fade-in' class to the product grid in collection.html for animations
};


// --- Page Router ---
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html')) {
        initHomepage();
    } else if (path.endsWith('collection.html')) {
        // initCollectionPage(); // Collection page ka logic yahan call karein
    }

    // Call scroll animations on all pages that might have .fade-in elements
    initScrollAnimations();
});

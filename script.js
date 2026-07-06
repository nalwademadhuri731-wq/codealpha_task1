// AURA Gallery - Core Script

// ==========================================================================
// Gallery Data
// ==========================================================================
const galleryData = [
    {
        id: 1,
        title: "Misty Peaks",
        category: "nature",
        description: "A spectacular view of the morning sun rising over snow-capped ridges, illuminating a deep pine valley shrouded in low fog.",
        imagePath: "assets/images/mountain.png",
        tags: ["dawn", "forest", "mountain", "nature"]
    },
    {
        id: 2,
        title: "Serene Reflection",
        category: "nature",
        description: "Quiet turquoise waters of an alpine lake, mirroring the warm colors of autumn leaves against towering peaks.",
        imagePath: "assets/images/lake.png",
        tags: ["lake", "reflection", "trees", "nature"]
    },
    {
        id: 3,
        title: "Neo Shinjuku",
        category: "architecture",
        description: "Neon glow reflecting on rain-slicked streets under towering skyscrapers of a cyberpunk metropolis.",
        imagePath: "assets/images/cyberpunk.png",
        tags: ["neon", "cityscape", "futuristic", "architecture"]
    },
    {
        id: 4,
        title: "Concrete Retreat",
        category: "architecture",
        description: "A minimalist modern concrete villa with glass walls, reflecting sunset hues in an infinity pool.",
        imagePath: "assets/images/minimal.png",
        tags: ["minimalist", "sunset", "villa", "architecture"]
    },
    {
        id: 5,
        title: "The Snow Sovereign",
        category: "animals",
        description: "A majestic snow leopard resting on a snowy ledge, scanning the mountain peaks with green-blue eyes.",
        imagePath: "assets/images/leopard.png",
        tags: ["leopard", "wildlife", "snow", "animals"]
    },
    {
        id: 6,
        title: "Deep Glow",
        category: "animals",
        description: "Bioluminescent jellyfish with trailing gold tentacles floating through the pitch-black abyss of the ocean.",
        imagePath: "assets/images/jellyfish.png",
        tags: ["jellyfish", "bioluminescence", "ocean", "animals"]
    }
];

// ==========================================================================
// State Variables
// ==========================================================================
let activeCategory = "all";
let searchQuery = "";
let filteredImages = [...galleryData];
let currentIndex = 0;

// ==========================================================================
// DOM Elements
// ==========================================================================
const galleryGrid = document.getElementById("gallery-grid");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const noResultsElement = document.getElementById("no-results");
const resetSearchBtn = document.getElementById("reset-search-btn");

// Lightbox Elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");
const lightboxCategory = document.getElementById("lightbox-category");
const lightboxTags = document.getElementById("lightbox-tags");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

// ==========================================================================
// Initialization & Render
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initGallery();
    setupEventListeners();
});

function initGallery() {
    // Generate all cards once in DOM
    galleryGrid.innerHTML = "";
    galleryData.forEach((item, index) => {
        const cardHTML = `
            <div class="gallery-item" data-id="${item.id}" data-index="${index}">
                <div class="card-img-wrapper">
                    <span class="card-category">${item.category}</span>
                    <img src="${item.imagePath}" alt="${item.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="overlay-content">
                            <h3 class="overlay-title">${item.title}</h3>
                            <div class="overlay-view-action">
                                <span>Inspect Visual</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description}</p>
                    <div class="card-tags">
                        ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        galleryGrid.insertAdjacentHTML("beforeend", cardHTML);
    });

    // Initial Filter & Search application
    filterAndSearch();
    updateBadgeCounts();
}

// ==========================================================================
// Filter and Search Logic
// ==========================================================================
function filterAndSearch() {
    searchQuery = searchInput.value.toLowerCase().trim();
    
    // Filter the dataset
    filteredImages = galleryData.filter(item => {
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                             item.category.toLowerCase().includes(searchQuery) ||
                             item.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
                             item.description.toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesSearch;
    });

    // Update visibility of cards in DOM
    const cardElements = galleryGrid.querySelectorAll(".gallery-item");
    cardElements.forEach(card => {
        const cardId = parseInt(card.getAttribute("data-id"));
        const matchesFilter = filteredImages.some(img => img.id === cardId);
        
        if (matchesFilter) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });

    // Handle No Results visibility
    if (filteredImages.length === 0) {
        noResultsElement.style.display = "flex";
        galleryGrid.style.display = "none";
    } else {
        noResultsElement.style.display = "none";
        galleryGrid.style.display = "grid";
    }
}

function updateBadgeCounts() {
    // Total count
    document.getElementById("count-all").textContent = galleryData.length;
    
    // Count per category
    const categories = ["nature", "architecture", "animals"];
    categories.forEach(cat => {
        const count = galleryData.filter(item => item.category === cat).length;
        document.getElementById(`count-${cat}`).textContent = count;
    });
}

// ==========================================================================
// Lightbox Implementation
// ==========================================================================
function openLightbox(galleryItemIndexInFiltered) {
    currentIndex = galleryItemIndexInFiltered;
    const currentItem = filteredImages[currentIndex];
    
    if (!currentItem) return;

    // Load content dynamically
    lightboxImg.src = currentItem.imagePath;
    lightboxImg.alt = currentItem.title;
    lightboxTitle.textContent = currentItem.title;
    lightboxDesc.textContent = currentItem.description;
    lightboxCategory.textContent = currentItem.category;
    
    // Add Tags
    lightboxTags.innerHTML = currentItem.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
    
    // Update Counter
    lightboxCounter.textContent = `${currentIndex + 1} of ${filteredImages.length}`;

    // Show Lightbox with transitions
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent scrolling
    
    // Focus the lightbox close button for accessibility
    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Re-enable scrolling
    
    // Reset image src after transition to avoid flicker on next open
    setTimeout(() => {
        lightboxImg.src = "";
    }, 400);
}

function navigateLightbox(direction) {
    if (filteredImages.length <= 1) return;

    // Add subtle scale out animation to image during load
    lightboxImg.style.transform = "scale(0.95)";
    lightboxImg.style.opacity = "0.5";

    setTimeout(() => {
        if (direction === "next") {
            currentIndex = (currentIndex + 1) % filteredImages.length;
        } else if (direction === "prev") {
            currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        }
        
        const currentItem = filteredImages[currentIndex];
        
        lightboxImg.src = currentItem.imagePath;
        lightboxImg.alt = currentItem.title;
        lightboxTitle.textContent = currentItem.title;
        lightboxDesc.textContent = currentItem.description;
        lightboxCategory.textContent = currentItem.category;
        lightboxTags.innerHTML = currentItem.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
        lightboxCounter.textContent = `${currentIndex + 1} of ${filteredImages.length}`;
        
        lightboxImg.style.transform = "scale(1)";
        lightboxImg.style.opacity = "1";
    }, 150);
}

// ==========================================================================
// Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
    // 1. Search bar event
    searchInput.addEventListener("input", () => {
        filterAndSearch();
    });

    // 2. Reset Search Button
    resetSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        filterAndSearch();
        searchInput.focus();
    });

    // 3. Category filtering buttons
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active class from all
            filterButtons.forEach(b => b.classList.remove("active"));
            
            // Add to clicked button
            const targetBtn = e.currentTarget;
            targetBtn.classList.add("active");
            
            activeCategory = targetBtn.getAttribute("data-filter");
            filterAndSearch();
        });
    });

    // 4. Click gallery item to open lightbox
    galleryGrid.addEventListener("click", (e) => {
        const item = e.target.closest(".gallery-item");
        if (item) {
            const cardId = parseInt(item.getAttribute("data-id"));
            // Find index of this item in the filtered items array
            const filteredIndex = filteredImages.findIndex(img => img.id === cardId);
            if (filteredIndex !== -1) {
                openLightbox(filteredIndex);
            }
        }
    });

    // 5. Lightbox Close
    lightboxClose.addEventListener("click", () => {
        closeLightbox();
    });

    // Close on backdrop click (outside container)
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-wrapper")) {
            closeLightbox();
        }
    });

    // 6. Lightbox Navigation
    lightboxPrev.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid backdrop click close trigger
        navigateLightbox("prev");
    });
    lightboxNext.addEventListener("click", (e) => {
        e.stopPropagation();
        navigateLightbox("next");
    });

    // 7. Keyboard Navigation (Accessibility)
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            navigateLightbox("prev");
        } else if (e.key === "ArrowRight") {
            navigateLightbox("next");
        }
    });
}

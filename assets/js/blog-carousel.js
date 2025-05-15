const blogPosts = [
  {
    id: 1,
    title: "Bing it on[HTC #57]",
    excerpt: "Bing it on👊[HTC #57].Read more at: https://raiso.substack.com/p/bing-it-onhtc-57",
    category: "Blog",
    image: "images/Bing.png",
    date: "February, 2023"
  },
  {
    id: 2,
    title: "Advanced CSS Animations",
    excerpt: "Creating responsive animations.",
    category: "Design",
    image: "images/Overview.png",
    date: "September, 2024"
  },
  {
    id: 3,
    title: "JavaScript Performance Tips",
    excerpt: "Information Systems.",
    category: "Data Analytics",
    image: "images/Minerva_flow.png",
    date: "March, 2025"
  },
];

// DOM Elements
const carouselContainer = document.getElementById('blogCarousel');
const categoryFilters = document.getElementById('categoryFilters');
const carouselDots = document.getElementById('carouselDots');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

// State variables
let activeIndex = 0;
let activeCategory = 'All';
let filteredPosts = [...blogPosts];
let autoPlayInterval;

// Extract unique categories
const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

// Initialize the carousel
function initCarousel() {
  renderCategoryButtons();
  filterPosts();
  renderPosts();
  renderDots();
  startAutoPlay();
  
  // Add event listeners
  prevButton.addEventListener('click', () => navigateToPost(getPrevIndex()));
  nextButton.addEventListener('click', () => navigateToPost(getNextIndex()));
}

// Render category filter buttons
function renderCategoryButtons() {
  categoryFilters.innerHTML = '';
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `category-button ${category === activeCategory ? 'active' : ''}`;
    button.textContent = category;
    button.addEventListener('click', () => {
      activeCategory = category;
      activeIndex = 0;
      updateCategoryButtons();
      filterPosts();
      renderPosts();
      renderDots();
    });
    categoryFilters.appendChild(button);
  });
}

// Update category buttons active state
function updateCategoryButtons() {
  const buttons = categoryFilters.querySelectorAll('.category-button');
  buttons.forEach(button => {
    button.classList.toggle('active', button.textContent === activeCategory);
  });
}

// Filter posts based on active category
function filterPosts() {
  filteredPosts = activeCategory === 'All' 
    ? [...blogPosts] 
    : blogPosts.filter(post => post.category === activeCategory);
}

// Render blog posts
function renderPosts() {
  carouselContainer.innerHTML = '';
  
  if (filteredPosts.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'No posts found in this category';
    carouselContainer.appendChild(emptyMessage);
    return;
  }
  
  filteredPosts.forEach((post, index) => {
    const postElement = document.createElement('div');
    postElement.className = `blog-post ${index === activeIndex ? 'active' : ''}`;
    
    postElement.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="blog-post-image">
      <div class="blog-post-content">
        <span class="blog-post-category">${post.category}</span>
        <h3 class="blog-post-title">${post.title}</h3>
        <p class="blog-post-excerpt">${post.excerpt}</p>
        <span class="blog-post-date">${post.date}</span>
      </div>
    `;
    
    carouselContainer.appendChild(postElement);
  });
}

// Render navigation dots
function renderDots() {
  carouselDots.innerHTML = '';
  
  filteredPosts.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${index === activeIndex ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to post ${index + 1}`);
    dot.addEventListener('click', () => navigateToPost(index));
    carouselDots.appendChild(dot);
  });
}

// Update active post
function updateActivePosts() {
  const posts = carouselContainer.querySelectorAll('.blog-post');
  posts.forEach((post, index) => {
    post.classList.toggle('active', index === activeIndex);
  });
  
  const dots = carouselDots.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeIndex);
  });
}

// Navigate to a specific post
function navigateToPost(index) {
  activeIndex = index;
  updateActivePosts();
  resetAutoPlay();
}

// Get next post index
function getNextIndex() {
  return activeIndex === filteredPosts.length - 1 ? 0 : activeIndex + 1;
}

// Get previous post index
function getPrevIndex() {
  return activeIndex === 0 ? filteredPosts.length - 1 : activeIndex - 1;
}

// Start auto play
function startAutoPlay() {
  stopAutoPlay();
  if (filteredPosts.length > 1) {
    autoPlayInterval = setInterval(() => {
      navigateToPost(getNextIndex());
    }, 4000); // Change every 4 seconds
  }
}

// Stop auto play
function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
}

// Reset auto play
function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

// Initialize the carousel when the DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);
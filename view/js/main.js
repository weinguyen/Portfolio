document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear()

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on a link
  const navItems = document.querySelectorAll(".nav-links a")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (hamburger.classList.contains("active")) {
        hamburger.classList.remove("active")
        navLinks.classList.remove("active")
      }
    })
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth",
        })
      }
    })
  })

  // Load projects
  const projectsContainer = document.getElementById("projects-container")
  if (projectsContainer) {
    loadProjects()
  }

  // Load certificates
  const certificatesContainer = document.getElementById("certificates-container")
  if (certificatesContainer) {
    loadCertificates()
  }

  // Contact form submission
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactFormSubmit)
  }

  // Close modal when clicking outside or on close button
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("project-modal")
    const closeBtn = document.querySelector(".close-modal")
    
    if (e.target === modal || e.target === closeBtn) {
      closeProjectModal()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProjectModal()
    }
  })

})


// Load projects from API
async function loadProjects() {
  const projectsContainer = document.getElementById("projects-container")
  try {
    const projects = await ApiService.getProjects()

    if (projects.length === 0) {
      projectsContainer.innerHTML = '<p class="no-data">No projects found.</p>'
      return
    }

    let projectsHTML = ""
    projects.forEach((project) => {
      projectsHTML += `
                <div class="project-card" data-id="${project.id}">
                    <div class="project-img">
                        <img src="${project.image[0]}" alt="${project.title}">
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <div class="project-links">
                            <button class="view-details-btn">Xem chi tiết</button>
                        </div>
                    </div>
                </div>
            `
    })

    projectsContainer.innerHTML = projectsHTML

    // Add click event to project cards
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => {
        const projectId = card.getAttribute("data-id")
        openProjectModal(projectId)
      })
    })

    // Add click event to view details buttons
    document.querySelectorAll(".view-details-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        const projectId = btn.closest(".project-card").getAttribute("data-id")
        openProjectModal(projectId)
      })
    })
  } catch (error) {
    projectsContainer.innerHTML = '<p class="error">Failed to load projects. Please try again later.</p>'
  }
}

// Open project modal
async function openProjectModal(projectId) {
  try {
    const projects = await ApiService.getProjects()
    const project = projects.find(p => p.id == projectId)
    
    if (!project) return

    let modal = document.getElementById("project-modal")
    if (!modal) {
      modal = document.createElement("div")
      modal.id = "project-modal"
      modal.className = "modal"
      document.body.appendChild(modal)
    }

    // Create gallery HTML
    const galleryHTML = `
      <div class="gallery-container">
        <div class="gallery-main">
          <img src="${project.image[0]}" alt="${project.title}">
          <button class="gallery-nav prev"><i class="fas fa-chevron-left"></i></button>
          <button class="gallery-nav next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="gallery-thumbnails">
          ${project.image.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
              <img src="${img}" alt="${project.title} ${index + 1}">
            </div>
          `).join('')}
        </div>
      </div>
    `

    // Populate modal content
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-modal">&times;</span>
    
    <div class="modal-body">
      ${galleryHTML}
    <div class="modal-header">
      <h2>${project.title}</h2>
    </div>
      <div class="modal-description">
        ${project.description.split('\n').map(paragraph => 
          `<p>${paragraph}</p>`
        ).join('')}
      </div>
    </div>
  </div>
`

    // Initialize gallery after modal is shown
    modal.classList.add("show")
    document.body.classList.add("modal-open")
    initGallery(modal)

  } catch (error) {
    console.error("Error opening project modal:", error)
  }
}


// Close project modal
function closeProjectModal() {
  const modal = document.getElementById("project-modal")
  if (modal) {
    modal.classList.remove("show")
    setTimeout(() => {
      document.body.classList.remove("modal-open")
    }, 300)
  }
}


async function handleContactFormSubmit(e) {
  e.preventDefault()

  const formMessage = document.getElementById("form-message")
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    message: document.getElementById("message").value,
  }

  try {
     ApiService.submitGuestMessage(formData)
    formMessage.textContent = "Your message has been sent successfully!"
    formMessage.className = "form-message success"
    e.target.reset()
  } catch (error) {
    formMessage.textContent = "Failed to send message. Please try again later."
    formMessage.className = "form-message error"
  }

  // Hide message after 5 seconds
  setTimeout(() => {
    formMessage.style.display = "none"
  }, 5000)
}




// Slider functionality
function initCertificatesSlider() {
    const container = document.querySelector('.certificates-container');
    const prevBtn = document.querySelector('.slider-btn.prev-btn');
    const nextBtn = document.querySelector('.slider-btn.next-btn');
    
    if (!container || !prevBtn || !nextBtn) {
        console.log('Certificate slider elements not found');
        return;
    }
    
    let slideIndex = 0;
    const cardWidth = 350; // Chiều rộng card + gap
    
    function updateSlidePosition() {
        const cards = container.querySelectorAll('.certificate-card');
        if (cards.length === 0) return;
        
        const maxSlides = Math.max(0, cards.length - getVisibleCards());
        
        // Giới hạn slideIndex
        slideIndex = Math.max(0, Math.min(slideIndex, maxSlides));
        
        // Apply transform
        container.style.transform = `translateX(-${slideIndex * cardWidth}px)`;
        
        // Update button states
        prevBtn.disabled = slideIndex === 0;
        nextBtn.disabled = slideIndex >= maxSlides;
        
        // Update button opacity
        prevBtn.style.opacity = slideIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = slideIndex >= maxSlides ? '0.5' : '1';
    }
    
    function getVisibleCards() {
        return window.innerWidth > 768 ? 3 : 1;
    }
    
    // Event listeners
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Prev button clicked, current index:', slideIndex);
        if (slideIndex > 0) {
            slideIndex--;
            updateSlidePosition();
        }
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Next button clicked, current index:', slideIndex);
        const cards = container.querySelectorAll('.certificate-card');
        const maxSlides = Math.max(0, cards.length - getVisibleCards());
        if (slideIndex < maxSlides) {
            slideIndex++;
            updateSlidePosition();
        }
    });
    
    // Reset on window resize
    window.addEventListener('resize', () => {
        slideIndex = 0;
        updateSlidePosition();
    });
    
    // Initial setup
    updateSlidePosition();
    
    console.log('Certificate slider initialized');
}

function initCertificateModal() {
    const modal = document.querySelector('.certificate-modal');
    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.close-certificate-modal');
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Đóng modal khi click nút close
    closeBtn.addEventListener('click', closeModal);
    
    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Đóng modal khi nhấn ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    return {
        open: (imgSrc, title) => {
            modalImg.src = imgSrc;
            modalImg.alt = title;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };
}

// Cập nhật hàm loadCertificates
async function loadCertificates() {
    const certificatesContainer = document.getElementById("certificates-container");
    const modal = initCertificateModal();
    
    try {
        const certificates = await ApiService.getCertificates();
        
        if (certificates.length === 0) {
            certificatesContainer.innerHTML = '<p class="no-data">No certificates found.</p>';
            return;
        }
        
        let certificatesHTML = "";
        certificates.forEach((cert) => {
            certificatesHTML += `
                <div class="certificate-card">
                    <div class="certificate-img">
                        <img src="${cert.image}" alt="${cert.title}">
                        <div class="certificate-info">
                            <h3>${cert.title}</h3>
                        </div>
                    </div>
                </div>
            `;
        });
        
        certificatesContainer.innerHTML = certificatesHTML;
        
        // Add click event to all certificate cards
        const cards = certificatesContainer.querySelectorAll('.certificate-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('h3').textContent;
                modal.open(img.src, title);
            });
        });
        
        initCertificatesSlider();
        
    } catch (error) {
        certificatesContainer.innerHTML = '<p class="error">Failed to load certificates.</p>';
    }
}



function initGallery(modal) {
  const galleryMain = modal.querySelector('.gallery-main img')
  const thumbnails = modal.querySelectorAll('.thumbnail')
  const prevBtn = modal.querySelector('.gallery-nav.prev')
  const nextBtn = modal.querySelector('.gallery-nav.next')
  let currentIndex = 0

  function updateGallery(index) {
    const images = Array.from(thumbnails).map(thumb => 
      thumb.querySelector('img').src
    )
    
    currentIndex = index
    galleryMain.src = images[currentIndex]
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'))
    thumbnails[currentIndex].classList.add('active')
    
    // Update navigation buttons
    prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex'
    nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'flex'
  }

  // Add click handlers for thumbnails
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.dataset.index)
      updateGallery(index)
    })
  })

  // Add click handlers for navigation buttons
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      updateGallery(currentIndex - 1)
    }
  })

  nextBtn.addEventListener('click', () => {
    if (currentIndex < thumbnails.length - 1) {
      updateGallery(currentIndex + 1)
    }
  })
}

// Add this to your main.js file or create a new skills.js file
document.addEventListener('DOMContentLoaded', function() {
    const skillNavButtons = document.querySelectorAll('.skill-nav-btn');
    
    skillNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const boxType = this.getAttribute('data-box');
            const isNext = this.classList.contains('next-btn');
            const container = document.getElementById(`${boxType}-skills`);
            const cardWidth = 170; // 150px card width + 20px gap
            const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time
            
            if (isNext) {
                container.style.transform = `translateX(-${scrollAmount}px)`;
            } else {
                const currentTransform = container.style.transform;
                const currentX = currentTransform ? parseInt(currentTransform.replace('translateX(', '').replace('px)', '')) : 0;
                const newX = Math.min(0, currentX + scrollAmount);
                container.style.transform = `translateX(${newX}px)`;
            }
        });
    });
});


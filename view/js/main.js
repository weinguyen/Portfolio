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
                        <img src="${project.image}" alt="${project.title}">
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <div class="project-links">
                            <button class="view-details-btn">View Details</button>
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

    // Create modal if it doesn't exist
    let modal = document.getElementById("project-modal")
    if (!modal) {
      modal = document.createElement("div")
      modal.id = "project-modal"
      modal.className = "modal"
      document.body.appendChild(modal)
    }

    // Create technologies HTML
    let technologiesHTML = ''
    if (project.technologies && project.technologies.length) {
      technologiesHTML = `
        <div class="modal-technologies">
          <h4>Technologies Used:</h4>
          <ul>
            ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
          </ul>
        </div>
      `
    }

    // Create demo link HTML
    let demoLinkHTML = ''
    if (project.demoLink) {
      demoLinkHTML = `
        <a href="${project.demoLink}" target="_blank" class="btn demo-link">
          <i class="fas fa-external-link-alt"></i> Live Demo
        </a>
      `
    }

    // Populate modal content
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-header">
          <h2>${project.title}</h2>
        </div>
        <div class="modal-body">
          <div class="modal-image">
            <img src="${project.image}" alt="${project.title}">
          </div>
          <div class="modal-description">
            <p>${project.longDescription || project.description}</p>
            ${technologiesHTML}
      </div>
    `

    // Show modal
    document.body.classList.add("modal-open")
    setTimeout(() => {
      modal.classList.add("show")
    }, 10)
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

async function loadCertificates() {
  const certificatesContainer = document.getElementById("certificates-container")
  try {
    const certificates = await ApiService.getCertificates()

    if (certificates.length === 0) {
      certificatesContainer.innerHTML = '<p class="no-data">No certificates found.</p>'
      return
    }

    let certificatesHTML = ""
    certificates.forEach((cert) => {
      certificatesHTML += `
                <div class="certificate-card">
                    <div class="certificate-img">
                        <img src="${cert.image}" alt="${cert.title}">
                    </div>
                    <div class="certificate-info">
                        <h3>${cert.title}</h3>
                    </div>
                </div>
            `
    })

    certificatesContainer.innerHTML = certificatesHTML
  } catch (error) {
    certificatesContainer.innerHTML = '<p class="error">Failed to load certificates. Please try again later.</p>'
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
    await ApiService.submitGuestMessage(formData)
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

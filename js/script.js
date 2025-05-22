document.addEventListener("DOMContentLoaded", () => {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`)

  // We listen to the resize event
  window.addEventListener("resize", () => {
    // We execute the same script as before
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  })

  // Fix video loading issues
  const videoElements = document.querySelectorAll("video")
  videoElements.forEach((video) => {
    // Add event listeners to handle loading states
    video.addEventListener("loadstart", function () {
      this.classList.add("loading")
    })

    video.addEventListener("canplay", function () {
      this.classList.remove("loading")
      this.classList.add("loaded")
    })

    video.addEventListener("error", function () {
      console.error("Error loading video:", this.querySelector("source").src)
      this.classList.add("error")

      // Create error message
      const errorMsg = document.createElement("div")
      errorMsg.className = "video-error-message"
      errorMsg.innerHTML = 'Không thể tải video. <button class="retry-btn">Thử lại</button>'
      this.parentNode.appendChild(errorMsg)

      // Add retry functionality
      errorMsg.querySelector(".retry-btn").addEventListener("click", function () {
        const videoEl = this.parentNode.parentNode.querySelector("video")
        const currentSrc = videoEl.querySelector("source").src
        videoEl.querySelector("source").src = currentSrc
        videoEl.load()
        this.parentNode.remove()
      })
    })

    // Add click-to-load functionality for mobile
    const videoContainer = video.parentNode
    const overlay = videoContainer.querySelector(".video-overlay")

    if (overlay) {
      overlay.addEventListener("click", () => {
        if (!video.classList.contains("loaded")) {
          video.load()
          video.play()
        }
      })
    }
  })

  // Lazy load videos when they come into view
  const lazyLoadVideos = () => {
    const videoContainers = document.querySelectorAll(".video-item")

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector("video")
          if (video && !video.classList.contains("loaded")) {
            // Set poster first for better UX
            if (video.hasAttribute("poster")) {
              const img = new Image()
              img.onload = () => {
                // Once poster is loaded, load video source
                video.load()
              }
              img.src = video.getAttribute("poster")
            } else {
              video.load()
            }
          }
          observer.unobserve(entry.target)
        }
      })
    }, options)

    videoContainers.forEach((container) => {
      observer.observe(container)
    })
  }

  // Initialize lazy loading
  lazyLoadVideos()
})

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger")
  const menu = document.querySelector(".menu")

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active")
    menu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  const menuLinks = document.querySelectorAll(".menu a")
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      menu.classList.remove("active")
    })
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Show corresponding tab pane
      const tabId = this.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Form submission
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const message = document.getElementById("message").value

      // Simple validation
      if (!name || !email || !message) {
        alert("Vui lòng điền đầy đủ thông tin!")
        return
      }

      // Here you would typically send the form data to a server
      // For now, we'll just show a success message
      alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.")

      // Reset form
      contactForm.reset()
    })
  }

  // Scroll animation for elements
  const scrollElements = document.querySelectorAll(
    ".timeline-item, .case-study-item, .design-item, .content-item, .project-item",
  )

  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top
    const elementHeight = el.getBoundingClientRect().height
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100)
  }

  const displayScrollElement = (element) => {
    element.classList.add("scrolled")
  }

  const hideScrollElement = (element) => {
    element.classList.remove("scrolled")
  }

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 90)) {
        displayScrollElement(el)
      } else {
        hideScrollElement(el)
      }
    })
  }

  const style = document.createElement("style")
  style.textContent = `
    .timeline-item, .case-study-item, .design-item, .content-item, .project-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .timeline-item.scrolled, .case-study-item.scrolled, .design-item.scrolled, .content-item.scrolled, .project-item.scrolled {
        opacity: 1;
        transform: translateY(0);
    }
  `
  document.head.appendChild(style)

  window.addEventListener("scroll", () => {
    handleScrollAnimation()
  })

  // Trigger once on load
  handleScrollAnimation()

  // CSP-compliant TikTok embed handling
  function loadTikTokEmbeds() {
    // Create a new script element for TikTok embed
    const script = document.createElement("script")
    script.src = "https://www.tiktok.com/embed.js"
    script.async = true
    script.defer = true

    document.body.appendChild(script)

    // Add a refresh button for TikTok videos
    const tiktokSection = document.getElementById("tiktok")
    if (tiktokSection) {
      const refreshButton = document.createElement("button")
      refreshButton.textContent = "Tải lại video"
      refreshButton.className = "btn"
      refreshButton.style.display = "block"
      refreshButton.style.margin = "0 auto 20px auto"

      refreshButton.addEventListener("click", () => {
        // Remove old script
        const oldScript = document.querySelector('script[src*="tiktok.com/embed.js"]')
        if (oldScript) {
          oldScript.remove()
        }

        // Create and add new script
        const newScript = document.createElement("script")
        newScript.src = "https://www.tiktok.com/embed.js"
        newScript.async = true
        newScript.defer = true
        document.body.appendChild(newScript)
      })

      // Insert button after the section title
      const sectionTitle = tiktokSection.querySelector(".section-title")
      if (sectionTitle) {
        sectionTitle.insertAdjacentElement("afterend", refreshButton)
      }
    }
  }

  // Load TikTok embeds
  // loadTikTokEmbeds()

  // Handle visibility changes
  // document.addEventListener("visibilitychange", () => {
  //   if (document.visibilityState === "visible") {
  //     // Reload TikTok embeds when tab becomes visible again
  //     const oldScript = document.querySelector('script[src*="tiktok.com/embed.js"]')
  //     if (oldScript) {
  //       oldScript.remove()
  //     }

  //     const newScript = document.createElement("script")
  //     newScript.src = "https://www.tiktok.com/embed.js"
  //     newScript.async = true
  //     newScript.defer = true
  //     document.body.appendChild(newScript)
  //   }
  // })
})

// Smooth scroll for certificates
document.addEventListener("DOMContentLoaded", () => {
  const certificatesSlider = document.querySelector(".certificates-slider")
  let isScrolling = false
  let startX
  let scrollLeft

  certificatesSlider.addEventListener("mousedown", (e) => {
    isScrolling = true
    startX = e.pageX - certificatesSlider.offsetLeft
    scrollLeft = certificatesSlider.scrollLeft
  })

  certificatesSlider.addEventListener("mouseleave", () => {
    isScrolling = false
  })

  certificatesSlider.addEventListener("mouseup", () => {
    isScrolling = false
  })

  certificatesSlider.addEventListener("mousemove", (e) => {
    if (!isScrolling) return
    e.preventDefault()
    const x = e.pageX - certificatesSlider.offsetLeft
    const walk = (x - startX) * 2
    certificatesSlider.scrollLeft = scrollLeft - walk
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const certificatesSlider = document.querySelector(".certificates-slider")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")
  const isScrolling = false
  let startX
  let scrollLeft

  // Existing mouse events...

  // Add scroll button functionality
  if (prevBtn && nextBtn) {
    const scrollAmount = 300 // Adjust scroll amount as needed

    prevBtn.addEventListener("click", () => {
      certificatesSlider.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    })

    nextBtn.addEventListener("click", () => {
      certificatesSlider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    })

    // Show/hide buttons based on scroll position
    const updateScrollButtons = () => {
      prevBtn.style.opacity = certificatesSlider.scrollLeft <= 0 ? "0.5" : "1"
      prevBtn.style.cursor = certificatesSlider.scrollLeft <= 0 ? "default" : "pointer"

      const maxScroll = certificatesSlider.scrollWidth - certificatesSlider.clientWidth
      nextBtn.style.opacity = certificatesSlider.scrollLeft >= maxScroll ? "0.5" : "1"
      nextBtn.style.cursor = certificatesSlider.scrollLeft >= maxScroll ? "default" : "pointer"
    }

    certificatesSlider.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)

    // Initial button state
    updateScrollButtons()
  }
})

// Video Modal Functionalit
function playVideo(thumbnailElement, videoUrl) {
  const wrapper = thumbnailElement.parentElement;
  const iframe = wrapper.querySelector('iframe');

  // Hiển thị iframe và set source
  iframe.style.display = 'block';
  iframe.src = videoUrl;

  // Ẩn thumbnail
  thumbnailElement.style.display = 'none';
}


function replaceWithIframe(thumbnailElement, videoUrl) {
  if (!videoUrl) return;

  const iframe = document.createElement('iframe');
  iframe.src = videoUrl;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = "0";
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay";

  // Replace thumbnail with iframe
  const wrapper = thumbnailElement.parentElement;
  wrapper.innerHTML = ''; // Clear thumbnail
  wrapper.appendChild(iframe);
}

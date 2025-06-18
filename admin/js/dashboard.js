document.addEventListener("DOMContentLoaded", async () => {
  try {

    // Fetch projects count
    const projects = await ApiService.getProjects()
    document.getElementById("projects-count").querySelector("p").textContent = projects.length

    // Fetch certificates count
    const certificates = await ApiService.getCertificates()
    document.getElementById("certificates-count").querySelector("p").textContent = certificates.length

    // Fetch messages count
    const messages = await ApiService.getGuestMessages()
    document.getElementById("messages-count").querySelector("p").textContent = messages.length
    const tiktoks = await ApiService.getVideos()
    document.getElementById("tiktok-count").querySelector("p").textContent = tiktoks.length
  } catch (error) {
    console.error("Error loading dashboard data:", error)
  }
})

document.addEventListener("DOMContentLoaded", async () => {
  const addProjectBtn = document.getElementById("add-project-btn")
  const cancelProjectBtn = document.getElementById("cancel-project-btn")
  const projectFormContainer = document.getElementById("project-form-container")
  const projectForm = document.getElementById("project-form")
  const projectImageInput = document.getElementById("project-image")
  const imagePreview = document.getElementById("image-preview")
  const projectsTableContainer = document.getElementById("projects-table-container")

  loadProjects()
  addProjectBtn.addEventListener("click", () => {
    projectFormContainer.style.display = "block"
    projectForm.reset()
    imagePreview.innerHTML = ""
  })

  cancelProjectBtn.addEventListener("click", () => {
    projectFormContainer.style.display = "none"
  })

  projectImageInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`
      }

    reader.readAsDataURL(file)
    }
  })
  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('key', '5fd16c9768b32d05ff318d4826ef0712');
      formData.append("image", projectImageInput.files[0]);

      const uploadResponse = await ApiService.uploadProjectImage(formData)
      const imageUrl = uploadResponse.data.url 
      console.log(imageUrl)
      const projectData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        image: imageUrl,
      }

      await ApiService.createProject(projectData) 
      projectForm.reset()
      projectFormContainer.style.display = "none"
      imagePreview.innerHTML = ""

      loadProjects()
    } catch (error) {
      alert("Failed to create project. Please try again.")
    }
  })

  async function loadProjects() {
    try {
      const projects = await ApiService.getProjects()

      if (projects.length === 0) {
        projectsTableContainer.innerHTML = "<p>No projects found.</p>"
        return
      }

      let tableHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `

      projects.forEach((project) => {
        tableHTML += `
                    <tr data-id="${project.id}">
                        <td><img src="${project.image}" alt="${project.title}"></td>
                        <td>${project.title}</td>
                        <td>${project.description.substring(0, 100)}${project.description.length > 100 ? "..." : ""}</td>
                        <td>
                            <button class="action-btn delete-btn" data-id="${project.id}">Delete</button>
                        </td>
                    </tr>
                `
      })

      tableHTML += `
                    </tbody>
                </table>
            `

      projectsTableContainer.innerHTML = tableHTML

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", handleDeleteProject)
      })
    } catch (error) {
      projectsTableContainer.innerHTML = '<p class="error">Failed to load projects. Please try again later.</p>'
    }
  }

  // Handle delete project
  async function handleDeleteProject(e) {
    if (confirm("Are you sure you want to delete this project?")) {
      const projectId = e.target.getAttribute("data-id")

      try {
        await ApiService.deleteProject(projectId)
        loadProjects()
      } catch (error) {
        alert("Failed to delete project. Please try again.")
      }
    }
  }
})

// ApiService needs to be defined or imported.  Assuming it's a global or imported.
// Example:
// import ApiService from './api-service';  OR
// const ApiService = window.ApiService; // If it's exposed globally

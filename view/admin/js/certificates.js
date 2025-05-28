document.addEventListener("DOMContentLoaded", async () => {
  const addCertificateBtn = document.getElementById("add-certificate-btn")
  const cancelCertificateBtn = document.getElementById("cancel-certificate-btn")
  const certificateFormContainer = document.getElementById("certificate-form-container")
  const certificateForm = document.getElementById("certificate-form")
  const certificateImageInput = document.getElementById("certificate-image")
  const imagePreview = document.getElementById("cert-image-preview")
  const certificatesTableContainer = document.getElementById("certificates-table-container")
  loadCertificates()
  addCertificateBtn.addEventListener("click", () => {
    certificateFormContainer.style.display = "block"
    certificateForm.reset()
    imagePreview.innerHTML = ""
  })

  cancelCertificateBtn.addEventListener("click", () => {
    certificateFormContainer.style.display = "none"
  })

  // Image preview
  certificateImageInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`
      }

      reader.readAsDataURL(file)
    }
  })

  // Certificate form submission
  certificateForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('key', '5fd16c9768b32d05ff318d4826ef0712');
      formData.append("image", certificateImageInput.files[0]);

      const uploadResponse = await ApiService.uploadCertificateImage(formData)
      console.log(uploadResponse);
      const imageUrl = uploadResponse.data.url
      const certData = {
        title: document.getElementById("cert-title").value,
        image: imageUrl,
      }
      await ApiService.createCertificate(certData)
      certificateForm.reset()
      certificateFormContainer.style.display = "none"
      imagePreview.innerHTML = ""

      loadCertificates()
    } catch (error) {
      alert("Failed to create certificate. Please try again.")
    }
  })
  async function loadCertificates() {
    try {
      const certificates = await ApiService.getCertificates()

      if (certificates.length === 0) {
        certificatesTableContainer.innerHTML = "<p>No certificates found.</p>"
        return
      }

      let tableHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `

      certificates.forEach((cert) => {
        tableHTML += `
                    <tr data-id="${cert.id}">
                        <td><img src="${cert.image}" alt="${cert.title}"></td>
                        <td>${cert.title}</td>
                        <td>
                            <button class="action-btn delete-btn" data-id="${cert.id}">Delete</button>
                        </td>
                    </tr>
                `
      })

      tableHTML += `
                    </tbody>
                </table>
            `

      certificatesTableContainer.innerHTML = tableHTML

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", handleDeleteCertificate)
      })
    } catch (error) {
      certificatesTableContainer.innerHTML = '<p class="error">Failed to load certificates. Please try again later.</p>'
    }
  }

  // Handle delete certificate
  async function handleDeleteCertificate(e) {
      const certId = e.target.getAttribute("data-id")

      try {
        await ApiService.deleteCertificate(certId)
        loadCertificates()
      } catch (error) {
        alert("Failed to delete certificate. Please try again.")
      }
    
  }
})

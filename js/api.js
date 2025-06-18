// API Base URL - Change this to your actual API endpoint
const API_BASE_URL = "https://your-api-endpoint.com"

// API Service
const ApiService = {
  // Projects
  async getProjects() {
    try {
      const response = await fetch(`/project`)
      if (!response.ok) throw new Error("Failed to fetch projects")
      return await response.json()
    } catch (error) {
      console.error("Error fetching projects:", error)
      return []
    }
  },

  async createProject(projectData) {
    try {
      const response = await fetch(`/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectData),
      })
      if (!response.ok) throw new Error("Failed to create project")
      return await response.json()
    } catch (error) {
      console.error("Error creating project:", error)
      throw error
    }
  },

  async deleteProject(id) {
    try {
      const response = await fetch(`/project/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to delete project")
      return await response.json()
    } catch (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  },

  async uploadProjectImage(formData) {
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to upload image")
      return await response.json()
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  },


  async getCertificates() {
    try {
      const response = await fetch(`/cert`)
      if (!response.ok) throw new Error("Failed to fetch certificates")
      return await response.json()
    } catch (error) {
      console.error("Error fetching certificates:", error)
      return []
    }
  },

  async createCertificate(certData) {
    try {
      const response = await fetch(`/cert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(certData),
      })
      if (!response.ok) throw new Error("Failed to create certificate")
      return await response.json()
    } catch (error) {
      console.error("Error creating certificate:", error)
      throw error
    }
  },

  async deleteCertificate(id) {
    try {
      const response = await fetch(`/cert/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to delete certificate")
      return await response.json()
    } catch (error) {
      console.error("Error deleting certificate:", error)
      throw error
    }
  },

  async uploadCertificateImage(formData) {
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to upload image")
      return await response.json()
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  },

  // Guest Messages
  async submitGuestMessage(messageData) {
    try {
      const response = await fetch(`/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
      if (!response.ok) throw new Error("Failed to submit message")
      return await response.json()
    } catch (error) {
      console.error("Error submitting message:", error)
      throw error
    }
  },

  async getGuestMessages() {
    try {
      const response = await fetch(`/guest`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch messages")
      return await response.json()
    } catch (error) {
      console.error("Error fetching messages:", error)
      return []
    }
  },

  async deleteGuestMessage(id) {
    try {
      const response = await fetch(`/guest/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to delete message")
      return await response.json()
    } catch (error) {
      console.error("Error deleting message:", error)
      throw error
    }
  },

  // Authentication
  async login(credentials) {
    try {
      const response = await fetch(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
      if (!response.ok) throw new Error("Login failed")
      return await response.json()
    } catch (error) {
      console.error("Error during login:", error)
      throw error
    }
  },
 getVideos: async () => {
    const res = await fetch("/video");
    return await res.json();
  },

  uploadTikTok: async (link) => {
  
    const res = await fetch("/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    body: JSON.stringify({ link }), 
    });

    if (!res.ok) {
    
      throw new Error("Failed to upload video");
    }

    return await res.json();
  },
  async deleteVideo(videoId) {
    try {
      const response = await fetch(`/video/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }


}



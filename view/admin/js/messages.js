document.addEventListener("DOMContentLoaded", async () => {
  const messagesTableContainer = document.getElementById("messages-table-container")

  // Load messages
  loadMessages()

  // Load messages function
  async function loadMessages() {
    try {
      const messages = await ApiService.getGuestMessages()

      if (messages.length === 0) {
        messagesTableContainer.innerHTML = "<p>No messages found.</p>"
        return
      }

      let tableHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `

      messages.forEach((message) => {
        tableHTML += `
                    <tr data-id="${message.id}">
                        <td>${message.name}</td>
                        <td>${message.email}</td>
                        <td>${message.phone}</td>
                        <td>${message.message}</td>
                        <td>
                            <button class="action-btn delete-btn" data-id="${message.id}">Delete</button>
                        </td>
                    </tr>
                `
      })

      tableHTML += `
                    </tbody>
                </table>
            `

      messagesTableContainer.innerHTML = tableHTML

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", handleDeleteMessage)
      })
    } catch (error) {
      messagesTableContainer.innerHTML = '<p class="error">Failed to load messages. Please try again later.</p>'
    }
  }

  // Handle delete message
  async function handleDeleteMessage(e) {
      const messageId = e.target.getAttribute("data-id")

      try {
        await ApiService.deleteGuestMessage(messageId)
        loadMessages()
      } catch (error) {
        alert("Failed to delete message. Please try again.")
      }
  }
})

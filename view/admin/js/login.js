document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form")
  const loginMessage = document.getElementById("login-message")

  if (localStorage.getItem("token")) {
    window.location.href = "dashboard.html"
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const credentials = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    }

    try {
      const response = await ApiService.login(credentials)
      localStorage.setItem("token", response.access_token)
      window.location.href = "dashboard.html"
    } catch (error) {
      loginMessage.textContent = "Invalid username or password"
      loginMessage.className = "form-message error"
    }
  })
})


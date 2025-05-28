document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tiktok-form");
  const input = document.getElementById("tiktok-link");
  const list = document.getElementById("tiktok-list");

  async function loadVideos() {
    try {
      const videos = await ApiService.getVideos();
      list.innerHTML = "";

      if (!videos.length) {
        list.innerHTML = "<li>Chưa có video TikTok nào được thêm.</li>";
        return;
      }

      videos.forEach(video => {
        const li = document.createElement("li");
        li.className = "video-item"; // Thêm class để styling
        
        // Tạo container cho link và nút xóa
        const videoContent = document.createElement("div");
        videoContent.className = "video-content";
        
        // Hiển thị link video
        const linkText = document.createElement("span");
        linkText.textContent = video.link;
        videoContent.appendChild(linkText);
        
        // Tạo nút xóa
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; // Thêm icon thùng rác
        deleteBtn.title = "Xóa video này";
        
        // Xử lý sự kiện click nút xóa
        deleteBtn.addEventListener("click", async () => {
          if (confirm("Bạn có chắc muốn xóa video này không?")) {
            try {
              await ApiService.deleteVideo(video.id); // Thêm hàm deleteVideo vào ApiService
              loadVideos(); // Tải lại danh sách sau khi xóa
            } catch (error) {
              alert("Không thể xóa video.");
              console.error("Failed to delete video:", error);
            }
          }
        });

        videoContent.appendChild(deleteBtn);
        li.appendChild(videoContent);
        list.appendChild(li);
      });
    } catch (error) {
      console.error("Failed to load videos:", error);
      list.innerHTML = "<li>Lỗi khi tải danh sách video.</li>";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const link = input.value.trim();
    if (!link) return;
  
    try {
      await ApiService.uploadTikTok(link);
      input.value = "";
      loadVideos();
    } catch (error) {
      alert("Không thể thêm video.");
      console.error(error);
    }
  });

  loadVideos();
});
async function loadTikTokVideos() {
  try {
    const response = await fetch('/video');
    const videos = await response.json();
    const container = document.getElementById('tiktok-container');
    const tiktokSection = document.getElementById('tiktok-videos');

    // Xóa nội dung cũ
    container.innerHTML = '';
    const existingArrows = tiktokSection.querySelectorAll('.scroll-arrow');
    existingArrows.forEach(arrow => arrow.remove());

    for (const video of videos) {
      const videoUrl = video.link || 'https://www.tiktok.com/ @username/video/7040821234567890';
      const videoId = extractVideoId(videoUrl);
      if (!videoId) continue;

      const wrapper = document.createElement('div');
      wrapper.className = 'tiktok-video-wrapper';

      // Video Embed
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'tiktok-embed tiktok-video';
      blockquote.setAttribute('cite', videoUrl);
      blockquote.setAttribute('data-video-id', videoId);
      blockquote.innerHTML = `<section>Loading...</section>`;

      // Stats Section
      // Stats Section
const statsDiv = document.createElement('div');
statsDiv.className = 'tiktok-stats';
statsDiv.innerHTML = `
  <div class="stat-item">
    <i class="fas fa-play"></i>
    <span>${video.play_count ?? 0} Lượt xem</span>
  </div>
  <div class="stat-item">
    <i class="fas fa-heart"></i>
    <span>${video.like_count ?? 0} Lượt thích</span>
  </div>
  <div class="stat-item">
    <i class="fas fa-comment"></i>
    <span>${video.comment_count ?? 0} Bình luận</span>
  </div>
  <div class="stat-item">
    <i class="fas fa-share"></i>
    <span>${video.share_count ?? 0} Lượt chia sẻ</span>
  </div>
  <div class="stat-item">
    <i class="fas fa-download"></i>
    <span>${video.download_count ?? 0} Lượt tải xuống</span>
  </div>
  <div class="stat-item">
    <i class="fas fa-bookmark"></i>
    <span>${video.collect_count ?? 0} Lượt sưu tập</span>
  </div>
`;

      wrapper.appendChild(blockquote);
      wrapper.appendChild(statsDiv);
      container.appendChild(wrapper);
    }

    


    if (window.TikTokEmbed && window.TikTokEmbed.load) {
      window.TikTokEmbed.load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js ';
      script.async = true;
      script.onload = () => {
        window.TikTokEmbed = { load: () => {} };
      };
      document.body.appendChild(script);
    }



    const scrollAmount = () => {
  const firstChild = container.querySelector('.tiktok-video-wrapper');
  if (!firstChild) return 320; // fallback
  const style = window.getComputedStyle(firstChild);
  const marginRight = parseInt(style.marginRight || '16'); // fallback nếu chưa có gap
  return firstChild.offsetWidth + marginRight;
};

const leftArrow = document.createElement('button');
leftArrow.className = 'scroll-arrow left';
leftArrow.innerHTML = '&#8249;'; // Dấu mũi tên trái

const rightArrow = document.createElement('button');
rightArrow.className = 'scroll-arrow right';
rightArrow.innerHTML = '&#8250;'; // Dấu mũi tên phải

leftArrow.addEventListener('click', () => {
  container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
});

rightArrow.addEventListener('click', () => {
  container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
});

tiktokSection.appendChild(leftArrow);
tiktokSection.appendChild(rightArrow);



  } catch (err) {
    console.error('Lỗi khi load video TikTok:', err);
  }
}

function extractVideoId(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

window.addEventListener('DOMContentLoaded', loadTikTokVideos);
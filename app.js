/**
 * Lottie Player 控制邏輯
 * 支援載入、播放控制、時間軸拖曳、倍速切換與背景切換
 */
document.addEventListener('DOMContentLoaded', () => {
  // DOM 元素選取
  const lottieContainer = document.getElementById('lottieContainer');
  const canvasContainer = document.getElementById('canvasContainer');
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  const btnPlayPause = document.getElementById('btnPlayPause');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const labelPlayPause = document.getElementById('labelPlayPause');
  const btnRestart = document.getElementById('btnRestart');
  const btnLoop = document.getElementById('btnLoop');
  const labelLoop = document.getElementById('labelLoop');
  
  const progressBar = document.getElementById('progressBar');
  const currentTimeText = document.getElementById('currentTimeText');
  const currentFrameText = document.getElementById('currentFrameText');
  const totalTimeText = document.getElementById('totalTimeText');
  
  const speedButtons = document.querySelectorAll('.btn-chip');
  const bgButtons = document.querySelectorAll('.bg-btn');
  
  const metaDimensions = document.getElementById('metaDimensions');
  const metaFrames = document.getElementById('metaFrames');
  const metaDuration = document.getElementById('metaDuration');

  // 狀態管理
  let isDragging = false;
  let wasPlayingBeforeDrag = false;
  let isLooping = true;
  let currentSpeed = 1.0;

  // 初始化 Lottie 動畫
  const anim = lottie.loadAnimation({
    container: lottieContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './leafglobe.json'
  });

  // 格式化時間為 mm:ss 或 ss.s
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');
    return `${paddedMins}:${paddedSecs}.${ms}`;
  }

  // 更新播放/暫停按鈕 UI
  function updatePlayPauseUI(isPlaying) {
    if (isPlaying) {
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
      labelPlayPause.textContent = '暫停';
      btnPlayPause.classList.remove('btn-secondary');
      btnPlayPause.classList.add('btn-primary');
    } else {
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
      labelPlayPause.textContent = '播放';
      btnPlayPause.classList.remove('btn-primary');
      btnPlayPause.classList.add('btn-secondary');
    }
  }

  // 動畫資料載入完成事件
  anim.addEventListener('DOMLoaded', () => {
    const totalFrames = Math.round(anim.totalFrames);
    const frameRate = anim.frameRate || 25;
    const duration = totalFrames / frameRate;

    // 更新資訊卡片
    if (anim.animationData) {
      metaDimensions.textContent = `${anim.animationData.w} × ${anim.animationData.h} px`;
    }
    metaFrames.textContent = `${totalFrames} 幀 @ ${frameRate} fps`;
    metaDuration.textContent = `${duration.toFixed(2)} 秒`;
    totalTimeText.textContent = formatTime(duration);

    // 設定進度條最大值
    progressBar.max = totalFrames;
    progressBar.value = 0;

    // 隱藏載入動畫遮罩
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
    }, 200);

    updatePlayPauseUI(true);
  });

  // 每一幀渲染事件監聽
  anim.addEventListener('enterFrame', (e) => {
    if (isDragging) return;

    const currentFrame = Math.floor(e.currentTime);
    const totalFrames = Math.round(anim.totalFrames);
    const frameRate = anim.frameRate || 25;
    const currentSec = currentFrame / frameRate;

    progressBar.value = currentFrame;
    currentFrameText.textContent = `Frame: ${currentFrame} / ${totalFrames}`;
    currentTimeText.textContent = formatTime(currentSec);
  });

  // 播放與暫停事件監聽
  anim.addEventListener('play', () => updatePlayPauseUI(true));
  anim.addEventListener('pause', () => updatePlayPauseUI(false));

  // 播放/暫停切換
  btnPlayPause.addEventListener('click', () => {
    if (anim.isPaused) {
      anim.play();
    } else {
      anim.pause();
    }
  });

  // 重播按鈕
  btnRestart.addEventListener('click', () => {
    anim.goToAndPlay(0, true);
  });

  // 循環切換按鈕
  btnLoop.addEventListener('click', () => {
    isLooping = !isLooping;
    anim.loop = isLooping;
    if (isLooping) {
      btnLoop.classList.add('active-toggle');
      labelLoop.textContent = '循環：開啟';
    } else {
      btnLoop.classList.remove('active-toggle');
      labelLoop.textContent = '循環：關閉';
    }
  });

  // 進度條拖曳控制
  progressBar.addEventListener('mousedown', () => {
    isDragging = true;
    wasPlayingBeforeDrag = !anim.isPaused;
    anim.pause();
  });

  progressBar.addEventListener('touchstart', () => {
    isDragging = true;
    wasPlayingBeforeDrag = !anim.isPaused;
    anim.pause();
  }, { passive: true });

  progressBar.addEventListener('input', (e) => {
    const targetFrame = parseFloat(e.target.value);
    anim.goToAndStop(targetFrame, true);

    const frameRate = anim.frameRate || 25;
    const currentSec = targetFrame / frameRate;
    const totalFrames = Math.round(anim.totalFrames);

    currentFrameText.textContent = `Frame: ${Math.round(targetFrame)} / ${totalFrames}`;
    currentTimeText.textContent = formatTime(currentSec);
  });

  const stopDragging = () => {
    if (!isDragging) return;
    isDragging = false;
    if (wasPlayingBeforeDrag) {
      anim.play();
    }
  };

  progressBar.addEventListener('mouseup', stopDragging);
  progressBar.addEventListener('touchend', stopDragging);

  // 播放速度切換
  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      speedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const speed = parseFloat(btn.getAttribute('data-speed'));
      currentSpeed = speed;
      anim.setSpeed(speed);
    });
  });

  // 畫布背景樣式切換
  bgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bgButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const bgMode = btn.getAttribute('data-bg');
      canvasContainer.className = `canvas-container bg-${bgMode}`;
    });
  });

  // 鍵盤快速鍵 (空白鍵播放/暫停)
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      if (anim.isPaused) {
        anim.play();
      } else {
        anim.pause();
      }
    }
  });
});

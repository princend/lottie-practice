# Lottie 動畫展示 (Leaf Globe)

這是一個精美的 Lottie 動畫展示網頁，已配置支援一鍵自動部署至 **GitHub Pages**。

## 🌟 功能特點

- 🎨 **現代化設計風格**：深色背景、毛玻璃質感卡片（Glassmorphism）、微互動光暈效果。
- ⏯️ **完整播放控制**：支援播放 / 暫停、重新播放、循環播放切換、空白鍵快速鍵。
- ⏱️ **時間軸與進度拖曳**：即時顯示目前幀數、總幀數、時長與精準拖曳預覽。
- ⚡ **倍速播放切換**：提供 0.5x、1.0x、1.5x、2.0x 四種播放速度切換。
- 🖼️ **畫布背景切換**：可自由切換深色漸層、淺色漸層、石板藍與透明棋盤格背景。
- 📊 **動畫資訊卡片**：即時解析並顯示解析度、總幀數、幀率、時長與檔案大小。
- 🚀 **GitHub Actions 自動化部署**：推送代碼至 `main` 分支後自動發布至 GitHub Pages。

---

## 🛠️ 本地預覽

您可以使用任何靜態網頁伺服器在本地進行預覽：

### 方法一：使用 Node.js (npx)
```bash
npx serve .
```

### 方法二：使用 Python
```bash
# Python 3
python3 -m http.server 8000
```
開啟瀏覽器前往 `http://localhost:8000` 即可預覽。

---

## 🚀 部署至 GitHub Pages 教學

### 方式 A：使用 GitHub Actions（推薦，已內建設定）

1. 將代碼提交並推送到 GitHub 倉庫的 `main` 分支：
   ```bash
   git add .
   git commit -m "feat: setup lottie showcase page and github pages deployment"
   git push origin main
   ```
2. 前往 GitHub 倉庫頁面：
   - 點擊 **Settings** (設定) &rarr; 左側選單 **Pages**。
   - 在 **Build and deployment** > **Source** 下拉選單中，選擇 **GitHub Actions**。
3. 推送代碼後，GitHub Actions 會自動執行部署。完成後即可在 `https://<您的帳號>.github.io/lottie-practice/` 瀏覽網站！

### 方式 B：使用分支直接發布 (Deploy from a branch)

1. 前往 GitHub 倉庫頁面中的 **Settings** &rarr; **Pages**。
2. 在 **Build and deployment** > **Source** 選擇 **Deploy from a branch**。
3. 分支選擇 **`main`**，目錄選擇 **`/(root)`**，點擊 **Save** 即可。

---

## 📁 檔案結構

```
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 自動部署設定
├── leafglobe.json           # Lottie 動畫原始 JSON 檔
├── index.html               # 播放器首頁結構
├── style.css                # 介面樣式與主題定義
├── app.js                   # Lottie 播放控制邏輯
└── README.md                # 專案說明文件
```

# 重訓日誌

手機優先的重訓紀錄網頁 App：記錄每組重量和次數、對照上次成績、自動辨識 PR，並用肌肉人形圖顯示恢復度、本週訓練量和肌肉等級。

純靜態網站（HTML + CSS + JavaScript），不需要安裝套件或建置。

## 檔案

| 檔案 | 內容 |
|---|---|
| `index.html` | 頁面入口 |
| `styles.css` | 所有樣式 |
| `app.js` | 程式邏輯（動作庫、紀錄、建議、圖表） |
| `body-data.js` | 肌肉人形圖的多邊形資料 |
| `manifest.webmanifest`、`icon*` | 加到主畫面用的名稱和圖示 |

## 本機預覽

```bash
python3 -m http.server 8000
```

然後打開 http://localhost:8000

## 部署到 Vercel

1. 在 Vercel 匯入這個 GitHub repo（Framework Preset 選 **Other**，其他設定不用改）。
2. 每次 push 到 `main`，Vercel 會自動重新部署。

## 資料存在哪裡

紀錄存在**每個人自己手機瀏覽器的 localStorage**，不會上傳到任何伺服器，所以分享網址給別人時，每個人看到的都是自己的紀錄。清除 Safari 的網站資料會讓紀錄消失。

## 授權聲明

肌肉人形圖資料來自 [react-body-highlighter](https://github.com/giavinh79/react-body-highlighter)（MIT License），詳見 `THIRD_PARTY_NOTICES.md`。

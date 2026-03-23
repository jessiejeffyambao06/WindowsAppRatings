const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "app", "index.html"));
}

app.whenReady().then(createWindow);

// SAVE TO PHP BACKEND
ipcMain.on("save-rating", async (event, data) => {
  console.log("RECEIVED DATA:", data);

  try {
    const response = await fetch(
      "http://localhost/WindowsAppRatings/backend/save_rating.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const result = await response.text();
    console.log("PHP RAW RESPONSE:", result);

    // Reply to app
    event.reply("saved");

    // Notify dashboard windows to update
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("update-dashboard");
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

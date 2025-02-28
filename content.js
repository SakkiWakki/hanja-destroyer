async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ["mode", "mode1Enabled", "fontSize", "fontColor"],
      (result) => {
        resolve({
          mode: result.mode || 3,
          mode1Enabled: result.mode1Enabled || false,
          fontSize: result.fontSize || 10,
          fontColor: result.fontColor || "#000000",
        });
      }
    );
  });
}

(async () => {
  const globalSettings = await loadSettings();
  console.log("[HANJA DESTROYER] Settings loaded:", globalSettings);

  if (globalSettings.mode === 4) {
    console.log("[HANJA DESTROYER] Extension is disabled.");
    return;
  }

  injectRuby();

  traverseAndProcess(document.body, globalSettings.mode);


  startObserver(globalSettings.mode);
})();

$(function () {
  const elements = {
    modeSelect: $("#modeSelect"),
    mode1Option: $("#mode1Option"),
    fontSizeSlider: $("#fontSizeSlider"),
    fontSizeValue: $("#fontSizeValue"),
    fontColorPicker: $("#fontColorPicker"),
    saveButton: $("#saveButton"),
    resetButton: $("#resetButton"),
    forceButton: $("#force"),
    example: $(".example"),
  };

  const defaultSettings = {
    mode: 3,
    mode1Enabled: false,
    fontSize: 10,
    fontColor: "#000000",
  };

  // Load settings and apply them
  getStoredSettings().then(applySettingsToUI);

  // Add event listeners dynamically
  [
    ["click", elements.saveButton, () => saveSettings(getCurrentSettings())],
    ["click", elements.resetButton, () => saveSettings(defaultSettings)],
    [
      "click",
      elements.forceButton,
      () => chrome.runtime.sendMessage({ action: "forceAnnotate" }),
    ],
    ["input change", elements.modeSelect, updateExample],
    ["input change", elements.fontSizeSlider, updateExample],
    ["input change", elements.fontColorPicker, updateExample],
  ].forEach(([event, el, handler]) => el.on(event, handler));

  function getStoredSettings() {
    return new Promise((resolve) =>
      chrome.storage.sync.get(Object.keys(defaultSettings), (result) =>
        resolve({ ...defaultSettings, ...result })
      )
    );
  }

  function saveSettings(settings) {
    chrome.storage.sync.set(settings, () => {
      applySettingsToUI(settings);
      window.close();
    });
  }

  function getCurrentSettings() {
    return Object.fromEntries(
      Object.entries({
        mode: elements.modeSelect.val(),
        mode1Enabled: elements.mode1Option.prop("checked"),
        fontSize: elements.fontSizeSlider.val(),
        fontColor: elements.fontColorPicker.val(),
      }).map(([key, val]) => [key, isNaN(val) ? val : parseInt(val)])
    );
  }

  function applySettingsToUI(settings) {
    Object.entries(settings).forEach(([key, value]) => {
      const el =
        elements[key + "Select"] ||
        elements[key + "Slider"] ||
        elements[key + "Picker"] ||
        elements[key + "Option"];
      if (el) el.is(":checkbox") ? el.prop("checked", value) : el.val(value);
    });
    elements.fontSizeValue.text(settings.fontSize);
    updateExample();
  }

  function updateExample() {
    const { mode, mode1Enabled, fontSize, fontColor } = getCurrentSettings();
    elements.example.html(
      {
        1: mode1Enabled ? "Parentheses Notation (Merged)" : "漢字美(한자미)",
        2: "한자미",
        3: `<ruby><rb>漢</rb><rp>(</rp><rt style="font-size:${fontSize}px;color:${fontColor}">한</rt><rp>)</rp></ruby>
            <ruby><rb>字</rb><rp>(</rp><rt style="font-size:${fontSize}px;color:${fontColor}">자</rt><rp>)</rp></ruby>
            <ruby><rb>美</rb><rp>(</rp><rt style="font-size:${fontSize}px;color:${fontColor}">미</rt><rp>)</rp></ruby>`,
        5: "Tooltip on Hover",
      }[mode] || ""
    );
  }
});

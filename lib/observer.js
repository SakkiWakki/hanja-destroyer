function startObserver(mode) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "SCRIPT") {
          traverseAndProcess(node, mode);
        } else if (
          node.nodeType === Node.TEXT_NODE &&
          hanjaRegex.test(node.data)
        ) {
          elementTextConvert(node, mode);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

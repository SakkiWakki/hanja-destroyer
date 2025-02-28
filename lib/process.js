const visitedElements = new WeakSet();

function elementTextConvert(element, mode) {

  if (visitedElements.has(element)) {
    return;
  }
  switch (mode) {
    case 1:
      convertWithParentheses(element);
      break;
    case 2:
      convertToHangul(element);
      break;
    case 3:
      convertWithRuby(element);
      break;
  }

  visitedElements.add(element);
}

function traverseAndProcess(target, mode) {
  const rejectSet = new Set([
    "SCRIPT",
    "FURIGANA",
    "STYLE",
    "NOSCRIPT",
  ]);

  const walker = document.createTreeWalker(target, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      // return rejectSet.has(node.tagName)
      return (!node.textContent.trim() ||
        rejectSet.has(node.tagName) || node.NodeType === Node.TEXT_NODE)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });

  let currentNode;
  while ((currentNode = walker.nextNode())) {
    elementTextConvert(currentNode, mode);
  }
}

function getHangul(hanja) {
  return hanjaToHangul[hanja] || hanja;
}

/**
 * Generic function to process Hanja in text using a callback
 */
function processTextWithCallback(text, callback) {
  return (
    [...text.matchAll(hanjaRegex)]
      .map((match, i, matches) => {
        const prevIndex =
          i === 0 ? 0 : matches[i - 1].index + matches[i - 1][0].length;
        return (
          text.slice(prevIndex, match.index) +
          callback(match[0], match.index, text)
        );
      })
      .join("") +
    text.slice(
      matches.length
        ? matches[matches.length - 1].index +
            matches[matches.length - 1][0].length
        : 0
    )
  );
}


/**
 * Converts Hanja to Hangul with parentheses notation
 */
function convertWithParentheses(text) {
  return processTextWithCallback(text, (hanja, index, originalText) => {
    const hangul = getHangul(hanja);
    const notation = `(${hangul})`;

    // Avoid double conversion
    if (
      originalText.slice(index + 1, index + 1 + notation.length) === notation
    ) {
      return hanja;
    }
    return `${hanja}${notation}`;
  });
}

/**
 * Converts Hanja to Hangul directly
 */
function convertToHangul(text) {
  return processTextWithCallback(text, (hanja) => getHangul(hanja));
}

/**
 * Creates a furigana span element
 */
function createFuriganaSpan(kanji, furigana) {
  const container = document.createElement("furigana");
  container.setAttribute("t", furigana);
  container.textContent = kanji;
  return container;
}

/**
 * Returns a formatted version of the textNode
 */
function hanja_destroyer(textNode) {
  const text = textNode.nodeValue;

  return text.replace(hanjaRegex, (kanjiGroup) => {
    const furigana = kanjiGroup.split("").map(getHangul).join("");
    return `<furigana t=\"${furigana}\">${kanjiGroup}</furigana>`;
  });
}

/**
 * Converts Hanja to Hangul using ruby annotations for a child text node
 */
function convertWithRuby(element) {
  Array.from(element.childNodes).map((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.match(hanjaRegex)) {

      const range = document.createRange();
      const fragment = range.createContextualFragment(
        `${hanja_destroyer(node)}`
      );
      const tempDiv = document.createElement("span");
      tempDiv.appendChild(fragment.cloneNode(true)); // Clone to avoid modifying the origin

      node.replaceWith(fragment);
    }
  });
}

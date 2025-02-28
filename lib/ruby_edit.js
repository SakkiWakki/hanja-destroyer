function injectRuby() {
  const style = document.createElement("style");
  style.textContent = `
    furigana:before {
      content: attr(t);
      display: block;
      font-size: 50%;
      text-align: center;
      line-height: 1.5;
    }

    furigana {
      display: inline-block;
      text-indent: 0px;
      line-height: normal;
      -webkit-text-emphasis: none;
      line-height: 1;
    }
  `;
  document.head.appendChild(style);
}

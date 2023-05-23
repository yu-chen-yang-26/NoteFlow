const handleLang = (curMode) => {
  if (!curMode) {
    const lang = localStorage.getItem('noteflow-lang');
    console.log(lang);
    if (!lang) {
      return 'zh';
    }
    return lang;
  }

  // setter
  console.log('new mode', curMode);
  localStorage.setItem('noteflow-lang', curMode);
};

export { handleLang };

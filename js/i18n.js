(function () {
  const config = window.ATG_CONFIG;

  function normalizeLocale(locale) {
    const available = Object.keys(window.ATG_CONTENT || {});
    return available.includes(locale) ? locale : config.defaultLocale;
  }

  function getLocaleFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang");
  }

  function getStoredLocale() {
    try {
      return window.localStorage.getItem("atg-locale");
    } catch (error) {
      return null;
    }
  }

  function storeLocale(locale) {
    try {
      window.localStorage.setItem("atg-locale", locale);
    } catch (error) {
      return;
    }
  }

  function applyMeta(locale) {
    const content = window.ATG_CONTENT[locale];
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale;
    document.documentElement.dataset.locale = locale;
    document.title = content.meta.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", content.meta.description);
    }
  }

  function init() {
    const locale = normalizeLocale(getLocaleFromUrl() || getStoredLocale() || config.defaultLocale);
    applyMeta(locale);
    return locale;
  }

  function setLocale(locale) {
    const nextLocale = normalizeLocale(locale);
    storeLocale(nextLocale);
    applyMeta(nextLocale);
    window.dispatchEvent(new CustomEvent("atg:locale-change", { detail: { locale: nextLocale } }));
    return nextLocale;
  }

  window.ATG_I18N = {
    init,
    setLocale,
    normalizeLocale
  };
})();

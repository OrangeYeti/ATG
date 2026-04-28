(function () {
  function boot(locale) {
    window.ATG_RENDER.renderPage(locale);
    window.ATG_MOTION.init();
    window.ATG_FORM.init();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const locale = window.ATG_I18N.init();
    boot(locale);
  });

  window.addEventListener("atg:locale-change", (event) => {
    boot(event.detail.locale);
  });
})();

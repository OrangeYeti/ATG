(function () {
  const config = window.ATG_CONFIG;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function iconArrow() {
    return '<svg class="btn__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h9m0 0-4-4m4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function iconDownload() {
    return '<svg class="btn__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v9m0 0 4-4m-4 4-4-4M4 15.5h12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function sectionHeader(data, titleId) {
    const section = data || {};
    return `
      <div class="section__header reveal">
        <div>
          <div class="section__eyebrow">${escapeHtml(section.eyebrow)}</div>
          <h2 class="section__title" ${titleId ? `id="${escapeHtml(titleId)}"` : ""}>${escapeHtml(section.title)}</h2>
        </div>
        ${section.desc ? `<p class="section__desc">${escapeHtml(section.desc)}</p>` : ""}
      </div>
    `;
  }

  function mediaPlaceholder(data, imageSrc, extraClass = "") {
    if (imageSrc) {
      return `
        <figure class="media-frame ${extraClass}">
          <img class="media-frame__image" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(data.caption)}" loading="lazy" />
        </figure>
      `;
    }

    return `
      <figure class="media-frame ${extraClass}">
        <div class="media-frame__placeholder">
          <span class="media-frame__label">${escapeHtml(data.label)}</span>
          <div class="media-lines" aria-hidden="true"><span></span><span></span><span></span></div>
          <figcaption class="media-frame__caption">${escapeHtml(data.caption)}</figcaption>
        </div>
      </figure>
    `;
  }

  function renderHeader(content, locale) {
    const header = document.getElementById("siteHeader");
    const langButtons = safeArray(config.locales)
      .map(
        (item) => `
          <button class="lang-switch__button ${item.code === locale ? "is-active" : ""}" type="button" data-locale="${escapeHtml(item.code)}" aria-pressed="${item.code === locale}">
            ${escapeHtml(item.label)}
          </button>
        `
      )
      .join("");

    header.innerHTML = `
      <div class="container header__inner">
        <a class="brand" href="#top" aria-label="${escapeHtml(content.brand.name)}">
          <img class="brand__logo" src="${escapeHtml(config.assets.logos.horizontal)}" alt="${escapeHtml(content.brand.name)}" width="196" height="84" decoding="async" />
        </a>

        <nav class="header__nav" aria-label="Primary">
          ${safeArray(content.nav)
            .map((item) => `<a class="nav__link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
            .join("")}
          <div class="nav__mobile-lang" aria-label="Mobile language switcher">${langButtons}</div>
        </nav>

        <button class="menu-button" type="button" aria-label="${escapeHtml(content.actions.menu)}" aria-expanded="false" aria-controls="siteHeader">
          <span class="menu-button__line" aria-hidden="true"></span>
        </button>

        <div class="header__actions">
          <div class="lang-switch" aria-label="Language switcher">${langButtons}</div>
        </div>
      </div>
    `;
  }

  function renderHero(content) {
    const hero = content.hero || {};
    const actions = content.actions || {};
    const doc = (((config.assets || {}).docs || {}).companyProfile || {});
    const titleMarkup = Array.isArray(hero.titleLines)
      ? hero.titleLines.map((line) => `<span class="hero__title-line">${escapeHtml(line)}</span>`).join("")
      : escapeHtml(hero.title);

    return `
      <section class="hero" id="top" aria-labelledby="hero-title">
        <div class="hero__visual" aria-hidden="true">
          <span class="hero__glow hero__glow--one"></span>
          <span class="hero__glow hero__glow--two"></span>
          <span class="hero__line-field"></span>
          <span class="hero__mark"></span>
        </div>
        <div class="hero__inner">
          <div class="hero__content reveal">
            <div class="hero__eyebrow">${escapeHtml(hero.eyebrow)}</div>
            <h1 class="hero__title" id="hero-title" aria-label="${escapeHtml(hero.title)}">${titleMarkup}</h1>
            <p class="hero__body">${escapeHtml(hero.body)}</p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="#contact">${escapeHtml(actions.inquiry)}${iconArrow()}</a>
              <a class="btn btn--secondary" href="${escapeHtml(doc.href)}" download="${escapeHtml(doc.fileName)}">${iconDownload()}${escapeHtml(actions.download)}</a>
            </div>
          </div>
          <div class="hero__meta reveal">
            <div class="chip-list">
              ${safeArray(hero.chips).map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("")}
            </div>
            <p class="hero__note">${escapeHtml(hero.note)}</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderAbout(content) {
    return `
      <section class="section about" id="about" aria-labelledby="about-title">
        <div class="container">
          ${sectionHeader({ eyebrow: content.about.eyebrow, title: content.about.title }, "about-title")}
          <div class="grid-12 about__layout">
            <div class="about__main reveal">
              <div class="stack">
                ${content.about.paragraphs.map((text) => `<p class="about__text">${escapeHtml(text)}</p>`).join("")}
              </div>
              <div class="about__timeline" aria-label="${escapeHtml(content.about.timelineTitle)}">
                <h3 class="about__block-title">${escapeHtml(content.about.timelineTitle)}</h3>
                <ol class="about__timeline-list">
                  ${content.about.timeline
                    .map(
                      (item) => `
                        <li class="about__timeline-item">
                          <span class="about__timeline-year">${escapeHtml(item.year)}</span>
                          <div>
                            <strong>${escapeHtml(item.title)}</strong>
                            <p>${escapeHtml(item.desc)}</p>
                          </div>
                        </li>
                      `
                    )
                    .join("")}
                </ol>
              </div>
              <div class="about__structure" aria-label="${escapeHtml(content.about.structureTitle)}">
                <h3 class="about__block-title">${escapeHtml(content.about.structureTitle)}</h3>
                <div class="about__structure-grid">
                  ${content.about.structure
                    .map(
                      (item) => `
                        <article class="about__structure-item">
                          <span>${escapeHtml(item.label)}</span>
                          <strong>${escapeHtml(item.title)}</strong>
                          <p>${escapeHtml(item.desc)}</p>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </div>
            </div>
            <aside class="about__aside reveal" aria-label="${escapeHtml(content.about.asideLabel)}">
              <article class="leader-card">
                <figure class="leader-card__photo">
                  <img src="${escapeHtml(config.assets.media.ceoProfile)}" alt="${escapeHtml(content.about.leader.photoAlt)}" loading="lazy" decoding="async" />
                </figure>
                <div class="leader-card__body">
                  <span class="leader-card__label">${escapeHtml(content.about.leader.label)}</span>
                  <h3 class="leader-card__name">${escapeHtml(content.about.leader.name)}</h3>
                  <p class="leader-card__role">${escapeHtml(content.about.leader.role)}</p>
                  <p class="leader-card__summary">${escapeHtml(content.about.leader.summary)}</p>
                  <ul class="leader-card__list">
                    ${content.about.leader.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                  </ul>
                </div>
              </article>
              <article class="about__subsidiary-note">
                <span>${escapeHtml(content.about.subsidiary.label)}</span>
                <strong>${escapeHtml(content.about.subsidiary.title)}</strong>
                <p>${escapeHtml(content.about.subsidiary.desc)}</p>
              </article>
            </aside>
          </div>
        </div>
      </section>
    `;
  }

  function renderServices(content) {
    const services = content.services || {};
    const items = safeArray(services.items);
    return `
      <section class="section section--soft services" id="services" aria-labelledby="services-title">
        <div class="container">
          ${sectionHeader(services, "services-title")}
          <div class="grid-12 services__grid">
            ${items
              .map(
                (item, index) => `
                  <article class="card service-card reveal">
                    <div>
                      <span class="service-card__number">${String(index + 1).padStart(2, "0")}</span>
                      <h3 class="service-card__title">${escapeHtml(item.title)}</h3>
                    </div>
                    <div class="stack">
                      <div class="service-card__line" aria-hidden="true"></div>
                      <p class="service-card__desc">${escapeHtml(item.desc)}</p>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderProcess(content) {
    return `
      <section class="section process" id="process" aria-labelledby="process-title">
        <div class="container">
          ${sectionHeader(content.process, "process-title")}
          <ol class="process__list">
            ${content.process.items
              .map(
                (item, index) => `
                  <li class="process-step reveal">
                    <span class="process-step__mark">${String(index + 1).padStart(2, "0")}</span>
                    <div class="stack">
                      <h3 class="process-step__title">${escapeHtml(item.title)}</h3>
                      <p class="process-step__desc">${escapeHtml(item.desc)}</p>
                    </div>
                  </li>
                `
              )
              .join("")}
          </ol>
        </div>
      </section>
    `;
  }

  function renderCases(content) {
    const cases = content.cases || {};
    const items = safeArray(cases.items);
    const caseImages = safeArray(((config.assets || {}).media || {}).cases);
    return `
      <section class="section cases" id="cases" aria-labelledby="cases-title">
        <div class="container">
          ${sectionHeader(cases, "cases-title")}
          <div class="grid-12">
            ${items
              .map((item, index) => {
                const image = caseImages[index];
                const facts = [item.role, item.result].filter(Boolean);
                return `
                  <article class="case-card reveal">
                    <div class="case-card__media">
                      ${
                        image
                          ? `<img class="media-frame__image" src="${escapeHtml(image)}" alt="${escapeHtml(item.title || item.category)}" loading="lazy" />`
                          : `<div class="case-card__placeholder">
                              <div class="case-card__geometry" aria-hidden="true"><span></span><span></span><span></span></div>
                            </div>`
                      }
                    </div>
                    <div class="case-card__body">
                      <span class="case-card__category">${escapeHtml(item.category)}</span>
                      ${item.metric ? `<p class="case-card__metric">${escapeHtml(item.metric)}</p>` : ""}
                      <h3 class="case-card__title">${escapeHtml(item.title)}</h3>
                      <p class="case-card__desc">${escapeHtml(item.desc)}</p>
                      ${
                        facts.length
                          ? `<ul class="case-card__facts">
                              ${facts.map((fact) => `<li class="case-card__fact">${escapeHtml(fact)}</li>`).join("")}
                            </ul>`
                          : ""
                      }
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderExecution(content) {
    const execution = content.execution || {};
    const steps = safeArray(execution.steps);
    const network = execution.network || {};
    const groups = safeArray(network.groups);
    const leader = execution.leader || {};
    const highlights = safeArray(leader.highlights);
    const ceoProfile = (((config.assets || {}).media || {}).ceoProfile || "");

    return `
      <section class="section execution" id="execution" aria-labelledby="execution-title">
        <div class="container">
          ${sectionHeader(execution, "execution-title")}
          <div class="execution__layout grid-12">
            <div class="execution__main reveal">
              <ol class="process__list execution__steps">
                ${steps
                  .map(
                    (step, index) => `
                      <li class="process-step execution-step">
                        <span class="process-step__mark">${String(index + 1).padStart(2, "0")}</span>
                        <div class="stack">
                          <h3 class="process-step__title">${escapeHtml(step.title)}</h3>
                          <p class="process-step__desc">${escapeHtml(step.desc)}</p>
                          ${step.deliverable ? `<p class="process-step__deliverable">${escapeHtml(step.deliverable)}</p>` : ""}
                        </div>
                      </li>
                    `
                  )
                  .join("")}
              </ol>

              <div class="execution__network">
                ${network.title ? `<h3 class="execution__block-title">${escapeHtml(network.title)}</h3>` : ""}
                <div class="network-groups execution__network-groups">
                  ${groups
                    .map(
                      (group) => `
                        <article class="network-group">
                          <h4 class="network-group__title">${escapeHtml(group.title)}</h4>
                          <p class="network-group__desc">${escapeHtml(group.desc)}</p>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </div>
            </div>

            <aside class="execution__aside reveal" aria-label="${escapeHtml(leader.label)}">
              <article class="leader-card leader-card--compact execution__leader">
                ${
                  ceoProfile
                    ? `<figure class="leader-card__photo">
                        <img src="${escapeHtml(ceoProfile)}" alt="${escapeHtml(leader.photoAlt || leader.name)}" loading="lazy" decoding="async" />
                      </figure>`
                    : ""
                }
                <div class="leader-card__body">
                  <span class="leader-card__label">${escapeHtml(leader.label)}</span>
                  <h3 class="leader-card__name">${escapeHtml(leader.name)}</h3>
                  <p class="leader-card__role">${escapeHtml(leader.role)}</p>
                  <p class="leader-card__summary">${escapeHtml(leader.summary)}</p>
                  ${
                    highlights.length
                      ? `<ul class="leader-card__list">
                          ${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                        </ul>`
                      : ""
                  }
                </div>
              </article>
            </aside>
          </div>
        </div>
      </section>
    `;
  }

  function renderNetwork(content) {
    return `
      <section class="section network" id="network" aria-labelledby="network-title">
        <div class="container">
          ${sectionHeader(content.network, "network-title")}
          <div class="grid-12 network__layout">
            <div class="network__content reveal">
              <div class="network-groups">
                ${content.network.groups
                  .map(
                    (group) => `
                      <article class="network-group">
                        <h3 class="network-group__title">${escapeHtml(group.title)}</h3>
                        <p class="network-group__desc">${escapeHtml(group.desc)}</p>
                      </article>
                    `
                  )
                  .join("")}
              </div>
              <p class="network__note">${escapeHtml(content.network.note)}</p>
            </div>
            <div class="network__media reveal">
              ${mediaPlaceholder(content.network.media, config.assets.media.network, "network__media")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderContact(content) {
    const email = config.form.recipientEmail;
    const contact = content.contact || {};
    const fields = contact.fields || {};
    const placeholders = contact.placeholders || {};
    const download = contact.download || {};
    const doc = (((config.assets || {}).docs || {}).companyProfile || {});
    return `
      <section class="section contact" id="contact" aria-labelledby="contact-title">
        <div class="container">
          <div class="grid-12 contact__layout">
            <div class="contact__intro reveal">
              <div>
                <div class="section__eyebrow">${escapeHtml(contact.eyebrow)}</div>
                <h2 class="section__title" id="contact-title">${escapeHtml(contact.title)}</h2>
              </div>
              <p class="section__desc">${escapeHtml(contact.lead)}</p>
              <div class="contact__email-box">
                <span class="contact__email-label">${escapeHtml(contact.emailLabel)}</span>
                <a class="contact__email" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
              </div>
              <article class="contact-download">
                <h3 class="contact-download__title">${escapeHtml(download.title)}</h3>
                <p class="contact-download__desc">${escapeHtml(download.desc)}</p>
                <a class="btn btn--secondary contact-download__button" href="${escapeHtml(doc.href)}" download="${escapeHtml(doc.fileName)}">${iconDownload()}${escapeHtml(download.button)}</a>
              </article>
            </div>
            <form class="contact-form reveal" id="contactForm" novalidate data-endpoint="${escapeHtml(config.form.endpoint)}">
              <div class="contact-form__grid">
                ${formField("company", fields.company, placeholders.company, "text", true)}
                ${formField("name", fields.name, placeholders.name, "text", true)}
                ${formField("email", fields.email, placeholders.email, "email", true)}
                ${formField("phone", fields.phone, placeholders.phone, "tel", false)}
                ${formSelectField("inquiryType", fields.inquiryType, placeholders.inquiryType, contact.inquiryTypes, true)}
                ${formField("message", fields.message, placeholders.message, "textarea", true, true)}
                ${formCheckboxField("privacy", fields.privacy, contact.privacy || {}, true)}
              </div>
              <input type="hidden" name="privacyConsentVersion" value="${escapeHtml((contact.privacy || {}).version)}" />
              <input type="hidden" name="privacyConsentedAt" value="" data-privacy-consented-at />
              <div class="visually-hidden" aria-hidden="true">
                <label for="website">${escapeHtml(fields.website)}</label>
                <input id="website" name="website" tabindex="-1" autocomplete="off" />
              </div>
              <p class="form-status" data-form-status>${escapeHtml((contact.status || {}).ready)}</p>
              <button class="btn btn--primary" type="submit">${escapeHtml(contact.submit)}${iconArrow()}</button>
            </form>
          </div>
        </div>
        ${renderPrivacyModal(content)}
      </section>
    `;
  }

  function formField(name, label, placeholder, type, required, wide = false) {
    const id = `field-${name}`;
    const control =
      type === "textarea"
        ? `<textarea id="${id}" name="${name}" placeholder="${escapeHtml(placeholder)}" ${required ? "required" : ""}></textarea>`
        : `<input id="${id}" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" ${required ? "required" : ""} />`;

    return `
      <div class="form-field ${wide ? "contact-form__wide" : ""}" data-field="${name}">
        <label for="${id}">${escapeHtml(label)}</label>
        ${control}
        <span class="field-error" data-error-for="${name}"></span>
      </div>
    `;
  }

  function formSelectField(name, label, placeholder, options, required, wide = false) {
    const id = `field-${name}`;
    return `
      <div class="form-field ${wide ? "contact-form__wide" : ""}" data-field="${name}">
        <label for="${id}">${escapeHtml(label)}</label>
        <select id="${id}" name="${name}" ${required ? "required" : ""}>
          <option value="" disabled selected>${escapeHtml(placeholder)}</option>
          ${safeArray(options).map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
        </select>
        <span class="field-error" data-error-for="${name}"></span>
      </div>
    `;
  }

  function formCheckboxField(name, label, privacy, required) {
    const id = `field-${name}`;
    return `
      <div class="form-field form-field--checkbox privacy-field contact-form__wide" data-field="${name}">
        <label class="privacy-field__label" for="${id}">
          <input id="${id}" name="${name}" type="checkbox" value="agreed" data-privacy-checkbox data-consent-confirmed="false" ${required ? "required" : ""} />
          <span>${escapeHtml(label)}</span>
        </label>
        <p class="privacy-field__text">
          ${escapeHtml(privacy.text)}
          <button type="button" class="privacy-field__trigger" data-privacy-open>${escapeHtml(privacy.triggerLabel)}</button>
        </p>
        <span class="field-error" data-error-for="${name}"></span>
      </div>
    `;
  }

  function renderPrivacyModal(content) {
    const privacy = ((content.contact || {}).privacy || {});
    const items = safeArray(privacy.items);
    const additionalItems = safeArray(privacy.additionalItems);

    return `
      <div class="privacy-modal" id="privacyConsentDialog" role="dialog" aria-modal="true" aria-labelledby="privacyConsentTitle" aria-describedby="privacyConsentDesc" hidden>
        <div class="privacy-modal__backdrop" data-privacy-close></div>
        <div class="privacy-modal__panel" role="document">
          <button type="button" class="privacy-modal__close" data-privacy-close aria-label="${escapeHtml(privacy.closeLabel)}">&times;</button>
          <div class="privacy-modal__eyebrow">AY TECH GLOBAL</div>
          <h3 class="privacy-modal__title" id="privacyConsentTitle">${escapeHtml(privacy.modalTitle)}</h3>
          <p class="privacy-modal__desc" id="privacyConsentDesc">${escapeHtml(privacy.modalIntro)}</p>

          <div class="privacy-modal__content">
            <section class="privacy-modal__section">
              <h4>${escapeHtml(privacy.controllerTitle)}</h4>
              <p>${escapeHtml(privacy.controllerText)}</p>
            </section>

            <section class="privacy-modal__section">
              <h4>${escapeHtml(privacy.tableTitle)}</h4>
              <dl class="privacy-modal__list">
                ${items
                  .map(
                    (item) => `
                      <div class="privacy-modal__item">
                        <dt>${escapeHtml(item.label)}</dt>
                        <dd>${escapeHtml(item.value)}</dd>
                      </div>
                    `
                  )
                  .join("")}
              </dl>
            </section>

            <section class="privacy-modal__section">
              <h4>${escapeHtml(privacy.additionalTitle)}</h4>
              <ul class="privacy-modal__bullets">
                ${additionalItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </section>
          </div>

          <div class="privacy-modal__actions">
            <button type="button" class="btn btn--outline" data-privacy-close>${escapeHtml(privacy.cancelButton)}</button>
            <button type="button" class="btn btn--primary" data-privacy-agree>${escapeHtml(privacy.agreeButton)}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFooter(content) {
    const footer = document.getElementById("siteFooter");
    footer.innerHTML = `
      <div class="container footer__inner">
        <div class="footer__brand">
          <div class="footer__brand-line">
            <img class="footer__logo" src="${escapeHtml(config.assets.logos.monoLight)}" alt="${escapeHtml(content.footer.name)}" loading="lazy" decoding="async" />
            <span class="footer__wordmark">AY Tech Global</span>
          </div>
          <div class="footer__legal">
            <span>${escapeHtml(content.footer.ceo)}</span>
            <span>${escapeHtml(content.footer.address)}</span>
            <span>${escapeHtml(content.footer.businessNumber)}</span>
            <span>${escapeHtml(content.footer.email)}</span>
          </div>
          <p class="footer__note">${escapeHtml(content.footer.note)}</p>
        </div>
        <div class="footer__aside">
          <a class="footer__email" href="mailto:${escapeHtml(config.form.recipientEmail)}">${escapeHtml(config.form.recipientEmail)}</a>
          <span>${escapeHtml(content.footer.copyright)}</span>
        </div>
      </div>
    `;
  }

  function renderPage(locale) {
    const content = window.ATG_CONTENT[locale] || window.ATG_CONTENT[config.defaultLocale];
    renderHeader(content, locale);

    document.getElementById("main").innerHTML = [
      renderHero(content),
      renderServices(content),
      renderCases(content),
      renderExecution(content),
      renderContact(content)
    ].join("");

    renderFooter(content);
  }

  window.ATG_RENDER = {
    renderPage
  };
})();

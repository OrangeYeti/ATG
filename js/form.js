(function () {
  const fieldNames = ["company", "name", "email", "phone", "inquiryType", "message", "privacy"];
  const privacyState = {
    form: null,
    modal: null,
    checkbox: null,
    consentedAt: null,
    previousFocus: null
  };

  function getContent() {
    const locale = document.documentElement.dataset.locale || window.ATG_CONFIG.defaultLocale;
    return window.ATG_CONTENT[locale] || window.ATG_CONTENT[window.ATG_CONFIG.defaultLocale];
  }

  function getLocale() {
    return document.documentElement.dataset.locale || window.ATG_CONFIG.defaultLocale;
  }

  function getValue(data, name) {
    return String(data.get(name) || "").trim();
  }

  function setStatus(form, text, type) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = text;
    status.classList.remove("is-success", "is-error");
    if (type) status.classList.add(`is-${type}`);
  }

  function setFieldError(form, name, message) {
    const field = form.querySelector(`[data-field="${name}"]`);
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (field) field.classList.toggle("is-invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function setSubmitting(form, isSubmitting) {
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = isSubmitting;
    form.classList.toggle("is-submitting", isSubmitting);
  }

  function resetPrivacyConsent(form) {
    const checkbox = form.querySelector("[data-privacy-checkbox]");
    const consentedAt = form.querySelector("[data-privacy-consented-at]");
    if (checkbox) {
      checkbox.checked = false;
      checkbox.dataset.consentConfirmed = "false";
    }
    if (consentedAt) consentedAt.value = "";
  }

  function validate(form, content) {
    const data = new FormData(form);
    const errors = {};
    const validation = content.contact.validation;
    const privacy = content.contact.privacy || {};
    const required = ["company", "name", "email", "inquiryType", "message"];

    required.forEach((name) => {
      if (!getValue(data, name)) {
        errors[name] = validation.required;
      }
    });

    const email = getValue(data, "email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = validation.email;
    }

    const message = getValue(data, "message");
    if (message && message.length < 10) {
      errors.message = validation.message;
    }

    const checkbox = form.querySelector("[data-privacy-checkbox]");
    const consentedAt = form.querySelector("[data-privacy-consented-at]");
    const privacyConfirmed =
      checkbox &&
      checkbox.checked &&
      checkbox.dataset.consentConfirmed === "true" &&
      consentedAt &&
      consentedAt.value;

    if (!privacyConfirmed) {
      errors.privacy = validation.privacy || privacy.requiredText || validation.required;
    }

    fieldNames.forEach((name) => {
      setFieldError(form, name, errors[name]);
    });

    return {
      valid: Object.keys(errors).length === 0,
      data
    };
  }

  function buildPayload(data) {
    return {
      company: getValue(data, "company"),
      name: getValue(data, "name"),
      email: getValue(data, "email"),
      phone: getValue(data, "phone"),
      inquiryType: getValue(data, "inquiryType"),
      message: getValue(data, "message"),
      privacy: true,
      privacyConsentVersion: getValue(data, "privacyConsentVersion"),
      privacyConsentedAt: getValue(data, "privacyConsentedAt"),
      locale: getLocale(),
      pageUrl: window.location.href,
      source: "ay-tech-global-landing"
    };
  }

  function buildMailto(data, content) {
    const config = window.ATG_CONFIG;
    const payload = buildPayload(data);
    const fields = content.contact.fields;
    const subject = `${config.form.subjectPrefix} ${payload.company || payload.name}`;
    const body = [
      `${fields.company}: ${payload.company}`,
      `${fields.name}: ${payload.name}`,
      `${fields.email}: ${payload.email}`,
      `${fields.phone}: ${payload.phone}`,
      `${fields.inquiryType}: ${payload.inquiryType}`,
      "",
      `${fields.message}:`,
      payload.message,
      "",
      `${fields.privacy}: true`,
      `privacyConsentVersion: ${payload.privacyConsentVersion}`,
      `privacyConsentedAt: ${payload.privacyConsentedAt}`
    ].join("\n");

    return `mailto:${config.form.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function submitToEndpoint(form, data, content) {
    const endpoint = String(form.dataset.endpoint || "").trim();
    if (!endpoint) {
      window.location.href = buildMailto(data, content);
      setStatus(form, content.contact.status.fallback, "success");
      return;
    }

    const response = await fetch(endpoint, {
      method: window.ATG_CONFIG.form.method || "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildPayload(data))
    });

    if (!response.ok) {
      throw new Error(`Form endpoint responded with ${response.status}`);
    }

    form.reset();
    resetPrivacyConsent(form);
    setStatus(form, content.contact.status.success, "success");
  }

  function getFocusableElements(modal) {
    if (!modal) return [];
    return [...modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
      (element) => !element.disabled && element.offsetParent !== null
    );
  }

  function refreshPrivacyState(form) {
    const currentForm = form || document.getElementById("contactForm");
    const modal = document.getElementById("privacyConsentDialog");
    const checkbox = currentForm && currentForm.querySelector("[data-privacy-checkbox]");
    const consentedAt = currentForm && currentForm.querySelector("[data-privacy-consented-at]");

    if (!currentForm || !modal || !checkbox || !consentedAt) return false;

    privacyState.form = currentForm;
    privacyState.modal = modal;
    privacyState.checkbox = checkbox;
    privacyState.consentedAt = consentedAt;
    return true;
  }

  function openPrivacyModal(form) {
    if (!refreshPrivacyState(form || privacyState.form)) return;
    const modal = privacyState.modal;
    privacyState.previousFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("is-modal-open");

    const focusable = getFocusableElements(modal);
    const closeButton = modal.querySelector(".privacy-modal__close");
    (closeButton || focusable[0] || modal).focus();
  }

  function closePrivacyModal() {
    const modal = privacyState.modal;
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");

    if (
      privacyState.previousFocus &&
      document.body.contains(privacyState.previousFocus) &&
      typeof privacyState.previousFocus.focus === "function"
    ) {
      privacyState.previousFocus.focus();
    }
    privacyState.previousFocus = null;
  }

  function handlePrivacyKeydown(event) {
    const modal = privacyState.modal;
    if (!modal || modal.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closePrivacyModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(modal);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function confirmPrivacyConsent(form) {
    refreshPrivacyState(form || privacyState.form);
    const currentForm = privacyState.form;
    const checkbox = privacyState.checkbox || (form && form.querySelector("[data-privacy-checkbox]"));
    const consentedAt = privacyState.consentedAt || (currentForm && currentForm.querySelector("[data-privacy-consented-at]"));
    if (!checkbox || !consentedAt) return;

    checkbox.checked = true;
    checkbox.dataset.consentConfirmed = "true";
    consentedAt.value = new Date().toISOString();
    if (currentForm) setFieldError(currentForm, "privacy", "");
    closePrivacyModal();
  }

  function handlePrivacyCheckboxClick(event) {
    const checkbox = event.currentTarget;
    const form = checkbox.closest("form");
    const consentedAt = form && form.querySelector("[data-privacy-consented-at]");

    if (checkbox.dataset.consentConfirmed === "true" && !checkbox.checked) {
      if (form) resetPrivacyConsent(form);
      return;
    }

    if (checkbox.dataset.consentConfirmed !== "true") {
      event.preventDefault();
      checkbox.checked = false;
      checkbox.dataset.consentConfirmed = "false";
      if (consentedAt) consentedAt.value = "";
      openPrivacyModal(form);
    }
  }

  function handlePrivacyChange(event) {
    const checkbox = event.currentTarget;

    const form = privacyState.form || checkbox.closest("form");
    if (!checkbox.checked) {
      if (form) resetPrivacyConsent(form);
    } else if (checkbox.dataset.consentConfirmed !== "true") {
      checkbox.checked = false;
      openPrivacyModal(form);
    }
  }

  function initPrivacyConsent(form) {
    if (!refreshPrivacyState(form)) return;

    const modal = privacyState.modal;
    const checkbox = privacyState.checkbox;
    privacyState.previousFocus = null;
    modal.hidden = true;
    modal.classList.remove("is-open");
    document.body.classList.remove("is-modal-open");

    checkbox.onclick = handlePrivacyCheckboxClick;
    checkbox.onchange = handlePrivacyChange;

    form.querySelectorAll("[data-privacy-open]").forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        openPrivacyModal(form);
      };
    });

    modal.querySelectorAll("[data-privacy-close]").forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        closePrivacyModal();
      };
    });

    const agreeButton = modal.querySelector("[data-privacy-agree]");
    if (agreeButton) {
      agreeButton.onclick = (event) => {
        event.preventDefault();
        confirmPrivacyConsent(form);
      };
    }

    if (window.__ATG_PRIVACY_KEYDOWN) {
      document.removeEventListener("keydown", window.__ATG_PRIVACY_KEYDOWN);
    }
    window.__ATG_PRIVACY_KEYDOWN = handlePrivacyKeydown;
    document.addEventListener("keydown", handlePrivacyKeydown);
  }

  async function handleFormSubmit(event) {
    const form = event.target;
    if (!form || form.id !== "contactForm") return;

    event.preventDefault();
    const content = getContent();

    if (form.website && form.website.value) {
      form.reset();
      resetPrivacyConsent(form);
      setStatus(form, content.contact.status.success, "success");
      return;
    }

    const result = validate(form, content);
    if (!result.valid) {
      setStatus(form, content.contact.status.error, "error");
      return;
    }

    setSubmitting(form, true);
    setStatus(form, content.contact.status.sending);
    try {
      await submitToEndpoint(form, result.data, content);
    } catch (error) {
      setStatus(form, content.contact.status.error, "error");
    } finally {
      setSubmitting(form, false);
    }
  }

  function init() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.dataset.formReady = "true";
    initPrivacyConsent(form);
    form.onsubmit = handleFormSubmit;
  }

  window.ATG_FORM = {
    init
  };
})();

(() => {
  const forms = document.querySelectorAll('form[data-formsubmit-ajax][action*="formsubmit.co"]');
  if (!forms.length) return;

  let modal = document.querySelector("[data-form-success-modal]");

  if (!modal) {
    modal = document.createElement("div");
    modal.className = "form-success-modal";
    modal.hidden = true;
    modal.setAttribute("data-form-success-modal", "");
    modal.innerHTML = `
      <div class="form-success-modal__backdrop" data-form-success-close></div>
      <div class="form-success-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="form-success-title">
        <button class="form-success-modal__close" type="button" aria-label="Close message" data-form-success-close>
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="form-success-modal__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        </div>
        <p class="form-success-modal__eyebrow">Submission received</p>
        <h3 id="form-success-title">Thank you.</h3>
        <p class="form-success-modal__copy" data-form-success-copy></p>
        <div class="form-success-modal__actions">
          <button class="button" type="button" data-form-success-close>Close</button>
        </div>
      </div>
    `;
    document.body.append(modal);
  }

  const copy = modal.querySelector("[data-form-success-copy]");
  const closeControls = modal.querySelectorAll("[data-form-success-close]");
  let lastFocusedElement = null;

  const modalMessages = {
    contact:
      "Your message has been sent to the Ali Print Pack team. We will review it and respond through the appropriate contact channel.",
    quote:
      "Your quotation request has been sent successfully. Our team will review the details and respond with the most suitable quotation.",
    careers:
      "Your application has been submitted successfully. Our team will review your details and contact you if your profile matches an active requirement.",
  };

  const resetModalState = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  const closeModal = () => {
    resetModalState();
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const openModal = (formType, triggerElement) => {
    if (copy) {
      copy.textContent =
        modalMessages[formType] || "Your submission has been received successfully.";
    }

    lastFocusedElement = triggerElement || document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".form-success-modal__close")?.focus();
  };

  closeControls.forEach((control) => {
    control.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  window.addEventListener("pageshow", resetModalState);
  resetModalState();

  const resetQuoteCountry = (form) => {
    if (form.dataset.formType !== "quote") return;
    const countrySelect = form.querySelector("[data-country-select]");
    if (!countrySelect) return;
    countrySelect.value = "pk";
    countrySelect.dispatchEvent(new Event("change", { bubbles: true }));
  };

  forms.forEach((form, index) => {
    if (form.dataset.formsubmitBound === "true") return;
    form.dataset.formsubmitBound = "true";

    const frameName = `formsubmit-frame-${form.dataset.formType || "form"}-${index + 1}`;
    const iframe = document.createElement("iframe");
    iframe.name = frameName;
    iframe.title = "Form submission target";
    iframe.hidden = true;
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    document.body.append(iframe);

    form.target = frameName;

    let isSubmitting = false;
    let timeoutId = null;

    const cleanupSubmitState = (submitButton, originalButtonHtml) => {
      isSubmitting = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
      }
    };

    iframe.addEventListener("load", () => {
      if (!isSubmitting) return;

      const submitButton = form.__submitButton || null;
      const originalButtonHtml = form.__submitButtonHtml || "";

      form.reset();
      resetQuoteCountry(form);
      cleanupSubmitState(submitButton, originalButtonHtml);
      openModal(form.dataset.formType || "form", submitButton);
    });

    form.addEventListener(
      "submit",
      (event) => {
        if (isSubmitting) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalButtonHtml = submitButton?.innerHTML || "";

        form.__submitButton = submitButton;
        form.__submitButtonHtml = originalButtonHtml;
        isSubmitting = true;

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = "Sending...";
        }

        timeoutId = window.setTimeout(() => {
          cleanupSubmitState(submitButton, originalButtonHtml);
          window.alert(
            "The form is taking longer than expected to submit. Please try again, or contact the team directly at info@aliprintpack.com."
          );
        }, 15000);
      },
      true
    );
  });
})();

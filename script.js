// Centralize the company's real, editable contact details here.
const company = {
  whatsapp: "5521970465929", // Country code + area code + number, digits only.
  phone: "(21) 97046-5929",
  address: "Av. Nilo Peçanha, 1385 - Centro, Nova Iguaçu - RJ, 26215-512",
  hours: "Segunda a Sexta, 08:00 - 18:00 | Sábado, 08:00 - 13:00",
  instagram: "@lannassom",
  email: "contato@lannasound.com.br"
};

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const contactStatus = document.querySelector("[data-contact-status]");

function getWhatsAppUrl(message) {
  const number = company.whatsapp.replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function requestContact(message) {
  const url = getWhatsAppUrl(message);
  if (!url) {
    if (contactStatus) {
      contactStatus.textContent = "O WhatsApp oficial ainda não foi configurado. Atualize o número no arquivo script.js.";
    }
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    navigation.classList.toggle("is-open", !expanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      navigation.classList.remove("is-open");
    });
  });
}

document.querySelectorAll("[data-contact-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (company.whatsapp.trim()) {
      event.preventDefault();
      requestContact("Olá! Gostaria de conhecer os serviços da Lanna’s Sound.");
    } else if (contactStatus) {
      contactStatus.textContent = "O WhatsApp oficial ainda não foi configurado. Atualize o número no arquivo script.js.";
    }
  });
});

// Edit the photos of each service here: add or replace paths in "images".
const serviceGalleries = {
  som: { title: "Som e tecnologia", images: ["images/sobre.jpg", "images/carro2.jpg"] },
  seguranca: { title: "Segurança e acessórios", images: ["images/engate1.jpg", "images/engate2.jpg"] },
  vidros: { title: "Vidros e para-brisas", images: ["images/vidro1.jpg", "images/vidro2.jpg", "images/vidro3.jpg", "images/carro4.jpg"] },
  insulfilm: { title: "Insulfilm", images: ["images/insulfilm1.jpg", "images/insulfilm2.jpg"] }
};

const serviceModal = document.querySelector("#service-modal");
const modalTitle = serviceModal?.querySelector("#service-modal-title");
const modalGrid = serviceModal?.querySelector("[data-modal-grid]");
const modalCta = serviceModal?.querySelector("[data-modal-cta]");
const modalDots = serviceModal?.querySelector("[data-modal-dots]");
const SLIDE_INTERVAL = 2500;
let modalOpener = null;
let modalService = "";
let slideIndex = 0;
let slideTimer = null;
let slideCount = 0;

function goToSlide(index, smooth = true) {
  if (!slideCount) return;
  slideIndex = (index + slideCount) % slideCount;
  modalGrid.scrollTo({ left: slideIndex * modalGrid.clientWidth, behavior: smooth ? "smooth" : "auto" });
  updateDots();
}

function updateDots() {
  modalDots.querySelectorAll("span").forEach((dot, i) => dot.classList.toggle("is-active", i === slideIndex));
}

function stopSlides() {
  clearInterval(slideTimer);
  slideTimer = null;
}

function startSlides() {
  stopSlides();
  if (slideCount > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    slideTimer = setInterval(() => goToSlide(slideIndex + 1), SLIDE_INTERVAL);
  }
}

if (modalGrid) {
  // Keeps the dots in sync when the user swipes with touch.
  modalGrid.addEventListener("scroll", () => {
    const index = Math.round(modalGrid.scrollLeft / modalGrid.clientWidth);
    if (index !== slideIndex && index >= 0 && index < slideCount) {
      slideIndex = index;
      updateDots();
    }
  }, { passive: true });
  ["touchstart", "pointerdown", "mouseenter"].forEach((type) => modalGrid.addEventListener(type, stopSlides, { passive: true }));
  ["touchend", "touchcancel", "mouseleave"].forEach((type) => modalGrid.addEventListener(type, startSlides, { passive: true }));
  serviceModal.querySelector("[data-carousel-prev]").addEventListener("click", () => { goToSlide(slideIndex - 1); startSlides(); });
  serviceModal.querySelector("[data-carousel-next]").addEventListener("click", () => { goToSlide(slideIndex + 1); startSlides(); });
}

function closeServiceModal() {
  if (!serviceModal || serviceModal.hidden) return;
  stopSlides();
  serviceModal.hidden = true;
  document.body.classList.remove("modal-open");
  modalOpener?.focus();
}

function openServiceModal(link) {
  const gallery = serviceGalleries[link.dataset.gallery];
  if (!serviceModal || !gallery) return false;
  modalOpener = link;
  modalService = link.dataset.service;
  modalTitle.textContent = gallery.title;
  modalGrid.replaceChildren(...gallery.images.map((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${gallery.title} - Lanna’s Sound`;
    img.loading = "lazy";
    return img;
  }));
  slideCount = gallery.images.length;
  modalDots.replaceChildren(...gallery.images.map((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => { goToSlide(i); startSlides(); });
    return dot;
  }));
  serviceModal.hidden = false;
  goToSlide(0, false);
  startSlides();
  document.body.classList.add("modal-open");
  serviceModal.querySelector(".service-modal-close").focus();
  return true;
}

serviceModal?.querySelectorAll("[data-modal-close]").forEach((el) => el.addEventListener("click", closeServiceModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeServiceModal();
});

modalCta?.addEventListener("click", () => {
  const url = getWhatsAppUrl(`Olá! Gostaria de solicitar informações e orçamento para ${modalService}.`);
  if (!url) {
    if (contactStatus) {
      contactStatus.textContent = "O WhatsApp oficial ainda não foi configurado. Atualize o número no arquivo script.js.";
    }
    closeServiceModal();
    document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openServiceModal(link);
  });
});

function setText(selector, value, fallback) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value || fallback;
  });
}

setText("[data-company-phone]", company.phone || company.whatsapp, "Configure o número oficial no script.js");
setText("[data-company-address]", company.address, "Endereço a informar");
setText("[data-company-hours]", company.hours, "Horário a informar");

const socialLinks = [company.instagram, company.email].filter(Boolean);
setText("[data-company-social]", socialLinks.join(" · "), "Dados a informar");
setText("[data-footer-phone]", company.phone || company.whatsapp, "WhatsApp a configurar");
setText("[data-footer-address]", company.address, "Endereço a informar");
setText("[data-footer-social]", socialLinks.join(" · "), "Redes sociais a informar");

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

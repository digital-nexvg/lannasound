// Centralize the company's real, editable contact details here.
const company = {
  whatsapp: "21970465929", // Add the official number with country code and area code, digits only.
  phone: "",
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

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const service = link.dataset.service;
    const url = getWhatsAppUrl(`Olá! Gostaria de solicitar informações e orçamento para ${service}.`);
    if (!url) {
      if (contactStatus) {
        contactStatus.textContent = "O WhatsApp oficial ainda não foi configurado. Atualize o número no arquivo script.js.";
      }
      document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
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

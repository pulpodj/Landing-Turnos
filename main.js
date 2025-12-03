// main.js

document.addEventListener("DOMContentLoaded", () => {
  const btnIngresar = document.getElementById("btnIngresar");
  const contactSection = document.getElementById("contact");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  // ===== Scroll suave a contacto =====
  if (btnIngresar && contactSection) {
    btnIngresar.addEventListener("click", () => {
      contactSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== Reveal on scroll (finura ✨) =====
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealEls.forEach((el) => observer.observe(el));

  // ===== Datos de servicios =====
  const serviceCards = document.querySelectorAll(".service-card");
  const detailImage = document.getElementById("serviceDetailImage");
  const detailTitle = document.getElementById("serviceDetailTitle");
  const detailIntro = document.getElementById("serviceDetailIntro");
  const detailList = document.getElementById("serviceDetailList");

  const serviceData = {
    terapiaManual: {
      title: "TERAPIA MANUAL",
      intro:
        "Técnicas manuales específicas para disminuir el dolor, restaurar la movilidad y mejorar el funcionamiento general del cuerpo.",
      image: "assets/TerapiaManual.png",
      imageAlt: "Profesional realizando terapia manual en camilla",
      bullets: [
        "Evaluación funcional: postura, movilidad, fuerza y test específicos.",
        "Movilizaciones articulares.",
        "Masaje y tratamiento de tejidos blandos.",
        "Técnicas de energía muscular.",
        "Ejercicio terapéutico complementario."
      ]
    },
    kinesiologiaConvencional: {
      title: "KINESIOLOGÍA CONVENCIONAL",
      intro:
        "Protocolos tradicionales y actuales de kinesiología orientados a recuperar la función luego de lesiones, cirugías o cuadros dolorosos.",
      image: "assets/KinesiologiaConvensional.png",
      imageAlt: "Paciente en sesión de kinesiología convencional",
      bullets: [
        "Planes de tratamiento adaptados al diagnóstico médico.",
        "Reeducación de la marcha y la postura.",
        "Fortalecimiento y movilidad articular.",
        "Uso de agentes físicos según indicación profesional.",
        "Seguimiento y ajustes según evolución."
      ]
    },
    ejerciciosAdaptados: {
      title: "EJERCICIOS ADAPTADOS",
      intro:
        "Programas de ejercicio diseñados a medida para mejorar fuerza, estabilidad y resistencia, respetando tus tiempos y condiciones.",
      image: "assets/EjerciciosAdaptados.png",
      imageAlt: "Ejercicios adaptados guiados por profesional",
      bullets: [
        "Evaluación inicial de capacidades y limitaciones.",
        "Rutinas progresivas según objetivo y condición.",
        "Ejercicios de estabilidad, fuerza y control motor.",
        "Prevención de recaídas y sobrecargas.",
        "Educación en hábitos de movimiento y autocuidado."
      ]
    }
  };

  function updateServiceDetail(key) {
    const data = serviceData[key];
    if (!data || !detailImage || !detailTitle || !detailIntro || !detailList) return;

    detailTitle.textContent = data.title;
    detailIntro.textContent = data.intro;
    detailImage.src = data.image;
    detailImage.alt = data.imageAlt;

    // Limpiamos la lista de forma segura
    while (detailList.firstChild) {
      detailList.removeChild(detailList.firstChild);
    }

    data.bullets.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      detailList.appendChild(li);
    });
  }

  function setActiveCard(card) {
    serviceCards.forEach((c) => c.classList.remove("service-card--active"));
    card.classList.add("service-card--active");
  }

  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.service;
      if (!key) return;
      setActiveCard(card);
      updateServiceDetail(key);
    });
  });

  // Estado inicial
  updateServiceDetail("terapiaManual");

  // ===== Validación de formulario (simple, sin innerHTML) =====

  function sanitizeInput(value) {
    // evita que entren tags raros / JS obvio
    return value.replace(/[<>]/g, "").trim();
  }

  function isValidEmail(email) {
    // regex simple y razonable, sin locuras
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = sanitizeInput(contactForm.nombre.value);
      const apellido = sanitizeInput(contactForm.apellido.value);
      const email = sanitizeInput(contactForm.email.value);
      const telefono = sanitizeInput(contactForm.telefono.value || "");

      if (!nombre || !apellido || !email) {
        formMessage.textContent = "Por favor completá los campos obligatorios.";
        formMessage.style.color = "#b91c1c";
        return;
      }

      if (!isValidEmail(email)) {
        formMessage.textContent = "Ingresá un email válido.";
        formMessage.style.color = "#b91c1c";
        return;
      }

      if (telefono && telefono.length < 6) {
        formMessage.textContent = "Revisá el número de teléfono ingresado.";
        formMessage.style.color = "#b91c1c";
        return;
      }

      // Acá iría el fetch al backend / API real
      formMessage.textContent = "¡Gracias! Nos pondremos en contacto a la brevedad.";
      formMessage.style.color = "#047857";

      contactForm.reset();
    });
  }
});

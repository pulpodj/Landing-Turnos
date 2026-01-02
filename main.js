// main.js (SIN TOKEN)

document.addEventListener("DOMContentLoaded", () => {
  // ===== Config API (sin token) =====
  const API_BASE = "https://backend-turnos-7n89.onrender.com";

  const btnIngresar = document.getElementById("btnIngresar");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  // Inputs (tu HTML usa id="")
  const inputNombre = document.getElementById("nombre");
  const inputApellido = document.getElementById("apellido");
  const inputEmail = document.getElementById("email");
  const inputTelefono = document.getElementById("telefono");
  const inputWebsite = document.getElementById("website"); // honeypot opcional

  // ===== Botón Ingresar -> redirección =====
  if (btnIngresar) {
    btnIngresar.addEventListener("click", () => {
      window.location.href = "https://front-gestor-turnos.onrender.com";
    });
  }

  // ===== Reveal on scroll (finura ✨) =====
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("reveal--visible"));
  }

  // ===== Servicios dinámicos =====
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
        "Ejercicio terapéutico complementario.",
      ],
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
        "Seguimiento y ajustes según evolución.",
      ],
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
        "Educación en hábitos de movimiento y autocuidado.",
      ],
    },
  };

  function updateServiceDetail(key) {
    const data = serviceData[key];
    if (!data || !detailImage || !detailTitle || !detailIntro || !detailList) return;

    detailTitle.textContent = data.title;
    detailIntro.textContent = data.intro;
    detailImage.src = data.image;
    detailImage.alt = data.imageAlt;

    detailList.textContent = "";
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

  updateServiceDetail("terapiaManual");

  // ===== Helpers form =====
  function sanitizeInput(value) {
    return String(value || "").replace(/[<>]/g, "").trim();
  }

  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  async function postJSONWithTimeout(url, payload, timeoutMs = 12000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson
        ? await res.json().catch(() => null)
        : await res.text().catch(() => null);

      return { ok: res.ok, status: res.status, data };
    } finally {
      clearTimeout(timer);
    }
  }

  // ===== Submit formulario =====
  if (contactForm && formMessage && inputNombre && inputApellido && inputEmail) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = sanitizeInput(inputNombre.value);
      const apellido = sanitizeInput(inputApellido.value);
      const email = sanitizeInput(inputEmail.value);
      const telefono = sanitizeInput(inputTelefono?.value || "");
      const website = sanitizeInput(inputWebsite?.value || ""); // honeypot opcional

      // honeypot: si viene lleno, fingimos éxito (anti-bots)
      if (website) {
        formMessage.textContent = "¡Gracias! Nos pondremos en contacto a la brevedad.";
        formMessage.style.color = "#047857";
        contactForm.reset();
        return;
      }

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

      if (telefono && telefono.replace(/\D/g, "").length < 6) {
        formMessage.textContent = "Revisá el número de teléfono ingresado.";
        formMessage.style.color = "#b91c1c";
        return;
      }

      formMessage.textContent = "Enviando…";
      formMessage.style.color = "#374151";

      const url = `${API_BASE}/API/contacto`;


      try {
        const result = await postJSONWithTimeout(url, { nombre, apellido, email, telefono });

        console.log("Respuesta API:", result);

        if (result.ok) {
          formMessage.textContent = "¡Gracias! Nos pondremos en contacto a la brevedad.";
          formMessage.style.color = "#047857";
          contactForm.reset();
          return;
        }

        // Mensajes útiles por status
        if (result.status === 401 || result.status === 403) {
          formMessage.textContent = "No autorizado. El endpoint requiere token.";
        } else if (result.status === 429) {
          formMessage.textContent = "Demasiadas solicitudes. Probá de nuevo en un ratito.";
        } else {
          const serverMsg =
            (typeof result.data === "object" && result.data && (result.data.message || result.data.mensaje)) || null;

          formMessage.textContent = serverMsg || "Error al enviar el formulario. Intentalo más tarde.";
        }
        formMessage.style.color = "#b91c1c";
      } catch (err) {
        console.error("Error:", err);

        formMessage.textContent =
          String(err?.name) === "AbortError"
            ? "La solicitud tardó demasiado. Probá de nuevo."
            : "Error al enviar el formulario. Intentalo más tarde.";
        formMessage.style.color = "#b91c1c";
      }
    });
  } else {
    console.warn("Formulario: faltan elementos (contactForm/formMessage/inputs). Revisá ids en el HTML.");
  }
});

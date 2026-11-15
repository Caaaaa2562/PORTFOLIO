const root = document.documentElement;
const progreso = document.querySelector("#progreso");
const secciones = [...document.querySelectorAll("main section")];
const links = [...document.querySelectorAll("nav a")];

function pintarProgreso() {
  const alto = root.scrollHeight - root.clientHeight;
  const valor = alto > 0 ? (root.scrollTop / alto) * 100 : 0;
  progreso.style.transform = `scaleX(${valor / 100})`;
}

const revelar = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add("visible");
    revelar.unobserve(entrada.target);
  });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((nodo) => revelar.observe(nodo));

const barras = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const nivel = entrada.target.dataset.nivel;
    entrada.target.style.setProperty("--nivel", `${nivel}%`);
    barras.unobserve(entrada.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-nivel]").forEach((barra) => barras.observe(barra));

const spy = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const id = entrada.target.id;
    links.forEach((link) => {
      link.classList.toggle("activo", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

secciones.forEach((seccion) => spy.observe(seccion));

const escena = document.querySelector(".escena");
const inicio = document.querySelector("#inicio");

inicio.addEventListener("pointermove", (evento) => {
  const rect = inicio.getBoundingClientRect();
  const x = (evento.clientX - rect.left) / rect.width - 0.5;
  const y = (evento.clientY - rect.top) / rect.height - 0.5;
  inicio.style.setProperty("--mx", x.toFixed(3));
  inicio.style.setProperty("--my", y.toFixed(3));
});

inicio.addEventListener("pointerleave", () => {
  inicio.style.setProperty("--mx", "0");
  inicio.style.setProperty("--my", "0");
});

if (window.matchMedia("(pointer: coarse)").matches) {
  escena?.style.setProperty("transform", "none");
}

const form = document.querySelector("#contacto form");
const aviso = document.querySelector("#aviso-form");

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = new FormData(form);
    const nombre = String(datos.get("nombre") || "").trim();
    aviso.textContent = `Gracias${nombre ? `, ${nombre}` : ""}. Este formulario todavía no envía el mensaje: escribime por GitHub y te respondo.`;
    form.reset();
});

pintarProgreso();
window.addEventListener("scroll", pintarProgreso, { passive: true });
window.addEventListener("resize", pintarProgreso);

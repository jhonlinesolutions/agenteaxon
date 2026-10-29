const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revelar() {
  const alvos = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduz || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const atraso = Number(el.dataset.reveal || 0);
        setTimeout(() => {
          el.classList.add('is-in');
          el.classList.remove('is-hidden');
        }, atraso);
        io.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );

  alvos.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.classList.add('is-hidden');
    io.observe(el);
  });
}

function contar() {
  const nums = document.querySelectorAll<HTMLElement>('[data-count]');
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const fim = Number(el.dataset.count);
      if (reduz || !Number.isFinite(fim)) return;
      const inicio = performance.now();
      const dur = 1200;
      const passo = (t: number) => {
        const p = Math.min(1, (t - inicio) / dur);
        el.textContent = String(Math.round(fim * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  });
  nums.forEach((n) => io.observe(n));
}

revelar();
contar();

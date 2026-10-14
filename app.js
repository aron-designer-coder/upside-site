(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal sections as they scroll in.
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // The ladder: the dot climbs one rung per seventh of the section while you scroll.
  const climb = document.getElementById('climb');
  const ladder = document.getElementById('ladder');
  const climber = document.getElementById('climber');
  const items = [...document.querySelectorAll('.rungs li')].reverse(); // bottom rung first
  const num = document.getElementById('climb-num');
  const name = document.getElementById('climb-name');
  const target = document.getElementById('climb-target');
  let current = -1;

  function updateClimb() {
    const rect = climb.getBoundingClientRect();
    const total = climb.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / total));
    const step = Math.min(6, Math.floor(p * 7));
    // The dot sits on the current rung, like the dot under the bar in the logo.
    const box = ladder.getBoundingClientRect();
    const rung = items[step].getBoundingClientRect();
    climber.style.setProperty('--y', `${rung.top + rung.height / 2 - box.top}px`);
    if (step !== current) {
      current = step;
      items.forEach((li, i) => {
        li.classList.toggle('is-done', i < step);
        li.classList.toggle('is-now', i === step);
      });
      num.textContent = String(step + 1).padStart(2, '0');
      name.textContent = items[step].dataset.name;
      target.textContent = items[step].dataset.target;
    }
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateClimb();
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  updateClimb();

  // Spotlight that follows the pointer over the ladder tiles.
  document.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('pointermove', (e) => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
      tile.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();

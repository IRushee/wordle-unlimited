import confetti from 'canvas-confetti';

export function fireWinConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-burst fireworks
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#538d4e', '#6aaa64', '#f5793a', '#eab308']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#ffffff', '#22c55e', '#a855f7']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#f43f5e', '#06b6d4', '#eab308']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#538d4e', '#ffffff']
  });
}

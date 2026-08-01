import gsap from 'gsap';

export function animateConnectIntro(
  board: HTMLElement,
  docks: HTMLElement[],
  cards: HTMLElement[]
): void {
  gsap.set([...docks, ...cards], { opacity: 0, y: 18 });
  gsap.to(board, {
    opacity: 1,
    duration: 0.55,
    ease: 'power2.out'
  });
  gsap.to(docks, {
    opacity: 1,
    y: 0,
    duration: 0.72,
    ease: 'power3.out',
    stagger: 0.08
  });
  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.82,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 0.12
  });
}

export function animateCardPickup(card: HTMLElement): void {
  gsap.to(card, {
    scale: 1.045,
    duration: 0.2,
    ease: 'power2.out'
  });
}

export function animateCardReturn(card: HTMLElement, x: number, y: number): void {
  gsap.to(card, {
    x,
    y,
    scale: 1,
    rotation: 0,
    duration: 0.72,
    ease: 'elastic.out(0.8, 0.72)'
  });
}

export function animateDockProximity(dock: HTMLElement | undefined, active: boolean): void {
  if (!dock) {
    return;
  }

  gsap.to(dock, {
    scale: active ? 1.012 : 1,
    boxShadow: active
      ? '0 12px 24px rgba(var(--theme-primary-rgb), 0.08)'
      : '0 8px 22px rgba(0, 0, 0, 0.12)',
    duration: 0.2,
    ease: 'power2.out'
  });
}

export function animateConnector(path: SVGPathElement): void {
  gsap.killTweensOf(path);
  gsap.set(path, { opacity: 1, strokeDashoffset: 0 });
  gsap.to(path, {
    strokeDashoffset: -28,
    duration: 1.15,
    repeat: -1,
    ease: 'none'
  });
}

export function animateConnectSuccess(
  dock: HTMLElement,
  card: HTMLElement,
  receiver: HTMLElement | undefined,
  check: HTMLElement | undefined,
  x: number,
  y: number
): gsap.core.Timeline {
  const timeline = gsap.timeline();

  timeline.to(card, {
    x,
    y,
    scale: 0.92,
    rotation: 0,
    duration: 0.76,
    ease: 'elastic.out(0.88, 0.78)'
  });

  timeline.to(
    dock,
    {
      boxShadow: '0 0 0 1px rgba(var(--theme-primary-rgb), 0.16), 0 12px 28px rgba(var(--theme-primary-rgb), 0.10)',
      duration: 0.32,
      ease: 'power2.out'
    },
    '<0.1'
  );

  if (receiver) {
    timeline.fromTo(
      receiver,
      { scale: 0.96 },
      {
        scale: 1,
        duration: 0.38,
        ease: 'power3.out'
      },
      '<'
    );
  }

  timeline.to(
    card,
    {
      scale: 0.72,
      opacity: 0,
      duration: 0.28,
      ease: 'power2.inOut'
    },
    '-=0.18'
  );

  if (check) {
    timeline.fromTo(
      check,
      { opacity: 0, scale: 0.75 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.28,
        ease: 'back.out(2.5)'
      },
      '<0.12'
    );
  }

  return timeline;
}

export function animateCompletionTransition(docks: HTMLElement[], cards: HTMLElement[]): void {
  const timeline = gsap.timeline();

  timeline.to(cards, {
    opacity: 0,
    y: 10,
    scale: 0.96,
    duration: 0.42,
    ease: 'power2.inOut',
    stagger: 0.04
  });

  timeline.to(
    docks,
    {
      y: -3,
      duration: 0.58,
      ease: 'elastic.out(1, 0.8)',
      stagger: 0.05
    },
    '<0.1'
  );
}

export function animateWrongDock(card: HTMLElement): void {
  gsap.fromTo(
    card,
    { rotation: 0 },
    {
      rotation: -2,
      duration: 0.09,
      repeat: 1,
      yoyo: true,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.set(card, { rotation: 0 });
      }
    }
  );
}

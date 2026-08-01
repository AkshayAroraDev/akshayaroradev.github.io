import { ConnectPoint } from './connect.models';

export interface CircuitTraceRoute {
  path: string;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function distanceBetween(pointA: ConnectPoint, pointB: ConnectPoint): number {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

export function getRectCenter(rect: DOMRect): ConnectPoint {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

export function getCardCenter(
  stageRect: DOMRect,
  position: ConnectPoint,
  cardRect: DOMRect
): ConnectPoint {
  return {
    x: stageRect.left + position.x + cardRect.width / 2,
    y: stageRect.top + position.y + cardRect.height / 2
  };
}

export function getDockedCardPosition(
  stageRect: DOMRect,
  dockRect: DOMRect,
  cardRect: DOMRect
): ConnectPoint {
  return {
    x: dockRect.left - stageRect.left + dockRect.width / 2 - cardRect.width / 2,
    y: dockRect.top - stageRect.top + dockRect.height / 2 - cardRect.height / 2
  };
}

export function applyMagnetism(
  desired: ConnectPoint,
  snapped: ConnectPoint,
  distance: number,
  threshold: number
): ConnectPoint {
  if (distance >= threshold) {
    return desired;
  }

  const strength = 1 - distance / threshold;

  return {
    x: desired.x + (snapped.x - desired.x) * strength * 0.45,
    y: desired.y + (snapped.y - desired.y) * strength * 0.45
  };
}

export function buildCircuitTracePath(
  start: ConnectPoint,
  end: ConnectPoint,
  index: number,
  total: number,
  stageWidth: number
): CircuitTraceRoute {
  const safeTotal = Math.max(total, 1);
  const normalized = safeTotal === 1 ? 0 : index / (safeTotal - 1) - 0.5;
  const spread = clamp(stageWidth * 0.24, 96, 210);
  const sway = normalized * spread;

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const verticalDistance = Math.max(Math.abs(deltaY), 48);
  const archLift = clamp(verticalDistance * 0.38 + 34, 72, 220);
  const cp1 = {
    x: start.x + deltaX * 0.22 + sway,
    y: start.y - archLift
  };
  const cp2 = {
    x: end.x - deltaX * 0.2 + sway * 0.72,
    y: end.y + clamp(verticalDistance * 0.3, 30, 128)
  };

  const path = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;

  return {
    path
  };
}

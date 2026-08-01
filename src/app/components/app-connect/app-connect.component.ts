import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgxDotpatternComponent } from '@omnedia/ngx-dotpattern';
import gsap from 'gsap';
import footerData from '../../../json/footer.json';
import {
  animateCardPickup,
  animateCardReturn,
  animateConnectIntro,
  animateConnectSuccess,
  animateDockProximity,
  animateWrongDock
} from './connect-animation.utils';
import {
  applyMagnetism,
  buildCircuitTracePath,
  CircuitTraceRoute,
  clamp,
  distanceBetween,
  getCardCenter,
  getDockedCardPosition,
  getRectCenter
} from './connect-drag.utils';
import {
  CONNECT_ICONS,
  ConnectDockItem,
  ConnectDragState,
  ConnectLinkId,
  ConnectPoint
} from './connect.models';
import { ThemeService } from '../../services/theme.service';

interface ConnectCardSeedConfig {
  x: number;
  y: number;
  rotation: number;
  floatDelay: number;
}

interface ConnectTraceGuide {
  id: ConnectLinkId;
  path: string;
  active: boolean;
  hovered: boolean;
  connected: boolean;
  particleDuration: string;
  particleDelay: string;
}

const DEFAULT_CARD_SEEDS: ConnectCardSeedConfig[] = [
  { x: 0.18, y: 0.22, rotation: -5, floatDelay: 0 },
  { x: 0.5, y: 0.6, rotation: 2, floatDelay: 900 },
  { x: 0.82, y: 0.15, rotation: 6, floatDelay: 1500 },
  { x: 0.34, y: 0.78, rotation: -3, floatDelay: 450 },
  { x: 0.68, y: 0.82, rotation: 4, floatDelay: 1200 }
];

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule, NgxDotpatternComponent],
  templateUrl: './app-connect.component.html',
  styleUrl: './app-connect.component.scss'
})
export class AppConnectComponent implements AfterViewInit, OnDestroy {
  private static readonly CARD_INITIAL_WIDTH = 224;
  private static readonly CARD_INITIAL_HEIGHT = 88;

  @ViewChild('desktopStage') desktopStage?: ElementRef<HTMLDivElement>;
  @ViewChild('floatingStageRef') floatingStageRef?: ElementRef<HTMLDivElement>;
  @ViewChild('statusPanelRef') statusPanelRef?: ElementRef<HTMLElement>;
  @ViewChildren('dockRef') dockRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('checkRef') checkRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('receiverRef') receiverRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('boardRef') boardRef?: ElementRef<HTMLElement>;

  connectLinks = footerData.socialLinks;
  isDesktopViewport = typeof window === 'undefined' ? true : window.innerWidth > 1024;
  allConnected = false;
  cardsHidden = false;
  connectorLayerWidth = 0;
  connectorLayerHeight = 0;
  traceGuides: ConnectTraceGuide[] = [];
  cardsInitialized = false;

  desktopLinks: ConnectDockItem[] = this.buildDesktopLinks();

  private activeDrag: ConnectDragState | null = null;
  private introPlayed = false;
  private completionAnimated = false;
  private hoverDockId: ConnectLinkId | null = null;
  private hoveredConnectorId: ConnectLinkId | null = null;
  private activeConnectorId: ConnectLinkId | null = null;
  private resizeFrame: number | null = null;
  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {
    this.themeSubscription = this.themeService.currentTheme$.subscribe(() => {
      this.queueLayout(false);
    });
  }

  ngAfterViewInit(): void {
    this.queueLayout(true);
  }

  ngOnDestroy(): void {
    if (this.resizeFrame !== null) {
      cancelAnimationFrame(this.resizeFrame);
    }
    this.themeSubscription.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    const nextDesktop = window.innerWidth > 1024;

    if (this.isDesktopViewport !== nextDesktop) {
      this.isDesktopViewport = nextDesktop;
      this.traceGuides = [];
      this.activeDrag = null;
      this.activeConnectorId = null;
      this.hoveredConnectorId = null;
      this.hoverDockId = null;
      this.setRejectDock(null);
    }

    this.queueLayout(!this.introPlayed);
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.activeDrag || !this.isDesktopViewport) {
      return;
    }

    const stageRect = this.desktopStage?.nativeElement.getBoundingClientRect();
    const item = this.getItem(this.activeDrag.id);
    const card = this.getCardElement(this.activeDrag.id);
    const correctDock = this.getDockElement(this.activeDrag.id);

    if (!stageRect || !item || !card || !correctDock) {
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const desiredPosition: ConnectPoint = {
      x: clamp(
        event.clientX - stageRect.left - this.activeDrag.offsetX,
        0,
        stageRect.width - cardRect.width
      ),
      y: clamp(
        event.clientY - stageRect.top - this.activeDrag.offsetY,
        0,
        stageRect.height - cardRect.height
      )
    };

    const correctDockRect = correctDock.getBoundingClientRect();
    const desiredCenter = getCardCenter(stageRect, desiredPosition, cardRect);
    const desiredCardBounds = this.getCardBoundsForPosition(stageRect, desiredPosition, cardRect);
    const snappedPosition = getDockedCardPosition(stageRect, correctDockRect, cardRect);
    const correctDistance = distanceBetween(
      desiredCenter,
      getRectCenter(correctDockRect)
    );
    const nearestDock = this.getNearestDock(cardRect, stageRect, desiredPosition, item.id);
    const isInsideReceiver = this.isRectOverlappingRect(desiredCardBounds, correctDockRect);
    const isNearCorrectDock =
      isInsideReceiver || (nearestDock?.id === item.id && correctDistance < 160);
    const nextPosition = isNearCorrectDock
      ? applyMagnetism(desiredPosition, snappedPosition, correctDistance, 160)
      : desiredPosition;

    this.setCardPosition(item, nextPosition, true, isNearCorrectDock);
    this.refreshConnectorGuides(stageRect, item.id);
    this.setHoverDock(isNearCorrectDock ? item.id : null);
    this.setRejectDock(
      nearestDock && nearestDock.id !== item.id && nearestDock.distance < 120 ? nearestDock.id : null
    );
  }

  @HostListener('window:pointerup')
  onPointerUp(): void {
    if (!this.activeDrag) {
      return;
    }

    const { id } = this.activeDrag;
    const item = this.getItem(id);
    const card = this.getCardElement(id);
    const dock = this.getDockElement(id);
    const stageRect = this.desktopStage?.nativeElement.getBoundingClientRect();

    this.activeDrag = null;

    if (!item || !card || !dock || !stageRect) {
      this.activeConnectorId = null;
      this.refreshConnectorGuides();
      this.setHoverDock(null);
      this.setRejectDock(null);
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const dockRect = dock.getBoundingClientRect();
    const cardCenter = getCardCenter(stageRect, item, cardRect);
    const distanceToCorrectDock = distanceBetween(cardCenter, getRectCenter(dockRect));
    const isInsideReceiver = this.isRectOverlappingRect(cardRect, dockRect);
    const nearestDock = this.getNearestDock(cardRect, stageRect, item, item.id);

    this.activeConnectorId = null;
    this.refreshConnectorGuides(stageRect);
    this.setHoverDock(null);
    this.setRejectDock(null);

    if (distanceToCorrectDock <= 94 || isInsideReceiver) {
      this.completeConnection(item, card, dock, cardRect, dockRect, stageRect);
      return;
    }

    if (nearestDock && nearestDock.id !== item.id && nearestDock.distance < 110) {
      animateWrongDock(card);
    }

    this.setCardPosition(item, { x: item.originX, y: item.originY }, false);
    animateCardReturn(card, item.originX, item.originY);
  }

  onCardPointerDown(event: PointerEvent, item: ConnectDockItem): void {
    if (!this.isDesktopViewport || this.allConnected || item.connected) {
      return;
    }

    const card = this.getCardElement(item.id);

    if (!card) {
      return;
    }

    event.preventDefault();
    this.setRejectDock(null);

    const rect = card.getBoundingClientRect();
    this.activeDrag = {
      id: item.id,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    this.activeConnectorId = item.id;
    this.refreshConnectorGuides();

    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
    animateCardPickup(card);
  }

  handleDockClick(event: MouseEvent, _item: ConnectDockItem): void {
    if (!this.allConnected) {
      event.preventDefault();
    }
  }

  trackById(_: number, item: ConnectDockItem): ConnectLinkId {
    return item.id;
  }

  trackByTraceId(_: number, trace: ConnectTraceGuide): ConnectLinkId {
    return trace.id;
  }

  setConnectorHover(id: ConnectLinkId, hovering: boolean): void {
    this.hoveredConnectorId = hovering ? id : this.hoveredConnectorId === id ? null : this.hoveredConnectorId;
    this.refreshConnectorGuides();
  }

  getDockStatus(item: ConnectDockItem): string {
    if (this.allConnected) {
      return this.getDockActionLabel(item);
    }

    return item.connected ? 'Connected' : item.status;
  }

  get totalLinks(): number {
    return this.desktopLinks.length;
  }

  get connectedCount(): number {
    return this.desktopLinks.reduce((count, item) => count + (item.connected ? 1 : 0), 0);
  }

  get progressText(): string {
    return this.allConnected
      ? 'All links connected.'
      : `${this.connectedCount} / ${this.totalLinks}`;
  }

  get connectionStatusCountText(): string {
    return `${this.connectedCount} / ${this.totalLinks} connected`;
  }

  private queueLayout(resetFloating: boolean): void {
    if (this.resizeFrame !== null) {
      cancelAnimationFrame(this.resizeFrame);
    }

    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = null;
      this.setupDesktopLayout(resetFloating);
    });
  }

  private setupDesktopLayout(resetFloating: boolean): void {
    if (!this.isDesktopViewport || !this.desktopStage) {
      return;
    }

    if (!this.cardsInitialized) {
      this.initializeCardPositions();
      this.cardsInitialized = true;
      this.queueLayout(resetFloating);
      return;
    }

    if (this.cardRefs.length !== this.desktopLinks.length) {
      this.queueLayout(resetFloating);
      return;
    }

    const stageRect = this.desktopStage.nativeElement.getBoundingClientRect();
    this.positionCards(resetFloating);
    this.refreshConnectorGuides(stageRect);

    if (!this.introPlayed && this.boardRef) {
      const cardIntroTargets = this.cardRefs.map((ref) => {
        return (ref.nativeElement.querySelector('.connect__card-inner') as HTMLElement) ?? ref.nativeElement;
      });

      animateConnectIntro(
        this.boardRef.nativeElement,
        this.dockRefs.map((ref) => ref.nativeElement),
        cardIntroTargets
      );
      this.introPlayed = true;
    }
  }

  private positionCards(resetFloating: boolean): void {
    const stageRect = this.desktopStage?.nativeElement.getBoundingClientRect();

    if (!stageRect) {
      return;
    }

    this.desktopLinks.forEach((item) => {
      const card = this.getCardElement(item.id);
      const dock = this.getDockElement(item.id);

      if (!card) {
        return;
      }

      const cardRect = card.getBoundingClientRect();

      if (item.connected && dock) {
        this.setCardPosition(item, getDockedCardPosition(stageRect, dock.getBoundingClientRect(), cardRect));
        return;
      }

      if (!resetFloating && (item.x !== 0 || item.y !== 0)) {
        this.setCardPosition(item, { x: item.x, y: item.y });
        return;
      }

      const seededPosition = {
        x: clamp(stageRect.width * item.seedX - cardRect.width / 2, 0, stageRect.width - cardRect.width),
        y: (() => {
          const { top, range } = this.getSpawnMetrics(stageRect, cardRect.height);
          return clamp(top + range * item.seedY, 12, stageRect.height - cardRect.height);
        })()
      };

      item.originX = seededPosition.x;
      item.originY = seededPosition.y;
      this.setCardPosition(item, seededPosition);
    });
  }

  private completeConnection(
    item: ConnectDockItem,
    card: HTMLElement,
    dock: HTMLElement,
    cardRect: DOMRect,
    dockRect: DOMRect,
    stageRect: DOMRect
  ): void {
    const receiver = this.getReceiverElement(item.id);
    const snappedPosition = getDockedCardPosition(stageRect, dockRect, cardRect);

    item.connected = true;
    item.showCheck = true;
    item.reject = false;
    this.setCardPosition(item, snappedPosition, false);
    const successTimeline = animateConnectSuccess(
      dock,
      card,
      receiver,
      this.getCheckElement(item.id),
      snappedPosition.x,
      snappedPosition.y
    );

    successTimeline.eventCallback('onComplete', () => {
      item.merged = true;
      this.refreshConnectorGuides();

      if (this.desktopLinks.every((link) => link.connected) && !this.completionAnimated) {
        this.completionAnimated = true;
        this.allConnected = true;

        requestAnimationFrame(() => {
          this.animateCompletionSequence();
        });
      }
    });

    this.refreshConnectorGuides(stageRect);
  }

  private setHoverDock(nextDockId: ConnectLinkId | null): void {
    if (this.hoverDockId === nextDockId) {
      return;
    }

    if (this.hoverDockId) {
      animateDockProximity(this.getDockElement(this.hoverDockId), false);
    }

    this.hoverDockId = nextDockId;

    if (nextDockId) {
      animateDockProximity(this.getDockElement(nextDockId), true);
    }

    this.refreshConnectorGuides();
  }

  private setRejectDock(id: ConnectLinkId | null): void {
    this.desktopLinks.forEach((item) => {
      item.reject = item.id === id;
    });
  }

  private setCardPosition(
    item: ConnectDockItem,
    position: ConnectPoint,
    syncElement: boolean = true,
    smooth: boolean = false
  ): void {
    item.x = position.x;
    item.y = position.y;

    if (!syncElement) {
      return;
    }

    const card = this.getCardElement(item.id);

    if (card) {
      if (smooth) {
        gsap.to(card, {
          x: position.x,
          y: position.y,
          duration: 0.24,
          ease: 'elastic.out(0.95, 0.78)',
          overwrite: true
        });
      } else {
        gsap.set(card, { x: position.x, y: position.y });
      }
    }
  }

  private getItem(id: ConnectLinkId): ConnectDockItem | undefined {
    return this.desktopLinks.find((item) => item.id === id);
  }

  private getCardElement(id: ConnectLinkId): HTMLElement | undefined {
    return this.cardRefs.find((ref) => ref.nativeElement.dataset['id'] === id)?.nativeElement;
  }

  private getDockElement(id: ConnectLinkId): HTMLElement | undefined {
    return this.dockRefs.find((ref) => ref.nativeElement.dataset['id'] === id)?.nativeElement;
  }

  private getCheckElement(id: ConnectLinkId): HTMLElement | undefined {
    return this.checkRefs.find((ref) => ref.nativeElement.dataset['id'] === id)?.nativeElement;
  }

  private getReceiverElement(id: ConnectLinkId): HTMLElement | undefined {
    return this.receiverRefs.find((ref) => ref.nativeElement.dataset['id'] === id)?.nativeElement;
  }

  private refreshConnectorGuides(
    stageRectOverride?: DOMRect,
    activeId: ConnectLinkId | null = this.activeConnectorId
  ): void {
    const stageRect = stageRectOverride ?? this.desktopStage?.nativeElement.getBoundingClientRect();

    if (!this.isDesktopViewport || !stageRect) {
      this.traceGuides = [];
      return;
    }

    this.connectorLayerWidth = stageRect.width;
    this.connectorLayerHeight = stageRect.height;

    const traces: ConnectTraceGuide[] = [];

    this.desktopLinks.forEach((item, index) => {
      const card = this.getCardElement(item.id);
      const receiver = this.getReceiverElement(item.id);

      if (!card || !receiver) {
        return;
      }

      const cardRect = card.getBoundingClientRect();
      const receiverRect = receiver.getBoundingClientRect();
      const start = {
        x: item.x + cardRect.width / 2,
        y: item.y + cardRect.height / 2
      };
      const end = {
        x: receiverRect.left - stageRect.left + receiverRect.width / 2,
        y: receiverRect.top - stageRect.top + receiverRect.height / 2
      };
      const route: CircuitTraceRoute = buildCircuitTracePath(
        start,
        end,
        index,
        this.desktopLinks.length,
        stageRect.width
      );

      traces.push({
        id: item.id,
        path: route.path,
        active: activeId === item.id,
        hovered: this.hoverDockId === item.id || this.hoveredConnectorId === item.id,
        connected: item.connected,
        particleDuration: item.connected
          ? '7.6s'
          : activeId === item.id
            ? '1.35s'
            : this.hoverDockId === item.id || this.hoveredConnectorId === item.id
              ? '2.4s'
              : '4.8s',
        particleDelay: `${(index * 0.62).toFixed(2)}s`
      });
    });

    this.traceGuides = traces;
  }

  private getNearestDock(
    cardRect: DOMRect,
    stageRect: DOMRect,
    position: ConnectPoint,
    currentId: ConnectLinkId
  ): { id: ConnectLinkId; distance: number } | null {
    const cardCenter = getCardCenter(stageRect, position, cardRect);
    let nearest: { id: ConnectLinkId; distance: number } | null = null;

    this.desktopLinks.forEach((item) => {
      const dock = this.getDockElement(item.id);

      if (!dock || (item.connected && item.id !== currentId)) {
        return;
      }

      const distance = distanceBetween(cardCenter, getRectCenter(dock.getBoundingClientRect()));

      if (!nearest || distance < nearest.distance) {
        nearest = { id: item.id, distance };
      }
    });

    return nearest;
  }

  private isPointInsideRect(point: ConnectPoint, rect: DOMRect): boolean {
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
  }

  private isRectOverlappingRect(
    rectA: { left: number; right: number; top: number; bottom: number },
    rectB: { left: number; right: number; top: number; bottom: number }
  ): boolean {
    return !(
      rectA.right < rectB.left ||
      rectA.left > rectB.right ||
      rectA.bottom < rectB.top ||
      rectA.top > rectB.bottom
    );
  }

  private getCardBoundsForPosition(
    stageRect: DOMRect,
    position: ConnectPoint,
    cardRect: DOMRect
  ): { left: number; right: number; top: number; bottom: number } {
    const left = stageRect.left + position.x;
    const top = stageRect.top + position.y;

    return {
      left,
      top,
      right: left + cardRect.width,
      bottom: top + cardRect.height
    };
  }

  private initializeCardPositions(): void {
    const stageRect = this.desktopStage?.nativeElement.getBoundingClientRect();

    if (!stageRect) {
      return;
    }

    const { top: spawnTop, range: spawnRange } = this.getSpawnMetrics(
      stageRect,
      AppConnectComponent.CARD_INITIAL_HEIGHT
    );

    this.desktopLinks.forEach((item) => {
      const initialPosition = {
        x: clamp(
          stageRect.width * item.seedX - AppConnectComponent.CARD_INITIAL_WIDTH / 2,
          0,
          stageRect.width - AppConnectComponent.CARD_INITIAL_WIDTH
        ),
        y: clamp(
          spawnTop + spawnRange * item.seedY,
          12,
          stageRect.height - AppConnectComponent.CARD_INITIAL_HEIGHT
        )
      };

      item.originX = initialPosition.x;
      item.originY = initialPosition.y;
      item.x = initialPosition.x;
      item.y = initialPosition.y;
    });
  }

  private buildDesktopLinks(): ConnectDockItem[] {
    return this.connectLinks.map((link, index) => {
      const id = this.normalizeLinkId(link.label);
      const seed = DEFAULT_CARD_SEEDS[index] ?? this.buildFallbackSeed(index);

      return {
        id,
        label: link.label,
        url: link.url,
        description: this.getLinkDescription(id),
        status: 'Drop card to connect',
        icon: CONNECT_ICONS[id] ?? CONNECT_ICONS['email'],
        seedX: seed.x,
        seedY: seed.y,
        seedRotation: seed.rotation,
        floatDelay: seed.floatDelay,
        x: 0,
        y: 0,
        originX: 0,
        originY: 0,
        connected: false,
        showCheck: false,
        reject: false,
        merged: false
      };
    });
  }

  private normalizeLinkId(label: string): ConnectLinkId {
    return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  private getLinkDescription(id: ConnectLinkId): string {
    const descriptionById: Record<string, string> = {
      linkedin: 'Professional profile',
      github: 'Code and experiments',
      email: 'Start a conversation'
    };

    return descriptionById[id] ?? 'Direct connection';
  }

  private getDockActionLabel(item: ConnectDockItem): string {
    const actionById: Record<string, string> = {
      linkedin: 'Open Profile',
      github: 'View GitHub',
      email: 'Send Email'
    };

    return actionById[item.id] ?? `Open ${item.label}`;
  }

  private animateCompletionSequence(): void {
    if (!this.boardRef) {
      return;
    }

    const dockSurfaces = this.dockRefs
      .map((ref) => ref.nativeElement.querySelector('.connect__dock-surface') as HTMLElement | null)
      .filter((surface): surface is HTMLElement => Boolean(surface));
    const successPanel = this.boardRef.nativeElement.querySelector('.connect__success-panel') as HTMLElement | null;
    const timeline = gsap.timeline();

    if (dockSurfaces.length) {
      timeline.fromTo(
        dockSurfaces,
        {
          minHeight: 118,
          paddingTop: 16,
          paddingBottom: 16,
          y: 0,
          scale: 1
        },
        {
          minHeight: 148,
          paddingTop: 24,
          paddingBottom: 24,
          y: -2,
          scale: 1.01,
          duration: 0.34,
          ease: 'power2.out',
          stagger: 0.08
        }
      );
    }

    if (successPanel) {
      timeline.fromTo(
        successPanel,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: 'power3.out'
        },
        '-=0.06'
      );
    }
  }

  private buildFallbackSeed(index: number): ConnectCardSeedConfig {
    const column = index % 4;
    const row = Math.floor(index / 4);

    return {
      x: 0.14 + column * 0.24,
      y: Math.min(0.16 + row * 0.2, 0.88),
      rotation: ((index % 5) - 2) * 2,
      floatDelay: index * 240
    };
  }

  private getSpawnMetrics(stageRect: DOMRect, cardHeight: number): { top: number; range: number } {
    const floatingRect = this.floatingStageRef?.nativeElement.getBoundingClientRect();

    if (!floatingRect) {
      const fallbackTop = stageRect.height * 0.56;
      const fallbackBottom = stageRect.height - cardHeight - 12;
      return {
        top: clamp(fallbackTop, 12, stageRect.height - cardHeight),
        range: Math.max(0, fallbackBottom - fallbackTop)
      };
    }

    const topPadding = 14;
    const bottomPadding = 18;
    const floatingTop = floatingRect.top - stageRect.top;
    const lowerBandStart = floatingTop + floatingRect.height * 0.45;
    const lowerBandEnd = floatingTop + floatingRect.height - cardHeight - bottomPadding;
    const spawnTop = clamp(
      lowerBandStart + topPadding,
      12,
      stageRect.height - cardHeight
    );
    const spawnBottom = clamp(
      lowerBandEnd,
      spawnTop,
      stageRect.height - cardHeight - 12
    );

    const statusPanelRect = this.statusPanelRef?.nativeElement.getBoundingClientRect();
    const statusSafeBottom = statusPanelRect
      ? statusPanelRect.top - stageRect.top - cardHeight - 16
      : spawnBottom;

    return {
      top: spawnTop,
      range: Math.max(0, Math.min(spawnBottom, statusSafeBottom) - spawnTop)
    };
  }
}

export type ConnectLinkId = string;

export interface ConnectIconPath {
  d: string;
  fillRule?: 'evenodd' | 'nonzero';
  clipRule?: 'evenodd' | 'nonzero';
}

export interface ConnectIconDefinition {
  viewBox: string;
  paths: ConnectIconPath[];
}

export interface ConnectDockItem {
  id: ConnectLinkId;
  label: string;
  url: string;
  description: string;
  status: string;
  icon: ConnectIconDefinition;
  seedX: number;
  seedY: number;
  seedRotation: number;
  floatDelay: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  connected: boolean;
  showCheck: boolean;
  reject: boolean;
  merged: boolean;
}

export interface ConnectPoint {
  x: number;
  y: number;
}

export interface ConnectDragState {
  id: ConnectLinkId;
  pointerId: number;
  offsetX: number;
  offsetY: number;
}

export const CONNECT_ICONS: Record<string, ConnectIconDefinition> = {
  linkedin: {
    viewBox: '0 0 128 128',
    paths: [
      {
        d: 'M29.2 48.73h18.11V107H29.2zm9.06-29a10.5 10.5 0 1 1-10.5 10.49 10.5 10.5 0 0 1 10.5-10.49m20.47 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41 18.34 0 21.74 12.07 21.74 27.72v32H97.09V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H58.73z'
      }
    ]
  },
  github: {
    viewBox: '0 0 128 128',
    paths: [
      {
        d: 'M64 8.12c-31.68 0-57.37 25.67-57.37 57.37 0 25.34 16.43 46.83 39.21 54.41 2.86.53 3.91-1.24 3.91-2.76 0-1.37-.05-5.89-.08-10.69-15.95 3.47-19.31-6.76-19.31-6.76-2.61-6.62-6.37-8.38-6.37-8.38-5.2-3.55.39-3.48.39-3.48 5.76.41 8.8 5.9 8.8 5.9 5.11 8.76 13.4 6.23 16.67 4.77.52-3.7 2-6.23 3.64-7.67-12.72-1.45-26.09-6.36-26.09-28.31 0-6.26 2.24-11.38 5.91-15.4-.59-1.45-2.56-7.27.56-15.17 0 0 4.81-1.54 15.76 5.88C54.2 35.66 59.11 35.02 64 35c4.87.02 9.78.66 14.37 1.93 10.94-7.42 15.74-5.88 15.74-5.88 3.12 7.9 1.16 13.72.57 15.17 3.67 4.02 5.89 9.14 5.89 15.4 0 22-13.4 26.83-26.16 28.24 2.05 1.78 3.88 5.27 3.88 10.61 0 7.66-.06 13.83-.06 15.72 0 1.52 1.03 3.31 3.94 2.75 22.75-7.59 39.16-29.06 39.16-54.39C121.37 33.79 95.69 8.12 64 8.12Z',
        fillRule: 'evenodd',
        clipRule: 'evenodd'
      }
    ]
  },
  email: {
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25Zm1.58.18 7.42 4.79 7.42-4.79a.75.75 0 0 0-.17-.02H4.75a.75.75 0 0 0-.17.02Zm15.42 1.56-7.46 4.82a1 1 0 0 1-1.08 0L4 8.49v8.76c0 .41.34.75.75.75h14.5c.41 0 .75-.34.75-.75Z'
      }
    ]
  }
};

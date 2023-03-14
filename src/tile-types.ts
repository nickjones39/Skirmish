export interface Graphic {
  char: string;
  fg: string;
  bg: string;
}

export interface Tile {
  walkable: boolean;
  transparent: boolean;
  dark: Graphic;
  type: string;
}

export const FLOOR_TILE: Tile = {
  walkable: true,
  transparent: true,
  dark: { char: ' ', fg: '#fff', bg: '#323296' },
  type: 'floor'
};

export const WALL_TILE: Tile = {
  walkable: false,
  transparent: false,
  dark: { char: ' ', fg: '#fff', bg: '#000064' },
  type: 'wall'
};
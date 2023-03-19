import type { Tile } from './tile-types';

export class kDrawModel {
    tile: Tile;
    x: number;
    y: number;
    char: string;
    fg: string;
    bg: string;

    public static oldLevelMap: Array<kDrawModel> = new Array<kDrawModel>;
    public static levelMap: Array<kDrawModel> = new Array<kDrawModel>;
    public static kaboomDraw: boolean = true;

    constructor(tile:Tile, x: number, y:number, char:string, fg:string, bg:string) {
        this.tile = tile;
        this.x = x;
        this.y = y;
        this.char = char;
        this.fg = fg
        this.bg = bg;
    }
};

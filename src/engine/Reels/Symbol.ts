import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import SymbolConfig from "../../config/symbol.json";
import ReelsConfig from "../../config/reels.json";

export class Symbol extends PIXI.Sprite
{
    constructor(x: number, y: number, texture: PIXI.Texture)
    {
        super(texture);

        this.anchor.set(0.5);
        this.width = SymbolConfig.symbolWidth;
        this.height = SymbolConfig.symbolHeight;
        
        this.setPosition(x, y);
    }

    setPosition(x: number, y: number, offsetY?: number): void
    {
        const { columns, rows } = ReelsConfig;
        const { symbolWidth, symbolHeight } = SymbolConfig;
        const middleColumn = (columns + 1) / 2;
        const middleRow = (rows + 1) / 2;

        this.x = (x + 1 - middleColumn) * symbolWidth;
        this.y = (y - middleRow) * symbolHeight + (offsetY ?? 0);
    }

    setTexture(texture: PIXI.Texture): void
    {
        this.texture = texture;
    }

    setMask(mask: PIXI.Graphics): void
    {
        this.mask = mask;
    }

    setTint(colour: number): void
    {
        gsap.to(this, { pixi: { tint: colour }, duration: 0.25 });
    }
}
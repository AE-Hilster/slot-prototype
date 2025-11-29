import * as PIXI from "pixi.js";
import SymbolConfig from "../config/symbol.json";

export class Symbol
{
    private sprite!: PIXI.Sprite;

    constructor(x: number, y: number, texture: PIXI.Texture, app: PIXI.Application<PIXI.Renderer>)
    {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.width = SymbolConfig.symbolWidth;
        this.sprite.height = SymbolConfig.symbolHeight;

        app.stage.addChild(this.sprite);
        
        this.setPosition(x, y);
    }

    setPosition(x: number, y: number, offsetY?: number): void
    {
        this.sprite.x = x * SymbolConfig.symbolWidth + SymbolConfig.symbolWidth / 2;
        this.sprite.y = y * SymbolConfig.symbolHeight + SymbolConfig.symbolHeight / 2 + (offsetY ?? 0);
    }

    setTexture(texture: PIXI.Texture): void
    {
        this.sprite.texture = texture;
    }

    setMask(mask: PIXI.Graphics): void
    {
        this.sprite.mask = mask;
    }
}
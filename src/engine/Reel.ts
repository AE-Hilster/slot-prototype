import * as PIXI from "pixi.js";
import { Symbol } from "./Symbol";
import { Textures } from "./Textures";
import SymbolConfig from "../config/symbol.json";

export class Reel
{
    private reelIndex: number;

    public spinning: boolean = false;
    private spinSpeed: number = 3;

    private landDelay: number = 2.5;
    private landTimer: number = 0;

    private yOffset: number = 0;
    private symbols: Symbol[] = [];
    private mask: PIXI.Graphics;

    private textures!: Textures;

    constructor(reel: number, reelLength: number, textures: Textures, app: PIXI.Application<PIXI.Renderer>)
    {
        this.reelIndex = reel;
        this.textures = textures;

        this.mask = new PIXI.Graphics();
        this.mask.rect(reel * SymbolConfig.symbolWidth, SymbolConfig.symbolHeight, SymbolConfig.symbolWidth, SymbolConfig.symbolHeight * reelLength)
            .fill(0xFFFFFF);
        app.stage.addChild(this.mask);

        for (let y = 0; y <= reelLength; ++y)
        {
            const symbol = new Symbol(reel, y, textures.getTexture(Math.floor(Math.random() * SymbolConfig.symbolFiles.length)), app);
            symbol.setMask(this.mask);
            this.symbols.push(symbol);
        }
    }

    update(delta: number): void
    {
        if (this.spinning)
        {
            const continueSpin = this.landTimer > 0;
            if (continueSpin)
            {
                this.landTimer -= delta;
            }

            this.yOffset += delta * this.spinSpeed;
            if (this.yOffset >= 1)
            {
                if (!continueSpin)
                {
                    this.yOffset = 0;
                    this.spinning = false;
                    this.landTimer = 0;
                }
                else
                {
                    this.yOffset -= 1;
                }

                const resetSymbol = this.symbols.pop()!
                resetSymbol.setTexture(this.textures.getTexture(Math.floor(Math.random() * SymbolConfig.symbolFiles.length)));
                this.symbols.unshift(resetSymbol);
            }

            for (let y = 0; y < this.symbols.length; ++y)
            {
                this.symbols[y].setPosition(this.reelIndex, y, this.yOffset * SymbolConfig.symbolHeight);
            }
        }
    }

    spin(): void
    {
        this.spinning = true;
        this.landTimer = this.landDelay;
    }
}
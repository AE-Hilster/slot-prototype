import * as PIXI from "pixi.js";
import { Symbol } from "./Symbol";
import { Textures } from "../Textures";
import SymbolConfig from "../../config/symbol.json";
import ReelConfig from "../../config/reels.json";

export class Reel extends PIXI.Container
{
    private reelIndex: number;
    private reelLength: number;

    public spinning: boolean = false;
    private spinSpeed: number = 3;

    private landDelay: number = 2.5;
    private landTimer: number = 0;

    private yOffset: number = 0;
    public symbols: Symbol[] = [];
    public mask: PIXI.Graphics;

    private textures!: Textures;

    private result: number[] = [];

    constructor(reel: number, reelLength: number, textures: Textures)
    {
        super();

        this.reelIndex = reel;
        this.reelLength = reelLength;
        this.textures = textures;
        const { symbolFiles } = SymbolConfig;

        this.mask = new PIXI.Graphics();
        this.addChild(this.mask);

        for (let y = 0; y <= reelLength; ++y)
        {
            const symbol = new Symbol(reel, y, textures.getTexture(Math.floor(Math.random() * symbolFiles.length)));
            symbol.setMask(this.mask);
            this.symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    update(delta: number): void
    {
        if (this.spinning)
        {
            const landResult = this.landTimer <= 0;
            const continueSpin = !landResult || (this.result && this.result.length > 0);
            if (!landResult)
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
                const newSymbolIndex = landResult && continueSpin ? this.result.pop()! : Math.floor(Math.random() * SymbolConfig.symbolFiles.length);
                resetSymbol.setTexture(this.textures.getTexture(newSymbolIndex));
                this.symbols.unshift(resetSymbol);
            }

            for (let y = 0; y < this.symbols.length; ++y)
            {
                this.symbols[y].setPosition(this.reelIndex, y, this.yOffset * SymbolConfig.symbolHeight);
            }
        }
    }

    spin(result: number[]): void
    {
        this.spinning = true;
        this.landTimer = this.landDelay;
        this.result = result;
    }

    showWin(row: number): void
    {
        for (let y = 0; y < this.symbols.length; ++y)
        {
            if (y === row + 1)
            {
                this.symbols[y].setTint(0xFFFFFF);
            }
            else
            {
                this.symbols[y].setTint(0x555555);
            }
        }
    }

    resetSymbols(): void
    {
        for (const symbol of this.symbols)
        {
            symbol.setTint(0xFFFFFF);
        }
    }

    updateMaskPosition(): void
    {
        const { columns, rows } = ReelConfig;
        const { symbolWidth, symbolHeight } = SymbolConfig;
        const middleColumn = (columns + 2) / 2;
        const middleRow = rows / 2;

        this.mask.clear();
        this.mask.rect((this.reelIndex + 1 - middleColumn) * symbolWidth, -middleRow * symbolHeight, symbolWidth, symbolHeight * this.reelLength)
            .fill(0xFFFFFF);
    }
}
import * as PIXI from "pixi.js";
import { Symbol } from "./Symbol";
import SymbolConfig from "../../config/symbol.json";
import ReelsConfig from "../../config/reels.json";
import { gameComponents } from "../GameComponents";

export interface ReelSpinStage
{
    name: string;
    duration: number;
    speed: number;
}

export interface ReelConfig
{
    index: number,
    length: number,
    spinStages: ReelSpinStage[]
}

export class Reel extends PIXI.Container
{
    private spinStages: ReelSpinStage[] = [];

    private reelIndex: number;
    private reelLength: number;

    public spinning: boolean = false;
    private spinDelay: number = 0;

    private landDelay: number = 1.5;
    private landTimer: number = 0;

    private yOffset: number = 0;
    public symbols: Symbol[] = [];
    public mask: PIXI.Graphics;

    private result: number[] = [];

    constructor(params: ReelConfig)
    {
        super();

        const { index, length, spinStages } = params;
        const { symbolFiles } = SymbolConfig;
        this.reelIndex = index;
        this.reelLength = length;
        this.spinStages = spinStages;

        this.mask = new PIXI.Graphics();
        this.addChild(this.mask);

        for (let y = 0; y <= length + 1; ++y)
        {
            const symbol = new Symbol(index, y, gameComponents.textures.getTexture(Math.floor(Math.random() * symbolFiles.length)));
            symbol.setMask(this.mask);
            this.symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    update(delta: number): void
    {
        const { spinning, landTimer, landDelay, reelIndex, result, symbols } = this;

        if (spinning)
        {
            const landResult = landTimer <= 0;
            const continueSpin = !landResult || (result && result.length > 0);
            if (!landResult)
            {
                this.landTimer -= delta;
            }

            if (landTimer <= landDelay)
            {
                const spinSpeed = this.getSpinSpeed();
                this.yOffset += delta * spinSpeed;
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
                    resetSymbol.setTexture(gameComponents.textures.getTexture(newSymbolIndex));
                    symbols.unshift(resetSymbol);
                }

                for (let y = 0; y < symbols.length; ++y)
                {
                    symbols[y].setPosition(reelIndex, y, this.yOffset * SymbolConfig.symbolHeight);
                }
            }
        }
    }

    spin(result: number[], delay: number): void
    {
        this.spinning = true;
        this.landTimer = this.landDelay + delay;
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
        const { columns, rows } = ReelsConfig;
        const { symbolWidth, symbolHeight } = SymbolConfig;
        const middleColumn = (columns + 2) / 2;
        const middleRow = rows / 2;

        this.mask.clear();
        this.mask.rect((this.reelIndex + 1 - middleColumn) * symbolWidth, -middleRow * symbolHeight, symbolWidth, symbolHeight * this.reelLength)
            .fill(0xFFFFFF);
    }

    getSpinSpeed(): number
    {
        const { landTimer, landDelay, spinStages, spinDelay } = this;
        const timeSinceStart = landDelay - landTimer;
        const land = timeSinceStart <= 0;

        if (!land)
        {
            let accumulatedTime = spinDelay;
            for (let i = 0; i < spinStages.length; ++i)
            {
                const stage = spinStages[i];
                accumulatedTime += stage.duration;
                if (timeSinceStart <= accumulatedTime)
                {
                    const previousSpeed = i > 0 ? spinStages[i - 1].speed : 0;
                    const previousAccumulatedTime = accumulatedTime - stage.duration;
                    const stageTime = timeSinceStart - previousAccumulatedTime;
                    const t = stageTime / stage.duration;
                    return previousSpeed + (stage.speed - previousSpeed) * t;
                }
            }

        }
        return spinStages[spinStages.length - 1].speed;
    }
}
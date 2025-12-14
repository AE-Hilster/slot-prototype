import * as PIXI from "pixi.js";
import { Reel, ReelSpinStage } from "./Reel";
import { WinLine } from "../Data/WinLine";
import { gameComponents } from "../GameComponents";

export interface ReelsConfig
{
    columns: number,
    rows: number,
    spinOffsets: number[],
    spinStages: ReelSpinStage[]
}

export class Reels extends PIXI.Container
{
    private reels: Reel[] = [];
    private spinOffsets: number[] = [];
    public winlines: WinLine[] = [];

    async initialize(params: ReelsConfig): Promise<void>
    {
        const { columns, rows, spinOffsets, spinStages } = params;
        this.spinOffsets = spinOffsets;

        for (let i = 0; i < columns; ++i)
        {
            const reel = new Reel();
            await reel.initialize({
                index: i,
                length: rows,
                spinStages: spinStages
            });
            this.reels.push(reel);
            this.addChild(reel);
        }

        const { app } = gameComponents;
        app.stage.addChild(this);

        this.updatePosition();
    }

    update(delta: number): void
    {
        const spinning = this.spinning();

        if (spinning)
        {
            for (const reel of this.reels)
            {
                reel.update(delta);
            }
        }
    }

    spin(result: number[][]): void
    {
        const { reels, spinOffsets } = this;
        for (let i = 0; i < reels.length; ++i)
        {
            reels[i].spin(result[i], spinOffsets[i]);
        }
    }

    showWin(winlines: WinLine): void
    {
        for (let i = 0; i < winlines.positions.length; ++i)
        {
            const position = winlines.positions[i];
            const reel = this.reels[position.column];
            reel.showWin(position.row);
        }
    }

    resetSymbols(): void
    {
        for (const reel of this.reels)
        {
            reel.resetSymbols();
        }
    }

    spinning(): boolean
    {
        for (const reel of this.reels)
        {
            if (reel.spinning)
            {
                return true;
            }
        }
        return false;
    }

    updatePosition(): void
    {
        const { app } = gameComponents;
        this.position.set(app.screen.width / 2, app.screen.height / 2);
        
        for (const reel of this.reels)
        {
            reel.updateMaskPosition();
        }
    }
}
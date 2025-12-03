import * as PIXI from "pixi.js";
import { Reel } from "./Reel";
import { Textures } from "../Textures";
import { WinLine } from "../Data/WinLine";
import { gameComponents } from "../GameComponents";

export class Reels extends PIXI.Container
{
    private reels: Reel[] = [];
    public winlines: WinLine[] = [];

    constructor(columns: number, rows: number, textures: Textures)
    {
        super();
        for (let i = 0; i < columns; ++i)
        {
            const reel = new Reel(i, rows, textures);
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
        for (let i = 0; i < this.reels.length; ++i)
        {
            this.reels[i].spin(result[i]);
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
        
        // Update mask position for each reel
        for (const reel of this.reels)
        {
            reel.updateMaskPosition();
        }
    }
}
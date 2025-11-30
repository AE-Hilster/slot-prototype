import * as PIXI from "pixi.js";
import { Reel } from "./Reel";
import { Textures } from "../Textures";
import { WinLine } from "../Data/WinLine";

export class Reels
{
    private reels: Reel[] = [];
    public winlines: WinLine[] = [];

    constructor(x: number, y: number, textures: Textures)
    {
        for (let i = 0; i < x; ++i)
        {
            const reel = new Reel(i, y, textures);
            this.reels.push(reel);
        }
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
}
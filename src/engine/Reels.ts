import * as PIXI from "pixi.js";
import { Reel } from "./Reel";
import { Textures } from "./Textures";

export class Reels
{
    private reels: Reel[] = [];

    constructor(x: number, y: number, textures: Textures, app: PIXI.Application<PIXI.Renderer>)
    {
        for (let i = 0; i < x; ++i)
        {
            const reel = new Reel(i, y, textures, app);
            this.reels.push(reel);
        }
    }

    update(delta: number): void
    {
        for (const reel of this.reels)
        {
            reel.update(delta);
        }
    }

    spin(): void
    {
        for (const reel of this.reels)
        {
            reel.spin();
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
import * as PIXI from "pixi.js";

/**
 * Texture manager
 * Provides centralized loading and access to textures
 */
export class Textures
{
    private textures: PIXI.Texture[] = [];

    constructor()
    {
    }

    async init(files: string[]): Promise<void>
    {
        for(const file of files)
        {
            const tex = await PIXI.Assets.load("assets/sprites/" + file);
            this.textures.push(tex);
        }
    }

    getTexture(index: number): PIXI.Texture
    {
        return this.textures[index];
    }
}
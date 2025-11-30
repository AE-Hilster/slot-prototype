import * as PIXI from "pixi.js";
import { gameComponents } from "../GameComponents";

export class Button
{
    private sprite: PIXI.Sprite;

    constructor(texture: PIXI.Texture)
    {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = gameComponents.app.screen.width / 2 - 50;
        this.sprite.y = gameComponents.app.screen.height - 80;
        this.sprite.anchor.set(0.5);
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.sprite.interactive = true;

        gameComponents.app.stage.addChild(this.sprite);
    }

    onClick(callback: () => void): void
    {
        this.sprite.on("pointerdown", callback);
    }

    visible(state: boolean): void
    {
        this.sprite.visible = state;
        this.sprite.interactive = state;
    }
}
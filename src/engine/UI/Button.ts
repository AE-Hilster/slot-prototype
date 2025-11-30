import * as PIXI from "pixi.js";
import { gameComponents } from "../GameComponents";

export class Button extends PIXI.Sprite
{
    constructor(texture: PIXI.Texture)
    {
        super(texture);
        this.x = gameComponents.app.screen.width / 2;
        this.y = gameComponents.app.screen.height - 80;
        this.anchor.set(0.5);
        this.width = 100;
        this.height = 100;
        this.interactive = true;

        gameComponents.app.stage.addChild(this);
    }

    onClick(callback: () => void): void
    {
        this.on("pointerdown", callback);
    }

    setVisible(state: boolean): void
    {
        this.visible = state;
        this.interactive = state;
    }
}
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import SymbolConfig from "./config/symbol.json";
import GridConfig from "./config/grid.json";
import { Textures } from "./engine/Textures";
import { Button } from "./engine/Button";
import { Reels } from "./engine/Reels";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

(async () => {
    const app = new PIXI.Application();
    await app.init({
        background: 0xb0b0b0,
        resizeTo: window,
        resolution: window.devicePixelRatio,
        hello: true,
    });

    document.body.appendChild(app.canvas as HTMLCanvasElement);

    const textures = new Textures();
    await textures.init(SymbolConfig.symbolFiles);

    const reels = new Reels(GridConfig.columns, GridConfig.rows, textures, app);

    const spinButton = new Button(await PIXI.Assets.load("assets/sprites/spin-button.png"), app);
    spinButton.onClick(() => {
        reels.spin();
        spinButton.visible(false);
    });

    app.ticker.add((delta) => {
        reels.update(delta.deltaTime / 60);

        if (!reels.spinning())
            spinButton.visible(true);
    });

})();

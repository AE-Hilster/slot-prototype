import { Application, Renderer, Text } from "pixi.js";
import { gsap } from "gsap";
import { WinLine } from "../Data/WinLine";
import SymbolConfig from "../../config/symbol.json";
import ReelsConfig from "../../config/reels.json";
import { gameComponents } from "../GameComponents";

export class WinLineText
{
    private text!: Text;
    constructor()
    {
        const x = ReelsConfig.columns * SymbolConfig.symbolWidth / 2;
        this.text = new Text({
            text: '',
            style: {
                fontFamily: 'Arial',
                fontSize: 180,
                fill: '#ffffff',
                stroke: { color: '#000000', width: 6}
            },
            zIndex: 1,
            x: x,
            y: 0,
            anchor: { x: 0.5, y: 0.5 },
          });
          gameComponents.app.stage.addChild(this.text);

          this.hide();
    }

    hide(): void
    {
        this.text.visible = false;
    }

    show(winline: WinLine): void
    {
        this.text.text = winline.payout.toString();
        this.text.y = this.getYPosition(winline);
        this.text.visible = true;
        gsap.to(this.text.scale, { x: 1.2, y: 1.2, duration: ReelsConfig.winLength / 2, yoyo: true, repeat: 1 });
    }

    private getYPosition(winLine: WinLine): number
    {
        let lowestRow = 5, highestRow = 0;
        for (let i = 0; i < winLine.positions.length; ++i)
        {
            const pos = winLine.positions[i];
            if (pos.row < lowestRow)
                lowestRow = pos.row;
            if (pos.row > highestRow)
                highestRow = pos.row;
        }
        const middleRow = (lowestRow + highestRow) / 2;
        return middleRow * SymbolConfig.symbolHeight + SymbolConfig.symbolHeight * 1.5;
    }
}
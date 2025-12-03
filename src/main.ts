import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import SymbolConfig from "./config/symbol.json";
import ReelsConfig from "./config/reels.json";
import { Textures } from "./engine/Textures";
import { Button } from "./engine/UI/Button";
import { Reels } from "./engine/Reels/Reels";
import { Result } from "./engine/Data/Result";
import { WinLineText } from "./engine/UI/WinLineText";
import { gameComponents } from "./engine/GameComponents";
import { changeGameState, gameState, GameState } from "./engine/GameState";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

const debug = false;

// Dynamically load all result files
async function loadAllResults(): Promise<Result[]> {
    const results: Result[] = [];
    let resultIndex = 1;
    
    while (true) {
        try {
            const response = await fetch(`assets/results/result-${resultIndex}.json`);
            if (!response.ok) {
                // No more result files found
                break;
            }
            const result = await response.json();
            results.push(result);
            ++resultIndex;
        } catch (error) {
            // No more result files found
            break;
        }
    }
    
    if (debug) console.log(`Loaded ${results.length} result files:`, results);
    
    return results;
}

function update(deltaTime: number): void
{
    const { reels, winLineText } = gameComponents;

    switch (gameState)
    {
        case GameState.IDLE:
            break;
        case GameState.SPINNING:
            if (!reels.spinning())
            {
                const result = gameComponents.getActiveResult();
                changeGameState(result && result.winlines.length > 0 ? GameState.SHOWING_WINS : GameState.IDLE);
            }
            else
            {
                reels.update(deltaTime);
            }
            break;
        case GameState.SHOWING_WINS:
            if (gameComponents.playNextWinLine(deltaTime))
            {
                const winLine = gameComponents.getWinLine();
                winLineText.show(winLine);
                reels.showWin(winLine);
            }
            break;
        default:
            break;
    }
}

/**
 * Application start
 */
(async () => {
    const app = new PIXI.Application();
    await app.init({
        background: 0xb0b0b0,
        resizeTo: window,
        resolution: window.devicePixelRatio,
        hello: true,
    });

    document.body.appendChild(app.canvas as HTMLCanvasElement);

    gameComponents.initialize(app);

    const results = await loadAllResults();
    gameComponents.setResults(results);
  
    const winLineText = new WinLineText();
    gameComponents.setWinLineText(winLineText);

    const textures = new Textures();
    await textures.init(SymbolConfig.symbolFiles);
    gameComponents.setTextures(textures);

    const reels = new Reels(ReelsConfig.columns, ReelsConfig.rows, textures);
    gameComponents.setReels(reels);
    reels.addChild(winLineText);

    const spinButton = new Button(await PIXI.Assets.load("assets/sprites/spin-button.png"));
    gameComponents.setSpinButton(spinButton);
    
    spinButton.onClick(() => {
        changeGameState(GameState.SPINNING);
    });

    window.addEventListener('resize', () => {
        gameComponents.resizeComponents();
    });

    changeGameState(GameState.IDLE);

    app.ticker.add((delta) => {
        update(delta.deltaTime / 60);
    });

})();

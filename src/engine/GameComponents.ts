import * as PIXI from "pixi.js";
import { Reels } from "./Reels/Reels";
import { WinLineText } from "./UI/WinLineText";
import { Textures } from "./Textures";
import { Button } from "./UI/Button";
import { Result } from "./Data/Result";
import { WinLine } from "./Data/WinLine";
import ReelsConfig from "../config/reels.json";

/**
 * Global component manager
 * Provides centralized access to game objects
 */
class GameComponents {
    public app!: PIXI.Application<PIXI.Renderer>;
    public textures!: Textures;
    public reels!: Reels;
    public winLineText!: WinLineText;
    public spinButton!: Button;
    public results: Result[] = [];
    
    // Game state
    public activeResult: number = -1;
    public playWinTimer: number = 0;
    public winIndex: number = -1;

    public initialize(app: PIXI.Application<PIXI.Renderer>): void
    {
        this.app = app;
    }

    public setReels(reels: Reels): void
    {
        this.reels = reels;
    }

    public setWinLineText(winLineText: WinLineText): void
    {
        this.winLineText = winLineText;
    }

    public setTextures(textures: Textures): void
    {
        this.textures = textures;
    }

    public setSpinButton(spinButton: Button): void
    {
        this.spinButton = spinButton;
    }

    public setResults(results: Result[]): void
    {
        this.results = results;
    }

    public getActiveResult(): Result | null
    {
        if (this.activeResult >= 0 && this.activeResult < this.results.length) {
            return this.results[this.activeResult];
        }
        return null;
    }

    public setActiveResult(index: number): void
    {
        this.activeResult = index;
    }

    public setRandomActiveResult(): void
    {
        this.activeResult = Math.floor(Math.random() * this.results.length);
    }

    public playNextWinLine(deltaTime: number): boolean
    {
        this.playWinTimer += deltaTime;
        if (this.playWinTimer >= ReelsConfig.winLength || this.winIndex === -1) {
            this.playWinTimer = 0;

            const result = this.getActiveResult()!;
            if (result.winlines.length - 1 == this.winIndex)
                this.winIndex = 0;
            else
                ++this.winIndex;

            return true;
        }
        return false;
    }

    public getWinLine(): WinLine
    {
        const result = this.getActiveResult()!;
        return result.winlines[this.winIndex];
    }

    public resizeComponents(): void
    {
        this.reels.updatePosition();
        this.spinButton.updatePosition();
    }
}

// Export a singleton instance
export const gameComponents = new GameComponents();
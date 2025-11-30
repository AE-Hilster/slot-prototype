import { gameComponents } from "./GameComponents";

/**
 * Global game state
 * Manages changes to and from states
 */

export enum GameState
{
    LOADING,
    IDLE,
    SPINNING,
    SHOWING_WINS
}

export let gameState: GameState = GameState.LOADING;

export function changeGameState(newState: GameState): void
{
    const { reels, winLineText, spinButton } = gameComponents;

    switch (gameState)
    {
        case GameState.LOADING:
            switch(newState)
            {
                case GameState.IDLE:
                    break;
                default:
                    return;
            }
            break;
        case GameState.IDLE:
            switch(newState)
            {
                case GameState.SPINNING:
                    spinReels();
                    break;
                default:
                    return;
            }
            break;
        case GameState.SPINNING:
            switch(newState)
            {
                case GameState.SHOWING_WINS:
                case GameState.IDLE:
                    spinButton.visible(true);
                    break;
                default:
                    return;
            }
            break;
        case GameState.SHOWING_WINS:
            switch(newState)
            {
                case GameState.SPINNING:
                    spinReels();
                case GameState.IDLE:
                    winLineText.hide();
                    reels.resetSymbols();
                    break;
                default:
                    return;
            }
            break;
        default:
            return;
    }

    gameState = newState;
}

function spinReels(): void
{
    const { results, reels, spinButton } = gameComponents;

    gameComponents.setRandomActiveResult();
    reels.spin(convertResultGridToReelGrids(results[gameComponents.activeResult].grid));
    spinButton.visible(false);
    gameComponents.winIndex = -1;
}

function convertResultGridToReelGrids(resultGrid: number[][]): number[][]
{
    const reelGrids: number[][] = [];

    for (let col = 0; col < resultGrid[0].length; col++)
    {
        reelGrids[col] = [];
        for (let row = 0; row < resultGrid.length; row++)
        {
            reelGrids[col].push(resultGrid[row][col]);
        }
    }

    return reelGrids;
}
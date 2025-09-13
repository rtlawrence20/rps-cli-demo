import {animRPS, animDisp} from "./anim.js" // Import animation/visual display logic
import readline from "readline";
import gameState from "./state.js";
import { updateStats,getOutcome, resetGame } from "./gameLogic.js"; 
const { stdout, stdin } = process; // Destructure standard input/output
const WIDTH = process.stdout.columns;
const HEIGHT = process.stdout.rows;
const MAIN_MENU_OPTIONS = ['Start Game', 'See Stats', 'Reset', 'Exit'];
const SUB_MENU_OPTIONS = ['rock', 'paper', 'scissors'];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms)); //used for pausing execution during async visual effects

/**
 * === Entry Point ===
 * Cleanup and prepare for menu object, setup listener and display window.
 * @param {object} gameState 
 */
export function showMainMenu(gameState) {
    prepareInteractiveMenu()
    animDisp.drawCyberMenuTopLeft(MAIN_MENU_OPTIONS);
    handleMainMenuKeys(MAIN_MENU_OPTIONS);
}
/**
 * Cleanup and prepare for submenu object, setup listener and display active game.
 * @param {object} gameState 
 */
function showSubMenuStart(gameState) {
    prepareInteractiveMenu()
    animDisp.drawCyberMenuTopLeft(SUB_MENU_OPTIONS);
    handleSubMenuKeys(SUB_MENU_OPTIONS);
}

/**
 * Helper to setup termninal for interactive input
 */
function prepareInteractiveMenu() {
    stdin.removeAllListeners('keypress'); // Avoid duplicate listeners
    readline.emitKeypressEvents(stdin); // Enable keypress events
    if (!stdin.isRaw) stdin.setRawMode(true);
    animDisp.selected = 0; //reset state to top of menu
    animDisp.clearScreen();
}

/**
 * Shared menu handler provides keypress listener with up/down nav of menu, enter for select
 * @param {string} options 
 * @param {function} onSelect 
 */
function handleMenuKeys(options, onSelect) {
    function onKeyPress(_, key) {
        if (key.name === 'up') {
            animDisp.selected = (animDisp.selected - 1 + animDisp.cyberOptions.length) % animDisp.cyberOptions.length; //modulo to enable looping
        } else if (key.name === 'down') {
            animDisp.selected = (animDisp.selected + 1) % animDisp.cyberOptions.length; //modulo to enable looping
        } else if (key.name === 'return') {
            const selectedOption = options[animDisp.selected];
            stdin.removeListener('keypress', onKeyPress); // Avoid duplicate listeners
            onSelect(selectedOption); // Call appropriate handler
            return;
        } else if (key.ctrl && key.name === 'c') {
            process.exit(); // Exit on Ctrl+C
        }
        // Redraw menu to reflect updated selection
        animDisp.clearScreen();
        animDisp.drawCyberMenuTopLeft(options);
    }
    stdin.on('keypress', onKeyPress);
}

/**
 * Wrapper for main menu handler.
 * @param {array} rawOptions the menu items before conversion to cyberText
 */
function handleMainMenuKeys(rawOptions) {
    handleMenuKeys(rawOptions, handleMenuSelection);
}

/**
 * Wrapper for submenu handler.
 * @param {array} rawOptions the menu items before conversion to cyberText
 */
function handleSubMenuKeys(rawOptions) {
    handleMenuKeys(rawOptions, handleSubMenuSelection);
}

/**
 * Handles logic when a main menu item is selected
 * @param {string} selectedOption 
 */
function handleMenuSelection(selectedOption) {
    const menuActions = {
        'start game': () => showSubMenuStart(gameState),
        'see stats': () => showStats(gameState),
        'reset': () => handleResetGame(gameState),
        'exit': () => exitGame(gameState),
    };
    const choice = selectedOption.toLowerCase();
    const action = menuActions[choice];
    if (action) {
        action();
    } else {
        console.log(`Unknown option: ${choice}`);
        process.exit(1);
    }
}

/**
 * Handles logic when a submenu item is selected
 * @param {string} selectedOption 
 */
function handleSubMenuSelection(selectedOption) {
    const choice = selectedOption.toLowerCase();
    const [userChoice, computerChoice, outcome] = getOutcome(choice); // Destructure results
    displayOutcome(userChoice, computerChoice, outcome);
}

/**
 * Render game outcome animation
 * @param {string} userChoice 
 * @param {string} computerChoice 
 * @param {string} outcome 
 */
async function displayOutcome(userChoice, computerChoice, outcome){
    animDisp.clearScreen();
    await sleep(500);
    animDisp.drawCyberMidLeft(animRPS.player[`${userChoice}`], HEIGHT);
    await sleep(1000);
    animDisp.drawCyberMidRight(animRPS.computer[`${computerChoice}`], HEIGHT, WIDTH);
    updateStats(outcome, gameState);
    await sleep(1000);
    animDisp.drawCyberMenuTopLeft([outcome]);
    waitForAnyKey(); // Prompt to continue
}

/**
 * Helper prompts user to hit any key to return to main menu
 */
function waitForAnyKey() {
    stdout.write(`\n\n  \x1b[36mHit any key to continue...\x1b[0m\n`); // Display the message
    stdin.removeAllListeners("keypress"); // Remove previous key handlers to avoid conflicts
    stdin.once("keypress", () => { // Wait for a single keypress, then go back to main menu
        showMainMenu(gameState); 
    });
}

/**
 * Display current win/loss/tie stats
 * @param {object} gameState 
 */
function showStats(gameState) {
    const stats = gameState.stats;
    const statsArray = [
        `Wins: ${stats.wins}`,
        `Losses: ${stats.losses}`,
        `Ties: ${stats.ties}`
    ];
    prepareInteractiveMenu()
    animDisp.drawCyberMenuTopLeft(statsArray);
    waitForAnyKey();
}

/**
 * Displays reset of game stats and handles passing off reset logic
 * @param {object} gameState 
 */
function handleResetGame(gameState){
    resetGame(gameState);
    const rawMessage = ['All stats have been reset'];
    animDisp.clearScreen();
    animDisp.drawCyberMenuTopLeft(rawMessage);
    waitForAnyKey();
}

/**
 * Handle game exit with message and proper cleanup
 */
function exitGame() {
    prepareInteractiveMenu()
    const rawMessage = ['Thank for playing!'];
    animDisp.drawCyberMenuTopLeft(rawMessage);
    stdout.write(`\n\n  \x1b[36mHit any key to continue...\x1b[0m\n`);
    stdin.removeAllListeners("keypress");
    stdin.once("keypress", () => {
        animDisp.clearScreen();
        animDisp.showCursor();
        stdin.setRawMode(false);
        stdin.pause();
        process.exit(0);
    });
}
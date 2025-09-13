/**
 * Update gameState when a game has concluded
 * @param {string} outcome 
 * @param {object} gameState 
 */
export function updateStats(outcome, gameState) {
    const statMap = { win: 'wins', lose: 'losses', tie: 'ties'};
    const key = statMap[outcome] || 'ties'; // Default to 'ties' if unexpected result
    gameState.stats[key] += 1;
}

/**
 * Determine who won a game and report choices and outcome
 * @param {string} userChoice 
 * @returns [userChoice, computerChoice, outcome]
 */
export function getOutcome(userChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const outcomes = {
        rock:     { rock: "tie",  paper: "lose", scissors: "win" },
        paper:    { rock: "win",  paper: "tie",  scissors: "lose"},
        scissors: { rock: "lose", paper: "win",  scissors: "tie" },
    };
    return [userChoice, computerChoice, outcomes[userChoice][computerChoice]];
}

export function resetGame(gameState) {
    gameState.stats = { wins: 0, losses: 0, ties: 0 };
}
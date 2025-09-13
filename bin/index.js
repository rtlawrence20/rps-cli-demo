#!/usr/bin/env node
import gameState from "../src/lib/state.js";
import { showMainMenu } from "../src/lib/menu.js";

async function main() {
  showMainMenu(gameState);
}

showMainMenu();


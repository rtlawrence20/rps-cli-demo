const { stdout, stdin } = process;

/**
 * WiP container to hold all ascii art
 * @typedef {object} animRPS
 * @property {object} player
 * @property {object} computer
 * @property {object} cyberFont
 */
export const animRPS = {
    player: {
        rock: [
            "      _______             ",
            "---'    _____)            ",
            "      (______)            ",
            "      (______)            ",
            "      (_____)             ",
            "---.__(____)              "
        ],
        paper: [
            "     _______              ",
            "---'   _____)________     ",
            "          ____________)   ",
            "          ______________) ",
            "         _____________)   ",
            "---._____________)        "
        ],
        scissors: [
            "     _______              ",
            "---'    ____)________     ",
            "          ____________)   ",
            "          ______________) ",
            "        (_____)           ",
            "---.__(____)              "
        ]
    },
    computer: {
        rock: [
            "            _______      ",
            "           (_____    '---",
            "           (______)      ",
            "           (______)      ",
            "            (_____)      ",
            "             (____)__.---"
        ],
        paper: [
            "            _______      ",
            "    ______(_____     '---",
            "  (____________          ",
            "(______________          ",
            "  (_____________         ",
            "       (_____________.---"
        ],
        scissors: [
            "             _______     ",
            "  __________(___     '---",
            "(____________            ",
            "  (___________           ",
            "          (_____)        ",
            "             (____)__.---"
        ]
    },
    cyberFont: {
        A: ["____", "|__|", "|  |"],
        B: ["___ ", "|__]", "|__]"],
        C: ["____", "|   ", "|___"],
        D: ["___ ", "|  \\", "|__/"],
        E: ["___ ", "|__ ", "|___"],
        F: ["___ ", "|__ ", "|   "],
        G: ["____", "| __", "|__]"],
        H: ["_  _", "|__|", "|  |"],
        I: ["___ ", " |  ", "_|_ "],
        J: ["  _ ", "  | ", "|_| "],
        K: ["_  _", "|_/ ", "| \\_"],
        L: ["_   ", "|   ", "|___"],
        M: ["_  _", "|\\/|", "|  |"],
        N: ["_  _", "|\\ |", "| \\|"],
        O: ["____", "|  |", "|__|"],
        P: ["___ ", "|__]", "|   "],
        Q: ["____", "|  |", "|_\\|"],
        R: ["___ ", "|__]", "|  \\"],
        S: ["____", "[__ ", "___]"],
        T: ["___", " | ", " | "],
        U: ["_  _", "|  |", "|__|"],
        V: ["_  _", "|  |", " \\/ "],
        W: ["_ _ _", "| | |", "|_|_|"],
        X: ["_  _", " \\/ ", "_/\\_"],
        Y: ["_   _", " \\_/ ", "  |  "],
        Z: ["___ ", "  / ", " /__"],
        " ": ["    ", "    ", "    "],
        "0": [
            "  ___  ",
            " / _ \\ ",
            "| (_) |",
            " \\___/ "
        ],
        "1": [
            "  __  ",
            " /_ | ",
            "  | | ",
            "  |_| "
            ],
        "2": [
            " ___  ",
            "|_  ) ",
            " / /  ",
            "/___| "
        ],
        "3": [
            " ____  ",
            "|__ /  ",
            " |_ \\  ",
            "|___/  "
        ],
        "4": [
            " _ _   ",
            "| | |  ",
            "|_  _| ",
            "  |_|  "
        ],
        "5": [
            " ___  ",
            "| __| ",
            "|__ \\ ",
            "|___/ "
        ],
        "6": [
            "  __   ",
            " / /   ",
            "| _ \\  ",
            "|___/  "
        ],
        "7": [
            " ____  ",
            "|__  | ",
            "  / /  ",
            " /_/   "
        ],
        "8": [
            " ___  ",
            "( _ ) ",
            "/ _ \\ ",
            "\\___/ "
        ],
        "9": [
            " ___  ",
            "/ _ \\ ",
            "\\_, / ",
            " /_/  "
        ]
            },
    toCyberFont: function (text) {
        const upper = text.toUpperCase();
        let maxHeight = 0;
        for (const char of upper) {
            const lines = this.cyberFont[char] || this.cyberFont[" "];
            maxHeight = Math.max(maxHeight, lines.length); // Determine max height used in this text
        }
        const cyberText = Array(maxHeight).fill(""); // Initialize output with correct height
        for (const char of upper) {
            const letter = this.cyberFont[char] || this.cyberFont[" "];
            const padded = [...letter]; // Pad this character if needed
            while (padded.length < maxHeight) {
                padded.push(" ".repeat(letter[0]?.length || 5)); // pad to width of char
            }
            for (let i = 0; i < maxHeight; i++) { // Add each line to the final output
                cyberText[i] += padded[i] + " ";
            }
        }
        return cyberText;
    }
}

/**
 * WiP of container object capable of drawing cyberText
 * @typedef {object} animDisp
 * @property {number} selected 
 * @property {array} cyberOptions
 */
export const animDisp = {
    selected: 0,
    cyberOptions: [],
    colors: {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        bright: "\x1b[1m",
    },
    showCursor: function () {
        process.stdout.write('\x1b[?25h');
        process.stdout.write('\x1b[0m'); // Show cursor on exit
    },
    clearScreen: function () {
        process.stdout.write('\x1b[2J'); // Clear screen
        process.stdout.write('\x1b[3J'); // Clear scrollback buffer (not always supported)
        process.stdout.write('\x1b[?25l'); // Hide cursor
    },
    getBoundingRect: function (strings) { //determine rectangle that will bound array
        if (!Array.isArray(strings) || strings.length === 0) {
            return { width: 0, height: 0 };
        }
        const width = strings.reduce((max, str) => Math.max(max, str.length), 0);
        const height = strings.length;
        return { width, height };
    },
    drawCyberMenuTopLeft: function (menu) {
        this.cyberOptions = menu.map(text => animRPS.toCyberFont(text));
        let currentY = 1;
        const currentX = 1;
        for (let i = 0; i < this.cyberOptions.length; i++) {
            const prefix = i === this.selected ? '> ' : '  ';
            const fontLines = this.cyberOptions[i];
            for (let j = 0; j < fontLines.length; j++) {
                stdout.write(`\x1b[${currentY + j};${currentX}H${prefix}${fontLines[j]}`);
            }
            currentY += 4; // extra space between items
        }
    },
    drawCyberMidLeft: function (menu, height) {
        let currentY = Math.ceil(height/2 - height/4);
        const menuWidth = Math.max(...menu.map(line => line.length));
        let currentX = Math.floor(0 + menuWidth + (menuWidth)/5); // add some padding (5)
        for (let i = 0; i < menu.length; i++) {
            stdout.write(`\x1b[${currentY + i};${currentX}H${menu[i]}`);
        }
    },
    drawCyberMidRight: function (menu, height, width) {
        let currentY = Math.ceil(height/2 - height/4);
        const menuWidth = Math.max(...menu.map(line => line.length));
        let currentX = Math.floor(width - menuWidth - (width - menuWidth)/5); // add some padding (5)
        for (let i = 0; i < menu.length; i++) {
            stdout.write(`\x1b[${currentY + i};${currentX}H${menu[i]}`);
        }
    },
    drawChar: function (x, y, char, colorCode) {
    process.stdout.write(`\x1b[${y};${x}H\x1b[${colorCode}m${char}\x1b[0m`);
    }
}


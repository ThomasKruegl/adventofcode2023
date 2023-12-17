import { Part } from '../index.js';
import callPart from '../util/callPart.js';
import readInputFile from '../util/readInputfile.js';

export async function run(part: Part) {
    return callPart(part, part1, part2);
}

const gameColors = ['blue', 'red', 'green'] as const;
type GameColor = typeof gameColors[number];

type Reveal = Map<GameColor, number>;

type GameDetails = {
    gameNumber: number;
    reveals: Reveal[];
}

async function part1() {
    const sumOfPossibleGameNumbers = await reduceLines(addGameIfPossible);
    console.log('Sum of possible game numbers: ', sumOfPossibleGameNumbers);
}

async function part2() {
    const sumOfPowers = await reduceLines(addGamePower);
    console.log('Sum of game powers: ', sumOfPowers);
}

async function reduceLines(reducer: (line: string, value: number) => number, initialValue = 0) {
    const fileHandle = await readInputFile(2);
    let value = initialValue;
    for await (const line of fileHandle.readLines()) {
        value = reducer(line, value);
    }
    return value;
}

function addGameIfPossible(line: string, previousResult: number) {
    const { gameNumber, reveals } = getGameDetails(line);
    const isGamePossible = reveals.every(isRevealPossible);
    if (isGamePossible) {
        return previousResult + gameNumber;
    } else {
        return previousResult;
    }
}

function isRevealPossible(reveal: Reveal) {
    const bag = new Map([['red', 12], ['green', 13], ['blue', 14]]);
    return Array.from(reveal.entries()).every(([color, count]) => {
        const maxCubes = bag.get(color) || 0;
        return count <= maxCubes;
    })
}

function addGamePower(line: string, previousResult: number) {
    function getMaximumValues(bag1: Reveal, bag2: Reveal): Reveal {
        return new Map(gameColors.map(color => {
            return [color, Math.max(bag1.get(color) || 0, bag2.get(color) || 0)]
        }));
    }
    const { reveals } = getGameDetails(line);
    const startBag: Reveal = new Map([['red', 0], ['green', 0], ['blue', 0]]);
    const minimumBag = reveals.reduce( getMaximumValues, startBag);
    const gamePower = Array.from(minimumBag.values()).reduce((count, power) => power * count, 1);
    console.log(gamePower);
    return previousResult + gamePower;
}

function getGameDetails(line: string): GameDetails {
    const gameRegex = /Game\s(\d+):\s(.+)/;
    const matchResult = line.match(gameRegex);
    if (matchResult) {
        const gameNumber = +matchResult[1];
        const gameContent = matchResult[2];
        const reveals = gameContent.split('; ');
        return { gameNumber, reveals: reveals.map(revealsStringToMap) };
    } else {
        throw new Error('Unexpected input: ' + line);
    }
}

/**
 * expected string format: "n <color>, n <color>, n <color>, ..."
 * @param reveal
 */
function revealsStringToMap(reveal: string): Reveal {
    const draws = reveal.split(', ');
    return new Map(draws.map(draw => {
        const [count, color] = draw.split(' ');
        if (isGameColor(color)) {
            return [color, +count];
        } else {
            throw new Error("Unexpected color: " + color);
        }
    }));
}


function isGameColor(maybeGamecolor: unknown): maybeGamecolor is GameColor {
    return typeof maybeGamecolor === 'string' && gameColors.includes(maybeGamecolor as GameColor);
}

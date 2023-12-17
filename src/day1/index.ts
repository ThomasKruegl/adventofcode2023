import { Part } from '../index.js';
import callPart from '../util/callPart.js';
import readInputFile from '../util/readInputfile.js';

export async function run(part: Part) {
    return callPart(part, part1, part2)
}

async function part1() {
    const fileHandle = await readInputFile(1);
    let calibrationSum = 0;
    for await (const line of fileHandle.readLines()) {
        const digitsOnly = line.replace(/[^0-9]/g, '');
        const calibrationNumber = digitsOnly[0] + digitsOnly[digitsOnly.length - 1];
        calibrationSum += +calibrationNumber;
    }

    console.log(calibrationSum);
}

async function part2() {
    const regexFirstOccurrence = /(one|two|three|four|five|six|seven|eight|nine|[1-9])/;
    const regexLastOccurrence = /.*(one|two|three|four|five|six|seven|eight|nine|[1-9])/;

    const fileHandle = await readInputFile(1);

    let calibrationSum = 0;

    for await (const line of fileHandle.readLines()) {
        const firstDigitMatch = line.match(regexFirstOccurrence);
        const lastDigitMatch = line.match(regexLastOccurrence);
        if (firstDigitMatch && lastDigitMatch) {
            const calibrationNumber = toDigitString(firstDigitMatch[0]) + toDigitString(lastDigitMatch[1]);
            calibrationSum += +calibrationNumber;
        }
    }

    console.log(calibrationSum);
}

function toDigitString(n: string): string {
    switch (n) {
        case 'one':
            return '1';
        case 'two':
            return '2';
        case 'three':
            return '3';
        case 'four':
            return '4';
        case 'five':
            return '5';
        case 'six':
            return '6';
        case 'seven':
            return '7';
        case 'eight':
            return '8';
        case 'nine':
            return '9';
        default:
            return n;
    }
}

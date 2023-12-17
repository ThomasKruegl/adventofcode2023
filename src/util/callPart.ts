import { Part } from '../index.js';

export default function callPart(part: Part, fn1: () => void, fn2: () => void,) {
    if (part === 1) {
        return fn1();
    } else {
        return fn2();
    }
}

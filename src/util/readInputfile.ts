import * as fs from 'fs/promises';
import path from 'path';

export default async function readInputFile(day: number): Promise<fs.FileHandle> {
    return fs.open(path.resolve('dist', 'day' + day, 'input.txt'));
}

import * as fs from 'fs';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

export async function read(dir: string) : Promise<object> {
    let data = await readFile(dir);
    return JSON.parse(data.toString());
}

export function readSync(dir: string) : object {
    let data = fs.readFileSync(dir);
    return JSON.parse(data.toString());
}
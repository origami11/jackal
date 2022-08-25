//
import { makeRandomDeck } from './deck.mjs';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

fs.writeFileSync(path.join(__dirname, '../data/games/sample/deck.json'), JSON.stringify(makeRandomDeck(11, 11)));

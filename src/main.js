import {run as loadData} from './data-loader.js';
import {getConverter} from './converter.js';
import {solve} from './solver.js';

// const playerIds = [1, 2, 15, 16];
const playerIds = [15,42,88,34,89,87,62,33];

const {ratings, lastMatchDates} = await loadData(playerIds);
// console.log(lastMatchData);

const converter = getConverter({ratings, lastMatchDates}, {
   canPlayFormula: (player1, player2) => Math.abs(player1.rating - player2.rating) < 200, 
   evaluateFormula: ({ratingsDeltaNorm, lastMatchDateNorm}) => 2 * ratingsDeltaNorm + lastMatchDateNorm
}); 
// console.log(converter.canPlay(1, 15));
// console.log(converter.getWeight(2, 16));

console.log(solve(converter.getWeight, converter.canPlay, playerIds));


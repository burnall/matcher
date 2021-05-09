import {run as loadData} from './data-loader.js';
import {getConverter} from './converter.js';
import {solve} from './solver.js';

// const playerIds = [1, 2, 15, 16];
// const playerIds = [15, 42, 88, 34, 89, 87, 62, 33];
// console.log(await execute(playerIds));

export async function execute(playerIds, nBest) {
    const {ratings, lastMatchDates} = await loadData(playerIds);
    if (ratings.size !== playerIds.length) {
        throw new Error(`Some players have no ratings. Ratings: ${mapToString(ratings)}, player IDs: ${playerIds}`);
    }

    const converter = getConverter({ratings, lastMatchDates}, {
        canPlayFormula: (player1, player2) => Math.abs(player1.rating - player2.rating) < 200,
        evaluateFormula: ({ratingsDeltaNorm, lastMatchDateNorm}) => 2 * ratingsDeltaNorm + lastMatchDateNorm
    });
    return solve(converter.getWeight, converter.canPlay, playerIds, nBest)
        .map(({cost, comb}) => ({cost, comb: sortCombinations(comb, ratings)}));
}

function mapToString(m) {
    const pairs = [...m.keys()]
        .map(key => `${key}: ${m.get(key)}`)
        .join(', ');
    return `{${pairs}}`;
}

function sortCombinations(sol, ratings) {
    return sol && sol
        .sort(([id1, id2], [id3, id4]) => ratings.get(id3) + ratings.get(id4) - ratings.get(id1) - ratings.get(id2));
}
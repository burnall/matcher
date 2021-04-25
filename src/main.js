import {run as loadData} from './data-loader.js';
import {getConverter} from './converter.js';
import {solve} from './solver.js';

// const playerIds = [1, 2, 15, 16];
// const playerIds = [15, 42, 88, 34, 89, 87, 62, 33];
// console.log(await execute(playerIds));

export async function execute(playerIds) {
    const {ratings, lastMatchDates} = await loadData(playerIds);
    if (ratings.size !== playerIds.length) {
        throw `Some players have no ratings. Ratings: ${mapToString(ratings)}, player IDs: ${playerIds}`;
    }

    const converter = getConverter({ratings, lastMatchDates}, {
        canPlayFormula: (player1, player2) => Math.abs(player1.rating - player2.rating) < 200,
        evaluateFormula: ({ratingsDeltaNorm, lastMatchDateNorm}) => 2 * ratingsDeltaNorm + lastMatchDateNorm
    });
    // console.log(converter.canPlay(1, 15));
    // console.log(converter.getWeight(2, 16));
    const {min, best} = solve(converter.getWeight, converter.canPlay, playerIds);

    // Sort by the total rating of the pair, descendent
    const sortedBest = best && best
        .sort(([id1, id2], [id3, id4]) => ratings.get(id3) + ratings.get(id4) - ratings.get(id1) - ratings.get(id2));
    return {
        min,
        best: sortedBest,
    };
}

function mapToString(m) {
    const pairs = [...m.keys()]
        .map(key => `${key}: ${m.get(key)}`)
        .join(', ');
    return `{${pairs}}`;
}

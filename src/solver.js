/**
 * @param getWeight {function} (playerId1, playerId2) -> number
 * @param canPlay {function} (playerId1, playerId2) -> boolean
 * @param playerIds {array}
 *
 * @return solution, minimizing weights
 */
import {PrioQueue} from "./prio-queue.js";

export function solve(getWeight, canPlay, playerIds, nBest) {
    const combs = perms(playerIds);
    const evaluateComb = evaluate.bind(null, getWeight, canPlay);
    const prioQueue = combs.reduce(
        (prioQ, comb) => {
            prioQ.add({cost: evaluateComb(comb), comb: comb});
            return prioQ;
        },
        new PrioQueue(nBest, elem => elem.cost));

    return prioQueue.get();
}

function perms(xs) {
	if (xs.length === 2) {
	    return [[xs]];
	}

	const elem = xs.pop();
	return xs.flatMap((x, i) => {
        const ys = [...xs];
        ys.splice(i, 1);
        return perms(ys).map(zs => {
        	zs.push([elem, xs[i]]);
        	return zs;
        });
	});
}

function evaluate(getWeight, canPlay, comb) {
    let weight = 0;
    for (let i = 0; i < comb.length; i++) {
        const [id1, id2] = comb[i];
        if (!canPlay(id1, id2)) {
            return Infinity;
        }
        weight += getWeight(id1, id2);
    }
    return weight;
}

/**
 * @param getWeight {function} (playerId1, playerId2) -> number  
 * @param canPlay {function} (playerId1, playerId2) -> boolean
 * @param playerIds {array}
 *
 * @return solution, minimizing weights
 */
export function solve(getWeight, canPlay, playerIds) {
    const combs = perms(playerIds);
    return combs.reduce(
        ({min, best}, comb) => {
            const v = evaluate(getWeight, canPlay, comb);
            console.log(comb, v);
            return v < min ? {min: v, best: comb} : {min, best};
        },
        {min: Infinity});
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
    for (let i = 0; i < comb.length / 2; i++) {
        const [id1, id2] = comb[i];
        if (!canPlay(id1, id2)) {
            return Infinity;
        }
        weight += getWeight(id1, id2);
    }
    return weight;
}

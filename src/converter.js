const MAX_DAYS = 50;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MAX_MS = MAX_DAYS * MS_PER_DAY;

export function getConverter({ratings, lastMatchDates}, {canPlayFormula, evaluateFormula}) {
    const ratingRange = getRange(ratings);
    return {
        canPlay: (playerId1, playerId2) => canPlayFormula({rating: ratings.get(playerId1)}, {rating: ratings.get(playerId2)}),
        getWeight: (playerId1, playerId2) => {
            const ratingsDeltaNorm = Math.abs(ratings.get(playerId1) - ratings.get(playerId2)) / ratingRange;
            const lastMatchDateNorm = evaluateLastMatchDateNorm(playerId1, playerId2, lastMatchDates);
            return evaluateFormula({ratingsDeltaNorm, lastMatchDateNorm}); 
        },
    };
}

function getRange(ratings) {
    const sorted = Array.from(ratings.values()).sort((a, b) => a - b);
    return sorted[sorted.length - 1] - sorted[0];
}

function evaluateLastMatchDateNorm(playerId1, playerId2, lastMatches) {
    console.log(playerId1, playerId2);
    const msSince = Date.now() - lastMatches.get(playerId1).get(playerId2);
    return msSince > MAX_MS ? 0 : (1 - msSince / MAX_MS);  
}

import mysql from 'mysql2/promise';

const options = {
    host: 'localhost',
    user: 'root',
    database: 'stegen',
};

export async function run(playerIds) {
    const conn = await mysql.createConnection(options);
    const ratings = await getRatings(conn, playerIds);
    const lastMatchDates = await getLastMatchDates(conn, playerIds);
    await conn.end();
    return {ratings, lastMatchDates};
}  

async function getRatings(conn, playerIds) {
    let [rows] = await conn.query('select max(id) as maxId from Ranking');
    const maxId = rows[0]['maxId'];
    [rows] = await conn.query(`select idPlayer, score 
                               from RankingPos 
                               where idPlayer IN (?) and idRanking=?`, [playerIds, maxId]);
    return rows.reduce(
        (res, row) => {
            res.set(row['idPlayer'], row['score'])
            return res;
        },
        new Map());
}

async function getLastMatchDates(conn, playerIds) {
    let [rows] = await conn.query(`select idPlayer1, idPlayer2, max(date) as lastDate 
                                   from Matchs 
                                   where idPlayer1 in (?) and idPlayer2 in (?) 
                                   group by idPlayer1, idPlayer2`, [playerIds, playerIds]); 

    return rows.reduce(
        (res, row) => {
            const {idPlayer1, idPlayer2, lastDate} = row;
            const d = Date.parse(lastDate);
            const v = res.get(idPlayer1).get(idPlayer2);
            if (d > v) {
                res.get(idPlayer1).set(idPlayer2, d);
                res.get(idPlayer2).set(idPlayer1, d);
            }
            return res;
        },
        getDefaultMap(playerIds));
}

function getDefaultMap(playerIds) {
    const m = new Map();
    for (const i of playerIds) {
        const m2 = new Map();
        m.set(i, m2);
        for (const j of playerIds) {
            if (i !== j) {
                 m2.set(j, 0); 
            }
        }
    }  
    return m;
}

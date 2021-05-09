import polka from 'polka';
import sendType from '@polka/send-type';
import bodyParser from 'body-parser';
import {execute} from './main.js';

polka()
    .use(bodyParser.json())
    .post('/match', matchHandler)
    .listen(3000, err => {
        if (err) {
            throw err;
        }
        console.log(`> Running on localhost:3000`);
    });

async function matchHandler(req, res) {
    try {
        const ts = Date.now();
        const solutions = await execute(req.body.playerIds, req.body.nBest || 1);
        console.log(`Solved in ${Date.now() - ts} ms`);
        res.end(JSON.stringify(solutions));
    } catch (e) {
        console.log(e);
        sendType(res, 400, {error: e.message});
    }
}

// http POST "http://localhost:3000/match" playerIds:='[14,17,42,47,57,75,77,81,97,98,99,101,102,107]' nBest:=3

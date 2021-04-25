import polka from 'polka';
import sendType from '@polka/send-type';
import bodyParser from 'body-parser';
import {execute} from './main.js';

polka()
    .use(bodyParser.json())
    .post('/match', async (req, res) => {
        try {
            const solution = await execute(req.body.playerIds);
            res.end(JSON.stringify(solution));
        } catch (e) {
            sendType(res, 400, {error: e});
        }
    })
    .listen(3000, err => {
        if (err) throw err;
        console.log(`> Running on localhost:3000`);
    });
import polka from 'polka';
import bodyParser from 'body-parser';
import {execute} from './main.js';

polka()
    .use(bodyParser.json())
    .post('/test', async (req, res) => {
        const solution = await execute(req.body.playerIds);
        res.end(JSON.stringify(solution));
    })
    .listen(3000, err => {
        if (err) throw err;
        console.log(`> Running on localhost:3000`);
    });
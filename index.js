import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";

import OttContentsDAO from './dao/ottContentsDAO.js';
import PlaylistsDAO from './dao/playlistsDAO.js';

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(process.env.MOVIE_MERAKI_DB_URI);

    const port = process.env.PORT || 8000;

    try {

        await client.connect();

        await OttContentsDAO.injectDB(client);
        await PlaylistsDAO.injectDB(client);

        app.listen(port, () => {
            console.log("Sever is running at port - " + port);
        })

    } catch (e) {

        console.error(e);
        process.exit(1);

    }
}

main().catch(console.error);
import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;
import OttContentsDAO from './ottContentsDAO.js'

let playlists;

export default class PlaylistsDAO {

    static async injectDB(conn) {

        if (playlists) {
            return;
        }

        try {
            playlists = await conn.db(process.env.MOVIEMERAKI_NS).collection('playlists');
        } catch (e) {
            console.error(`Unable to connect in OttContentsDAO: ${e}`);
        }

    }

    static async getOttContents({
        filters = null,
        page = 0,
        contentsPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters['name'] } };
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } };
            }
        }

        let cursor;
        try {
            cursor = await ottContents.find(query).limit(contentsPerPage).skip(contentsPerPage * page);
            const contentsList = await cursor.toArray();
            const totalNum = await ottContents.countDocuments(query);
            return { contentsList, totalNum };
        } catch (e) {
            console.error(`Unable to issue find command for ottcontents, ${e}`);
            return { contentsList: [], totalNum: 0 };
        }
    }

    static async getPlaylistsById(id) {
        try {
            return await playlists.aggregate([
                {
                    $match: {
                        playlistId: id,
                    }
                }]).next();
        } catch (e) {
            console.error(`Something went wrong in getPlaylistsById: ${e}`);
            throw e;
        }
    }


    static async fetchPlaylistsByList(listOfIds) {
        try {

            let cursor = await playlists.find(
                {
                    playlistId: { $in: listOfIds }
                }
            );
            const result = await cursor.toArray();

            return result;

        } catch (e) {
            console.log(`Unable to fetch Playlists by List: ${e}`);
            throw e;
        }
    }

    static async fetchMyPlaylists(userId) {
        try {

            let cursor = await playlists.find(
                {
                    userId: userId
                }
            );
            const result = await cursor.toArray();

            return result;

        } catch (e) {
            console.log(`Unable to fetch Playlists by List: ${e}`);
            throw e;
        }
    }

    static async deletePlaylist(playlistId, userId) {

        try {

            const deleteFilter = {
                userId: userId,
                playlistId: playlistId
            };

            return await playlists
                .deleteOne(deleteFilter);


        } catch (e) {
            console.error(`Unable to delete playlist: ${e}`);
            return { error: e };
        }

    }

    static async updateFavorites(userId, playlistId, contents) {

        try {

            const updateResponse = await playlists.updateOne(
                {
                    userId: userId,
                    playlistId: playlistId,
                },
                { $set: { contents: contents } },
                { upsert: true });
            return updateResponse;

        } catch (e) {
            console.log(`Unable to update contents: ${e}`);
            return { error: e };
        }

    }

    static async getTopPlaylists() {
        try {
            return await playlists.aggregate([
                {
                    $sort: {
                        likes: -1
                    }
                }]).toArray();
        } catch (e) {
            console.error(`Something went wrong in getTopPlaylists: ${e}`);
            throw e;
        }
    }

    static async createPlaylist(playlistName, playlistDescription, userId) {
        try {

            let countPlaylists = await playlists.countDocuments();
            countPlaylists = countPlaylists + 1;

            const createDoc = {
                userId: userId,
                playlistName: playlistName,
                playlistDescription: playlistDescription,
                playlistId: countPlaylists,
                likes: 0,
                contentsArray: []
            };

            const result = await playlists.insertOne(createDoc);

            return result;

        } catch (e) {
            console.error(`Something went wrong in getTopPlaylists: ${e}`);
            throw e;
        }
    }

    static async addToPlaylist(playlistId, contentId, userId) {
        try {

            let cursor = await playlists.find(
                {
                    playlistId: playlistId
                }
            );
            const result = await cursor.next();
            let contentsArray = result.contentsArray;

            if (!contentsArray.includes(contentId)) {
                contentsArray.push(contentId);

                const updateResponse = await playlists.updateOne(
                    {
                        playlistId: playlistId,
                    },
                    { $set: { contentsArray: contentsArray } },
                    { upsert: true });

            }

            return true;

        } catch (e) {
            console.error(`Something went wrong in add to playlist: ${e}`);
            throw e;
        }
    }

    static async getPlaylistContents(playlistId) {
        try {

            let cursor = await playlists.find(
                {
                    playlistId: Number(playlistId)
                }
            );
            const result = await cursor.next();
            let contentsArray = result.contentsArray;

            if (contentsArray) {

                let resultArray = await OttContentsDAO.fetchContentsByList(contentsArray);

                let resp = {
                    playlistName: result.playlistName,
                    list: resultArray
                }

                return resp;

            } else {
                return [];
            }

        } catch (e) {
            console.error(`Something went wrong in get Playlists Content: ${e}`);
            throw e;
        }
    }

    static async deleteFromPlaylist(playlistId, contentId, userId) {
        try {

            let cursor = await playlists.find(
                {
                    playlistId: playlistId
                }
            );
            const result = await cursor.next();
            let contentsArray = result.contentsArray;

            if (contentsArray.includes(contentId)) {

                let filtered = contentsArray.filter(function(el) { return el!= contentId; }); 

                const updateResponse = await playlists.updateOne(
                    {
                        playlistId: playlistId,
                    },
                    { $set: { contentsArray: filtered } },
                    { upsert: true });

            }

            return true;

        } catch (e) {
            console.error(`Something went wrong in add to playlist: ${e}`);
            throw e;
        }
    }




};
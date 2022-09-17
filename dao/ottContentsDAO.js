import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let ottContents;

export default class OttContentsDAO {

    static async injectDB(conn) {

        if (ottContents) {
            return;
        }

        try {
            ottContents = await conn.db(process.env.MOVIEMERAKI_NS).collection('ott_contents');
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

    static async getContentById(id) {
        try {
            return await ottContents.aggregate([
                {
                    $match: {
                        id: id,
                    }
                }]).next();
        } catch (e) {
            console.error(`Something went wrong in getOttContentById: ${e}`);
            throw e;
        }
    }


    static async fetchContentsByList(listOfIds){
        try {

            let cursor = await ottContents.find(
                { 
                    id: { $in: listOfIds } }
            );
            const result = await cursor.toArray();

            return result;

        } catch (e) {
            console.log(`Unable to fetch Contents by List: ${e}`);
            throw e;
        }
    }

};
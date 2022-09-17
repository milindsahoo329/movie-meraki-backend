import OttContentsDAO from "../dao/ottContentsDAO.js";


export default class OttContentsController {


    static async apiGetOttContents(req, res, next) {

        const contentsPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {};
        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.name) {
            filters.name = req.query.name;
        }

        const { contentsList, totalNum } = await OttContentsDAO.getOttContents({ filters, page, contentsPerPage });

        let response = {
            contents: contentsList,
            page: page,
            filters: filters,
            entries_per_page: contentsPerPage,
            total_results: totalNum
        };

        res.json(response);

    }

    static async apiGetContentById(req, res, next) {

        try {

            let id = req.params.id || {};
            let content = await OttContentsDAO.getContentById(id);

            if (!content) {
                content = {};
            }

            res.json(content);

        } catch (e) {
            console.log(`Content by ID API, ${e}`);
            res.status(500).json({ error: e });
        }

    }

    static async apiContentsByList(req, res, next) {

        try {

            let listOfIds = req.body.idList;
            let contentsList = await OttContentsDAO.fetchContentsByList(listOfIds);

            res.json(contentsList);

        } catch (e) {

            console.log(`Fetch contents by list API, ${e}`);
            res.status(500).json({ error: e.message });

        }

    }

}

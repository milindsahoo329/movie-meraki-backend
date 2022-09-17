import PlaylistsDAO from "../dao/playlistsDAO.js";


export default class PlaylistsController {

    static async apiGetPlaylistById(req, res, next) {

        try {

            let id = req.params.id || {};
            let playlist = await PlaylistsDAO.getPlaylistsById(id);

            if (!playlist) {
                content = {};
            }

            res.json(playlist);

        } catch (e) {
            console.log(`Playlist by ID API, ${e}`);
            res.status(500).json({ error: e });
        }

    }

    static async apiPlaylistsByList(req, res, next) {

        try {

            let listOfIds = req.body.idList;
            let playlistsList = await PlaylistsDAO.fetchPlaylistsByList(listOfIds);

            res.json(playlistsList);

        } catch (e) {

            console.log(`Fetch playlists by list API, ${e}`);
            res.status(500).json({ error: e.message });

        }

    }

    static async apiMyPlaylists(req, res, next) {

        try {

            let userId = req.body.userId;
            let playlistsList = await PlaylistsDAO.fetchMyPlaylists(userId);

            res.json(playlistsList);

        } catch (e) {

            console.log(`Fetch my playlists, ${e}`);
            res.status(500).json({ error: e.message });

        }

    }

    static async apiDeletePlaylist(req, res, next) {

        try {

            const playlistId = req.body.playlistId;
            const userId = req.body.userId;


            const playlistResponse = await PlaylistsDAO.deletePlaylist(
                playlistId,
                userId
            );

            var { error } = playlistResponse;
            // console.log(error);

            if (error) {
                res.status(500).json({ error: "Unable to delete the review." });
            } else {
                res.json({ status: "success" });
            }


        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }

    static async apiUpdatePlaylistsContents(req, res, next) {

        try {

            const PlaylistsResponse = await PlaylistsDAO.updateFavorites(
                req.body.userId,
                req.body.playlistId,
                req.body.contents);

            var { error } = PlaylistsResponse;

            if (error) {
                res.status(500).json({ error });
            }

            res.json({ status: "success" });

        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }

    static async apiGetTopPlaylists(req, res, next) {

        try {

            let id = req.params.id || {};
            let playlist = await PlaylistsDAO.getTopPlaylists();

            if (!playlist) {
                content = {};
            }

            res.json(playlist);

        } catch (e) {
            console.log(`Playlist by ID API, ${e}`);
            res.status(500).json({ error: e });
        }

    }

    static async apiCreatePlaylist(req, res, next) {

        try {

            const playlistName = req.body.playlistName;
            const playlistDescription = req.body.playlistDescription;
            const userId = req.body.userId;


            const playlistResponse = await PlaylistsDAO.createPlaylist(
                playlistName,
                playlistDescription,
                userId
            );

            var { error } = playlistResponse;
            // console.log(error);

            if (error) {
                res.status(500).json({ error: "Unable to create playlist" });
            } else {
                res.json({ status: "success" });
            }


        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }

    static async apiAddToPlaylist(req, res, next) {

        try {

            const playlistId = req.body.playlistId;
            const contentId = req.body.contentId;
            const userId = req.body.userId;

            const playlistResponse = await PlaylistsDAO.addToPlaylist(
                playlistId,
                contentId,
                userId
            );

            var { error } = playlistResponse;
            // console.log(error);

            if (error) {
                res.status(500).json({ error: "Unable to add to playlist" });
            } else {
                res.json({ status: "success" });
            }


        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }

    static async apiGetPlaylistContents(req, res, next) {

        try {

            let id = req.params.id || {};

            let playlist = await PlaylistsDAO.getPlaylistContents(id);

            if (!playlist) {
                content = [];
            }

            res.json(playlist);

        } catch (e) {
            console.log(`Playlist by ID API, ${e}`);
            res.status(500).json({ error: e });
        }

    }

    static async apiDeleteFromPlaylist(req, res, next) {

        try {

            const playlistId = req.body.playlistId;
            const contentId = req.body.contentId;
            const userId = req.body.userId;

            const playlistResponse = await PlaylistsDAO.deleteFromPlaylist(
                playlistId,
                contentId,
                userId
            );

            var { error } = playlistResponse;
            // console.log(error);

            if (error) {
                res.status(500).json({ error: "Unable to delete from playlist" });
            } else {
                res.json({ status: "success" });
            }


        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }




}

import express from "express";

import OttContentsController from "./ottcontents.controller.js";
import PlaylistsController from "./playlists.controller.js";

const router = express.Router();

router.route("/").get(OttContentsController.apiGetOttContents);
router.route("/id/:id").get(OttContentsController.apiGetContentById);
router.route("/list").post(OttContentsController.apiContentsByList);

router.route("/playlists/id/:id").get(PlaylistsController.apiGetPlaylistById);
router.route("/playlists/list").post(PlaylistsController.apiPlaylistsByList);
router.route("/playlists").delete(PlaylistsController.apiDeletePlaylist);
router.route("/playlists").put(PlaylistsController.apiUpdatePlaylistsContents);
router.route("/topplaylists").get(PlaylistsController.apiGetTopPlaylists);
router.route("/myplaylists").post(PlaylistsController.apiMyPlaylists);
router.route("/createplaylist").post(PlaylistsController.apiCreatePlaylist);

router.route("/playlist/add").post(PlaylistsController.apiAddToPlaylist);
router.route("/playlist/delete").post(PlaylistsController.apiDeleteFromPlaylist);

router.route("/playlistcontent/:id").get(PlaylistsController.apiGetPlaylistContents);

export default router;
import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {

    static async apiPostReview(req, res, next) {

        try {

            const movieId = req.body.movie_id;
            const review = req.body.review;

            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };

            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date
            );

            var {error}  = reviewResponse;
            // console.log(error);

            if (error) {
                res.status(500).json({error: "Unable to post a review."});
            } else {
                res.json({status: "success"});
            }


        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }

    static async apiUpdateReview(req, res, next) {

        try {

            const reviewId = req.body.review_id;
            const review = req.body.review;

            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };

            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                userInfo._id,
                review,
                date
            );

            var {error}  = reviewResponse;
            // console.log(error);

            if (error) {
                res.status(500).json({error: "Unable to update the review."});
            } else {
                if(reviewResponse.modifiedCount >= 1){
                    res.json({status: "success"});
                } else {
                    // There is no record that was updated
                    res.status(500).json({status: "No record found to be updated"});
                }
                
            }


        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }

    static async apiDeleteReview(req, res, next) {

        try {

            const reviewId = req.body.review_id;
            const userId = req.body.user_id;


            const reviewResponse = await ReviewsDAO.deletReview(
                reviewId,
                userId
            );

            var {error}  = reviewResponse;
            // console.log(error);

            if (error) {
                res.status(500).json({error: "Unable to delete the review."});
            } else {
                res.json({status: "success"});
            }


        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    }

}
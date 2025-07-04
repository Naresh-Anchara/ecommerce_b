const express = require('express');
const Reviews = require('./reviews.model');
const Products = require('../products/products.model');
const router = express.Router();


//post a new review
router.post("/post-review",async (req,res)=>{
    try {
        const {comment,rating,productId,userId} = req.body;
        
        if(!comment || !rating || !productId || !userId){
            return res.status(400).send({ message: "All fields are required" });
          }
          const existingReview = await Reviews.findOne({productId,userId});

          if(existingReview){
            //update the review
            existingReview.comment = comment;
            existingReview.rating = rating;
            await existingReview.save();
          }else{
            //create a new review
            const newReview = new Reviews({
                comment,rating,productId,userId
            })
            await newReview.save();
          }
          //calculate the average rating
          const reviews = await Reviews.find({productId});
          if(reviews.length > 0){
            let totalRating = 0;

            for (let i = 0; i < reviews.length; i++) {
               totalRating += reviews[i].rating;
            }

            const averageRating = totalRating / reviews.length;
            const product = await Products.findById(productId);
             if(product){
                product.rating = averageRating;
                await product.save({validateBeforeSave : false});
             }
             else{
               return res.status(404).send({ 
                    message: "product is not found",
                }); 
             }
          }
          res.status(200).send({ 
            message: "review  processed successfully",
            reviews:reviews
        });
    } catch (error) {
        console.error("Error posting the review", error);
        res.status(500).send({ message: "Failed to post the review"});
    }
})

// get all review with count
router.get("/total-review",async (req,res)=>{
  try {
       const totalReviews = await Reviews.countDocuments({});
        res.status(200).send({totalReviews});
  } catch (error) {
      console.error("Error getting in total review", error);
      res.status(500).send({ message: "Failed to get review count"});
  }
});

//get review by userid
router.get("/:userId",async (req,res)=>{
      const {userId} = req.params;
      console.log(userId);
       if(!userId){
       return res.status(400).send({ message: "User id is not found"});
       }
  try {
       const reviews = await Reviews.find({userId:userId}).sort({createAt:-1});
       if(reviews.length === 0){
        return res.status(404).send({ message: "No review found"});
       }
        res.status(200).send({reviews});
  } catch (error) {
      console.error("Error fetching review by user", error);
      res.status(500).send({ message: "Failed to fetch review by user"});
  }
});

module.exports = router;
const {Review} = require("../../../models");


const approveReviews = async (req, res) => {
    const  { isApproved } = req.body
console.log(typeof(isApproved),'hey')
console.log(isApproved, 'hujhakjd')
    try {
        const review = await Review.findByIdAndUpdate(req.params.id,  { isApproved: isApproved }, { new: true, runValidators: true });
        if (!review) {
            return res.status(404).send({success: false, message: "Review not found"});
        }
        res.status(200).send({success: true, message: "review approved",data:review});
    } catch (error) {
        res.status(400).send({success: false, message: error.message});
    }
}

module.exports = approveReviews
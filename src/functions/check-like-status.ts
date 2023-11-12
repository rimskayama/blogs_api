export const checkLikeStatus = async (likeStatus: string) => {

    if (!(likeStatus === "None" || likeStatus === "Like" || likeStatus === "Dislike"))

        return Promise.reject("like status must be in correct format");

};
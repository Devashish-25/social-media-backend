const { Posts, Comments, Users } = require("../db");
const { upload } = require('./helper')

const getPosts = async (data) =>{
    try{
        const { page, limit} = data;
        const posts = await Posts.find({}, {seen: 0}).skip((page-1)*limit).limit(limit);
        const response = [];
        for(let i=0; i<posts.length; i++){
            const post = posts[i];
            const user = await Users.findOne({username: post.author}, {profileImg: 1, username: 1});
            response.push({user, post});
        }
        return { status: 200, posts: response};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const likePost = async (req) =>{
    try{
        const {postId, hostId} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.likes.push(hostId);
        await post.save();
        return { status: 200, message: "Post Liked!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const unlikePost = async (req) =>{
    try{
        const {postId, hostId} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.likes = post.likes.filter((value) =>{
            return value!=hostId;
        })
        await post.save();
        return { status: 200, message: "Post unLiked!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}



const addPost = async (req) =>{
    try{
        const response = await upload(req);
        const post = new Posts({
            author: req.body.username,
            date: new Date(),
            likes: [],
            seen: [],
            comments: [],
            url: response.fileLocation,
            caption: req.body.caption
        })
        
        await post.save();
        return { status: 200, message: "Post Added!"};
    }
    catch(err){
        console.log(err);
        return { status: 500, message: "Something went wrong!" };
    }
}

const deletePost = async (req) =>{
    try{
        const {postId} = req.body;
        await Posts.deleteOne({_id: postId});
        await Comments.deleteMany({postId: postId});
        return { status: 200, message: "Post Deleted!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const seenPost = async (req) =>{
    try{
        const {userId, postId} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.seen.push(userId);
        await post.save();
        return { status: 200, message: "Post Seen!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const editPost = async (req) =>{
    try{
        const {postId, data} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.caption = data;
        await post.save();
        return { status: 200, message: "Post Edited!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

module.exports = {
    getPosts,
    likePost,
    unlikePost,
    addPost,
    deletePost,
    seenPost,
    editPost
}


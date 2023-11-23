import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons";
import { Rating } from "@mui/material";
import CommentSection from "../CommentSection";
import useUser from "../../hooks/useUser";
import toast from "react-hot-toast";
import "./ViewPost.css";

const ViewPost = () => {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [rating, setRating] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("postID", postID)
        .single();
      if (error) {
        console.error("Error fetching post: ", error);
      } else {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [postID]);

  const handleLike = async () => {
    if (!user) {
      toast("Log in to like this post", { icon: "❗️" });
      return;
    }
    const { error } = await supabase
      .from("posts")
      .update({ likeCount: post.likeCount + 1 })
      .eq("postID", postID);
    if (error) {
      console.error("Error updating post: ", error);
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        likeCount: prevPost.likeCount + 1,
      }));
      setIsLiked((prevIsLiked) => !prevIsLiked);
    }
  };

  const toggleComments = () => {
    setShowComments((prevShowComments) => !prevShowComments);
  };

  const formattedDescription = post?.description
    .split("\n")
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : post ? (
        <div className="container view-post">
          <h2 className="view-post-title">{post.title}</h2>
          {post.imgUrl ? (
            <img
              src={post.imgUrl}
              alt={post.imgUrl}
              className="view-post-image"
            />
          ) : (
            <img
              src="/post-placeholder-image.jpeg"
              alt="image-placeholder"
              className="view-post-image"
            />
          )}
          {post.description ? (
            <p className="view-post-desc">{formattedDescription}</p>
          ) : (
            ""
          )}
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <div className="like-container">
            <p className="like-title">Like this post:</p>
            <IconContext.Provider
              value={{
                color: "red",
                className: `like-icon ${isLiked ? "liked" : ""}`,
              }}
            >
              <AiFillHeart className="like-icon" onClick={handleLike} />
            </IconContext.Provider>
            <p>{post.likeCount}</p>
          </div>
          <button onClick={toggleComments}>
            {showComments ? "Hide Comments" : "Comments"}
          </button>
          {showComments && <CommentSection postID={postID} />}
        </div>
      ) : (
        <p>Post not found</p>
      )}
    </div>
  );
};

export default ViewPost;

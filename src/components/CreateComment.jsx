import { useState } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";
import "./CreateComment.css";

const CreateComment = ({ postID, fetchComments }) => {
  const [commentText, setCommentText] = useState("");
  const { user } = useUser();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const { error } = await supabase
      .from("comments")
      .insert([{ commentText, postID, userID: user.id }]);
    if (error) {
      console.error("Error creating comment: ", error);
    } else {
      setCommentText("");
      fetchComments();
    }
  };

  return user ? (
    <form onSubmit={handleCommentSubmit} className="createCommentForm">
      <textarea
        value={commentText}
        placeholder="Leave a comment..."
        onChange={(e) => setCommentText(e.target.value)}
        required
        className="createCommentTextarea"
      />
      <button type="submit" className="createCommentButton">
        Post Comment
      </button>
    </form>
  ) : (
    <h3>Sign in to comment</h3>
  );
};

export default CreateComment;

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import CreateComment from "./CreateComment";
import "./CommentSection.css";

const CommentSection = ({ postID }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, [postID]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select()
      .eq("postID", postID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments: ", error);
    } else {
      setComments(data);
    }
  }

  return (
    <div className="comment-section">
      <CreateComment postID={postID} fetchComments={fetchComments} />
      {comments.length > 0 ? (
        comments.map((comment) => (
          <p key={comment.commentID} className="comment">
            {comment.commentText}
          </p>
        ))
      ) : (
        <p>No comments</p>
      )}
    </div>
  );
};

export default CommentSection;

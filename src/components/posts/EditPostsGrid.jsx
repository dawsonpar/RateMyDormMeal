import React, { useEffect, useState, Suspense } from "react";
const Post = React.lazy(() => import("./Post"));
import { supabase } from "../../supabaseClient";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import "./EditPostsGrid.css";

const EditPostsGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      if (user) {
        setLoading(true);

        const result = await supabase
          .from("posts")
          .select()
          .eq("userID", user.id)
          .order("created_at", { ascending: false });
        let data = result.data;

        setPosts(data);
        setLoading(false);
      }
    }

    fetchPosts();
  }, [user]);

  return (
    <div className="posts">
      {loading ? (
        <p>Loading...</p>
      ) : posts && posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <Suspense key={post.postID} fallback={<div>Loading post...</div>}>
              <div className="edit-post">
                <Post
                  key={post.postID}
                  postID={post.postID}
                  title={post.title}
                  imgUrl={post.imgUrl}
                  created={post.created_at}
                  likeCount={post.likeCount}
                />
                <button
                  className="edit-button"
                  onClick={() => {
                    navigate("/edit/" + post.postID);
                  }}
                >
                  Edit Post
                </button>
              </div>
            </Suspense>
          ))}
        </div>
      ) : (
        <p className="no-posts">No posts to display</p>
      )}
    </div>
  );
};

export default EditPostsGrid;

import React, { useEffect, useState, Suspense } from "react";
import PropTypes from "prop-types";
const Post = React.lazy(() => import("./Post"));
import { supabase } from "../../supabaseClient";
import useUser from "../../hooks/useUser";
import SearchBar from "../SearchBar";
import "./PostsGrid.css";

const PostsGrid = ({ filter }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      let data;

      if (filter === "newest") {
        const result = await supabase
          .from("posts")
          .select()
          .order("created_at", { ascending: false });
        data = result.data;
      } else if (filter === "popular") {
        const result = await supabase
          .from("posts")
          .select()
          .order("likeCount", { ascending: false });
        data = result.data;
      } else {
        const result = await supabase.from("posts").select();
        data = result.data;
      }
      setPosts(data);
      setLoading(false);
    }

    fetchPosts();
  }, [filter, user]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <div className="posts">
        {loading ? (
          <p>Loading...</p>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <Suspense key={post.postID} fallback={<div>Loading post...</div>}>
                <Post
                  key={post.postID}
                  postID={post.postID}
                  title={post.title}
                  imgUrl={post.imgUrl}
                  created={post.created_at}
                  likeCount={post.likeCount}
                />
              </Suspense>
            ))}
          </div>
        ) : (
          <p>No posts to display</p>
        )}
      </div>
    </>
  );
};

PostsGrid.propTypes = {
  filter: PropTypes.string,
};

export default PostsGrid;

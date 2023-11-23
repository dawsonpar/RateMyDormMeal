import CreatePost from "../components/posts/CreatePost";
import "./Share.css";

const Share = () => {
  return (
    <div className="container share-page">
      <h2>Create a New Post</h2>
      <CreatePost />
    </div>
  );
};

export default Share;

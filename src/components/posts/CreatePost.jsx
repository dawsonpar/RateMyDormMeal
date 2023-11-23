import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { supabase } from "../../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const { user } = useUser();
  const [file, setFile] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({
    title: "",
    description: "",
    userID: user ? user.id : "",
    imgUrl: "",
  });
  const storageFilepath =
    "https://lajoxhbsjunpcklscmpu.supabase.co/storage/v1/object/public/PostImages/";
  const navigate = useNavigate();

  useEffect(() => {
    setPost((prevPost) => ({
      ...prevPost,
      userID: user ? user.id : "",
    }));
  }, [user]);

  const deleteIMG = async () => {
    const imgUrlSegments = imgUrl.split("/");
    const imgFilePath = imgUrlSegments.slice(-2).join("/");

    await supabase.storage.from("PostImages").remove([`${imgFilePath}`]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleFileSelected = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleImgSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (imgUrl) {
      await deleteIMG();
    }

    const { data, error } = await supabase.storage
      .from("PostImages")
      .upload(user.id + "/" + uuidv4(), file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error("Error: ", error);
    } else {
      setImgUrl(storageFilepath + data.path);
    }

    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!post.title.trim()) {
      toast.error("Title is required");

      console.log("Title is required");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .insert([
        {
          userID: post.userID,
          title: post.title,
          description: post.description,
          imgUrl: imgUrl,
        },
      ])
      .select();
    if (error) {
      console.error("Error: ", error);
    } else {
      toast.success("Post created!");
      navigate("/meals");
    }
  };

  return (
    <div className="container">
      <form action="" className="create-post">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleInputChange}
          className="title-input"
          maxLength="20"
        ></input>
        <label htmlFor="uploadImage">Post Cover</label>
        <div className="upload-image-container">
          <input
            type="file"
            id="uploadImage"
            name="image"
            className="imgUpload"
            onChange={handleFileSelected}
          />
          <button
            type="submit"
            className="upload-button"
            onClick={handleImgSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
        {imgUrl && (
          <div className="img-wrapper">
            <img src={imgUrl} alt="uploaded" className="postImg" />
          </div>
        )}
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={post.description}
          rows="8"
          className="description-input"
          onChange={handleInputChange}
        ></textarea>
        <div className="button-container">
          <button className="submit" onClick={handleFormSubmit}>
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

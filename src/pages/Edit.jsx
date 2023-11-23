import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import useUser from "../hooks/useUser";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Edit.css";

const Edit = () => {
  const { postID } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [file, setFile] = useState([]);
  const [postState, setPostState] = useState({
    title: "",
    description: "",
    imgUrl: "",
  });
  const storageFilepath =
    "https://lajoxhbsjunpcklscmpu.supabase.co/storage/v1/object/public/PostImages/";

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("postID", postID)
        .single();
      if (error) {
        console.error("Error fetching post: ", error);
      } else {
        setPostState({
          title: data.title,
          description: data.description,
          imgUrl: data.imgUrl,
        });
      }
    }

    fetchPost();
  }, [postID, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostState({ ...postState, [name]: value });
  };

  const handleFileSelected = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const deleteIMG = async () => {
    const imgUrlSegments = postState.imgUrl.split("/");
    const imgFilePath = imgUrlSegments.slice(-2).join("/");

    console.log(imgFilePath);

    await supabase.storage.from("PostImages").remove([`${imgFilePath}`]);
  };

  const handleImgSubmit = async (e) => {
    e.preventDefault();

    if (postState.imgUrl) {
      await deleteIMG();
    }

    const { data, error } = await supabase.storage
      .from("PostImages")
      .upload(user.id + "/" + uuidv4(), file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image: ", error);
    } else {
      const newImgUrl = storageFilepath + data.path;
      setPostState({ ...postState, imgUrl: newImgUrl });
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();

    const { title, description, imgUrl } = postState;

    await supabase
      .from("posts")
      .update({ title, description, imgUrl })
      .eq("postID", postID);

    toast.success("Post updated successfully!");

    navigate(`/view/${postID}`);
  };

  const deletePost = async (e) => {
    e.preventDefault();

    if (postState.imgUrl) {
      await deleteIMG();
    }
    await supabase.from("posts").delete().eq("postID", postID);

    toast.success("Post deleted successfully!");

    navigate("/");
  };

  return (
    <div className="container edit-post-container">
      <h2>Edit Post</h2>
      <form action="" className="edit-post-form">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={postState.title}
          onChange={handleInputChange}
          className="title-input"
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
          >
            Upload Image
          </button>
        </div>
        {postState.imgUrl && (
          <div className="img-wrapper">
            <img src={postState.imgUrl} alt="image" className="postImg" />
          </div>
        )}
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={postState.description}
          rows="8"
          className="description-input"
          onChange={handleInputChange}
        ></textarea>
        <div className="button-container">
          <button className="submit" onClick={updatePost}>
            Edit Post
          </button>
          <button className="delete" onClick={deletePost}>
            Delete Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;

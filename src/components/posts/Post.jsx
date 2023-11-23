import { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Post.css";

const Post = ({ postID, title, imgUrl, created, likeCount }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const calculateTimeDifference = (created) => {
    const createdDate = new Date(created);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - createdDate;
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;
    const differenceInWeeks = differenceInDays / 7;
    const differenceInMonths = differenceInDays / 30;
    const differenceInYears = differenceInDays / 365;

    if (differenceInMinutes < 60) {
      return `Posted ${Math.round(differenceInMinutes)} minutes ago`;
    } else if (differenceInHours < 24) {
      return `Posted ${Math.round(differenceInHours)} hours ago`;
    } else if (differenceInDays < 7) {
      return `Posted ${Math.round(differenceInDays)} days ago`;
    } else if (differenceInWeeks < 4) {
      return `Posted ${Math.round(differenceInWeeks)} weeks ago`;
    } else if (differenceInMonths < 12) {
      return `Posted ${Math.round(differenceInMonths)} months ago`;
    } else {
      return `Posted ${Math.round(differenceInYears)} years ago`;
    }
  };

  return (
    <Link to={`/view/${postID}`} className="post">
      <div className="container">
        <h4 className="post-title">{title}</h4>
      </div>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={imgUrl}
          className={`post-image ${imageLoaded ? "loaded" : ""}`}
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <img
          src="/post-placeholder-image.jpeg"
          alt="image-placeholder"
          className={`post-image ${imageLoaded ? "loaded" : ""}`}
          onLoad={() => setImageLoaded(true)}
        />
      )}

      <p className="post-created container">
        {calculateTimeDifference(created)}
      </p>
      <div className="like-container">
        <IconContext.Provider
          value={{
            color: "red",
          }}
        >
          <AiFillHeart className="like-icon" />
        </IconContext.Provider>
        <p className="post-like-count">{likeCount}</p>
      </div>
    </Link>
  );
};

Post.propTypes = {
  postID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imgUrl: PropTypes.string,
  created: PropTypes.string.isRequired,
  likeCount: PropTypes.number.isRequired,
};

export default Post;

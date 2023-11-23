import { useState } from "react";
import PostsGrid from "../components/posts/PostsGrid";
import "./Meals.css";

const Meals = () => {
  const [filterType, setFilterType] = useState("newest");

  const handleNewestFilter = () => {
    setFilterType("newest");
  };
  const handlePopularFilter = () => {
    setFilterType("popular");
  };

  return (
    <div className="container meals">
      <h1 className="meals-title">What&apos;s Cooking?</h1>
      <p className="subtitle">
        Check out the latest and hotest meals across all campuses.
      </p>
      <div className="filters">
        <button className="newest" onClick={handleNewestFilter}>
          Newest
        </button>
        <button className="popular" onClick={handlePopularFilter}>
          Popular
        </button>
      </div>
      <PostsGrid filter={filterType} />
    </div>
  );
};

export default Meals;

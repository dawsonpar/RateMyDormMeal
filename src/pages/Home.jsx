import React, { useRef } from "react";
import { motion, useIsPresent } from "framer-motion";
import PostsGrid from "../components/posts/PostsGrid";
import { BsFillArrowDownSquareFill } from "react-icons/bs";
import { useMediaQuery } from "usehooks-ts";
import "./Home.css";

const Home = () => {
  const postsRef = useRef();
  const mobile = useMediaQuery("(min-width: 650px)");
  const isPresent = useIsPresent();

  const scrollToPosts = () => {
    postsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero-container">
      <section className="hero">
        {mobile ? (
          <h1 className="hero-title">RATE MY DORM MEAL</h1>
        ) : (
          <h1 className="hero-title-mobile">
            <span>RATE MY</span>
            <br />
            <span>DORM MEAL</span>
          </h1>
        )}
        <h2>Have a craving?</h2>
        <BsFillArrowDownSquareFill
          className="arrow"
          size={50}
          onClick={scrollToPosts}
        />
      </section>
      <section className="posts-container" ref={postsRef}>
        <h2>Trending Meals</h2>
        <PostsGrid filter="popular" />
      </section>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen"
      />
    </div>
  );
};

export default Home;

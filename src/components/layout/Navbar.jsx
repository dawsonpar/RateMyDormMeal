import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useUser from "../../hooks/useUser";
import PropTypes from "prop-types";
import { useMediaQuery } from "usehooks-ts";
import { MdOutlineFastfood } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import "./Navbar.css";

const Navbar = ({ children }) => {
  const { user, isLoading, setUser } = useUser();
  const mobile = useMediaQuery("(min-width: 650px)");
  const [showMenu, setShowMenu] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session ? session.user : null;
        setUser(currentUser);
      }
    );

    const scrollListener = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("scroll", scrollListener);
    };
  }, [setUser]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const navigateAndCloseMenu = (path) => {
    navigate(path);
    toggleMenu();
  };

  return (
    <div>
      {mobile ? (
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
          <p className="nav-left logo" onClick={() => navigate("/")}>
            RateMyDormMeal
            <MdOutlineFastfood className="logo-icon" size={30} />
          </p>
          {isLoading ? (
            <div>Loading...</div>
          ) : user ? (
            <div className="nav-right">
              <p className="nav-right-item" onClick={() => navigate("/meals")}>
                All Meals
              </p>
              <p className="nav-right-item" onClick={() => navigate("/share")}>
                Share
              </p>

              <p
                className="nav-right-item"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                Profile
              </p>
            </div>
          ) : (
            <div className="nav-right">
              <p className="nav-right-item" onClick={() => navigate("/meals")}>
                All Meals
              </p>
              <p className="nav-right-item" onClick={() => navigate("/login")}>
                Share
              </p>
              <button
                className="nav-right-item"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          )}
        </nav>
      ) : (
        // Mobile navbar
        <nav className="navbar mobile">
          <p
            className="nav-left logo mobile-text"
            onClick={() => navigate("/")}
          >
            RateMyDormMeal
            <MdOutlineFastfood className="logo-icon" size={20} />
          </p>
          {isLoading ? (
            <div>Loading...</div>
          ) : user ? (
            <div className="nav-right">
              {showMenu ? (
                <AiOutlineMenu onClick={toggleMenu} />
              ) : (
                <div className="vertical-menu">
                  <AiOutlineClose
                    onClick={toggleMenu}
                    className="nav-right-item-mobile close-icon"
                  />
                  <p
                    className="nav-right-item-mobile mobile-text"
                    onClick={() => navigateAndCloseMenu("/meals")}
                  >
                    All Meals
                  </p>
                  <p
                    className="nav-right-item-mobile mobile-text"
                    onClick={() => navigateAndCloseMenu("/share")}
                  >
                    Share
                  </p>

                  <p
                    className="nav-right-item-mobile mobile-text"
                    onClick={() => navigateAndCloseMenu(`/profile/${user.id}`)}
                  >
                    Profile
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-right">
              {showMenu ? (
                <AiOutlineMenu onClick={toggleMenu} />
              ) : (
                <div className="vertical-menu">
                  <AiOutlineClose
                    onClick={toggleMenu}
                    className="nav-right-item-mobile close-icon"
                  />
                  <p
                    className="nav-right-item-mobile mobile-text"
                    onClick={() => navigateAndCloseMenu("/meals")}
                  >
                    All Meals
                  </p>
                  <p
                    className="nav-right-item-mobile mobile-text"
                    onClick={() => navigateAndCloseMenu("/login")}
                  >
                    Share
                  </p>
                  <button
                    className="nav-right-item-mobile mobile-text mobile-sign-in"
                    onClick={() => navigateAndCloseMenu("/login")}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      )}
      {children}
    </div>
  );
};

Navbar.propTypes = {
  children: PropTypes.node,
};

export default Navbar;

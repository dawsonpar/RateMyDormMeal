import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import EditPostsGrid from "../components/posts/EditPostsGrid";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container profile">
      <div className="profile-header">
        <h2 className="my-profile">My Profile:</h2>
        <div className="signout">
          <h3 className="user-email">{user.email}</h3>
          <button className="sign-out-button" onClick={signOutUser}>
            Sign Out
          </button>
        </div>
      </div>
      <h3>My Posts</h3>
      <EditPostsGrid />
    </div>
  );
};

export default Profile;

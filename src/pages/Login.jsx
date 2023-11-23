import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";

import "./Login.css";

const Login = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate("/");
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="login-body">
      {!isLoading ? (
        !user ? (
          <div className="auth">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={["google"]}
            />
          </div>
        ) : (
          <div>
            <button onClick={signOutUser}>Sign Out</button>
          </div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Login;

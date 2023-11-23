import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const supabaseSession = supabase.auth.getSession();
    console.log("supabaseSession", supabaseSession);
    if (supabaseSession?.user?.id) {
      setUser(supabaseSession.user);
      setToken(supabaseSession.access_token);
    }
    setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.id) {
          setUser(session.user);
          setToken(session.access_token);
        }
        setLoading(false);
      }
    );

    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  return {
    user,
    isLoading,
    token,
    setUser,
  };
};

export default useUser;


import { useState } from "react";
import App from "./App";
import Auth from "./Auth";

export default function AppWithAuth() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("reeltrack_user");
      const token = localStorage.getItem("reeltrack_token");

      return savedUser && token ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  function handleLogout() {
    localStorage.removeItem("reeltrack_token");
    localStorage.removeItem("reeltrack_user");
    setUser(null);
  }

  if (!user) {
    return <Auth onAuthenticated={setUser} />;
  }

  return (
    <>
      <div className="reeltrack-session-bar">
        <span>
          Signed in as <strong>{user.name}</strong>
        </span>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <App />
    </>
  );
}


import { useState } from "react";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/auth";

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint =
        mode === "register" ? "/register" : "/login";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          mode === "register"
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      localStorage.setItem("reeltrack_token", data.token);
      localStorage.setItem(
        "reeltrack_user",
        JSON.stringify(data.user)
      );

      onAuthenticated(data.user);
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to connect to the server. Check that your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setMessage("");
    setPassword("");
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="auth-brand">
          <span className="auth-brand-icon">R</span>
          <span>ReelTrack</span>
        </div>

        <div className="auth-intro-content">
          <p className="auth-eyebrow">YOUR PERSONAL WATCHLIST</p>
          <h1>
            Your next
            <br />
            favorite story
            <br />
            <span>starts here.</span>
          </h1>
          <p className="auth-description">
            Keep track of the movies, shows, web series, and anime
            you love. Organize your watchlist your way.
          </p>

          <div className="auth-feature-list">
            <div>
              <span>✓</span> Keep your watchlist organized
            </div>
            <div>
              <span>✓</span> Track what you have watched
            </div>
            <div>
              <span>✓</span> Rate your favorite titles
            </div>
          </div>
        </div>

        <p className="auth-footer">
          Every story deserves a place in your list.
        </p>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-card">
          <div className="auth-mobile-brand">
            <span className="auth-brand-icon">R</span>
            <span>ReelTrack</span>
          </div>

          <p className="auth-form-eyebrow">
            {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
          </p>

          <h2>
            {mode === "login" ? "Sign in" : "Create your account"}
          </h2>

          <p className="auth-form-subtitle">
            {mode === "login"
              ? "Enter your details to continue to ReelTrack."
              : "Create an account to start your personal watchlist."}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="auth-field">
                <label htmlFor="auth-name">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                placeholder={
                  mode === "register"
                    ? "At least 6 characters"
                    : "Enter your password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete={
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                minLength={mode === "register" ? 6 : undefined}
                required
              />
            </div>

            {message && (
              <div className="auth-message" role="alert">
                {message}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in to ReelTrack"
                  : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button type="button" onClick={switchMode}>
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="auth-terms">
            Your personal media journey, all in one place.
          </p>
        </div>
      </section>
    </main>
  );
}


import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [mood, setMood] = useState("Happy");

  const messages = {
    Happy: "Keep smiling and spread happiness!",
    Sad: "It's okay to have a difficult day. Take care!",
    Excited: "Enjoy the moment and make it memorable!",
    Calm: "Take a deep breath and enjoy your peace."
  };

  function resetCard() {
    setName("");
    setMood("Happy");
  }

  return (
    <div className="page">
      <div className="mood-card">
        <h1>Daily Mood Card</h1>
        <p>How are you feeling today?</p>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor="mood">Choose your mood:</label>

        <select
          id="mood"
          value={mood}
          onChange={(event) => setMood(event.target.value)}
        >
          <option value="Happy">😊 Happy</option>
          <option value="Sad">😔 Sad</option>
          <option value="Excited">🤩 Excited</option>
          <option value="Calm">😌 Calm</option>
        </select>

        <div className="message">
          <h2>{name.trim() ? `Hello, ${name.trim()}!` : "Hello!"}</h2>
          <h3>{mood} Day</h3>
          <p>{messages[mood]}</p>
        </div>

        <button onClick={resetCard}>Reset</button>
      </div>
    </div>
  );
}

export default App;

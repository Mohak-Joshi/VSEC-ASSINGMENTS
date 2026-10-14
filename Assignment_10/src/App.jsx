
import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");

  return (
    <div className="container">
      <h2>Text Display App</h2>

      <input
        type="text"
        placeholder="Enter something..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <h1>{text || "Your text will appear here"}</h1>
    </div>
  );
}

export default App;

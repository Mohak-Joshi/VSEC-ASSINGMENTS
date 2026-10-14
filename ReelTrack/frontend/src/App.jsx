import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/media";

const emptyForm = {
  title: "",
  type: "Movie",
  genre: "",
  year: "",
  status: "Plan to Watch",
  rating: "",
  image: "",
};

function App() {
  const [media, setMedia] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load media from MongoDB through the backend
  async function loadMedia() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load your media collection.");
      }

      const data = await response.json();
      setMedia(data);
    } catch (err) {
      setError(
        "Cannot connect to the backend. Make sure your server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  const completedCount = media.filter(
    (item) => item.status === "Completed"
  ).length;

  const watchingCount = media.filter(
    (item) => item.status === "Watching"
  ).length;

  const plannedCount = media.filter(
    (item) => item.status === "Plan to Watch"
  ).length;

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || item.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      type: item.type,
      genre: item.genre || "",
      year: item.year || "",
      status: item.status,
      rating: item.rating ?? "",
      image: item.image || "",
    });
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const mediaItem = {
      title: form.title.trim(),
      type: form.type,
      genre: form.genre.trim(),
      year: form.year === "" ? null : Number(form.year),
      status: form.status,
      rating: form.rating === "" ? null : Number(form.rating),
      image: form.image.trim(),
    };

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mediaItem),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not save the title.");
      }

      await loadMedia();
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMedia(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this title?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete the title.");
      }

      setMedia((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(err.message || "Something went wrong while deleting.");
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">▶</div>
          <span>ReelTrack</span>
        </div>

        <div className="sidebar-label">MENU</div>

        <button
          className={`nav-item ${activeFilter === "All" ? "active" : ""}`}
          onClick={() => setActiveFilter("All")}
        >
          <span>▦</span> My Library
        </button>

        <button
          className={`nav-item ${
            activeFilter === "Watching" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Watching")}
        >
          <span>◷</span> Currently Watching
        </button>

        <button
          className={`nav-item ${
            activeFilter === "Completed" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Completed")}
        >
          <span>✓</span> Completed
        </button>

        <button
          className={`nav-item ${
            activeFilter === "Plan to Watch" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("Plan to Watch")}
        >
          <span>＋</span> Plan to Watch
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-note">YOUR PERSONAL MEDIA SPACE</div>
          <p>Keep track of every story.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">YOUR PERSONAL COLLECTION</div>
            <h1>My Media Library</h1>
            <p className="subtitle">
              Every movie, every episode, all in one place.
            </p>
          </div>

          <button className="add-button" onClick={openAddForm}>
            <span>＋</span> Add New Title
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Titles</span>
              <span className="stat-icon purple">▦</span>
            </div>
            <div className="stat-number">{media.length}</div>
            <div className="stat-caption">In your collection</div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Currently Watching</span>
              <span className="stat-icon blue">▶</span>
            </div>
            <div className="stat-number">{watchingCount}</div>
            <div className="stat-caption">Stories in progress</div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Completed</span>
              <span className="stat-icon green">✓</span>
            </div>
            <div className="stat-number">{completedCount}</div>
            <div className="stat-caption">Stories finished</div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Plan to Watch</span>
              <span className="stat-icon orange">◷</span>
            </div>
            <div className="stat-number">{plannedCount}</div>
            <div className="stat-caption">Waiting for you</div>
          </div>
        </section>

        <section className="library-section">
          <div className="library-heading">
            <div>
              <h2>Your Collection</h2>
              <p>Browse and manage your favourite titles.</p>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search titles..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="filter-row">
            {[
              "All",
              "Plan to Watch",
              "Watching",
              "Completed",
              "Dropped",
            ].map((filter) => (
              <button
                key={filter}
                className={`filter-button ${
                  activeFilter === filter ? "selected" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}

            <span className="result-count">
              {filteredMedia.length} titles
            </span>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                color: "#ff9fae",
                background: "#40252c",
                borderRadius: "8px",
                padding: "12px",
                marginTop: "16px",
                fontSize: "12px",
              }}
            >
              {error}
              <button
                onClick={loadMedia}
                style={{
                  marginLeft: "12px",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="empty-state">
              <h3>Loading your library...</h3>
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="media-grid">
              {filteredMedia.map((item) => (
                <article className="media-card" key={item._id}>
                  <div className="poster">
                    <div
                      className="poster-placeholder"
                      style={{ display: item.image ? "none" : "block" }}
                    >
                      <span>▶</span>
                      <p>{item.title}</p>
                    </div>

                    {item.image && (
                      <img
                        src={item.image}
                        alt={`${item.title} poster`}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          const placeholder =
                            event.currentTarget.parentElement.querySelector(
                              ".poster-placeholder"
                            );

                          if (placeholder) {
                            placeholder.style.display = "block";
                          }
                        }}
                      />
                    )}

                    <span className="poster-type">{item.type}</span>
                  </div>

                  <div className="media-details">
                    <div className="media-title-row">
                      <h3>{item.title}</h3>

                      {item.rating !== null &&
                        item.rating !== undefined &&
                        item.rating !== "" && (
                          <span className="rating">
                            ★ {item.rating}/10
                          </span>
                        )}
                    </div>

                    <p className="media-meta">
                      {item.year || "Year not set"}
                      {item.genre ? ` · ${item.genre}` : ""}
                    </p>

                    <span
                      className={`status-badge ${item.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {item.status}
                    </span>

                    <div className="card-actions">
                      <button onClick={() => openEditForm(item)}>
                        Edit
                      </button>
                      <button
                        className="delete-action"
                        onClick={() => deleteMedia(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">▦</div>
              <h3>
                {search || activeFilter !== "All"
                  ? "No titles found"
                  : "Your library is empty"}
              </h3>
              <p>
                {search || activeFilter !== "All"
                  ? "Try another search or filter."
                  : "Add your first movie or series to get started."}
              </p>
              <button className="add-button" onClick={openAddForm}>
                ＋ Add a Title
              </button>
            </div>
          )}
        </section>

        <footer className="footer">
          ReelTrack <span>·</span> Your stories, your collection.
        </footer>
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setShowForm(false);
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="eyebrow">YOUR LIBRARY</div>
                <h2>{editingId ? "Edit Title" : "Add New Title"}</h2>
                <p>Enter the details of your movie or series.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Inception"
                  required
                  maxLength={100}
                />
              </label>

              <div className="form-row">
                <label>
                  Type
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option>Movie</option>
                    <option>TV Series</option>
                    <option>Web Series</option>
                    <option>Anime</option>
                  </select>
                </label>

                <label>
                  Year
                  <input
                    name="year"
                    type="number"
                    min="1888"
                    max="2100"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="e.g. 2024"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Genre
                  <input
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    placeholder="e.g. Sci-Fi"
                    maxLength={50}
                  />
                </label>

                <label>
                  Rating (out of 10)
                  <input
                    name="rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Plan to Watch</option>
                  <option>Watching</option>
                  <option>Completed</option>
                  <option>Dropped</option>
                </select>
              </label>

              <label>
                Poster Image URL (optional)
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/poster.jpg"
                />
                <span className="field-hint">
                  Paste a direct image link, or leave it blank.
                </span>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Add to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
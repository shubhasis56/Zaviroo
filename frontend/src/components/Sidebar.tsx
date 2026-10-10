export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🎵</span>
        <span className="logo-text">Zaviroo</span>
      </div>
      <nav className="sidebar-nav">
        <button className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">🔍</span>
          <span>Search</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">📚</span>
          <span>Your Library</span>
        </button>
      </nav>
      <div className="sidebar-playlists">
        <h3 className="sidebar-section-title">Playlists</h3>
        <ul className="playlist-list">
          <li>Liked Songs</li>
          <li>Chill Vibes</li>
          <li>Workout Mix</li>
          <li>Focus Beats</li>
          <li>Party Anthems</li>
          <li>Late Night Jazz</li>
        </ul>
      </div>
    </aside>
  )
}

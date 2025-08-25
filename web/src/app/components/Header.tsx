export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-logo">
              <span>TV</span>
            </div>
            <div>
              <h1 className="header-title">TypeVibe</h1>
              <p className="header-subtitle">Mood based playlist generator</p>
            </div>
          </div>
          <button className="header-settings">
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}

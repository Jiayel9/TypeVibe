'use client';

import { useState, useEffect, useRef } from 'react';
import { PlaylistData } from '../../lib/types';

interface ControlsProps {
  onGenerate: (data: PlaylistData) => void;
  isLoading: boolean;
}

export default function Controls({ onGenerate, isLoading }: ControlsProps) {
  const [mood, setMood] = useState('');
  const [funMode, setFunMode] = useState(false);
  const [playlistName, setPlaylistName] = useState('My TypeVibe Playlist');
  const [genre, setGenre] = useState('Hip Hop');
  const [songCount, setSongCount] = useState(10);
  const rangeRef = useRef<HTMLInputElement>(null);

  const handleSongCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSongCount(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      mood,
      funMode,
      playlistName,
      genre,
      songCount,
    });
  };

  return (
    <div className="controls">
      <form onSubmit={handleSubmit} className="controls-form">
        {/* Mood Input */}
        <div className="form-section">
          <h2 className="form-section-title">What's your mood?</h2>
          <p className="form-section-description">
            Describe your mood in a sentence.
          </p>
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g., feeling nostalgic and want to dance..."
            className="form-input form-textarea"
            required
          />
        </div>

        {/* Fun Mode Toggle */}
        <div className="toggle-container">
          <div className="toggle-content">
            <span className="toggle-icon">⚡</span>
            <div>
              <div className="toggle-label">{funMode ? 'Fun' : 'Default'}</div>
              <div className="toggle-description">
                {funMode 
                  ? 'Playlist generation but with a twist (WIP).'
                  : 'Standard playlist generation.'
                }
              </div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={funMode}
              onChange={(e) => setFunMode(e.target.checked)}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        {/* Additional Options */}
        <div className="form-section">
          <h3 className="form-section-title">Additional Options</h3>
          
          {/* Playlist Name */}
          <div className="form-field">
            <label className="form-label">
              <span>Playlist Name</span>
            </label>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Genre */}
          <div className="form-field">
            <label className="form-label">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="form-input form-select"
            >
              <option value="Hip Hop">Hip Hop</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Electronic">Electronic</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Country">Country</option>
              <option value="R&B">R&B</option>
              <option value="Any">Any</option>
            </select>
          </div>

          {/* Song Count */}
          <div className="range-container">
            <label className="range-label">
              <span>Number of Songs</span>
              <span className="range-value">{songCount} songs</span>
            </label>
            <input
              ref={rangeRef}
              type="range"
              min="5"
              max="20"
              value={songCount}
              onChange={handleSongCountChange}
              className="range-input"
            />
            <div className="range-labels">
              <span>5</span>
              <span>20</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading || !mood.trim()}
          className="btn"
        >
          <span>♪</span>
          <span>{isLoading ? 'Generating...' : 'Generate Playlist'}</span>
        </button>
      </form>
    </div>
  );
}

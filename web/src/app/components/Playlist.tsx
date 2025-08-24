import TrackCard from './TrackCard';
import { Track } from '../../lib/types';

interface PlaylistProps {
  playlistName: string;
  tracks: Track[];
  isLoading: boolean;
  hasGenerated: boolean;
}

export default function Playlist({ playlistName, tracks, isLoading, hasGenerated }: PlaylistProps) {
  if (isLoading) {
    return (
      <div className="playlist">
        <div className="playlist-header">
          <h2 className="playlist-title">{playlistName}</h2>
          <div className="playlist-count">
            Loading...
          </div>
        </div>
        
        {/* Skeleton loading */}
        <div className="track-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-track">
              <div className="skeleton skeleton-number"></div>
              <div className="skeleton skeleton-artwork"></div>
              <div className="skeleton-content">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-artist"></div>
              </div>
              <div className="skeleton skeleton-duration"></div>
              <div className="skeleton skeleton-play"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show welcome state if no playlist has been generated yet
  if (!hasGenerated) {
    return (
      <div className="welcome">
        <div className="welcome-icon">
          <span>♪</span>
        </div>
        <h2 className="welcome-title">Ready to discover new music?</h2>
        <p className="welcome-description">
          Tell us your mood and we will create the perfect playlist for you. Enter your current vibe to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="playlist">
      <div className="playlist-header">
        <h2 className="playlist-title">{playlistName}</h2>
        <div className="playlist-count">
          {tracks.length} tracks
        </div>
      </div>
      
      {tracks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎵</div>
          <p className="empty-state-title">No playlist generated yet</p>
          <p className="empty-state-description">Fill in your mood and click "Generate Playlist" to get started!</p>
        </div>
      ) : (
        <div className="track-list">
          {tracks.map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              trackNumber={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

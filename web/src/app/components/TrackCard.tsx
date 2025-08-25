import { Track } from '../../lib/types';

interface TrackCardProps {
  track: Track;
  trackNumber: number;
}

export default function TrackCard({ track, trackNumber }: TrackCardProps) {
  return (
    <div className="track-card">
      {/* Track Number */}
      <div className="track-number">
        {trackNumber}
      </div>
      
      {/* Album Art */}
      <div className="track-artwork">
        <img
          src={track.albumArt}
          alt={`${track.title} album art`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = '🎵';
            target.parentElement!.className = 'track-artwork';
          }}
        />
      </div>
      
      {/* Track Info */}
      <div className="track-info">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-artist">{track.artist}</p>
      </div>
      
      {/* Duration */}
      <div className="track-duration">
        {track.duration}
      </div>
      
      {/* Play Button */}
      <button className="track-play">
        <div className="track-play-icon"></div>
      </button>
    </div>
  );
}

import { AppTrack } from '../../lib/types';

interface TrackCardProps {
  track: AppTrack;
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
          alt={`${track.name} album art`}
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
        <h3 className="track-title">{track.name}</h3>
        <p className="track-artist">{track.artists}</p>
      </div>
      
      {/* Duration - AppTrack doesn't have duration, so we'll show a placeholder */}
      <div className="track-duration">
        --:--
      </div>
      
      {/* Play Button */}
      <button className="track-play">
        <div className="track-play-icon"></div>
      </button>
    </div>
  );
}

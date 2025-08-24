'use client';

import { useState } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Playlist from './components/Playlist';
import { Track, PlaylistData } from '../lib/types';

// Placeholder tracks for demo
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Vibes',
    artist: 'Luna Echo',
    duration: '3:24',
    albumArt: 'https://via.placeholder.com/48x48/4A5568/FFFFFF?text=MV'
  },
  {
    id: '2',
    title: 'Electric Dreams',
    artist: 'Neon Pulse',
    duration: '4:12',
    albumArt: 'https://via.placeholder.com/48x48/805AD5/FFFFFF?text=ED'
  },
  {
    id: '3',
    title: 'Vintage Soul',
    artist: 'The Vinyl Collective',
    duration: '2:58',
    albumArt: 'https://via.placeholder.com/48x48/DD6B20/FFFFFF?text=VS'
  },
  {
    id: '4',
    title: 'Acoustic Harmony',
    artist: 'String Theory',
    duration: '3:45',
    albumArt: 'https://via.placeholder.com/48x48/38A169/FFFFFF?text=AH'
  },
  {
    id: '5',
    title: 'Studio Sessions',
    artist: 'The Producers',
    duration: '5:21',
    albumArt: 'https://via.placeholder.com/48x48/2B6CB0/FFFFFF?text=SS'
  }
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState('My TypeVibe Playlist');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async (data: PlaylistData) => {
    setIsLoading(true);
    setPlaylistName(data.playlistName);
    setHasGenerated(true);
    
    // Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data for demo
    setTracks(mockTracks.slice(0, data.songCount));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main-container">
        <div className="main-grid">
          {/* Controls Panel */}
          <div>
            <Controls onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          
          {/* Playlist Panel */}
          <div>
            <Playlist
              playlistName={playlistName}
              tracks={tracks}
              isLoading={isLoading}
              hasGenerated={hasGenerated}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <button className="footer-help">
          <span className="footer-help-icon">?</span>
        </button>
      </footer>
    </div>
  );
}

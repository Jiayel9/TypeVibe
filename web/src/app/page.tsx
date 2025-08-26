'use client';

import { useState } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Playlist from './components/Playlist';
import { AppTrack, PlaylistData } from '../lib/types';

// Placeholder tracks for demo
const mockTracks: AppTrack[] = [
  {
    id: '1',
    uri: 'spotify:track:mock1',
    name: 'Midnight Vibes',
    artists: 'Luna Echo',
    albumArt: 'https://via.placeholder.com/48x48/4A5568/FFFFFF?text=MV'
  },
  {
    id: '2',
    uri: 'spotify:track:mock2',
    name: 'Electric Dreams',
    artists: 'Neon Pulse',
    albumArt: 'https://via.placeholder.com/48x48/805AD5/FFFFFF?text=ED'
  },
  {
    id: '3',
    uri: 'spotify:track:mock3',
    name: 'Vintage Soul',
    artists: 'The Vinyl Collective',
    albumArt: 'https://via.placeholder.com/48x48/DD6B20/FFFFFF?text=VS'
  },
  {
    id: '4',
    uri: 'spotify:track:mock4',
    name: 'Acoustic Harmony',
    artists: 'String Theory',
    albumArt: 'https://via.placeholder.com/48x48/38A169/FFFFFF?text=AH'
  },
  {
    id: '5',
    uri: 'spotify:track:mock5',
    name: 'Studio Sessions',
    artists: 'The Producers',
    albumArt: 'https://via.placeholder.com/48x48/2B6CB0/FFFFFF?text=SS'
  }
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState('My TypeVibe Playlist');
  const [tracks, setTracks] = useState<AppTrack[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async (data: PlaylistData) => {
    setIsLoading(true);
    setPlaylistName(data.playlistName);
    setHasGenerated(true);
    
    try {
      console.log('Sending mood to API:', data.mood);
      
      // Fetch tracks from Spotify API using the user's mood
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentence: data.mood
        }),
      });
      
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Response data:', result);
        
        const spotifyTracks: AppTrack[] = result.tracks || [];
        console.log('Spotify tracks received:', spotifyTracks.length);
        
        if (spotifyTracks.length > 0) {
          console.log('First Spotify track:', spotifyTracks[0]);
          // Use real tracks from API, limit to requested song count
          const finalTracks = spotifyTracks.slice(0, data.songCount);
          console.log('Final tracks to display:', finalTracks);
          setTracks(finalTracks);
        } else {
          console.log('No Spotify tracks returned, using mock tracks');
          // Fallback to mock tracks if API returns no tracks
          setTracks(mockTracks.slice(0, data.songCount));
        }
      } else {
        const errorText = await response.text();
        console.error('API call failed:', response.status, errorText);
        // Fallback to mock data if API call fails
        setTracks(mockTracks.slice(0, data.songCount));
      }
    } catch (error) {
      console.error('Error fetching from Spotify API:', error);
      // Fallback to mock data
      setTracks(mockTracks.slice(0, data.songCount));
    }
    
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

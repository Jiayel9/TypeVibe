// src/lib/types.ts

/** Specifications type */
export type Spec = {
  minutes?: number;
  targetTracks?: number;
  seeds: { genres?: string[] }; // e.g., ["chill", "ambient", "indie"]
  features: Partial<{
    energyMin: number;
    energyMax: number;
    tempoMin: number;
    tempoMax: number;
    valenceMin: number;
    valenceMax: number;
    instrumentalnessMin: number;
    danceabilityMin: number;
    acousticnessMin: number;
  }>;
};

// New types for the playlist generator
export type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  artists: { name: string }[]; // minimal artist info
  album: {
    images: { url: string }[]; // just URLs (ignore height/width if you don’t need them)
  };
};

export interface PlaylistData {
  mood: string;
  funMode: boolean;
  playlistName: string;
  genre: string;
  songCount: number;
}

export type AppTrack = {
  id: string;
  uri: string;
  name: string;
  artists: string; // flattened: "Artist A, Artist B"
  albumArt: string; // one URL (medium or fallback)
};

function simplifyTrack(t: SpotifyTrack): AppTrack {
  return {
    id: t.id,
    uri: t.uri,
    name: t.name,
    artists: t.artists.map((a) => a.name).join(", "),
    albumArt: t.album.images[1]?.url ?? "", // medium size or fallback
  };
}

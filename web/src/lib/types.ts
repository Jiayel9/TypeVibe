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

/** Track Summary for requested song*/
export type TrackSummary = {
  id: string; // Spotify track ID
  name: string; // Track name
  artists: string; // "Artist A, Artist B"
  uri: string; // "spotify:track:..."
};

/**
 * Pluto Universal Audio Engine
 * Plays authentic audio previews via HTML5 Audio elements with real playback state tracking.
 * Ensures strict single-stream playback (only one audio plays at any time).
 */

type PlaybackListener = (playingId: string | null) => void;

class PlutoAudioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private currentTrackId: string | null = null;
  private listeners = new Set<PlaybackListener>();

  public subscribe(fn: PlaybackListener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentTrackId);
      } catch {
        // ignore listener errors
      }
    }
  }

  public getPlayingTrackId(): string | null {
    return this.currentTrackId;
  }

  public isPlaying(trackId: string): boolean {
    return this.currentTrackId === trackId && !this.audioEl?.paused;
  }

  public stop() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl.src = "";
      this.audioEl = null;
    }
    this.currentTrackId = null;
    this.notify();
  }

  public async play(trackId: string, previewUrl?: string | null): Promise<boolean> {
    // If clicking the currently playing track, toggle pause
    if (this.currentTrackId === trackId && this.audioEl) {
      if (this.audioEl.paused) {
        try {
          await this.audioEl.play();
          this.notify();
          return true;
        } catch {
          this.stop();
          return false;
        }
      } else {
        this.audioEl.pause();
        this.currentTrackId = null;
        this.notify();
        return false;
      }
    }

    // Stop previous track if running
    this.stop();

    if (!previewUrl) {
      return false;
    }

    try {
      const audio = new Audio(previewUrl);
      this.audioEl = audio;
      this.currentTrackId = trackId;

      audio.onended = () => {
        this.currentTrackId = null;
        this.audioEl = null;
        this.notify();
      };

      audio.onerror = () => {
        this.currentTrackId = null;
        this.audioEl = null;
        this.notify();
      };

      await audio.play();
      this.notify();
      return true;
    } catch {
      this.currentTrackId = null;
      this.audioEl = null;
      this.notify();
      return false;
    }
  }
}

export const audioEngine = new PlutoAudioEngine();

import { useEffect, useMemo, useRef, useState } from "react";

const TRACKS = {
  spotify: { title: "505", artist: "Arctic Monkeys", src: "/assets/505-arctic-monkeys.mp3" },
  button1: { title: "Cha Cha", artist: "Josephson", src: "/assets/chachacha.mp3" },
  button2: { title: "Mi Girasol", artist: "Mon Laferte", src: "/assets/my-one-and-only-love.mp3" },
} as const;
type TrackKey = keyof typeof TRACKS;

const LYRICS = [
  { at: 0, text: "I'm going back to 505" },
  { at: 8, text: "If it's a seven hour flight or a forty-five minute drive" },
  { at: 17, text: "In my imagination, you're waiting lying on your side" },
  { at: 27, text: "With your hands between your thighs" },
  { at: 37, text: "But I crumble completely when you cry" },
  { at: 47, text: "It seems like once again you've had to greet me with goodbye" },
  { at: 60, text: "I'm always just about to go and spoil the surprise" },
  { at: 72, text: "And I'll waste the night" },
];

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
};

export function MusicLetter({ onPlayback }: { onPlayback: (playing: boolean) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<TrackKey>("spotify");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const track = TRACKS[currentTrack];

  const lyricIndex = useMemo(() => {
    let current = 0;
    LYRICS.forEach((line, index) => {
      if (line.at <= time) current = index;
    });
    return current;
  }, [time]);

  const progressPercent = duration > 0 ? (time / duration) * 100 : 0;

  useEffect(() => () => audioRef.current?.pause(), []);

  const setPlayingState = (nextPlaying: boolean) => {
    setPlaying(nextPlaying);
    onPlayback(nextPlaying);
  };

  const togglePlayback = async (nextTrack: TrackKey) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack !== nextTrack) {
      audio.pause();
      audio.src = TRACKS[nextTrack].src;
      audio.load();
      setCurrentTrack(nextTrack);
      setTime(0);
      setDuration(0);
      try {
        await audio.play();
        setPlayingState(true);
      } catch {
        setPlayingState(false);
      }
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        setPlayingState(true);
      } catch {
        setPlayingState(false);
      }
    } else {
      audio.pause();
      setPlayingState(false);
    }
  };

  return (
    <section className="etapa etapa-musical">
      <div className={`carta-musical-wrap ${playing ? "audio-activo" : ""}`}>
        <img src="/assets/carta-ilustrada-key.jpeg" alt="Carta ilustrada My Last Love para Key" />
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onEnded={() => {
            setPlayingState(false);
            setTime(0);
          }}
        />
        <button type="button" className={`spotify-card-overlay ${playing && currentTrack === "spotify" ? "is-playing" : ""}`} onClick={() => togglePlayback("spotify")} aria-label={playing && currentTrack === "spotify" ? "Pausar 505" : "Reproducir 505"}>
          <span className="spotify-play-state" aria-hidden="true">{playing && currentTrack === "spotify" ? "❚❚" : "▶"}</span>
          <span className="sr-only">{playing && currentTrack === "spotify" ? "Pausar 505" : "Reproducir 505"}</span>
          <span className="spotify-progress-live" aria-hidden="true"><span style={{ width: `${progressPercent}%` }} /></span>
          <span className="spotify-time-live" aria-hidden="true">{formatTime(time)} / {formatTime(duration)}</span>
          <span className="spotify-live-lyrics" aria-live="polite">
            <span className="spotify-live-lyrics-track" style={{ transform: `translateY(-${Math.max(0, lyricIndex - 1) * 1.2}rem)` }}>
              {LYRICS.map((line, index) => <span key={line.at} className={index === lyricIndex ? "is-current" : ""}>{line.text}</span>)}
            </span>
          </span>
        </button>
        <div className="audios-flotantes" aria-label="Botones de audio dibujados en la carta">
          <div className="controles-integrados">
            <button type="button" className={`control-imagen control-barra-1 ${playing && currentTrack === "button1" ? "is-playing" : ""}`} onClick={() => togglePlayback("button1")} aria-label={playing && currentTrack === "button1" ? "Pausar Cha Cha" : "Reproducir Cha Cha"}>
              <span className="wave-state" aria-hidden="true">{playing && currentTrack === "button1" ? "❚❚" : "▶"}</span>
            </button>
            <button type="button" className={`control-imagen control-barra-2 ${playing && currentTrack === "button2" ? "is-playing" : ""}`} onClick={() => togglePlayback("button2")} aria-label={playing && currentTrack === "button2" ? "Pausar Mi Girasol" : "Reproducir Mi Girasol"}>
              <span className="wave-state" aria-hidden="true">{playing && currentTrack === "button2" ? "❚❚" : "▶"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

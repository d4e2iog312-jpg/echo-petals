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
  { at: 37, text: "Stop and wait a sec" },
  { at: 45, text: "When you say you want to" },
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
      <div className="carta-musical-wrap">
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
        <div className="spotify-player" aria-label="Reproductor de 505 de Arctic Monkeys">
          <button type="button" className="spotify-play" onClick={() => togglePlayback("spotify")} aria-label={playing ? "Pausar 505" : "Reproducir 505"}>
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
          </button>
          <div className="spotify-details">
            <div className="spotify-track"><strong>{track.title}</strong><span> · {track.artist}</span><time>{formatTime(time)} / {formatTime(duration)}</time></div>
            <input className="spotify-progress" aria-label="Progreso de 505" type="range" min="0" max={duration || 1} value={Math.min(time, duration || 1)} onChange={(event) => { if (audioRef.current) { audioRef.current.currentTime = Number(event.target.value); setTime(Number(event.target.value)); } }} />
            <div className="spotify-lyric" aria-live="polite">{LYRICS[lyricIndex]?.text}</div>
          </div>
        </div>
        <div className="audios-flotantes" aria-label="Botones de audio dibujados en la carta">
          <div className="controles-integrados">
            <button type="button" className="control-imagen control-barra-1" onClick={() => togglePlayback("button1")} aria-label={playing ? "Pausar 505 desde la primera barra" : "Reproducir 505 desde la primera barra"} />
            <button type="button" className="control-imagen control-barra-2" onClick={() => togglePlayback("button2")} aria-label={playing ? "Pausar 505 desde la segunda barra" : "Reproducir 505 desde la segunda barra"} />
            <button type="button" className="control-imagen control-spotify" onClick={() => togglePlayback("spotify")} aria-label={playing ? "Pausar 505 desde el reproductor Spotify" : "Reproducir 505 desde el reproductor Spotify"} />
          </div>
        </div>
      </div>
    </section>
  );
}

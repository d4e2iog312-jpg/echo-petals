import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRACK = {
  title: "505",
  artist: "Arctic Monkeys",
  src: "/assets/505-arctic-monkeys.mp3",
};

const LYRICS = [
  { time: 0, text: "I'm going back to 505" },
  { time: 5, text: "If it's a seven hour flight or a forty-five minute drive" },
  { time: 12, text: "In my imagination, you're waiting lying on your side" },
  { time: 19, text: "With your hands between your thighs" },
  { time: 27, text: "Stop and wait a second" },
  { time: 34, text: "When you look at me like that, my darling" },
  { time: 42, text: "What did you expect?" },
];

function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function MusicLetter({ onPlayback }: { onPlayback: (playing: boolean) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef<number | null>(null);
  const barsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const lyricIndex = useMemo(() => {
    let current = 0;
    for (let index = 0; index < LYRICS.length; index += 1) {
      const lyric = LYRICS[index];
      if (lyric && lyric.time <= time) current = index;
      else break;
    }
    return current;
  }, [time]);

  const stopWave = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    barsRef.current.forEach((bar) => {
      if (bar) bar.style.transform = "scaleY(0.22)";
    });
  };

  const animateWave = () => {
    if (!audioRef.current || audioRef.current.paused) {
      stopWave();
      return;
    }
    barsRef.current.forEach((bar, index) => {
      if (!bar) return;
      const wave = 0.28 + Math.abs(Math.sin(audioRef.current!.currentTime * 5 + index * 0.8)) * 0.72;
      bar.style.transform = `scaleY(${wave})`;
    });
    frameRef.current = requestAnimationFrame(animateWave);
  };

  useEffect(() => () => stopWave(), []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
      onPlayback(true);
      animateWave();
    } else {
      audio.pause();
    }
  };

  const handlePause = () => {
    setPlaying(false);
    onPlayback(false);
    stopWave();
  };

  return (
    <section className="etapa etapa-musical">
      <div className="carta-musical-wrap">
        <img src="/assets/carta-ilustrada-key.jpeg" alt="Carta ilustrada My Last Love para Key" />
        <div className="audios-flotantes">
          <div className="audio-mensaje audio-pos-1">
            <audio
              ref={audioRef}
              src={TRACK.src}
              preload="metadata"
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onPause={handlePause}
              onEnded={() => { setTime(0); handlePause(); }}
            />
            <Button type="button" size="icon" className="audio-play" onClick={togglePlayback} aria-label={playing ? "Pausar 505" : "Reproducir 505"}>
              {playing ? <Pause /> : <Play />}
            </Button>
            <div className="audio-info">
              <div className="audio-meta"><span>{TRACK.title}</span><span>{formatTime(time)} / {formatTime(duration)}</span></div>
              <div className="frecuencias" aria-hidden>
                {Array.from({ length: 22 }).map((_, index) => <span key={index} ref={(node) => { barsRef.current[index] = node; }} />)}
              </div>
              <input aria-label="Progreso de 505" type="range" min="0" max={duration || 1} step="0.01" value={Math.min(time, duration || 1)} onChange={(event) => { if (audioRef.current) { audioRef.current.currentTime = Number(event.target.value); setTime(Number(event.target.value)); } }} />
              <div className="audio-lyrics" aria-live="polite">
                <span className="audio-lyric-current">{LYRICS[lyricIndex]?.text ?? ""}</span>
                {LYRICS[lyricIndex + 1] && <span className="audio-lyric-next">{LYRICS[lyricIndex + 1]?.text}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

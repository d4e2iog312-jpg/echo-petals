import { useEffect, useState } from "react";
import { LYRICS, lineIndexAt } from "@/lib/lyrics";

export function LyricsBar({ audio }: { audio: HTMLAudioElement | null }) {
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (!audio) {
      setIdx(-1);
      return;
    }

    const syncToAudio = () => {
      setIdx(lineIndexAt(audio.currentTime));
    };
    const reset = () => setIdx(-1);

    audio.addEventListener("timeupdate", syncToAudio);
    audio.addEventListener("seeking", syncToAudio);
    audio.addEventListener("seeked", syncToAudio);
    audio.addEventListener("loadedmetadata", syncToAudio);
    audio.addEventListener("play", syncToAudio);
    audio.addEventListener("pause", syncToAudio);
    audio.addEventListener("emptied", reset);
    audio.addEventListener("loadstart", reset);
    syncToAudio();

    return () => {
      audio.removeEventListener("timeupdate", syncToAudio);
      audio.removeEventListener("seeking", syncToAudio);
      audio.removeEventListener("seeked", syncToAudio);
      audio.removeEventListener("loadedmetadata", syncToAudio);
      audio.removeEventListener("play", syncToAudio);
      audio.removeEventListener("pause", syncToAudio);
      audio.removeEventListener("emptied", reset);
      audio.removeEventListener("loadstart", reset);
    };
  }, [audio]);

  const current = LYRICS[idx]?.text ?? "";

  return (
    <div className="lyrics-bar" aria-live="polite">
      <div className="lyrics-stack">
        {current ? <span className="lyric-now">{current}</span> : <span className="lyric-dots">♪</span>}
      </div>
    </div>
  );
}

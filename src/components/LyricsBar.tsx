import { useEffect, useRef, useState } from "react";
import { LYRICS, lineIndexAt } from "@/lib/lyrics";

/** Cada frase aparece con la música y se deshace como ceniza al terminar. */
export function LyricsBar({ audio }: { audio: HTMLAudioElement | null }) {
  const [idx, setIdx] = useState(-1);
  const [ashes, setAshes] = useState<{ id: number; text: string }[]>([]);
  const prevIdx = useRef(-1);
  const seq = useRef(0);

  useEffect(() => {
    if (!audio) return;
    let raf = 0;
    const tick = () => {
      const i = lineIndexAt(audio.currentTime);
      if (i !== prevIdx.current) {
        const old = LYRICS[prevIdx.current]?.text;
        if (old) {
          const id = seq.current++;
          setAshes((prev) => [...prev, { id, text: old }]);
          window.setTimeout(
            () => setAshes((prev) => prev.filter((a) => a.id !== id)),
            1600,
          );
        }
        prevIdx.current = i;
        setIdx(i);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [audio]);

  const current = LYRICS[idx]?.text ?? "";

  return (
    <div className="lyrics-bar" aria-live="polite">
      <div className="lyrics-stack">
        {ashes.map((a) => (
          <span key={a.id} className="lyric-ash">
            {a.text}
          </span>
        ))}
        {current ? (
          <span key={idx} className="lyric-now">
            {current}
          </span>
        ) : (
          <span className="lyric-dots">♪</span>
        )}
      </div>
    </div>
  );
}

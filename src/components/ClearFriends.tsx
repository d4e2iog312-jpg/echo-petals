import { useMemo, useRef, useState } from "react";
import alegre from "@/assets/amigo-alegre.png.asset.json";
import timido from "@/assets/amigo-timido.png.asset.json";

type Friend = { id: number; src: string; x: number; y: number; angle: number };

const STARTS = [
  [8, 12], [38, 6], [69, 10], [16, 34], [58, 30],
  [3, 58], [38, 55], [72, 54], [18, 76], [61, 76],
];

export function ClearFriends({ onComplete }: { onComplete: () => void }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [friends, setFriends] = useState<Friend[]>(() =>
    STARTS.map(([x, y], id) => ({
      id,
      x: x ?? 0,
      y: y ?? 0,
      angle: (id % 2 ? 1 : -1) * (3 + (id % 3) * 3),
      src: id % 2 ? timido.url : alegre.url,
    })),
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const remaining = friends.length;
  const label = useMemo(() => `${remaining} por guardar`, [remaining]);

  const move = (event: React.PointerEvent<HTMLImageElement>, id: number) => {
    if (dragging !== id || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setFriends((items) => items.map((item) => item.id === id ? { ...item, x, y } : item));
  };

  const release = (event: React.PointerEvent<HTMLImageElement>, id: number) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(null);
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const edge = Math.min(
      event.clientX - rect.left,
      rect.right - event.clientX,
      event.clientY - rect.top,
      rect.bottom - event.clientY,
    );
    if (edge < Math.min(72, rect.width * 0.14)) {
      setFriends((items) => {
        const next = items.filter((item) => item.id !== id);
        if (next.length === 0) window.setTimeout(onComplete, 700);
        return next;
      });
    }
  };

  return (
    <section className="etapa etapa-limpieza">
      <div className="limpieza-copy">
        <p className="kicker">un pequeño caos</p>
        <h2>Guarda a estos amiguitos</h2>
        <p className="sub">Llévalos hasta cualquier borde.</p>
        <span className="contador-amigos" aria-live="polite">{label}</span>
      </div>
      <div ref={areaRef} className={`amigos-area ${remaining === 0 ? "limpia" : ""}`}>
        <div className="borde-succion" aria-hidden />
        {friends.map((friend) => (
          <img
            key={friend.id}
            src={friend.src}
            alt="Amiguito dibujado para guardar"
            className={`amiguito ${dragging === friend.id ? "arrastrando" : ""}`}
            style={{ left: `${friend.x}%`, top: `${friend.y}%`, rotate: `${friend.angle}deg` }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(friend.id);
            }}
            onPointerMove={(event) => move(event, friend.id)}
            onPointerUp={(event) => release(event, friend.id)}
          />
        ))}
        {remaining === 0 && <p className="limpieza-lista">Todo despejado :3</p>}
      </div>
    </section>
  );
}
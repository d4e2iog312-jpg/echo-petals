import { useRef, useState } from "react";
import alegre from "@/assets/amigo-alegre-limpio.png.asset.json";
import timido from "@/assets/amigo-timido-limpio.png.asset.json";

type Friend = { id: number; src: string; x: number; y: number; angle: number };

const STARTS = [[9, 10], [29, 14], [51, 8], [75, 16], [16, 38], [42, 34], [68, 42], [24, 67], [52, 65], [79, 70]];

export function ClearFriends() {
  const areaRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);
  const [friends, setFriends] = useState<Friend[]>(() =>
    STARTS.map(([x, y], id) => ({
      id,
      x: x ?? 0,
      y: y ?? 0,
      angle: (id % 2 ? 1 : -1) * (3 + (id % 3) * 3),
      src: Math.random() > 0.5 ? timido.url : alegre.url,
    })),
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const move = (event: React.PointerEvent<HTMLImageElement>, id: number) => {
    if (draggingRef.current !== id || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setFriends((items) => items.map((item) => item.id === id ? {
      ...item,
      x: Math.max(3, Math.min(97, x)),
      y: Math.max(4, Math.min(96, y)),
    } : item));
  };

  const release = (event: React.PointerEvent<HTMLImageElement>, id: number) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    draggingRef.current = null;
    setDragging(null);
    move(event, id);
  };

  return (
    <section className="etapa etapa-limpieza">
      <div ref={areaRef} className="amigos-area">
        {friends.map((friend) => (
          <img
            key={friend.id}
            src={friend.src}
            alt={friend.src === alegre.url ? "Mini dibujo de chico de pelo blanco" : "Mini dibujo de chico de pelo negro"}
            className={`amiguito ${dragging === friend.id ? "arrastrando" : ""}`}
            style={{ left: `${friend.x}%`, top: `${friend.y}%`, rotate: `${friend.angle}deg` }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              draggingRef.current = friend.id;
              setDragging(friend.id);
            }}
            onPointerMove={(event) => move(event, friend.id)}
            onPointerUp={(event) => release(event, friend.id)}
            draggable={false}
          />
        ))}
      </div>
    </section>
  );
}
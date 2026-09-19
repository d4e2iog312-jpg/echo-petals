import { useMemo, useRef, useState } from "react";
import claro from "@/assets/chico-pelo-blanco.jpg.asset.json";
import oscuro from "@/assets/chico-pelo-negro.jpg.asset.json";
import flor from "@/assets/flor.png.asset.json";

type Friend = { id: number; src: string; x: number; y: number; angle: number };

const STARTS = [
  [12, 18], [31, 11], [52, 18], [75, 12], [89, 28],
  [16, 50], [39, 43], [65, 51], [29, 76], [76, 75],
];

export function ClearFriends() {
  const areaRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [friends, setFriends] = useState<Friend[]>(() =>
    STARTS.map(([x, y], id) => ({
      id,
      x: x ?? 0,
      y: y ?? 0,
      angle: (Math.random() - 0.5) * 12,
      src: Math.random() > 0.5 ? claro.url : oscuro.url,
    })),
  );
  const decorativeFlowers = useMemo(() => [
    { left: "3%", top: "4%", rotate: "-14deg" },
    { right: "4%", bottom: "5%", rotate: "17deg" },
  ], []);

  const move = (clientX: number, clientY: number, id: number) => {
    const area = areaRef.current;
    if (!area || draggingRef.current !== id) return;
    const rect = area.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(6, Math.min(94, ((clientY - rect.top) / rect.height) * 100));
    setFriends((items) => items.map((item) => item.id === id ? { ...item, x, y } : item));
  };

  const release = (event: React.PointerEvent<HTMLImageElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    draggingRef.current = null;
    setDragging(null);
  };

  return (
    <section className="etapa etapa-limpieza">
      <div ref={areaRef} className="amigos-area">
        {decorativeFlowers.map((position, index) => (
          <img key={index} className="flor-amigos" src={flor.url} alt="" style={position} />
        ))}
        {friends.map((friend) => (
          <img
            key={friend.id}
            src={friend.src}
            alt={friend.src === claro.url ? "Mini dibujo de chico de pelo claro" : "Mini dibujo de chico de pelo negro"}
            draggable={false}
            className={`amiguito ${dragging === friend.id ? "arrastrando" : ""}`}
            style={{ left: `${friend.x}%`, top: `${friend.y}%`, rotate: `${friend.angle}deg` }}
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              draggingRef.current = friend.id;
              setDragging(friend.id);
            }}
            onPointerMove={(event) => move(event.clientX, event.clientY, friend.id)}
            onPointerUp={release}
            onPointerCancel={release}
          />
        ))}
      </div>
    </section>
  );
}
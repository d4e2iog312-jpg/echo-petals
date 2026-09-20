import { useEffect, useRef, useState } from "react";
import cartaRasca from "@/assets/carta-rasca.png.asset.json";
import alegre from "@/assets/amigo-alegre-limpio.png.asset.json";
import timido from "@/assets/amigo-timido-limpio.png.asset.json";

type Friend = { id: number; src: string; x: number; y: number; angle: number };
const STARTS = [[32, 28], [68, 28]];

export function ScratchLetter({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);
  const strokes = useRef(0);
  const [friends, setFriends] = useState<Friend[]>(() => STARTS.map(([x, y], id) => ({
    id,
    x: x ?? 0,
    y: y ?? 0,
    angle: (id % 2 ? 1 : -1) * (3 + (id % 3) * 3),
    src: id % 2 ? timido.url : alegre.url,
  })));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#b9b5aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 450; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,.2)" : "rgba(55,52,48,.12)";
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
    }
  }, []);

  const moveFriend = (event: React.PointerEvent<HTMLImageElement>, id: number) => {
    if (draggingRef.current !== id || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setFriends((items) => items.map((item) => item.id === id ? { ...item, x, y } : item));
  };

  const releaseFriend = (event: React.PointerEvent<HTMLImageElement>, id: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    const outside = rect && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
    event.currentTarget.releasePointerCapture(event.pointerId);
    draggingRef.current = null;
    if (outside) {
      setFriends((items) => items.filter((item) => item.id !== id));
    }
  };

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!(event.buttons & 1)) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 72, 0, Math.PI * 2);
    ctx.fill();
    strokes.current += 1;
    if (strokes.current === 65) window.setTimeout(onComplete, 600);
  };

  return (
    <section className="etapa etapa-rasca">
      <div ref={areaRef} className="rasca-area">
        {friends.map((friend) => (
          <img key={friend.id} src={friend.src} alt="Personaje dibujado" className="rasca-amiguito" style={{ left: `${friend.x}%`, top: `${friend.y}%`, rotate: `${friend.angle}deg` }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); draggingRef.current = friend.id; }} onPointerMove={(event) => moveFriend(event, friend.id)} onPointerUp={(event) => releaseFriend(event, friend.id)} draggable={false} />
        ))}
        <div className="rasca-marco">
          <img src={cartaRasca.url} alt="Carta ilustrada para Key" />
          <canvas ref={canvasRef} width={1024} height={1536} aria-label="Superficie para rascar y descubrir la carta" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); scratch(event); }} onPointerMove={scratch} />
        </div>
      </div>
    </section>
  );
}

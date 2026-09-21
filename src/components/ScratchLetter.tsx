import { useEffect, useRef, useState } from "react";
const muñecosKey = "/assets/muñecos-recorte.jpeg";

type Friend = { id: number; side: "izquierdo" | "derecho"; x: number; y: number; angle: number };
const STARTS: Friend[] = [
  { id: 0, side: "izquierdo", x: 16, y: 22, angle: -4 },
  { id: 1, side: "derecho", x: 50, y: 20, angle: 3 },
  { id: 2, side: "izquierdo", x: 82, y: 25, angle: -2 },
  { id: 3, side: "derecho", x: 30, y: 70, angle: 3 },
  { id: 4, side: "izquierdo", x: 68, y: 72, angle: -3 },
];

export function ScratchLetter({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const strokes = useRef(0);
  const [friends, setFriends] = useState<Friend[]>(STARTS);

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

  const removeFriend = (id: number) => {
    setFriends((items) => items.filter((item) => item.id !== id));
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
          <button
            key={friend.id}
            type="button"
            aria-label="Quitar personaje"
            className={`rasca-amiguito ${friend.side}`}
            style={{
              left: `${friend.x}%`,
              top: `${friend.y}%`,
              rotate: `${friend.angle}deg`,
              backgroundImage: `url("${muñecosKey}")`,
            }}
            onClick={() => removeFriend(friend.id)}
          />
        ))}
        <div className="rasca-marco">
          <img src="/assets/carta-etapa-dos.png?v=flowers-yellow-20260920" alt="Carta del Día de las Flores Amarillas" />
          <canvas ref={canvasRef} width={1024} height={1536} aria-label="Superficie para rascar y descubrir la carta" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); scratch(event); }} onPointerMove={scratch} />
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import cartaRasca from "@/assets/carta-rasca.png.asset.json";

export function ScratchLetter({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#b9b5aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#77746d";
    ctx.font = "700 46px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("RASCA AQUÍ", canvas.width / 2, canvas.height / 2);
    for (let i = 0; i < 450; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,.2)" : "rgba(55,52,48,.12)";
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
    }
  }, []);

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
    const next = Math.min(100, Math.round((strokes.current / 65) * 100));
    setProgress(next);
    if (next >= 72) window.setTimeout(onComplete, 600);
  };

  return (
    <section className="etapa etapa-rasca">
      <p className="kicker">hay algo debajo</p>
      <h2>Descúbrelo poco a poco</h2>
      <div className="rasca-marco">
        <img src={cartaRasca.url} alt="Carta ilustrada para Key" />
        <canvas
          ref={canvasRef}
          width={1024}
          height={1536}
          aria-label="Superficie para rascar y descubrir la carta"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            scratch(event);
          }}
          onPointerMove={scratch}
        />
      </div>
      <div className="rasca-progreso" aria-label={`${progress}% descubierto`}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
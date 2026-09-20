import { useEffect, useRef, useState, useCallback } from "react";
import florAsset from "@/assets/flor.png.asset.json";

const FRASES = [
  "feliz día :3",
  "te amo",
  "eres mi todo",
  "te pienso mucho",
  "mi girasol",
];

/** Perfiles: cada flor que cae se ve distinta (tono, tamaño, giro, opacidad). */
type Profile = {
  filter: string;
  flip: boolean;
  petals: number;
};

const PROFILES: Profile[] = [
  { filter: "none", flip: false, petals: 0 },
  { filter: "hue-rotate(-12deg) saturate(1.15)", flip: true, petals: 0 },
  { filter: "hue-rotate(14deg) brightness(1.06)", flip: false, petals: 0 },
  { filter: "saturate(0.8) brightness(1.12)", flip: true, petals: 0 },
  { filter: "hue-rotate(-25deg) saturate(1.3) brightness(0.95)", flip: false, petals: 0 },
  { filter: "contrast(1.15) hue-rotate(6deg)", flip: true, petals: 0 },
];

type Falling = {
  id: number;
  x: number;
  y: number;
  size: number;
  amp: number;
  freq: number;
  phase: number;
  vy: number;
  spin: number;
  tilt: number;
  profile: number;
  el?: HTMLButtonElement | null;
};

type Broken = {
  id: number;
  x: number;
  y: number;
  size: number;
  profile: number;
  frase: string;
  rot: number;
};

let uid = 1;

export function FlowerRain({ active = true, delicate = false }: { active?: boolean; delicate?: boolean }) {
  const [falling, setFalling] = useState<Falling[]>([]);
  const [broken, setBroken] = useState<Broken[]>([]);
  const fallingRef = useRef<Falling[]>([]);
  const burstRef = useRef(0);

  fallingRef.current = falling;

  useEffect(() => {
    setFalling([]);
    setBroken([]);
  }, [delicate]);

  const spawn = useCallback((count: number, fromTop = true) => {
    const w = window.innerWidth;
    const add: Falling[] = [];
    for (let i = 0; i < count; i++) {
      const size = delicate ? 20 + Math.random() * 14 : 42 + Math.random() * 46;
      add.push({
        id: uid++,
        x: Math.random() * (w - size),
        y: fromTop ? -size - Math.random() * 220 : Math.random() * -600,
        size,
        amp: 26 + Math.random() * 55,
        freq: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        vy: 58 + Math.random() * 42,
        spin: (Math.random() * 2 - 1) * 26,
        tilt: Math.random() * 360,
        profile: Math.floor(Math.random() * PROFILES.length),
      });
    }
    setFalling((prev) => [...prev, ...add].slice(-90));
  }, []);

  // Caen ~3 flores cada 3 segundos
  useEffect(() => {
    if (!active) return;
    spawn(delicate ? 2 : 3);
    const id = window.setInterval(() => spawn(delicate ? 1 : 3), delicate ? 4500 : 3000);
    return () => window.clearInterval(id);
  }, [active, delicate, spawn]);

  // Sacudir el teléfono => lluvia de flores
  useEffect(() => {
    if (!active) return;
    let last = { x: 0, y: 0, z: 0 };
    let lastTime = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const now = Date.now();
      if (now - lastTime < 120) return;
      const dx = Math.abs((a.x ?? 0) - last.x);
      const dy = Math.abs((a.y ?? 0) - last.y);
      const dz = Math.abs((a.z ?? 0) - last.z);
      last = { x: a.x ?? 0, y: a.y ?? 0, z: a.z ?? 0 };
      lastTime = now;
      if (dx + dy + dz > 28 && now - burstRef.current > 900) {
        burstRef.current = now;
        spawn(4);
      }
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [active, spawn]);

  // Animación: caída tipo hoja (zig-zag) con giro
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const h = window.innerHeight;
      const dead: number[] = [];
      for (const f of fallingRef.current) {
        f.phase += f.freq * dt;
        f.y += f.vy * dt;
        f.tilt += f.spin * dt;
        if (f.y > h + 120) dead.push(f.id);
        if (f.el) {
          const sway = Math.sin(f.phase) * f.amp;
          const wobble = Math.sin(f.phase * 2.1) * 12;
          f.el.style.transform = `translate3d(${f.x + sway}px, ${f.y}px, 0) rotate(${
            f.tilt + sway * 0.35
          }deg) rotateY(${wobble * 4}deg)`;
        }
      }
      if (dead.length) {
        setFalling((prevArr) => prevArr.filter((f) => !dead.includes(f.id)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const breakFlower = (f: Falling) => {
    const rect = f.el?.getBoundingClientRect();
    setBroken((prev) => [
      ...prev,
      {
        id: f.id,
        x: rect ? rect.left : f.x,
        y: rect ? rect.top : f.y,
        size: f.size,
        profile: f.profile,
        frase: FRASES[Math.floor(Math.random() * FRASES.length)] ?? "feliz día :3",
        rot: f.tilt,
      },
    ]);
    setFalling((prev) => prev.filter((x) => x.id !== f.id));
    window.setTimeout(() => {
      setBroken((prev) => prev.filter((b) => b.id !== f.id));
    }, 3400);
  };

  return (
    <div className="flower-layer">
      {falling.map((f) => {
        const p = PROFILES[f.profile] ?? PROFILES[0];
        if (!p) return null;
        return (
          <button
            key={f.id}
            type="button"
            aria-label="flor amarilla"
            ref={(el) => {
              f.el = el;
            }}
            onPointerDown={() => breakFlower(f)}
            className="falling-flower"
            style={{
              width: f.size,
              height: f.size,
              filter: p.filter,
              transform: `translate3d(${f.x}px, ${f.y}px, 0)`,
            }}
          >
            <img
              src={florAsset.url}
              alt=""
              draggable={false}
              style={{ transform: p.flip ? "scaleX(-1)" : undefined }}
            />
          </button>
        );
      })}

      {broken.map((b) => {
        const p = PROFILES[b.profile] ?? PROFILES[0];
        if (!p) return null;
        return (
          <div
            key={b.id}
            className="broken-wrap"
            style={{ left: b.x, top: b.y, width: b.size, height: b.size }}
          >
            <div className="half half-l" style={{ filter: p.filter }}>
              <img src={florAsset.url} alt="" />
            </div>
            <div className="half half-r" style={{ filter: p.filter }}>
              <img src={florAsset.url} alt="" />
            </div>
            <span className="frase">{b.frase}</span>
          </div>
        );
      })}
    </div>
  );
}

export async function pedirPermisoSacudida(): Promise<boolean> {
  const dm = window.DeviceMotionEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  if (dm && typeof dm.requestPermission === "function") {
    try {
      const res = await dm.requestPermission();
      return res === "granted";
    } catch {
      return false;
    }
  }
  return true;
}

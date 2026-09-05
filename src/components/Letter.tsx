import { useState } from "react";
import sobreAsset from "@/assets/sobre.png.asset.json";

export function Letter({ texto }: { texto: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="letter-zone">
      <svg width="0" height="0" aria-hidden className="absolute">
        <filter id="arrugado">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" result="n">
            <animate
              attributeName="baseFrequency"
              from="0.07"
              to="0.002"
              dur="1.6s"
              begin="indefinite"
              fill="freeze"
              id="anim-freq"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26">
            <animate
              attributeName="scale"
              from="26"
              to="0"
              dur="1.6s"
              begin="indefinite"
              fill="freeze"
              id="anim-scale"
            />
          </feDisplacementMap>
        </filter>
      </svg>

      {!open && (
        <button
          type="button"
          className="envelope"
          onClick={() => {
            setOpen(true);
            requestAnimationFrame(() => {
              document
                .querySelectorAll<SVGAnimateElement>("#anim-freq, #anim-scale")
                .forEach((a) => a.beginElement?.());
            });
          }}
        >
          <img src={sobreAsset.url} alt="Una carta cerrada con un sello" />
          <span className="envelope-hint">toca para abrir</span>
        </button>
      )}

      {open && (
        <div className="letter-open">
          <div className="envelope-back">
            <img src={sobreAsset.url} alt="" aria-hidden />
            <span className="flap" />
          </div>
          <article className="paper">
            {texto.map((p, i) => (
              <p key={i} style={{ animationDelay: `${1.3 + i * 0.35}s` }}>
                {p}
              </p>
            ))}
            <span className="paper-sign">— con cariño 🌻</span>
          </article>
        </div>
      )}
    </div>
  );
}

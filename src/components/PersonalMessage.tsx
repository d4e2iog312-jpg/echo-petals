import { useState } from "react";

export function PersonalMessage({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [focused, setFocused] = useState(false);

  return (
    <section className="etapa etapa-mensaje-propio">
      <p className="kicker">unas palabras tuyas</p>
      <h2>Para Key</h2>
      <div className={`papel-mensaje ${focused ? "escribiendo" : ""}`}>
        <textarea
          aria-label="Mensaje para Key"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Para Key..."
          maxLength={1200}
        />
        <span className="firma-mensaje">♡</span>
      </div>
    </section>
  );
}
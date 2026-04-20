import { useMemo } from 'react';
import './StarBackground.css';

export function StarBackground() {
  const generateShadows = (count: number) => {
    let shadows = [];
    for (let i = 0; i < count; i++) {
      shadows.push(`${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`);
    }
    return shadows.join(', ');
  };

  const shadowsSmall = useMemo(() => generateShadows(700), []);
  const shadowsMedium = useMemo(() => generateShadows(200), []);
  const shadowsBig = useMemo(() => generateShadows(100), []);

  return (
    <div className="star-background-wrapper">
      <div id="stars" style={{ boxShadow: shadowsSmall }} />
      <div id="stars2" style={{ boxShadow: shadowsMedium }} />
      <div id="stars3" style={{ boxShadow: shadowsBig }} />
    </div>
  );
}

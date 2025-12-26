export const AnimatedLightDot = ({ progress, index, points }) => {
  if (!points || points.length === 0) return null;

  const position = calculateDotPosition(progress, index, points);
  if (!position) return null;

  return (
    <g>
      <PulsingRing cx={position.x} cy={position.y} r={16} opacity={0.1} duration="1.2s" />
      <PulsingRing cx={position.x} cy={position.y} r={10} opacity={0.3} duration="1.2s" />
      <CoreDot cx={position.x} cy={position.y} />
      <InnerGlow cx={position.x} cy={position.y} />
    </g>
  );
};

// Calcula la posición interpolada del punto usando Hermite spline
const calculateDotPosition = (progress, index, points) => {
  const totalPoints = points.length;
  const currentIndex = progress * (totalPoints - 1);
  const lowerIndex = Math.floor(currentIndex);
  const upperIndex = Math.ceil(currentIndex);

  // Solo renderizar en el índice activo
  if (index !== lowerIndex) return null;

  const fraction = currentIndex - lowerIndex;
  const interpolationPoints = getInterpolationPoints(points, lowerIndex, upperIndex);
  
  return interpolatePosition(interpolationPoints, fraction);
};

// Obtiene los 4 puntos necesarios para la interpolación
const getInterpolationPoints = (points, lowerIndex, upperIndex) => {
  const point1 = points[lowerIndex];
  const point2 = points[upperIndex] || point1;
  const point0 = points[lowerIndex - 1] || point1;
  const point3 = points[upperIndex + 1] || point2;

  return { point0, point1, point2, point3 };
};

// Aplica interpolación Hermite spline
const interpolatePosition = ({ point0, point1, point2, point3 }, t) => {
  const t2 = t * t;
  const t3 = t2 * t;

  // Coeficientes de Hermite
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  // Tangentes con tensión
  const tension = 0.25;
  const m0 = {
    x: (point2.x - point0.x) * tension,
    y: (point2.y - point0.y) * tension
  };
  const m1 = {
    x: (point3.x - point1.x) * tension,
    y: (point3.y - point1.y) * tension
  };

  // Posición interpolada
  return {
    x: h00 * point1.x + h10 * m0.x + h01 * point2.x + h11 * m1.x,
    y: h00 * point1.y + h10 * m0.y + h01 * point2.y + h11 * m1.y
  };
};

// Componentes visuales reutilizables
const PulsingRing = ({ cx, cy, r, opacity, duration }) => (
  <circle cx={cx} cy={cy} r={r} fill="#3b82f6" opacity={opacity}>
    <animate
      attributeName="r"
      values={`${r};${r + 4};${r}`}
      dur={duration}
      repeatCount="indefinite"
    />
    <animate
      attributeName="opacity"
      values={`${opacity};${opacity / 2};${opacity}`}
      dur={duration}
      repeatCount="indefinite"
    />
  </circle>
);

const CoreDot = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={5} fill="white" filter="url(#glow)">
    <animate attributeName="r" values="4;5;4" dur="1s" repeatCount="indefinite" />
  </circle>
);

const InnerGlow = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={2.5} fill="#ffffff" opacity={0.9}>
    <animate
      attributeName="opacity"
      values="0.9;1;0.9"
      dur="1s"
      repeatCount="indefinite"
    />
  </circle>
);
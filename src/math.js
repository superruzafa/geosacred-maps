export const Pi2 = Math.PI * 2;
// export const PiD2 = Math.PI / 2;
// export const PiD4 = Math.PI / 4;

export const Sqrt2 = Math.sqrt(2);

export function modulo(value, mod) {
  return ((value % mod) + mod) % mod;
}

export function deg2rad(angle) {
  return modulo(angle * Pi2 / 360, Pi2);
}

export function rad2deg(angle) {
  return modulo(angle * 360 / Pi2, 360);
}

export function polar2cart({ r, a }) {
  return {
    x: r * Math.cos(a),
    y: r * Math.sin(a),
  };
}

// export function cart2polar({ x, y }) {
//   return {
//     r: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
//     a: Math.atan2(y, x)
//   };
// }

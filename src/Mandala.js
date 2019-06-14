import {
  deg2rad,
  Pi2,
  polar2cart,
  rad2deg,
  Sqrt2,
} from './math.js';

function pixelRatio(length) {
  return length / devicePixelRatio;
}

const ECLIPTIC = deg2rad(23.44);
const SIN_ECLIPTIC = Math.sin(ECLIPTIC);

export default class Mandala {
  constructor(options = {}) {
    this._width = options.width || 200;
    this._height = options.height || 200;
    this._canvas = document.createElement('canvas');
    this._canvas.style.width = `${this._width}px`;
    this._canvas.style.height = `${this._height}px`;
    this._canvas.width = this._width * devicePixelRatio;
    this._canvas.height = this._height * devicePixelRatio;
    const ctx = this._canvas.getContext('2d');
    const halfWidth = this._width / 2 * devicePixelRatio;
    const halfHeight = this._height / 2 * devicePixelRatio;
    ctx.setTransform(
      devicePixelRatio, 0,
      0, devicePixelRatio,
      halfWidth, halfHeight
    );
    const safeMargin = 10;
    this._solarRadius = (Math.min(this._width, this._height) - safeMargin) * Sqrt2 / 4;
  }

  canvas() {
    return this._canvas;
  }

  update({ latlng }) {
    const ctx = this._canvas.getContext('2d');
    const { lat } = latlng;
    const values = this._calculateValues({ lat });
    this
      ._clear(ctx)
      ._drawAxes(ctx)
      ._drawAzimuth(ctx, values)
      ._drawSolarRect(ctx, values)
      ._drawLunarRect(ctx, values)
      ._drawMotherSquare(ctx, values)
      ._drawFatherSquare(ctx, values)
      ._drawFinisterreCircle(ctx, values)
      ;
  }

  _clear(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'copy';
    ctx.strokeStyle = 'transparent';
    ctx.beginPath();
    ctx.strokeRect(0, 0, 1, 1);
    ctx.restore();
    return this;
  }

  _drawAxes(ctx) {
    const width2 = this._width / 2;
    const height2 = this._height / 2;
    ctx.save();
    ctx.lineWidth = pixelRatio(1);
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(-width2, 0);
    ctx.lineTo(width2, 0);
    ctx.moveTo(0, -height2);
    ctx.lineTo(0, height2);
    ctx.stroke();
    ctx.restore();
    return this;
  }

  _drawAzimuth(ctx, values) {
    const angle = deg2rad(90 - values.nAz);
    const angle2 = deg2rad(90 - values.nAz / 2);
    const arcRadius = this._solarRadius / 4;
    const { x, y } = polar2cart({
      r: this._solarRadius,
      a: angle
    })
    const { x: xt, y: yt } = polar2cart({
      r: arcRadius + 5,
      a: deg2rad(90 - values.nAz / 2)
    })
    ctx.save();
    ctx.strokeStyle = '#888';
    ctx.fillStyle = '#888';
    ctx.lineWidth = pixelRatio(1);
    ctx.font = `12px sans-serif`;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, -y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, arcRadius, Math.PI * 3/2, -angle);
    ctx.stroke();

    ctx.save();
    const nAzText = `${Math.floor(values.nAz * 100) / 100}º`;
    ctx.beginPath();
    ctx.translate(xt, -yt);
    ctx.rotate(-angle2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(nAzText, 0, 0);
    ctx.restore();

    const kTxt = Math.floor(values.k * 1000) / 1000;
    ctx.beginPath();
    ctx.rotate(-angle);
    ctx.textAlign = 'center';
    ctx.fillText(kTxt, this._solarRadius / 2, 12);
    ctx.restore();
    return this;
  }


  _drawSolarRect(ctx, values) {
    const angle = deg2rad(90 - values.nAz);
    const { x, y } = polar2cart({
      r: this._solarRadius,
      a: angle
    });
    const lineWidth = pixelRatio(2);
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'orange';
    ctx.setLineDash([lineWidth, lineWidth]);
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(-y, -x, y * 2, x * 2);
    ctx.restore();
    return this;
  }


  _drawLunarRect(ctx, values) {
    const angle = deg2rad(90 - values.nAz);
    const { x, y } = polar2cart({
      r: this._solarRadius,
      a: angle
    });
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = pixelRatio(2);
    ctx.strokeRect(-x, -y, x * 2, y * 2);
    ctx.restore();
    return this;
  }

  _drawMotherSquare(ctx, values) {
    const angle = deg2rad(90 - values.nAz);
    const { x, y } = polar2cart({
      r: this._solarRadius,
      a: angle
    });
    const z = Math.max(x, y);
    const z2 = z * 2;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = pixelRatio(2);
    ctx.strokeRect(-z, -z, z2, z2);
    ctx.restore();
    return this;
  }

  _drawFatherSquare(ctx, values) {
    const angle = deg2rad(90 - values.nAz);
    const { x, y } = polar2cart({
      r: this._solarRadius,
      a: angle
    });
    const z = Math.max(x, y);
    const z2 = z * 2;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = pixelRatio(2);
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-z, -z, z2, z2);
    ctx.restore();
    return this;
  }

  _drawFinisterreCircle(ctx, values) {
    const angle = deg2rad(90 - values.nAz);
    const { x, y } = polar2cart({
      r: this._solarRadius,
      a: angle
    });
    const z = Math.max(x, y);
    const r = Math.sqrt(2 * Math.pow(z, 2));
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#a52a2a';
    ctx.lineWidth = pixelRatio(2);
    ctx.arc(0, 0, r, 0, Pi2);
    ctx.stroke();
    ctx.restore();
    return this;
  }

  _calculateValues({ lat }) {
    const cosLatitude = Math.cos(deg2rad(lat));
    const northAzimuth = Math.acos(SIN_ECLIPTIC / cosLatitude);
    const k = Math.tan(northAzimuth);
    return {
      lat,
      nAz: rad2deg(northAzimuth),
      k
    };
  }
}

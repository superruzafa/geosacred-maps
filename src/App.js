import * as L from 'https://unpkg.com/leaflet@1.5.1/dist/leaflet-src.esm.js'
import Mandala from './Mandala.js';

export default class App {
  constructor(id) {
    const center = [0, 0];
    const accessToken = 'pk.eyJ1Ijoic3VwZXJydXphZmEiLCJhIjoiY2pyZ3VnNmNzMTFmYjN6bWprMWF0dnd2cCJ9.zy5R_I0TyDopEL9EI9gVVA';
    const streetsLayer = L.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken
      }
    );
    this._map = L.map(id, {
      center,
      zoom: 2,
      layers: streetsLayer
    });
    this._map.addEventListener('click', (e) => this._onMapClick(e), false);

    this._mandala = new Mandala();

    this._popup = L.popup()
      .setLatLng(center)
      .setContent(this._mandala.canvas());
  }

  static run(id) {
    new App(id);
  }

  _onMapClick(e) {
    const latlng = e.latlng;
    this._updateMandalaPopup({ latlng });
  }

  _updateMandalaPopup({ latlng }) {
    this._mandala.update({ latlng });
    this._popup.setLatLng(latlng);
    if (this._popup.isOpen()) {
      this._popup.update();
    } else {
      this._popup.openOn(this._map);
    }
  }
}

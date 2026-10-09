(function(){ const L2=L; const CONFIG={minDataZoom:4,maxDataZoom:9,tileSize:256,sourceLayer:"admin"}; const {VectorTile,Pbf}=MapDataLib;
    function pointInRing(x2, y, ring) {
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
        const xi = ring[i].x;
        const yi = ring[i].y;
        const xj = ring[j].x;
        const yj = ring[j].y;
        const crosses = yi > y !== yj > y && x2 < (xj - xi) * (y - yi) / (yj - yi || Number.EPSILON) + xi;
        if (crosses) inside = !inside;
      }
      return inside;
    }
    function pointInGeometry(x2, y, geometry) {
      let inside = false;
      for (const ring of geometry) {
        if (ring.length > 2 && pointInRing(x2, y, ring)) inside = !inside;
      }
      return inside;
    }
    const BoundaryLayer = L2.GridLayer.extend({
      initialize(pmtilesArchive, options = {}) {
        L2.setOptions(this, options);
        this.archive = pmtilesArchive;
        this.decodedTiles = /* @__PURE__ */ new Map();
        this.selectedIds = /* @__PURE__ */ new Set();
        this.showFill = true;
      },
      createTile(coords, done) {
        const tile = L2.DomUtil.create("canvas", "vietflex-boundary-tile");
        const size = this.getTileSize();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        tile.width = size.x * ratio;
        tile.height = size.y * ratio;
        tile.style.width = `${size.x}px`;
        tile.style.height = `${size.y}px`;
        tile.setAttribute("role", "presentation");
        const context = tile.getContext("2d");
        context.scale(ratio, ratio);
        const address = this._nativeAddress(coords);
        this._getDecodedTile(address.z, address.x, address.y).then((features) => {
          this._paint(context, size.x, features, address);
          done(null, tile);
        }).catch((error) => done(error, tile));
        return tile;
      },
      _nativeAddress(coords) {
        const z2 = Math.min(Math.max(coords.z, CONFIG.minDataZoom), CONFIG.maxDataZoom);
        const difference = Math.max(0, coords.z - z2);
        const factor = 2 ** difference;
        const x2 = Math.floor(coords.x / factor);
        const y = Math.floor(coords.y / factor);
        return {
          z: z2,
          x: x2,
          y,
          factor,
          offsetX: coords.x - x2 * factor,
          offsetY: coords.y - y * factor
        };
      },
      _getDecodedTile(z2, x2, y) {
        const key = `${z2}/${x2}/${y}`;
        if (!this.decodedTiles.has(key)) {
          const promise = this.archive.getZxy(z2, x2, y).then((result) => {
            if (!result) return [];
            const vectorTile = new VectorTile(new Pbf(new Uint8Array(result.data)));
            const layer = vectorTile.layers[CONFIG.sourceLayer];
            if (!layer) return [];
            const features = [];
            for (let index = 0; index < layer.length; index += 1) {
              const feature = layer.feature(index);
              if (feature.type !== 3) continue;
              features.push({
                properties: feature.properties,
                geometry: feature.loadGeometry(),
                extent: layer.extent || 4096
              });
            }
            return features;
          });
          this.decodedTiles.set(key, promise);
        }
        return this.decodedTiles.get(key);
      },
      _paint(context, size, features, address) {
        for (const feature of features) {
          const properties = feature.properties || {};
          const isProvince = properties.level === "province";
          const isSelected = this.selectedIds.has(String(properties.id));
          const scale = address.factor;
          context.beginPath();
          for (const ring of feature.geometry) {
            if (!ring.length) continue;
            for (let index = 0; index < ring.length; index += 1) {
              const point = ring[index];
              const x2 = (point.x / feature.extent * scale - address.offsetX) * size;
              const y = (point.y / feature.extent * scale - address.offsetY) * size;
              if (index === 0) context.moveTo(x2, y);
              else context.lineTo(x2, y);
            }
            context.closePath();
          }
          if (this.showFill || isSelected) {
            context.fillStyle = isSelected ? "rgba(255, 224, 72, .58)" : isProvince ? "rgba(210, 32, 48, .075)" : "rgba(17, 102, 204, .075)";
            context.fill("evenodd");
          }
          context.strokeStyle = isSelected ? "#d51f34" : isProvince ? "#bd2333" : "#1467ba";
          context.lineWidth = isSelected ? 2.8 : isProvince ? 1.35 : 0.85;
          context.globalAlpha = isSelected ? 1 : 0.94;
          context.stroke();
          context.globalAlpha = 1;
        }
      },
      setSelected(ids) {
        this.selectedIds = new Set(ids.map(String));
        this.redraw();
      },
      setFillVisible(visible) {
        this.showFill = Boolean(visible);
        this.redraw();
      },
      async featureAt(latlng, mapZoom, map2) {
        const nativeZoom = Math.min(Math.max(mapZoom, CONFIG.minDataZoom), CONFIG.maxDataZoom);
        const projected = map2.project(latlng, nativeZoom);
        const x2 = Math.floor(projected.x / CONFIG.tileSize);
        const y = Math.floor(projected.y / CONFIG.tileSize);
        const features = await this._getDecodedTile(nativeZoom, x2, y);
        if (!features.length) return null;
        const localX = (projected.x - x2 * CONFIG.tileSize) / CONFIG.tileSize * features[0].extent;
        const localY = (projected.y - y * CONFIG.tileSize) / CONFIG.tileSize * features[0].extent;
        for (let index = features.length - 1; index >= 0; index -= 1) {
          const feature = features[index];
          if (pointInGeometry(localX, localY, feature.geometry)) return feature;
        }
        return null;
      }
    });
window.BoundaryLayer=BoundaryLayer;})();
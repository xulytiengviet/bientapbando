
(() => {
  // node_modules/fflate/esm/browser.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b2 = new u16(31);
    for (var i = 0; i < 31; ++i) {
      b2[i] = start += 1 << eb[i - 1];
    }
    var r = new i32(b2[30]);
    for (var i = 1; i < 30; ++i) {
      for (var j = b2[i]; j < b2[i + 1]; ++j) {
        r[j] = j - b2[i] << 5 | i;
      }
    }
    return { b: b2, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x2 = (i & 43690) >> 1 | (i & 21845) << 1;
    x2 = (x2 & 52428) >> 2 | (x2 & 13107) << 2;
    x2 = (x2 & 61680) >> 4 | (x2 & 3855) << 4;
    rev[i] = ((x2 & 65280) >> 8 | (x2 & 255) << 8) >> 1;
  }
  var x2;
  var i;
  var hMap = (function(cd, mb, r) {
    var s = cd.length;
    var i = 0;
    var l = new u16(mb);
    for (; i < s; ++i) {
      if (cd[i])
        ++l[cd[i] - 1];
    }
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
      le[i] = le[i - 1] + l[i - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          var sv = i << 4 | cd[i];
          var r_1 = mb - cd[i];
          var v2 = le[cd[i] - 1]++ << r_1;
          for (var m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2) {
            co[rev[v2] >> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
        }
      }
    }
    return co;
  });
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m2 = a[0];
    for (var i = 1; i < a.length; ++i) {
      if (a[i] > m2)
        m2 = a[i];
    }
    return m2;
  };
  var bits = function(d2, p, m2) {
    var o = p / 8 | 0;
    return (d2[o] | d2[o + 1] << 8) >> (p & 7) & m2;
  };
  var bits16 = function(d2, p) {
    var o = p / 8 | 0;
    return (d2[o] | d2[o + 1] << 8 | d2[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v2, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v2.length)
      e = v2.length;
    return new u8(v2.subarray(s, e));
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    // determined by compression function
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, st, buf, dict) {
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf;
    var resize = noBuf || st.i != 2;
    var noSt = st.i;
    if (noBuf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i = 0; i < hcLen; ++i) {
            clt[clim[i]] = bits(dat, pos + i * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i = 0; i < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >> 4;
            if (s < 16) {
              ldt[i++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (resize)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i = sym - 257, b2 = fleb[i];
            add = bits(dat, pos, (1 << b2) - 1) + fl[i];
            pos += b2;
          }
          var d2 = dm[bits16(dat, pos) & dms], dsym = d2 >> 4;
          if (!d2)
            err(3);
          pos += d2 & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b2 = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b2) - 1, pos += b2;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + 131072);
          var end = bt + add;
          if (bt < dt) {
            var shift = dl - dt, dend = Math.min(dt, end);
            if (shift + bt < 0)
              err(3);
            for (; bt < dend; ++bt)
              buf[bt] = dict[shift + bt];
          }
          for (; bt < end; ++bt)
            buf[bt] = buf[bt - dt];
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  var gzs = function(d2) {
    if (d2[0] != 31 || d2[1] != 139 || d2[2] != 8)
      err(6, "invalid gzip data");
    var flg = d2[3];
    var st = 10;
    if (flg & 4)
      st += (d2[10] | d2[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d2[st++])
      ;
    return st + (flg & 2);
  };
  var gzl = function(d2) {
    var l = d2.length;
    return (d2[l - 4] | d2[l - 3] << 8 | d2[l - 2] << 16 | d2[l - 1] << 24) >>> 0;
  };
  var zls = function(d2, dict) {
    if ((d2[0] & 15) != 8 || d2[0] >> 4 > 7 || (d2[0] << 8 | d2[1]) % 31)
      err(6, "invalid zlib data");
    if ((d2[1] >> 5 & 1) == +!dict)
      err(6, "invalid zlib data: " + (d2[1] & 32 ? "need" : "unexpected") + " dictionary");
    return (d2[1] >> 3 & 4) + 2;
  };
  function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  function gunzipSync(data, opts) {
    var st = gzs(data);
    if (st + 8 > data.length)
      err(6, "invalid gzip data");
    return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
  }
  function unzlibSync(data, opts) {
    return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  function decompressSync(data, opts) {
    return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, opts) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, opts) : unzlibSync(data, opts);
  }
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }

  // node_modules/pmtiles/dist/esm/index.js
  var z = Object.defineProperty;
  var B = Math.pow;
  var d = (i, t) => z(i, "name", { value: t, configurable: true });
  var m = (i, t, e) => new Promise((r, n) => {
    var s = (c) => {
      try {
        a(e.next(c));
      } catch (u) {
        n(u);
      }
    }, o = (c) => {
      try {
        a(e.throw(c));
      } catch (u) {
        n(u);
      }
    }, a = (c) => c.done ? r(c.value) : Promise.resolve(c.value).then(s, o);
    a((e = e.apply(i, t)).next());
  });
  var re = d((i, t) => {
    let e = false, r = "", n = L.GridLayer.extend({ createTile: d((s, o) => {
      let a = document.createElement("img"), c = new AbortController(), u = c.signal;
      return a.cancel = () => {
        c.abort();
      }, e || (i.getHeader().then((l) => {
        l.tileType === 1 || l.tileType === 6 ? console.error("Error: archive contains vector tiles, but leafletRasterLayer is for displaying raster tiles. See https://github.com/protomaps/PMTiles/tree/main/js for details.") : l.tileType === 2 ? r = "image/png" : l.tileType === 3 ? r = "image/jpeg" : l.tileType === 4 ? r = "image/webp" : l.tileType === 5 && (r = "image/avif");
      }), e = true), i.getZxy(s.z, s.x, s.y, u).then((l) => {
        if (l) {
          let f = new Blob([l.data], { type: r }), y = window.URL.createObjectURL(f);
          a.src = y;
        } else a.style.display = "none";
        a.cancel = void 0, o(void 0, a);
      }).catch((l) => {
        if (l.name !== "AbortError") throw l;
      }), a;
    }, "createTile"), _removeTile: d(function(s) {
      let o = this._tiles[s];
      o && (o.el.cancel && o.el.cancel(), o.el.src && window.URL.revokeObjectURL(o.el.src), o.el.width = 0, o.el.height = 0, o.el.deleted = true, L.DomUtil.remove(o.el), delete this._tiles[s], this.fire("tileunload", { tile: o.el, coords: this._keyToTileCoords(s) }));
    }, "_removeTile") });
    return new n(t);
  }, "leafletRasterLayer");
  var W = d((i) => (t, e) => {
    if (e instanceof AbortController) return i(t, e);
    let r = new AbortController();
    return i(t, r).then((n) => e(void 0, n.data, n.cacheControl || "", n.expires || ""), (n) => e(n)).catch((n) => e(n)), { cancel: d(() => r.abort(), "cancel") };
  }, "v3compat");
  var E = class E2 {
    constructor(t) {
      this.tilev4 = d((t2, e) => m(this, null, function* () {
        if (t2.type === "json") {
          let y = t2.url.substr(10), p = this.tiles.get(y);
          if (p || (p = new w(y), this.tiles.set(y, p)), this.metadata) {
            let j = yield p.getTileJson(t2.url);
            return e.signal.throwIfAborted(), { data: j };
          }
          let h = yield p.getHeader();
          return e.signal.throwIfAborted(), (h.minLon >= h.maxLon || h.minLat >= h.maxLat) && console.error(`Bounds of PMTiles archive ${h.minLon},${h.minLat},${h.maxLon},${h.maxLat} are not valid.`), { data: { tiles: [`${t2.url}/{z}/{x}/{y}`], minzoom: h.minZoom, maxzoom: h.maxZoom, bounds: [h.minLon, h.minLat, h.maxLon, h.maxLat] } };
        }
        let r = new RegExp(/pmtiles:\/\/(.+)\/(\d+)\/(\d+)\/(\d+)/), n = t2.url.match(r);
        if (!n) throw new Error("Invalid PMTiles protocol URL");
        let s = n[1], o = this.tiles.get(s);
        o || (o = new w(s), this.tiles.set(s, o));
        let a = n[2], c = n[3], u = n[4], l = yield o == null ? void 0 : o.getZxy(+a, +c, +u, e.signal);
        if (e.signal.throwIfAborted(), l) return { data: new Uint8Array(l.data), cacheControl: l.cacheControl, expires: l.expires };
        let f = yield o.getHeader();
        if (f.tileType === 1 || f.tileType === 6) {
          if (this.errorOnMissingTile) throw new Error("Tile not found.");
          return { data: new Uint8Array() };
        }
        return { data: null };
      }), "tilev4");
      this.tile = W(this.tilev4);
      this.tiles = /* @__PURE__ */ new Map(), this.metadata = (t == null ? void 0 : t.metadata) || false, this.errorOnMissingTile = (t == null ? void 0 : t.errorOnMissingTile) || false;
    }
    add(t) {
      this.tiles.set(t.source.getKey(), t);
    }
    get(t) {
      return this.tiles.get(t);
    }
  };
  d(E, "Protocol");
  function b(i, t) {
    return (t >>> 0) * 4294967296 + (i >>> 0);
  }
  d(b, "toNum");
  function N(i, t) {
    let e = t.buf, r = e[t.pos++], n = (r & 112) >> 4;
    if (r < 128 || (r = e[t.pos++], n |= (r & 127) << 3, r < 128) || (r = e[t.pos++], n |= (r & 127) << 10, r < 128) || (r = e[t.pos++], n |= (r & 127) << 17, r < 128) || (r = e[t.pos++], n |= (r & 127) << 24, r < 128) || (r = e[t.pos++], n |= (r & 1) << 31, r < 128)) return b(i, n);
    throw new Error("Expected varint not more than 10 bytes");
  }
  d(N, "readVarintRemainder");
  function x(i) {
    let t = i.buf, e = t[i.pos++], r = e & 127;
    return e < 128 || (e = t[i.pos++], r |= (e & 127) << 7, e < 128) || (e = t[i.pos++], r |= (e & 127) << 14, e < 128) || (e = t[i.pos++], r |= (e & 127) << 21, e < 128) ? r : (e = t[i.pos], r |= (e & 15) << 28, N(r, i));
  }
  d(x, "readVarint");
  function Z(i, t, e, r, n) {
    return n === 0 ? r !== 0 ? [i - 1 - e, i - 1 - t] : [e, t] : [t, e];
  }
  d(Z, "rotate");
  function q(i, t, e) {
    if (i > 26) throw new Error("Tile zoom level exceeds max safe number limit (26)");
    if (t >= 1 << i || e >= 1 << i) throw new Error("tile x/y outside zoom level bounds");
    let r = ((1 << i) * (1 << i) - 1) / 3, n = i - 1, [s, o] = [t, e];
    for (let a = 1 << n; a > 0; a >>= 1) {
      let c = s & a, u = o & a;
      r += (3 * c ^ u) * (1 << n), [s, o] = Z(a, s, o, c, u), n--;
    }
    return r;
  }
  d(q, "zxyToTileId");
  function G(i) {
    let t = 3 * i + 1;
    return t < 4294967296 ? 31 - Math.clz32(t) : 63 - Math.clz32(t / 4294967296);
  }
  d(G, "tileIdToZ");
  function oe(i) {
    let t = G(i) >> 1;
    if (t > 26) throw new Error("Tile zoom level exceeds max safe number limit (26)");
    let e = ((1 << t) * (1 << t) - 1) / 3, r = i - e, n = 0, s = 0, o = 1 << t;
    for (let a = 1; a < o; a <<= 1) {
      let c = a & r / 2, u = a & (r ^ c);
      [n, s] = Z(a, n, s, c, u), r = r / 2, n += c, s += u;
    }
    return [t, n, s];
  }
  d(oe, "tileIdToZxy");
  var J = ((s) => (s[s.Unknown = 0] = "Unknown", s[s.None = 1] = "None", s[s.Gzip = 2] = "Gzip", s[s.Brotli = 3] = "Brotli", s[s.Zstd = 4] = "Zstd", s))(J || {});
  function D(i, t) {
    return m(this, null, function* () {
      if (t === 1 || t === 0) return i;
      if (t === 2) {
        if (typeof globalThis.DecompressionStream == "undefined") return decompressSync(new Uint8Array(i));
        let e = new Response(i).body;
        if (!e) throw new Error("Failed to read response stream");
        let r = e.pipeThrough(new globalThis.DecompressionStream("gzip"));
        return new Response(r).arrayBuffer();
      }
      throw new Error("Compression method not supported");
    });
  }
  d(D, "defaultDecompress");
  var O = ((a) => (a[a.Unknown = 0] = "Unknown", a[a.Mvt = 1] = "Mvt", a[a.Png = 2] = "Png", a[a.Jpeg = 3] = "Jpeg", a[a.Webp = 4] = "Webp", a[a.Avif = 5] = "Avif", a[a.Mlt = 6] = "Mlt", a))(O || {});
  function _(i) {
    return i === 1 ? ".mvt" : i === 2 ? ".png" : i === 3 ? ".jpg" : i === 4 ? ".webp" : i === 5 ? ".avif" : i === 6 ? ".mlt" : "";
  }
  d(_, "tileTypeExt");
  var Y = 127;
  function Q(i, t) {
    let e = 0, r = i.length - 1;
    for (; e <= r; ) {
      let n = r + e >> 1, s = t - i[n].tileId;
      if (s > 0) e = n + 1;
      else if (s < 0) r = n - 1;
      else return i[n];
    }
    return r >= 0 && (i[r].runLength === 0 || t - i[r].tileId < i[r].runLength) ? i[r] : null;
  }
  d(Q, "findTile");
  var A = class A2 {
    constructor(t) {
      this.file = t;
    }
    getKey() {
      return this.file.name;
    }
    getBytes(t, e) {
      return m(this, null, function* () {
        return { data: yield this.file.slice(t, t + e).arrayBuffer() };
      });
    }
  };
  d(A, "FileSource");
  var P = class P2 {
    constructor(t, e = new Headers(), r = void 0) {
      var a, c;
      this.url = t, this.customHeaders = e, this.credentials = r, this.mustReload = false;
      let n = "";
      "navigator" in globalThis && (n = (c = (a = globalThis.navigator) == null ? void 0 : a.userAgent) != null ? c : "");
      let s = n.indexOf("Windows") > -1, o = /Chrome|Chromium|Edg|OPR|Brave/.test(n);
      this.chromeWindowsNoCache = false, s && o && (this.chromeWindowsNoCache = true);
    }
    getKey() {
      return this.url;
    }
    setHeaders(t) {
      this.customHeaders = t;
    }
    getBytes(t, e, r, n) {
      return m(this, null, function* () {
        let s, o;
        r ? o = r : (s = new AbortController(), o = s.signal);
        let a = new Headers(this.customHeaders);
        a.set("range", `bytes=${t}-${t + e - 1}`);
        let c;
        this.mustReload ? c = "reload" : this.chromeWindowsNoCache && (c = "no-store");
        let u = yield fetch(this.url, { signal: o, cache: c, headers: a, credentials: this.credentials });
        if (t === 0 && u.status === 416) {
          let p = u.headers.get("Content-Range");
          if (!p || !p.startsWith("bytes */")) throw new Error("Missing content-length on 416 response");
          let h = +p.substr(8);
          a.set("range", `bytes=0-${h - 1}`), u = yield fetch(this.url, { signal: o, cache: "reload", headers: a, credentials: this.credentials });
        }
        let l = u.headers.get("Etag");
        if (l != null && l.startsWith("W/") && (l = null), u.status === 416 || n && l && l !== n) throw this.mustReload = true, new v(`Server returned non-matching ETag ${n} after one retry. Check browser extensions and servers for issues that may affect correct ETag headers.`);
        if (u.status >= 300) throw new Error(`Bad response code: ${u.status}`);
        let f = u.headers.get("Content-Length");
        if (u.status === 200 && (!f || +f > e)) throw s && s.abort(), new Error("Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving.");
        return { data: yield u.arrayBuffer(), etag: l || void 0, cacheControl: u.headers.get("Cache-Control") || void 0, expires: u.headers.get("Expires") || void 0 };
      });
    }
  };
  d(P, "FetchSource");
  var T = P;
  function g(i, t) {
    let e = i.getUint32(t + 4, true), r = i.getUint32(t + 0, true);
    return e * B(2, 32) + r;
  }
  d(g, "getUint64");
  function X(i, t) {
    let e = new DataView(i), r = e.getUint8(7);
    if (r > 3) throw new Error(`Archive is spec version ${r} but this library supports up to spec version 3`);
    return { specVersion: r, rootDirectoryOffset: g(e, 8), rootDirectoryLength: g(e, 16), jsonMetadataOffset: g(e, 24), jsonMetadataLength: g(e, 32), leafDirectoryOffset: g(e, 40), leafDirectoryLength: g(e, 48), tileDataOffset: g(e, 56), tileDataLength: g(e, 64), numAddressedTiles: g(e, 72), numTileEntries: g(e, 80), numTileContents: g(e, 88), clustered: e.getUint8(96) === 1, internalCompression: e.getUint8(97), tileCompression: e.getUint8(98), tileType: e.getUint8(99), minZoom: e.getUint8(100), maxZoom: e.getUint8(101), minLon: e.getInt32(102, true) / 1e7, minLat: e.getInt32(106, true) / 1e7, maxLon: e.getInt32(110, true) / 1e7, maxLat: e.getInt32(114, true) / 1e7, centerZoom: e.getUint8(118), centerLon: e.getInt32(119, true) / 1e7, centerLat: e.getInt32(123, true) / 1e7, etag: t };
  }
  d(X, "bytesToHeader");
  function I(i) {
    let t = { buf: new Uint8Array(i), pos: 0 }, e = x(t), r = [], n = 0;
    for (let s = 0; s < e; s++) {
      let o = x(t);
      r.push({ tileId: n + o, offset: 0, length: 0, runLength: 1 }), n += o;
    }
    for (let s = 0; s < e; s++) r[s].runLength = x(t);
    for (let s = 0; s < e; s++) r[s].length = x(t);
    for (let s = 0; s < e; s++) {
      let o = x(t);
      o === 0 && s > 0 ? r[s].offset = r[s - 1].offset + r[s - 1].length : r[s].offset = o - 1;
    }
    return r;
  }
  d(I, "deserializeIndex");
  var R = class R2 extends Error {
  };
  d(R, "EtagMismatch");
  var v = R;
  function V(i, t) {
    return m(this, null, function* () {
      let e = yield i.getBytes(0, 16384);
      if (new DataView(e.data).getUint16(0, true) !== 19792) throw new Error("Wrong magic number for PMTiles archive");
      let n = e.data.slice(0, Y), s = X(n, e.etag), o = e.data.slice(s.rootDirectoryOffset, s.rootDirectoryOffset + s.rootDirectoryLength), a = `${i.getKey()}|${s.etag || ""}|${s.rootDirectoryOffset}|${s.rootDirectoryLength}`, c = I(yield t(o, s.internalCompression));
      return [s, [a, c.length, c]];
    });
  }
  d(V, "getHeaderAndRoot");
  function K(i, t, e, r, n) {
    return m(this, null, function* () {
      let s = yield i.getBytes(e, r, void 0, n.etag), o = yield t(s.data, n.internalCompression), a = I(o);
      if (a.length === 0) throw new Error("Empty directory is invalid");
      return a;
    });
  }
  d(K, "getDirectory");
  var U = class U2 {
    constructor(t = 100, e = true, r = D) {
      this.cache = /* @__PURE__ */ new Map(), this.maxCacheEntries = t, this.counter = 1, this.decompress = r;
    }
    getHeader(t) {
      return m(this, null, function* () {
        let e = t.getKey(), r = this.cache.get(e);
        if (r) return r.lastUsed = this.counter++, r.data;
        let n = yield V(t, this.decompress);
        return n[1] && this.cache.set(n[1][0], { lastUsed: this.counter++, data: n[1][2] }), this.cache.set(e, { lastUsed: this.counter++, data: n[0] }), this.prune(), n[0];
      });
    }
    getDirectory(t, e, r, n) {
      return m(this, null, function* () {
        let s = `${t.getKey()}|${n.etag || ""}|${e}|${r}`, o = this.cache.get(s);
        if (o) return o.lastUsed = this.counter++, o.data;
        let a = yield K(t, this.decompress, e, r, n);
        return this.cache.set(s, { lastUsed: this.counter++, data: a }), this.prune(), a;
      });
    }
    prune() {
      if (this.cache.size > this.maxCacheEntries) {
        let t = 1 / 0, e;
        this.cache.forEach((r, n) => {
          r.lastUsed < t && (t = r.lastUsed, e = n);
        }), e && this.cache.delete(e);
      }
    }
    invalidate(t) {
      return m(this, null, function* () {
        this.cache.delete(t.getKey());
      });
    }
  };
  d(U, "ResolvedValueCache");
  var M = class M2 {
    constructor(t = 100, e = true, r = D) {
      this.cache = /* @__PURE__ */ new Map(), this.invalidations = /* @__PURE__ */ new Map(), this.maxCacheEntries = t, this.counter = 1, this.decompress = r;
    }
    getHeader(t) {
      return m(this, null, function* () {
        let e = t.getKey(), r = this.cache.get(e);
        if (r) return r.lastUsed = this.counter++, yield r.data;
        let n = new Promise((s, o) => {
          V(t, this.decompress).then((a) => {
            a[1] && this.cache.set(a[1][0], { lastUsed: this.counter++, data: Promise.resolve(a[1][2]) }), s(a[0]), this.prune();
          }).catch((a) => {
            o(a);
          });
        });
        return this.cache.set(e, { lastUsed: this.counter++, data: n }), n;
      });
    }
    getDirectory(t, e, r, n) {
      return m(this, null, function* () {
        let s = `${t.getKey()}|${n.etag || ""}|${e}|${r}`, o = this.cache.get(s);
        if (o) return o.lastUsed = this.counter++, yield o.data;
        let a = new Promise((c, u) => {
          K(t, this.decompress, e, r, n).then((l) => {
            c(l), this.prune();
          }).catch((l) => {
            u(l);
          });
        });
        return this.cache.set(s, { lastUsed: this.counter++, data: a }), a;
      });
    }
    prune() {
      if (this.cache.size >= this.maxCacheEntries) {
        let t = 1 / 0, e;
        this.cache.forEach((r, n) => {
          r.lastUsed < t && (t = r.lastUsed, e = n);
        }), e && this.cache.delete(e);
      }
    }
    invalidate(t) {
      return m(this, null, function* () {
        let e = t.getKey();
        if (this.invalidations.get(e)) return yield this.invalidations.get(e);
        this.cache.delete(t.getKey());
        let r = new Promise((n, s) => {
          this.getHeader(t).then((o) => {
            n(), this.invalidations.delete(e);
          }).catch((o) => {
            s(o);
          });
        });
        this.invalidations.set(e, r);
      });
    }
  };
  d(M, "SharedPromiseCache");
  var C = M;
  var H = class H2 {
    constructor(t, e, r) {
      typeof t == "string" ? this.source = new T(t) : this.source = t, r ? this.decompress = r : this.decompress = D, e ? this.cache = e : this.cache = new C();
    }
    getHeader() {
      return m(this, null, function* () {
        return yield this.cache.getHeader(this.source);
      });
    }
    getZxyAttempt(t, e, r, n) {
      return m(this, null, function* () {
        let s = q(t, e, r), o = yield this.cache.getHeader(this.source);
        if (t < o.minZoom || t > o.maxZoom) return;
        let a = o.rootDirectoryOffset, c = o.rootDirectoryLength;
        for (let u = 0; u <= 3; u++) {
          let l = yield this.cache.getDirectory(this.source, a, c, o), f = Q(l, s);
          if (f) {
            if (f.runLength > 0) {
              let y = yield this.source.getBytes(o.tileDataOffset + f.offset, f.length, n, o.etag);
              return { data: yield this.decompress(y.data, o.tileCompression), cacheControl: y.cacheControl, expires: y.expires };
            }
            a = o.leafDirectoryOffset + f.offset, c = f.length;
          } else return;
        }
        throw new Error("Maximum directory depth exceeded");
      });
    }
    getZxy(t, e, r, n) {
      return m(this, null, function* () {
        try {
          return yield this.getZxyAttempt(t, e, r, n);
        } catch (s) {
          if (s instanceof v) return this.cache.invalidate(this.source), yield this.getZxyAttempt(t, e, r, n);
          throw s;
        }
      });
    }
    getMetadataAttempt() {
      return m(this, null, function* () {
        let t = yield this.cache.getHeader(this.source), e = yield this.source.getBytes(t.jsonMetadataOffset, t.jsonMetadataLength, void 0, t.etag), r = yield this.decompress(e.data, t.internalCompression), n = new TextDecoder("utf-8");
        return JSON.parse(n.decode(r));
      });
    }
    getMetadata() {
      return m(this, null, function* () {
        try {
          return yield this.getMetadataAttempt();
        } catch (t) {
          if (t instanceof v) return this.cache.invalidate(this.source), yield this.getMetadataAttempt();
          throw t;
        }
      });
    }
    getTileJson(t) {
      return m(this, null, function* () {
        let e = yield this.getHeader(), r = yield this.getMetadata(), n = _(e.tileType);
        return { tilejson: "3.0.0", scheme: "xyz", tiles: [`${t}/{z}/{x}/{y}${n}`], vector_layers: r.vector_layers, attribution: r.attribution, description: r.description, name: r.name, version: r.version, bounds: [e.minLon, e.minLat, e.maxLon, e.maxLat], center: [e.centerLon, e.centerLat, e.centerZoom], minzoom: e.minZoom, maxzoom: e.maxZoom };
      });
    }
  };
  d(H, "PMTiles");
  var w = H;

  // node_modules/@mapbox/point-geometry/index.js
  function Point(x2, y) {
    this.x = x2;
    this.y = y;
  }
  Point.prototype = {
    /**
     * Clone this point, returning a new point that can be modified
     * without affecting the old one.
     * @return {Point} the clone
     */
    clone() {
      return new Point(this.x, this.y);
    },
    /**
     * Add this point's x & y coordinates to another point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    add(p) {
      return this.clone()._add(p);
    },
    /**
     * Subtract this point's x & y coordinates to from point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    sub(p) {
      return this.clone()._sub(p);
    },
    /**
     * Multiply this point's x & y coordinates by point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    multByPoint(p) {
      return this.clone()._multByPoint(p);
    },
    /**
     * Divide this point's x & y coordinates by point,
     * yielding a new point.
     * @param {Point} p the other point
     * @return {Point} output point
     */
    divByPoint(p) {
      return this.clone()._divByPoint(p);
    },
    /**
     * Multiply this point's x & y coordinates by a factor,
     * yielding a new point.
     * @param {number} k factor
     * @return {Point} output point
     */
    mult(k) {
      return this.clone()._mult(k);
    },
    /**
     * Divide this point's x & y coordinates by a factor,
     * yielding a new point.
     * @param {number} k factor
     * @return {Point} output point
     */
    div(k) {
      return this.clone()._div(k);
    },
    /**
     * Rotate this point around the 0, 0 origin by an angle a,
     * given in radians
     * @param {number} a angle to rotate around, in radians
     * @return {Point} output point
     */
    rotate(a) {
      return this.clone()._rotate(a);
    },
    /**
     * Rotate this point around p point by an angle a,
     * given in radians
     * @param {number} a angle to rotate around, in radians
     * @param {Point} p Point to rotate around
     * @return {Point} output point
     */
    rotateAround(a, p) {
      return this.clone()._rotateAround(a, p);
    },
    /**
     * Multiply this point by a 4x1 transformation matrix
     * @param {[number, number, number, number]} m transformation matrix
     * @return {Point} output point
     */
    matMult(m2) {
      return this.clone()._matMult(m2);
    },
    /**
     * Calculate this point but as a unit vector from 0, 0, meaning
     * that the distance from the resulting point to the 0, 0
     * coordinate will be equal to 1 and the angle from the resulting
     * point to the 0, 0 coordinate will be the same as before.
     * @return {Point} unit vector point
     */
    unit() {
      return this.clone()._unit();
    },
    /**
     * Compute a perpendicular point, where the new y coordinate
     * is the old x coordinate and the new x coordinate is the old y
     * coordinate multiplied by -1
     * @return {Point} perpendicular point
     */
    perp() {
      return this.clone()._perp();
    },
    /**
     * Return a version of this point with the x & y coordinates
     * rounded to integers.
     * @return {Point} rounded point
     */
    round() {
      return this.clone()._round();
    },
    /**
     * Return the magnitude of this point: this is the Euclidean
     * distance from the 0, 0 coordinate to this point's x and y
     * coordinates.
     * @return {number} magnitude
     */
    mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    /**
     * Judge whether this point is equal to another point, returning
     * true or false.
     * @param {Point} other the other point
     * @return {boolean} whether the points are equal
     */
    equals(other) {
      return this.x === other.x && this.y === other.y;
    },
    /**
     * Calculate the distance from this point to another point
     * @param {Point} p the other point
     * @return {number} distance
     */
    dist(p) {
      return Math.sqrt(this.distSqr(p));
    },
    /**
     * Calculate the distance from this point to another point,
     * without the square root step. Useful if you're comparing
     * relative distances.
     * @param {Point} p the other point
     * @return {number} distance
     */
    distSqr(p) {
      const dx = p.x - this.x, dy = p.y - this.y;
      return dx * dx + dy * dy;
    },
    /**
     * Get the angle from the 0, 0 coordinate to this point, in radians
     * coordinates.
     * @return {number} angle
     */
    angle() {
      return Math.atan2(this.y, this.x);
    },
    /**
     * Get the angle from this point to another point, in radians
     * @param {Point} b the other point
     * @return {number} angle
     */
    angleTo(b2) {
      return Math.atan2(this.y - b2.y, this.x - b2.x);
    },
    /**
     * Get the angle between this point and another point, in radians
     * @param {Point} b the other point
     * @return {number} angle
     */
    angleWith(b2) {
      return this.angleWithSep(b2.x, b2.y);
    },
    /**
     * Find the angle of the two vectors, solving the formula for
     * the cross product a x b = |a||b|sin(θ) for θ.
     * @param {number} x the x-coordinate
     * @param {number} y the y-coordinate
     * @return {number} the angle in radians
     */
    angleWithSep(x2, y) {
      return Math.atan2(
        this.x * y - this.y * x2,
        this.x * x2 + this.y * y
      );
    },
    /** @param {[number, number, number, number]} m */
    _matMult(m2) {
      const x2 = m2[0] * this.x + m2[1] * this.y, y = m2[2] * this.x + m2[3] * this.y;
      this.x = x2;
      this.y = y;
      return this;
    },
    /** @param {Point} p */
    _add(p) {
      this.x += p.x;
      this.y += p.y;
      return this;
    },
    /** @param {Point} p */
    _sub(p) {
      this.x -= p.x;
      this.y -= p.y;
      return this;
    },
    /** @param {number} k */
    _mult(k) {
      this.x *= k;
      this.y *= k;
      return this;
    },
    /** @param {number} k */
    _div(k) {
      this.x /= k;
      this.y /= k;
      return this;
    },
    /** @param {Point} p */
    _multByPoint(p) {
      this.x *= p.x;
      this.y *= p.y;
      return this;
    },
    /** @param {Point} p */
    _divByPoint(p) {
      this.x /= p.x;
      this.y /= p.y;
      return this;
    },
    _unit() {
      this._div(this.mag());
      return this;
    },
    _perp() {
      const y = this.y;
      this.y = this.x;
      this.x = -y;
      return this;
    },
    /** @param {number} angle */
    _rotate(angle) {
      const cos = Math.cos(angle), sin = Math.sin(angle), x2 = cos * this.x - sin * this.y, y = sin * this.x + cos * this.y;
      this.x = x2;
      this.y = y;
      return this;
    },
    /**
     * @param {number} angle
     * @param {Point} p
     */
    _rotateAround(angle, p) {
      const cos = Math.cos(angle), sin = Math.sin(angle), x2 = p.x + cos * (this.x - p.x) - sin * (this.y - p.y), y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
      this.x = x2;
      this.y = y;
      return this;
    },
    _round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    },
    constructor: Point
  };
  Point.convert = function(p) {
    if (p instanceof Point) {
      return (
        /** @type {Point} */
        p
      );
    }
    if (Array.isArray(p)) {
      return new Point(+p[0], +p[1]);
    }
    if (p.x !== void 0 && p.y !== void 0) {
      return new Point(+p.x, +p.y);
    }
    throw new Error("Expected [x, y] or {x, y} point format");
  };

  // node_modules/@mapbox/vector-tile/index.js
  var VectorTileFeature = class {
    /**
     * @param {Pbf} pbf
     * @param {number} end
     * @param {number} extent
     * @param {string[]} keys
     * @param {(number | string | boolean)[]} values
     */
    constructor(pbf, end, extent, keys, values) {
      this.properties = /* @__PURE__ */ Object.create(null);
      this.extent = extent;
      this.type = 0;
      this.id = void 0;
      this._pbf = pbf;
      this._geometry = -1;
      this._keys = keys;
      this._values = values;
      while (pbf.pos < end) {
        const tag = pbf.readVarint();
        if (tag === 8) this.id = pbf.readVarint();
        else if (tag === 18) {
          const tagsEnd = pbf.readVarint() + pbf.pos;
          while (pbf.pos < tagsEnd) {
            const key = keys[pbf.readVarint()];
            const value = values[pbf.readVarint()];
            this.properties[key] = value;
          }
        } else if (tag === 24) this.type = /** @type {0 | 1 | 2 | 3} */
        pbf.readVarint();
        else if (tag === 34) {
          this._geometry = pbf.pos;
          pbf.skip(tag);
        } else pbf.skip(tag);
      }
    }
    loadGeometry() {
      if (this._geometry < 0) throw new Error("feature has no geometry");
      const pbf = this._pbf;
      pbf.pos = this._geometry;
      const end = pbf.readVarint() + pbf.pos;
      const lines = [];
      let line;
      let cmd = 1;
      let length = 0;
      let x2 = 0;
      let y = 0;
      while (pbf.pos < end) {
        if (length <= 0) {
          const cmdLen = pbf.readVarint();
          cmd = cmdLen & 7;
          length = cmdLen >> 3;
          if (length === 0) continue;
        }
        length--;
        if (cmd === 1) {
          x2 += pbf.readSVarint();
          y += pbf.readSVarint();
          if (line) lines.push(line);
          line = [new Point(x2, y)];
        } else if (cmd === 2) {
          x2 += pbf.readSVarint();
          y += pbf.readSVarint();
          if (line) line.push(new Point(x2, y));
        } else if (cmd === 7) {
          if (line) {
            line.push(line[0].clone());
          }
        } else {
          throw new Error(`unknown command ${cmd}`);
        }
      }
      if (line) lines.push(line);
      return lines;
    }
    bbox() {
      if (this._geometry < 0) throw new Error("feature has no geometry");
      const pbf = this._pbf;
      pbf.pos = this._geometry;
      const end = pbf.readVarint() + pbf.pos;
      let cmd = 1, length = 0, x2 = 0, y = 0, x1 = Infinity, x22 = -Infinity, y1 = Infinity, y2 = -Infinity;
      while (pbf.pos < end) {
        if (length <= 0) {
          const cmdLen = pbf.readVarint();
          cmd = cmdLen & 7;
          length = cmdLen >> 3;
          if (length === 0) continue;
        }
        length--;
        if (cmd === 1 || cmd === 2) {
          x2 += pbf.readSVarint();
          y += pbf.readSVarint();
          if (x2 < x1) x1 = x2;
          if (x2 > x22) x22 = x2;
          if (y < y1) y1 = y;
          if (y > y2) y2 = y;
        } else if (cmd !== 7) {
          throw new Error(`unknown command ${cmd}`);
        }
      }
      return [x1, y1, x22, y2];
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {Feature}
     */
    toGeoJSON(x2, y, z2) {
      const size = this.extent * Math.pow(2, z2), x0 = this.extent * x2, y0 = this.extent * y, vtCoords = this.loadGeometry();
      function projectPoint(p) {
        return [
          (p.x + x0) * 360 / size - 180,
          360 / Math.PI * Math.atan(Math.exp((1 - (p.y + y0) * 2 / size) * Math.PI)) - 90
        ];
      }
      function projectLine(line) {
        return line.map(projectPoint);
      }
      let geometry;
      if (this.type === 1) {
        const points = [];
        for (const line of vtCoords) {
          points.push(line[0]);
        }
        const coordinates = projectLine(points);
        geometry = points.length === 1 ? { type: "Point", coordinates: coordinates[0] } : { type: "MultiPoint", coordinates };
      } else if (this.type === 2) {
        const coordinates = vtCoords.map(projectLine);
        geometry = coordinates.length === 1 ? { type: "LineString", coordinates: coordinates[0] } : { type: "MultiLineString", coordinates };
      } else if (this.type === 3) {
        const polygons = classifyRings(vtCoords);
        const coordinates = [];
        for (const polygon of polygons) {
          coordinates.push(polygon.map(projectLine));
        }
        geometry = coordinates.length === 1 ? { type: "Polygon", coordinates: coordinates[0] } : { type: "MultiPolygon", coordinates };
      } else {
        throw new Error("unknown feature type");
      }
      const result = {
        type: "Feature",
        geometry,
        properties: this.properties
      };
      if (this.id != null) {
        result.id = this.id;
      }
      return result;
    }
  };
  VectorTileFeature.types = ["Unknown", "Point", "LineString", "Polygon"];
  function classifyRings(rings) {
    const len = rings.length;
    if (len <= 1) return [rings];
    const polygons = [];
    let polygon, ccw;
    for (let i = 0; i < len; i++) {
      const area = signedArea(rings[i]);
      if (area === 0) continue;
      if (ccw === void 0) ccw = area < 0;
      if (ccw === area < 0) {
        if (polygon) polygons.push(polygon);
        polygon = [rings[i]];
      } else if (polygon) {
        polygon.push(rings[i]);
      }
    }
    if (polygon) polygons.push(polygon);
    return polygons;
  }
  function signedArea(ring) {
    let sum = 0;
    for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
      p1 = ring[i];
      p2 = ring[j];
      sum += (p2.x - p1.x) * (p1.y + p2.y);
    }
    return sum;
  }
  var VectorTileLayer = class {
    /**
     * @param {Pbf} pbf
     * @param {number} [end]
     */
    constructor(pbf, end) {
      this.version = 1;
      this.name = "";
      this.extent = 4096;
      this.length = 0;
      this._pbf = pbf;
      this._keys = [];
      this._values = [];
      this._features = [];
      if (end === void 0) end = pbf.length;
      while (pbf.pos < end) {
        const tag = pbf.readVarint();
        if (tag === 10) this.name = pbf.readString();
        else if (tag === 18) {
          this._features.push(pbf.pos);
          pbf.skip(tag);
        } else if (tag === 26) this._keys.push(pbf.readString());
        else if (tag === 34) this._values.push(readValueMessage(pbf));
        else if (tag === 40) this.extent = pbf.readVarint();
        else if (tag === 120) this.version = pbf.readVarint();
        else pbf.skip(tag);
      }
      this.length = this._features.length;
    }
    /** return feature `i` from this layer as a `VectorTileFeature`
     * @param {number} i
     */
    feature(i) {
      if (i < 0 || i >= this._features.length) throw new Error("feature index out of bounds");
      this._pbf.pos = this._features[i];
      const end = this._pbf.readVarint() + this._pbf.pos;
      return new VectorTileFeature(this._pbf, end, this.extent, this._keys, this._values);
    }
  };
  function readValueMessage(pbf) {
    let value = null;
    const end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) {
      const tag = pbf.readVarint();
      value = tag === 10 ? pbf.readString() : tag === 21 ? pbf.readFloat() : tag === 25 ? pbf.readDouble() : tag === 32 ? pbf.readVarint64() : tag === 40 ? pbf.readVarint() : tag === 48 ? pbf.readSVarint() : tag === 56 ? pbf.readBoolean() : (pbf.skip(tag), null);
    }
    if (value == null) {
      throw new Error("unknown feature value");
    }
    return value;
  }
  var VectorTile = class {
    /**
     * @param {Pbf} pbf
     * @param {number} [end]
     */
    constructor(pbf, end = pbf.length) {
      const layers = /* @__PURE__ */ Object.create(null);
      while (pbf.pos < end) {
        const tag = pbf.readVarint();
        if (tag === 26) {
          const layer = new VectorTileLayer(pbf, pbf.readVarint() + pbf.pos);
          if (layer.length) layers[layer.name] = layer;
        } else pbf.skip(tag);
      }
      this.layers = layers;
    }
  };

  // node_modules/pbf/index.js
  var SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
  var SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
  var TEXT_DECODER_MIN_LENGTH = 12;
  var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8");
  var PBF_VARINT = 0;
  var PBF_FIXED64 = 1;
  var PBF_BYTES = 2;
  var PBF_FIXED32 = 5;
  var Pbf = class {
    /**
     * @param {Uint8Array | ArrayBuffer} [buf]
     */
    constructor(buf = new Uint8Array(16)) {
      this.buf = ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf);
      this.dataView = new DataView(this.buf.buffer);
      this.pos = 0;
      this.type = 0;
      this.length = this.buf.length;
    }
    // === READING =================================================================
    /**
     * @template T
     * @param {(tag: number, result: T, pbf: Pbf) => void} readField
     * @param {T} result
     * @param {number} [end]
     */
    readFields(readField, result, end = this.length) {
      while (this.pos < end) {
        const val = this.readVarint(), tag = val >> 3, startPos = this.pos;
        this.type = val & 7;
        readField(tag, result, this);
        if (this.pos === startPos) this.skip(val);
      }
      return result;
    }
    /**
     * @template T
     * @param {(tag: number, result: T, pbf: Pbf) => void} readField
     * @param {T} result
     */
    readMessage(readField, result) {
      return this.readFields(readField, result, this.readVarint() + this.pos);
    }
    readFixed32() {
      const val = this.dataView.getUint32(this.pos, true);
      this.pos += 4;
      return val;
    }
    readSFixed32() {
      const val = this.dataView.getInt32(this.pos, true);
      this.pos += 4;
      return val;
    }
    // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)
    readFixed64() {
      const val = this.dataView.getUint32(this.pos, true) + this.dataView.getUint32(this.pos + 4, true) * SHIFT_LEFT_32;
      this.pos += 8;
      return val;
    }
    readSFixed64() {
      const val = this.dataView.getUint32(this.pos, true) + this.dataView.getInt32(this.pos + 4, true) * SHIFT_LEFT_32;
      this.pos += 8;
      return val;
    }
    readFloat() {
      const val = this.dataView.getFloat32(this.pos, true);
      this.pos += 4;
      return val;
    }
    readDouble() {
      const val = this.dataView.getFloat64(this.pos, true);
      this.pos += 8;
      return val;
    }
    /**
     * @param {boolean} [isSigned]
     */
    readVarint(isSigned) {
      const buf = this.buf;
      let val, b2;
      b2 = buf[this.pos++];
      val = b2 & 127;
      if (b2 < 128) return val;
      b2 = buf[this.pos++];
      val |= (b2 & 127) << 7;
      if (b2 < 128) return val;
      b2 = buf[this.pos++];
      val |= (b2 & 127) << 14;
      if (b2 < 128) return val;
      b2 = buf[this.pos++];
      val |= (b2 & 127) << 21;
      if (b2 < 128) return val;
      b2 = buf[this.pos];
      val |= (b2 & 15) << 28;
      return readVarintRemainder(val, isSigned, this);
    }
    readVarint64() {
      return this.readVarint(true);
    }
    readSVarint() {
      const num = this.readVarint();
      return num % 2 === 1 ? (num + 1) / -2 : num / 2;
    }
    readBoolean() {
      return Boolean(this.readVarint());
    }
    readString() {
      const end = this.readVarint() + this.pos;
      const pos = this.pos;
      this.pos = end;
      if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
        return utf8TextDecoder.decode(this.buf.subarray(pos, end));
      }
      return readUtf8(this.buf, pos, end);
    }
    readBytes() {
      const end = this.readVarint() + this.pos, buffer = this.buf.subarray(this.pos, end);
      this.pos = end;
      return buffer;
    }
    // verbose for performance reasons; doesn't affect gzipped size
    /**
     * @param {number[]} [arr]
     * @param {boolean} [isSigned]
     */
    readPackedVarint(arr = [], isSigned) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readVarint(isSigned));
      return arr;
    }
    /** @param {number[]} [arr] */
    readPackedSVarint(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readSVarint());
      return arr;
    }
    /** @param {boolean[]} [arr] */
    readPackedBoolean(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readBoolean());
      return arr;
    }
    /** @param {number[]} [arr] */
    readPackedFloat(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readFloat());
      return arr;
    }
    /** @param {number[]} [arr] */
    readPackedDouble(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readDouble());
      return arr;
    }
    /** @param {number[]} [arr] */
    readPackedFixed32(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readFixed32());
      return arr;
    }
    /** @param {number[]} [arr] */
    readPackedSFixed32(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readSFixed32());
      return arr;
    }
    /** @param {number[]} [arr] */
    readPackedFixed64(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readFixed64());
      return arr;
    }
    /** @param {number[]} [arr] */
    readPackedSFixed64(arr = []) {
      const end = this.readPackedEnd();
      while (this.pos < end) arr.push(this.readSFixed64());
      return arr;
    }
    readPackedEnd() {
      return this.type === PBF_BYTES ? this.readVarint() + this.pos : this.pos + 1;
    }
    /** @param {number} val */
    skip(val) {
      const type = val & 7;
      if (type === PBF_VARINT) while (this.buf[this.pos++] > 127) {
      }
      else if (type === PBF_BYTES) this.pos = this.readVarint() + this.pos;
      else if (type === PBF_FIXED32) this.pos += 4;
      else if (type === PBF_FIXED64) this.pos += 8;
      else throw new Error(`Unimplemented type: ${type}`);
    }
    // === WRITING =================================================================
    /**
     * @param {number} tag
     * @param {number} type
     */
    writeTag(tag, type) {
      this.writeVarint(tag << 3 | type);
    }
    /** @param {number} min */
    realloc(min) {
      let length = this.length || 16;
      while (length < this.pos + min) length *= 2;
      if (length !== this.length) {
        const buf = new Uint8Array(length);
        buf.set(this.buf);
        this.buf = buf;
        this.dataView = new DataView(buf.buffer);
        this.length = length;
      }
    }
    finish() {
      this.length = this.pos;
      this.pos = 0;
      return this.buf.subarray(0, this.length);
    }
    /** @param {number} val */
    writeFixed32(val) {
      this.realloc(4);
      this.dataView.setInt32(this.pos, val, true);
      this.pos += 4;
    }
    /** @param {number} val */
    writeSFixed32(val) {
      this.realloc(4);
      this.dataView.setInt32(this.pos, val, true);
      this.pos += 4;
    }
    /** @param {number} val */
    writeFixed64(val) {
      this.realloc(8);
      this.dataView.setInt32(this.pos, val & -1, true);
      this.dataView.setInt32(this.pos + 4, Math.floor(val * SHIFT_RIGHT_32), true);
      this.pos += 8;
    }
    /** @param {number} val */
    writeSFixed64(val) {
      this.realloc(8);
      this.dataView.setInt32(this.pos, val & -1, true);
      this.dataView.setInt32(this.pos + 4, Math.floor(val * SHIFT_RIGHT_32), true);
      this.pos += 8;
    }
    /** @param {number} val */
    writeVarint(val) {
      val = +val || 0;
      if (val > 268435455 || val < 0) {
        writeBigVarint(val, this);
        return;
      }
      this.realloc(4);
      this.buf[this.pos++] = val & 127 | (val > 127 ? 128 : 0);
      if (val <= 127) return;
      this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
      if (val <= 127) return;
      this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
      if (val <= 127) return;
      this.buf[this.pos++] = val >>> 7 & 127;
    }
    /** @param {number} val */
    writeSVarint(val) {
      this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
    }
    /** @param {boolean} val */
    writeBoolean(val) {
      this.writeVarint(+val);
    }
    /** @param {string} str */
    writeString(str) {
      str = String(str);
      this.realloc(str.length * 4);
      this.pos++;
      const startPos = this.pos;
      this.pos = writeUtf8(this.buf, str, this.pos);
      const len = this.pos - startPos;
      if (len >= 128) makeRoomForExtraLength(startPos, len, this);
      this.pos = startPos - 1;
      this.writeVarint(len);
      this.pos += len;
    }
    /** @param {number} val */
    writeFloat(val) {
      this.realloc(4);
      this.dataView.setFloat32(this.pos, val, true);
      this.pos += 4;
    }
    /** @param {number} val */
    writeDouble(val) {
      this.realloc(8);
      this.dataView.setFloat64(this.pos, val, true);
      this.pos += 8;
    }
    /** @param {Uint8Array} buffer */
    writeBytes(buffer) {
      const len = buffer.length;
      this.writeVarint(len);
      this.realloc(len);
      for (let i = 0; i < len; i++) this.buf[this.pos++] = buffer[i];
    }
    /**
     * @template T
     * @param {(obj: T, pbf: Pbf) => void} fn
     * @param {T} obj
     */
    writeRawMessage(fn, obj) {
      this.pos++;
      const startPos = this.pos;
      fn(obj, this);
      const len = this.pos - startPos;
      if (len >= 128) makeRoomForExtraLength(startPos, len, this);
      this.pos = startPos - 1;
      this.writeVarint(len);
      this.pos += len;
    }
    /**
     * @template T
     * @param {number} tag
     * @param {(obj: T, pbf: Pbf) => void} fn
     * @param {T} obj
     */
    writeMessage(tag, fn, obj) {
      this.writeTag(tag, PBF_BYTES);
      this.writeRawMessage(fn, obj);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedVarint(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedVarint, arr);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedSVarint(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedSVarint, arr);
    }
    /**
     * @param {number} tag
     * @param {boolean[]} arr
     */
    writePackedBoolean(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedBoolean, arr);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedFloat(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedFloat, arr);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedDouble(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedDouble, arr);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedFixed32(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedFixed32, arr);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedSFixed32(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedSFixed32, arr);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedFixed64(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedFixed64, arr);
    }
    /**
     * @param {number} tag
     * @param {number[]} arr
     */
    writePackedSFixed64(tag, arr) {
      if (arr.length) this.writeMessage(tag, writePackedSFixed64, arr);
    }
    /**
     * @param {number} tag
     * @param {Uint8Array} buffer
     */
    writeBytesField(tag, buffer) {
      this.writeTag(tag, PBF_BYTES);
      this.writeBytes(buffer);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeFixed32Field(tag, val) {
      this.writeTag(tag, PBF_FIXED32);
      this.writeFixed32(val);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeSFixed32Field(tag, val) {
      this.writeTag(tag, PBF_FIXED32);
      this.writeSFixed32(val);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeFixed64Field(tag, val) {
      this.writeTag(tag, PBF_FIXED64);
      this.writeFixed64(val);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeSFixed64Field(tag, val) {
      this.writeTag(tag, PBF_FIXED64);
      this.writeSFixed64(val);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeVarintField(tag, val) {
      this.writeTag(tag, PBF_VARINT);
      this.writeVarint(val);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeSVarintField(tag, val) {
      this.writeTag(tag, PBF_VARINT);
      this.writeSVarint(val);
    }
    /**
     * @param {number} tag
     * @param {string} str
     */
    writeStringField(tag, str) {
      this.writeTag(tag, PBF_BYTES);
      this.writeString(str);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeFloatField(tag, val) {
      this.writeTag(tag, PBF_FIXED32);
      this.writeFloat(val);
    }
    /**
     * @param {number} tag
     * @param {number} val
     */
    writeDoubleField(tag, val) {
      this.writeTag(tag, PBF_FIXED64);
      this.writeDouble(val);
    }
    /**
     * @param {number} tag
     * @param {boolean} val
     */
    writeBooleanField(tag, val) {
      this.writeVarintField(tag, +val);
    }
  };
  function readVarintRemainder(l, s, p) {
    const buf = p.buf;
    let h, b2;
    b2 = buf[p.pos++];
    h = (b2 & 112) >> 4;
    if (b2 < 128) return toNum(l, h, s);
    b2 = buf[p.pos++];
    h |= (b2 & 127) << 3;
    if (b2 < 128) return toNum(l, h, s);
    b2 = buf[p.pos++];
    h |= (b2 & 127) << 10;
    if (b2 < 128) return toNum(l, h, s);
    b2 = buf[p.pos++];
    h |= (b2 & 127) << 17;
    if (b2 < 128) return toNum(l, h, s);
    b2 = buf[p.pos++];
    h |= (b2 & 127) << 24;
    if (b2 < 128) return toNum(l, h, s);
    b2 = buf[p.pos++];
    h |= (b2 & 1) << 31;
    if (b2 < 128) return toNum(l, h, s);
    throw new Error("Expected varint not more than 10 bytes");
  }
  function toNum(low, high, isSigned) {
    return isSigned ? high * 4294967296 + (low >>> 0) : (high >>> 0) * 4294967296 + (low >>> 0);
  }
  function writeBigVarint(val, pbf) {
    let low, high;
    if (val >= 0) {
      low = val % 4294967296 | 0;
      high = val / 4294967296 | 0;
    } else {
      low = ~(-val % 4294967296);
      high = ~(-val / 4294967296);
      if (low ^ 4294967295) {
        low = low + 1 | 0;
      } else {
        low = 0;
        high = high + 1 | 0;
      }
    }
    if (val >= 18446744073709552e3 || val < -18446744073709552e3) {
      throw new Error("Given varint doesn't fit into 10 bytes");
    }
    pbf.realloc(10);
    writeBigVarintLow(low, high, pbf);
    writeBigVarintHigh(high, pbf);
  }
  function writeBigVarintLow(low, high, pbf) {
    pbf.buf[pbf.pos++] = low & 127 | 128;
    low >>>= 7;
    pbf.buf[pbf.pos++] = low & 127 | 128;
    low >>>= 7;
    pbf.buf[pbf.pos++] = low & 127 | 128;
    low >>>= 7;
    pbf.buf[pbf.pos++] = low & 127 | 128;
    low >>>= 7;
    pbf.buf[pbf.pos] = low & 127;
  }
  function writeBigVarintHigh(high, pbf) {
    const lsb = (high & 7) << 4;
    pbf.buf[pbf.pos++] |= lsb | ((high >>>= 3) ? 128 : 0);
    if (!high) return;
    pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
    if (!high) return;
    pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
    if (!high) return;
    pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
    if (!high) return;
    pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
    if (!high) return;
    pbf.buf[pbf.pos++] = high & 127;
  }
  function makeRoomForExtraLength(startPos, len, pbf) {
    const extraLen = len <= 16383 ? 1 : len <= 2097151 ? 2 : len <= 268435455 ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));
    pbf.realloc(extraLen);
    for (let i = pbf.pos - 1; i >= startPos; i--) pbf.buf[i + extraLen] = pbf.buf[i];
  }
  function writePackedVarint(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeVarint(arr[i]);
  }
  function writePackedSVarint(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeSVarint(arr[i]);
  }
  function writePackedFloat(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeFloat(arr[i]);
  }
  function writePackedDouble(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeDouble(arr[i]);
  }
  function writePackedBoolean(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeBoolean(arr[i]);
  }
  function writePackedFixed32(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeFixed32(arr[i]);
  }
  function writePackedSFixed32(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeSFixed32(arr[i]);
  }
  function writePackedFixed64(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeFixed64(arr[i]);
  }
  function writePackedSFixed64(arr, pbf) {
    for (let i = 0; i < arr.length; i++) pbf.writeSFixed64(arr[i]);
  }
  function readUtf8(buf, pos, end) {
    let str = "";
    let i = pos;
    while (i < end) {
      const b0 = buf[i];
      let c = null;
      let bytesPerSequence = b0 > 239 ? 4 : b0 > 223 ? 3 : b0 > 191 ? 2 : 1;
      if (i + bytesPerSequence > end) break;
      let b1, b2, b3;
      if (bytesPerSequence === 1) {
        if (b0 < 128) {
          c = b0;
        }
      } else if (bytesPerSequence === 2) {
        b1 = buf[i + 1];
        if ((b1 & 192) === 128) {
          c = (b0 & 31) << 6 | b1 & 63;
          if (c <= 127) {
            c = null;
          }
        }
      } else if (bytesPerSequence === 3) {
        b1 = buf[i + 1];
        b2 = buf[i + 2];
        if ((b1 & 192) === 128 && (b2 & 192) === 128) {
          c = (b0 & 15) << 12 | (b1 & 63) << 6 | b2 & 63;
          if (c <= 2047 || c >= 55296 && c <= 57343) {
            c = null;
          }
        }
      } else if (bytesPerSequence === 4) {
        b1 = buf[i + 1];
        b2 = buf[i + 2];
        b3 = buf[i + 3];
        if ((b1 & 192) === 128 && (b2 & 192) === 128 && (b3 & 192) === 128) {
          c = (b0 & 15) << 18 | (b1 & 63) << 12 | (b2 & 63) << 6 | b3 & 63;
          if (c <= 65535 || c >= 1114112) {
            c = null;
          }
        }
      }
      if (c === null) {
        c = 65533;
        bytesPerSequence = 1;
      } else if (c > 65535) {
        c -= 65536;
        str += String.fromCharCode(c >>> 10 & 1023 | 55296);
        c = 56320 | c & 1023;
      }
      str += String.fromCharCode(c);
      i += bytesPerSequence;
    }
    return str;
  }
  function writeUtf8(buf, str, pos) {
    for (let i = 0, c, lead; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c > 55295 && c < 57344) {
        if (lead) {
          if (c < 56320) {
            buf[pos++] = 239;
            buf[pos++] = 191;
            buf[pos++] = 189;
            lead = c;
            continue;
          } else {
            c = lead - 55296 << 10 | c - 56320 | 65536;
            lead = null;
          }
        } else {
          if (c > 56319 || i + 1 === str.length) {
            buf[pos++] = 239;
            buf[pos++] = 191;
            buf[pos++] = 189;
          } else {
            lead = c;
          }
          continue;
        }
      } else if (lead) {
        buf[pos++] = 239;
        buf[pos++] = 191;
        buf[pos++] = 189;
        lead = null;
      }
      if (c < 128) {
        buf[pos++] = c;
      } else {
        if (c < 2048) {
          buf[pos++] = c >> 6 | 192;
        } else {
          if (c < 65536) {
            buf[pos++] = c >> 12 | 224;
          } else {
            buf[pos++] = c >> 18 | 240;
            buf[pos++] = c >> 12 & 63 | 128;
          }
          buf[pos++] = c >> 6 & 63 | 128;
        }
        buf[pos++] = c & 63 | 128;
      }
    }
    return pos;
  }

window.MapDataLib={PMTiles:w,VectorTile,Pbf};
})();
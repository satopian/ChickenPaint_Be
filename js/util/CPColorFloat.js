/*
    litaChix
    https://github.com/satopian/ChickenPaint_Be
    by satopian
    Customized from ChickenPaint by Nicholas Sherlock.
    GNU GENERAL PUBLIC LICENSE
    Version 3, 29 June 2007
    <http://www.gnu.org/licenses/>
*/
/*
    ChickenPaint
    
    ChickenPaint is a translation of ChibiPaint from Java to JavaScript
    by Nicholas Sherlock / Chicken Smoothie.
    
    ChibiPaint is Copyright (c) 2006-2008 Marc Schefer

    ChickenPaint is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ChickenPaint is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ChickenPaint. If not, see <http://www.gnu.org/licenses/>.
*/

export default class CPColorFloat {
  /**
   * An RGB color with floating point values for each channel (between 0.0 and 1.0)
   *
   * @param {number} r
   * @param {number} g
   * @param {number} b
   *
   */
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toInt() {
    return (
      (Math.max(0, Math.min(255, Math.round(this.r * 255))) << 16) |
      (Math.max(0, Math.min(255, Math.round(this.g * 255))) << 8) |
      Math.max(0, Math.min(255, Math.round(this.b * 255)))
    );
  }

  /**
   * 2つの色をリニアRGB空間で補間する。
   * sRGB空間での線形補間と比較して、混色時の彩度・明度低下を防止する。
   *
   * @param {CPColorFloat} color - 混合する色
   * @param {number} alpha - 混合比率 (0.0 = 現在の色のまま, 1.0 = colorに完全に置き換え)
   */
  mixWith(color, alpha) {
    const r1L = this.r * this.r,
      r2L = color.r * color.r;
    const g1L = this.g * this.g,
      g2L = color.g * color.g;
    const b1L = this.b * this.b,
      b2L = color.b * color.b;

    const rMixed = r1L * (1.0 - alpha) + r2L * alpha;
    const gMixed = g1L * (1.0 - alpha) + g2L * alpha;
    const bMixed = b1L * (1.0 - alpha) + b2L * alpha;

    const BRIGHTNESS_RETENTION = 0.3;
    this.r = Math.sqrt(
      Math.max(rMixed, Math.max(r1L, r2L) * BRIGHTNESS_RETENTION),
    );
    this.g = Math.sqrt(
      Math.max(gMixed, Math.max(g1L, g2L) * BRIGHTNESS_RETENTION),
    );
    this.b = Math.sqrt(
      Math.max(bMixed, Math.max(b1L, b2L) * BRIGHTNESS_RETENTION),
    );
  }
  clone() {
    return new CPColorFloat(this.r, this.g, this.b);
  }

  /**
   * 32ビット整数のRGB値からCPColorFloatを生成する。
   *
   * @param {number} color - 32ビット整数 (0xAARRGGBB形式。アルファは無視される)
   * @returns {CPColorFloat}
   */
  static createFromInt(color) {
    return new CPColorFloat(
      ((color >>> 16) & 0xff) / 255,
      ((color >>> 8) & 0xff) / 255,
      (color & 0xff) / 255,
    );
  }
}

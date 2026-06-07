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

/**
 *
 * @param {number} rgb
 * @param {Object} hsv
 */
function convertRgbToHsv(rgb, hsv) {
  var r = (rgb >> 16) & 0xff,
    g = (rgb >> 8) & 0xff,
    b = rgb & 0xff;

  // Value
  hsv.value = Math.max(r, Math.max(g, b));

  // Saturation
  var mini = Math.min(r, Math.min(g, b));

  if (hsv.value == 0) {
    hsv.saturation = 0;
  } else {
    hsv.saturation = ~~(((hsv.value - mini) / hsv.value) * 255);
  }

  // Hue
  if (hsv.saturation == 0) {
    hsv.hue = 0;
  } else {
    var cr = (hsv.value - r) / (hsv.value - mini),
      cg = (hsv.value - g) / (hsv.value - mini),
      cb = (hsv.value - b) / (hsv.value - mini);

    var _hue = 0;

    if (hsv.value == r) {
      _hue = cb - cg;
    }
    if (hsv.value == g) {
      _hue = 2 + cr - cb;
    }
    if (hsv.value == b) {
      _hue = 4 + cg - cr;
    }

    _hue *= 60;
    if (_hue < 0) {
      _hue += 360;
    }

    hsv.hue = ~~_hue;
  }
}

/**
 *
 * @param {Object} hsv
 * @returns {Number}
 */
function convertHsvToRgb(hsv) {
  // no saturation means it's just a shade of grey
  if (hsv.saturation == 0) {
    return (hsv.value << 16) | (hsv.value << 8) | hsv.value;
  } else {
    var f = hsv.hue / 60;

    f = f - Math.floor(f);

    var s = hsv.saturation / 255,
      m = ~~(hsv.value * (1 - s)),
      n = ~~(hsv.value * (1 - s * f)),
      k = ~~(hsv.value * (1 - s * (1 - f)));

    switch (~~(hsv.hue / 60)) {
      case 0:
        return (hsv.value << 16) | (k << 8) | m;
      case 1:
        return (n << 16) | (hsv.value << 8) | m;
      case 2:
        return (m << 16) | (hsv.value << 8) | k;
      case 3:
        return (m << 16) | (n << 8) | hsv.value;
      case 4:
        return (k << 16) | (m << 8) | hsv.value;
      case 5:
        return (hsv.value << 16) | (m << 8) | n;
      default:
        return 0; // invalid hue
    }
  }
}

export default class CPColor {
  /**
   * @param {number} rgb Initial color 10進数
   */
  constructor(rgb) {
    /**
     * Color in RGB byte order (no alpha component)
     *
     * @type {Number}
     */
    this.rgb = 0;

    /**
     * Hue 0-359 degrees
     *
     * @type {Number}
     */
    this.hue = 0;

    /**
     * Color saturation 0 - 255
     * @type {Number}
     */
    this.saturation = 0;

    /**
     * Brightness 0 - 255
     *
     * @type {Number}
     */
    this.value = 0;

    this.setRgb(rgb || 0);
  }
  getRgb() {
    return this.rgb;
  }

  getSaturation() {
    return this.saturation;
  }

  getHue() {
    return this.hue;
  }

  getValue() {
    return this.value;
  }

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   */
  setRgbComponents(r, g, b) {
    this.setRgb((r << 16) | (g << 8) | b);
  }
  /**
   * @param {number} rgb
   */
  setRgb(rgb) {
    this.rgb = rgb;
    convertRgbToHsv(rgb, this);
  }

  /**
   * 色を設定 HSV
   * @param {number} hue
   * @param {number} saturation
   * @param {number} value
   */
  setHsv(hue, saturation, value) {
    this.hue = hue;
    this.saturation = saturation;
    this.value = value;

    this.rgb = convertHsvToRgb(this);
  }

  setHue(hue) {
    this.hue = hue;
    this.rgb = convertHsvToRgb(this);
  }

  setSaturation(saturation) {
    this.saturation = saturation;
    this.rgb = convertHsvToRgb(this);
  }

  setValue(value) {
    this.value = value;
    this.rgb = convertHsvToRgb(this);
  }

  setGreyscale(value) {
    this.rgb = CPColor.greyToRGB(value);
    this.hue = 0;
    this.saturation = 0;
    this.value = value;
  }

  clone() {
    var result = new CPColor(0);

    result.copyFrom(this);

    return result;
  }

  /**
   *
   * @param {CPColor} that
   */
  copyFrom(that) {
    this.rgb = that.rgb;
    this.hue = that.hue;
    this.saturation = that.saturation;
    this.value = that.value;
  }

  /**
   *
   * @param {CPColor} color
   * @returns {boolean}
   */
  isEqual(color) {
    return (
      this.rgb == color.rgb &&
      this.hue == color.hue &&
      this.saturation == color.saturation &&
      this.value == color.value
    );
  }

  static greyToRGB(grey) {
    return grey | (grey << 8) | (grey << 16);
  }
}

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
 * @param {Object} properties - Non-default properties to set on the brush
 *
 * @property  {Number} alpha - The user-chosen alpha of this brush
 * @property {float} alphaScale - A scale factor applied to curAlpha before drawing
 * @property  {Number} curAlpha - The current alpha after pen pressure etc. has been applied
 *
 * @property  {Number} spacing
 * @property  {Number} minSpacing
 *
 * @property  {Number} size - The user-chosen size of this brush
 * @property  {Number} curSize - The current size of the brush after pen pressure has been applied
 *
 * @property  {Number} brushMode - Selects the CPBrushTool that will be used to render the brush (CPBrushInfo.BRUSH_MODE_*)
 * @property  {Number} paintMode - Controls how paint builds up on the canvas during painting (for brush modes that don't
 * override the default paintDab() function). (CPBrushInfo.PAINT_MODE_*)
 * @property  {Number} strokeMode - How stroke points will be connected during drawing (CPBrushInfo.STROKE_MODE_*)
 * @property  {Number} tip - Kind of brush tip to be used (CPBrushInfo.TIP_*)
 *
 * @property {number} scattering
 * @property {number} curScattering
 * @property {number} angle
 * @property {number} resat - 0-1.0, controls how much of the user's selected paint color is mixed into the brush while painting.
 * @property {number} bleed - 0-1.0, controls how much of the color from the canvas is picked up by the brush.
 *
 * @property {boolean} isAA
 *
 * @constructor
 * @this {any}
 */

export default class CPBrushInfo {
  constructor(properties) {
    var propName;

    this.isAA = false;
    this.minSpacing = 0.0;
    this.spacing = 0.0;

    this.pressureSize = true;
    this.pressureAlpha = false;
    this.pressureScattering = false;
    this.alphaScale = 1.0;

    this.tip = CPBrushInfo.TIP_ROUND_PIXEL;
    this.brushMode = CPBrushInfo.BRUSH_MODE_PAINT;
    this.paintMode = CPBrushInfo.PAINT_MODE_OPACITY;
    this.strokeMode = CPBrushInfo.STROKE_MODE_FREEHAND;
    this.resat = 1.0;
    this.bleed = 0.0;

    this.texture = 1.0;
    this.toolNb = 0;

    // "cur" values are current brush settings (once tablet pressure and stuff is applied)
    this.size = 0.0;
    this.curSize = 0;
    this.alpha = 0.0;
    this.curAlpha = 0.0;
    this.scattering = 0.0;
    this.curScattering = 0;
    this.squeeze = 0.0;
    this.curSqueeze = 0;
    this.angle = Math.PI;
    this.curAngle = 0.0;

    this.smoothing = 0.0;

    for (propName in properties) {
      if (properties.hasOwnProperty(propName)) {
        this[propName] = properties[propName];
      }
    }
  }
  applyPressure(pressure, isFirstPoint) {
    // 1. 目標サイズ
    let targetSize = this.pressureSize
      ? Math.max(0.6, this.size * pressure)
      : Math.max(0.6, this.size);

    // 2. 線幅ローパスフィルタ
    const sizeSmooth = 0.15;

    if (isFirstPoint || !this._lastSize) {
      // 書き始めの1点目なら、フィルタを通さず即座に目標値にする
      this.curSize = targetSize;
      this._lastSize = targetSize;
    } else {
      // 2点目以降は滑らかに変化させる
      this.curSize =
        this._lastSize + sizeSmooth * (targetSize - this._lastSize);
      this._lastSize = this.curSize;
    }
    // 3. 不透明度
    this.curAlpha = this.pressureAlpha
      ? Math.floor(this.alpha * Math.min(pressure, 1.0))
      : this.alpha;

    // 4. その他
    this.curSqueeze = this.squeeze;
    this.curAngle = this.angle;
    this.curScattering =
      this.scattering *
      this.curSize *
      (this.pressureScattering ? pressure : 1.0);
  }

  clone() {
    return new CPBrushInfo(this);
  }
}

// Stroke modes
CPBrushInfo.STROKE_MODE_FREEHAND = 0;
CPBrushInfo.STROKE_MODE_LINE = 1;
CPBrushInfo.STROKE_MODE_BEZIER = 2;

// Brush dab types
CPBrushInfo.TIP_ROUND_PIXEL = 0;
CPBrushInfo.TIP_ROUND_AA = 1;
CPBrushInfo.TIP_ROUND_AIRBRUSH = 2;
CPBrushInfo.TIP_SQUARE_PIXEL = 3;
CPBrushInfo.TIP_SQUARE_AA = 4;

CPBrushInfo.BRUSH_MODE_PAINT = 0;
CPBrushInfo.BRUSH_MODE_ERASE = 1;
CPBrushInfo.BRUSH_MODE_DODGE = 2;
CPBrushInfo.BRUSH_MODE_BURN = 3;
CPBrushInfo.BRUSH_MODE_WATER = 4;
CPBrushInfo.BRUSH_MODE_BLUR = 5;
CPBrushInfo.BRUSH_MODE_SMUDGE = 6;
CPBrushInfo.BRUSH_MODE_OIL = 7;

CPBrushInfo.PAINT_MODE_OPACITY = 0;
CPBrushInfo.PAINT_MODE_FLOW = 1;

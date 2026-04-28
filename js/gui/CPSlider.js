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

import EventEmitter from "wolfy87-eventemitter";
import { _ } from "../languages/lang.js";

/**
 * A simple slider control.
 */
export default function CPSlider(
  minValue,
  maxValue,
  centerMode,
  expMode,
  defaultWidth = 0,
  expModeFactor = 0, //低い値の時にスライダーの動作を細やかにする係数
  fractionalStep = false,
) {
  defaultWidth = defaultWidth ? defaultWidth : 150;
  expModeFactor = expModeFactor ? expModeFactor : 3.0;
  const PRECISE_DRAG_SCALE = 4,
    DRAG_MODE_IDLE = 0,
    DRAG_MODE_NORMAL = 1,
    DRAG_MODE_PRECISE = 2;

  let canvas = document.createElement("canvas"),
    canvasContext = canvas.getContext("2d"),
    valueRange = maxValue - minValue,
    dragMode = DRAG_MODE_IDLE,
    dragPreciseX,
    doneInitialPaint = false,
    that = this;

  this.value = undefined;
  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault(); // デフォルトの動作をキャンセル
    },
    { passive: false },
  );

  /**
   * Either a string to draw on the slider, or a function(value) which receives the current value of the slider and
   * should return the string to be painted to the slider.
   *
   * @name CPSlider#title
   * @default ""
   */
  this.title = "";

  centerMode = centerMode || false;

  const boundaryValue = 5; // 均等表示の境目

  // 値がboundaryValueになるときのスライダー上の位置（0.0〜1.0）を自動計算して、均等エリアの幅を決める
  const boundaryProp = Math.pow(
    (boundaryValue - minValue) / valueRange,
    1 / expModeFactor,
  );

  function paint() {
    let width = canvas.width || defaultWidth;
    let height = canvas.height;
    let title =
      typeof that.title === "string" ? _(that.title) : that.title(that.value);
    let textX = 3 * window.devicePixelRatio;
    let textY = canvas.height * 0.75;

    if (centerMode) {
      canvasContext.save();

      canvasContext.fillStyle = "white";

      canvasContext.fillRect(0, 0, width, height);

      canvasContext.fillStyle = "black";

      canvasContext.fillText(title, textX, textY);
      canvasContext.beginPath();

      if (that.value >= valueRange / 2) {
        canvasContext.rect(
          width / 2,
          0,
          ((that.value - valueRange / 2) * width) / valueRange,
          height,
        );
      } else {
        canvasContext.rect(
          (that.value * width) / valueRange,
          0,
          ((valueRange / 2 - that.value) * width) / valueRange,
          height,
        );
      }

      canvasContext.fill();
      canvasContext.clip();

      canvasContext.fillStyle = "white";
      canvasContext.fillText(title, textX, textY);

      canvasContext.restore();
    } else {
      let barProp;

      if (expMode) {
        if (that.value <= boundaryValue) {
          // 均等エリアの描画
          barProp =
            ((that.value - minValue) / (boundaryValue - minValue)) *
            boundaryProp;
        } else {
          // 指数エリアの描画
          // 「本来の指数計算での位置」に戻す
          barProp = Math.pow(
            (that.value - minValue) / valueRange,
            1 / expModeFactor,
          );
        }
      } else {
        barProp = (that.value - minValue) / valueRange;
      }
      let barWidth = barProp * width;

      canvasContext.save();
      canvasContext.save();

      canvasContext.fillStyle = "black";

      canvasContext.beginPath();
      canvasContext.rect(0, 0, barWidth, height);
      canvasContext.fill();

      canvasContext.clip();

      canvasContext.fillStyle = "white";
      canvasContext.fillText(title, textX, textY);

      // Remove the clip region
      canvasContext.restore();

      canvasContext.fillStyle = "white";

      canvasContext.beginPath();
      canvasContext.rect(barWidth, 0, width, height);
      canvasContext.fill();

      canvasContext.clip();

      canvasContext.fillStyle = "black";
      canvasContext.fillText(title, textX, textY);

      canvasContext.restore();
    }
  }

  function mouseSelect(e) {
    let width = canvas.clientWidth;
    let left = canvas.getBoundingClientRect().left + window.scrollX;
    let proportion = (e.pageX - left) / width;

    let finalValue;

    if (expMode) {
      if (proportion <= boundaryProp) {
        // 均等エリア：
        finalValue =
          minValue + (proportion / boundaryProp) * (boundaryValue - minValue);
      } else {
        // 指数エリア：boundaryValue以上
        // ここで0にリセットせず、本来のカーブの「boundaryValue以降の形」を維持する
        // 元々の計算式に戻し、最小値をminValueではなく「指数の底」として扱う
        finalValue =
          Math.pow(proportion, expModeFactor) * valueRange + minValue;
      }
    } else {
      finalValue = proportion * valueRange + minValue;
    }
    that.setValue(finalValue);
  }

  function pointerDragged(e) {
    switch (dragMode) {
      case DRAG_MODE_NORMAL:
        return mouseSelect(e);
      case DRAG_MODE_PRECISE:
        let title = that.title();
        //ブラシサイズと不透明度以外は細やかなスライダーの動作をしない
        if (
          !(title.includes(_("Brush size")) || title.includes(_("Opacity")))
        ) {
          return mouseSelect(e);
        }
        let diff = (e.pageX - dragPreciseX) / PRECISE_DRAG_SCALE;
        if (diff !== 0) {
          /* (0.5刻み対応) */
          let unrounded = that.value + diff;
          that.setValue(unrounded);

          /* Tweak the "old mouseX" position such that the fractional part of the value we were unable to set
           * will be accumulated
           */
          dragPreciseX =
            e.pageX - (unrounded - that.value) * PRECISE_DRAG_SCALE;
        }
        break;
    }
  }

  const handlePointerUp = (e) => {
    // ドラッグ状態を解除
    dragMode = DRAG_MODE_IDLE;

    // ブラウザからのポインターキャプチャを解放
    canvas.releasePointerCapture(e.pointerId);

    //  pointermoveイベントのリスナーを削除
    canvas.removeEventListener("pointermove", pointerDragged);
  };
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerUp);

  this.setValue = function (_value) {
    _value = Math.max(minValue, Math.min(maxValue, _value));

    if (fractionalStep && _value <= 5) {
      // 0.5単位で丸める（例: 1.2 → 1.0, 1.3 → 1.5）
      _value = Math.round(_value * 2) / 2;
    } else {
      // 10以上のときは従来通り整数にする
      _value = Math.floor(_value);
    }

    if (this.value != _value) {
      this.value = _value;

      // The event listeners might like to update our title property at this point to reflect the new value
      this.emitEvent("valueChange", [this.value]);

      if (doneInitialPaint) {
        paint();
      } else {
        // We don't bother to do our canvas dimensioning until we're supplied with an initial value
        doneInitialPaint = true;
        this.resize();
      }
    }
  };

  /**
   * Get the DOM element for the slider component.
   */
  this.getElement = function () {
    return canvas;
  };

  this.resize = function () {
    canvas.width = canvas.clientWidth || defaultWidth;
    canvas.height = canvas.clientHeight || 20;

    if (window.devicePixelRatio > 1) {
      // Assume our width is set to 100% or similar, so we only need to the fix the height
      canvas.style.height = canvas.height + "px";

      canvas.width = canvas.width * window.devicePixelRatio;
      canvas.height = canvas.height * window.devicePixelRatio;
    }

    canvasContext.font = canvas.height * 0.47 + "pt sans-serif";

    paint();
  };

  canvas.addEventListener("pointerdown", function (e) {
    if (dragMode === DRAG_MODE_IDLE) {
      if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
        dragMode = DRAG_MODE_PRECISE;
        dragPreciseX = e.pageX;
      } else {
        dragMode = DRAG_MODE_NORMAL;
        mouseSelect(e);
      }

      canvas.setPointerCapture(e.pointerId);
      canvas.addEventListener("pointermove", pointerDragged);
    }
  });

  canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  canvas.setAttribute("touch-action", "none");
  canvas.className = "chickenpaint-slider";

  if (!("devicePixelRatio" in window)) {
    // Old browsers
    window.devicePixelRatio = 1.0;
  }
}

CPSlider.prototype = Object.create(EventEmitter.prototype);
CPSlider.prototype.constructor = CPSlider;

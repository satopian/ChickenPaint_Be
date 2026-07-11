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

export default class CPRect {
  /**
   * 新しいCPRectインスタンスを作成。
   * @param {number} left - 長方形の左端の座標。
   * @param {number} top - 長方形の上端の座標。
   * @param {number} right - 長方形の右端の座標。
   * @param {number} bottom - 長方形の下端の座標。
   */
  constructor(left, top, right, bottom) {
    /*
    if (left === undefined || top === undefined || right === undefined || bottom === undefined) {
        throw "Bad rect";
    }
    
    if (~~left !== left || ~~top !== top || ~~right !== right || ~~bottom !== bottom) {
        throw "Bad rect";
    }
    */

    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }

  makeEmpty() {
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
  }

  /**
   * この矩形と指定した矩形の和集合（両方を含む最小の外接矩形）を計算し、この矩形を上書きする。
   *
   * - this が空の場合は that をそのままコピーする。
   * - that が空の場合は何もしない（this は変化しない）。
   * - どちらも空でない場合は、両矩形を包含する最小の矩形に拡張する。
   *
   * @param {CPRect} that - 合成する相手の矩形
   * @returns {void} - 破壊的メソッド。戻り値はなく、this自身が更新される
   */
  union(that) {
    if (this.isEmpty()) {
      this.set(that);
    } else if (!that.isEmpty()) {
      this.left = Math.min(this.left, that.left);
      this.top = Math.min(this.top, that.top);
      this.right = Math.max(this.right, that.right);
      this.bottom = Math.max(this.bottom, that.bottom);
    }
  }

  /**
   * この矩形と指定した矩形の和集合（両方を含む最小の外接矩形）を、新しい CPRect インスタンスとして返す。
   *
   * this 自身は変更されない。
   *
   * @param {CPRect} that - 合成する相手の矩形
   * @returns {CPRect} - this と that を包含する最小の矩形（新しいインスタンス）
   */
  getUnion(that) {
    var result = this.clone();

    result.union(that);

    return result;
  }

  /**
   * Returns the intersection of this rectangle and another rectangle.
   *
   *@param {CPRect & Record<string, any>} that - The other rectangle to intersect with.
   * @param {boolean} [returnNullIfEmpty=false] - If true, returns null when intersection is empty.
   * @returns {CPRect|null} - The intersection rectangle, or null if empty and returnNullIfEmpty is true.
   */
  getIntersection(that, returnNullIfEmpty = false) {
    const left = Math.max(this.left, that.left);
    const top = Math.max(this.top, that.top);
    const right = Math.min(this.right, that.right);
    const bottom = Math.min(this.bottom, that.bottom);

    if (returnNullIfEmpty && (left >= right || top >= bottom)) {
      return null;
    }

    return new CPRect(left, top, right, bottom);
  }

  /**
   * Clip this rectangle to fit within `that`.
   *
   * @returns {CPRect} A reference to this rectangle for chaining
   */
  clipTo(that) {
    if (!this.isEmpty()) {
      if (that.isEmpty()) {
        this.makeEmpty();
      } else {
        this.left = Math.min(Math.max(this.left, that.left), that.right);
        this.top = Math.min(Math.max(this.top, that.top), that.bottom);
        this.right = Math.max(Math.min(this.right, that.right), that.left);
        this.bottom = Math.max(Math.min(this.bottom, that.bottom), that.top);
      }
    }

    return this;
  }

  containsPoint(p) {
    return !(
      p.x < this.left ||
      p.y < this.top ||
      p.x >= this.right ||
      p.y >= this.bottom
    );
  }

  isInside(that) {
    return (
      this.left >= that.left &&
      this.top >= that.top &&
      this.right <= that.right &&
      this.bottom <= that.bottom
    );
  }

  /**
   * Use this rectangle as bounds to clip the placement of the area of srcRect at the position of dstRect inside
   * our bounds.
   *
   * dstRect has its right and bottom set by this operation to match the area that would be copied from the source.
   * srcRect has its coordinates tweaked to match the area that will be copied.
   * @param {CPRect} srcRect - The source rectangle to be clipped.
   * @param {CPRect} dstRect - The destination rectangle to be clipped.
   */
  clipSourceDest(srcRect, dstRect) {
    dstRect.right = dstRect.left + srcRect.getWidth();
    dstRect.bottom = dstRect.top + srcRect.getHeight();

    if (
      this.isEmpty() ||
      dstRect.left >= this.right ||
      dstRect.top >= this.bottom ||
      dstRect.right <= this.left ||
      dstRect.bottom <= this.top
    ) {
      srcRect.makeEmpty();
      dstRect.makeEmpty();
    } else {
      // bottom/right
      if (dstRect.right > this.right) {
        srcRect.right -= dstRect.right - this.right;
        dstRect.right = this.right;
      }

      if (dstRect.bottom > this.bottom) {
        srcRect.bottom -= dstRect.bottom - this.bottom;
        dstRect.bottom = this.bottom;
      }

      // top/left
      if (dstRect.left < this.left) {
        srcRect.left += this.left - dstRect.left;
        dstRect.left = this.left;
      }

      if (dstRect.top < this.top) {
        srcRect.top += this.top - dstRect.top;
        dstRect.top = this.top;
      }
    }
  }

  /** @returns {number} */
  getWidth() {
    return this.right - this.left;
  }

  /** @returns {number} */
  getHeight() {
    return this.bottom - this.top;
  }

  /** @returns {number} */
  getArea() {
    return this.getWidth() * this.getHeight();
  }

  /** @returns {boolean} */
  isEmpty() {
    return this.right <= this.left || this.bottom <= this.top;
  }

  /**
   * Set this rectangle's coordinates to a copy of that ones.
   *
   * @param {CPRect} thatRect
   */
  set(thatRect) {
    this.left = thatRect.left;
    this.top = thatRect.top;
    this.right = thatRect.right;
    this.bottom = thatRect.bottom;
  }

  /**
   * Get an independent copy of this rectangle.
   *
   * @returns {CPRect}
   */
  clone() {
    return new CPRect(this.left, this.top, this.right, this.bottom);
  }

  /**
   * Move the rectangle by the given offset
   *
   * @param {number} x
   * @param {number} y
   *
   * @returns {CPRect} This rectangle for chaining
   */
  translate(x, y) {
    this.left += x;
    this.right += x;
    this.top += y;
    this.bottom += y;

    return this;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {CPRect}  
   */
  getTranslated(x, y) {
    var result = this.clone();

    result.translate(x, y);

    return result;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  moveTo(x, y) {
    this.translate(x - this.left, y - this.top);
  }

  equals(that) {
    return (
      this.left == that.left &&
      this.right == that.right &&
      this.top == that.top &&
      this.bottom == that.bottom
    );
  }

  /**
   * Add h pixels to both the left and right sides of the rectangle, and v pixels to both the top and bottom sides.
   *
   * @param {number} h
   * @param {number} v
   */
  grow(h, v) {
    // TODO checks for rectangles with zero-extent
    this.left -= h;
    this.right += h;
    this.top -= v;
    this.bottom += v;
  }

  toString() {
    return (
      "(" +
      this.left +
      "," +
      this.top +
      "," +
      this.right +
      "," +
      this.bottom +
      ")"
    );
  }

  /**
   * Convert the rectangle into an array of points of the corners of the rectangle (clockwise starting from the top left
   * point).
   */
  toPoints() {
    return [
      { x: this.left, y: this.top },
      { x: this.right, y: this.top },
      { x: this.right, y: this.bottom },
      { x: this.left, y: this.bottom },
    ];
  }

  /**
   * Round the rectangle coordinates to the nearest integer.
   *
   * @returns {CPRect} This rectangle for chaining
   */
  roundNearest() {
    this.left = Math.round(this.left);
    this.top = Math.round(this.top);
    this.right = Math.round(this.right);
    this.bottom = Math.round(this.bottom);

    return this;
  }

  /**
   * Round the rectangle coordinates to integers so that the old rectangle is contained by the new one.
   *
   * @returns {CPRect} This rectangle for chaining
   */
  roundContain() {
    this.left = Math.floor(this.left);
    this.top = Math.floor(this.top);
    this.right = Math.ceil(this.right);
    this.bottom = Math.ceil(this.bottom);

    return this;
  }

  /**
   * Create an AABB CPRect which encloses the given array of points.
   *
   * @param {{x: number, y: number}[]} points
   *
   * @returns {CPRect}
   */
  static createBoundingBox(points) {
    if (points.length === 0) {
      return new CPRect(0, 0, 0, 0);
    }

    let result = new CPRect(points[0].x, points[0].y, points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      result.left = Math.min(result.left, points[i].x);
      result.top = Math.min(result.top, points[i].y);
      result.right = Math.max(result.right, points[i].x);
      result.bottom = Math.max(result.bottom, points[i].y);
    }

    return result;
  }

  /**
   * Subtract that rectangle from this one and return an array of CPRects to represent the resulting area (possibly
   * empty).
   *
   * @param {CPRect} that
   * @returns {CPRect[]}
   */
  subtract(that) {
    return CPRect.subtract(this, that);
  }
  /**
   * Subtract the second rectangle or array of rectangles from the first one, and return an array of CPRects to represent
   * the resulting area (possibly empty).
   *
   * @param {(CPRect|CPRect[])} rectsA
   * @param {(CPRect|CPRect[])} rectsB
   * @returns {CPRect[]}
   */
  static subtract(rectsA, rectsB) {
    if (rectsA instanceof CPRect) {
      rectsA = [rectsA];
    }
    if (rectsB instanceof CPRect) {
      rectsB = [rectsB];
    }
    /** @type {any} */
    let result = rectsA.slice(0);

    for (let i = 0; i < rectsB.length; i++) {
      // Don't re-examine any new rectangles we push onto the result, since we know they don't intersect this rectB:
      let rectB = rectsB[i],
        resultLength = result.length;

      for (let j = 0; j < resultLength; j++) {
        let rectA = result[j];

        if (!rectA) {
          continue;
        }

        let intersection = rectA.getIntersection(rectB);

        if (intersection && !intersection.isEmpty()) {
          let newRects = [];

          if (rectA.top < rectB.top) {
            newRects.push(
              new CPRect(rectA.left, rectA.top, rectA.right, intersection.top),
            );
          }
          if (rectA.bottom > rectB.bottom) {
            newRects.push(
              new CPRect(
                rectA.left,
                intersection.bottom,
                rectA.right,
                rectA.bottom,
              ),
            );
          }
          if (rectA.left < rectB.left) {
            newRects.push(
              new CPRect(
                rectA.left,
                intersection.top,
                intersection.left,
                intersection.bottom,
              ),
            );
          }
          if (rectA.right > rectB.right) {
            newRects.push(
              new CPRect(
                intersection.right,
                intersection.top,
                rectA.right,
                intersection.bottom,
              ),
            );
          }

          newRects = newRects.filter((rect) => !rect.isEmpty());

          // Replace the original rectangle in the array with the new fragments
          if (newRects.length > 0) {
            result[j] = newRects[0];

            for (let k = 1; k < newRects.length; k++) {
              result.push(newRects[k]);
            }
          } else {
            result[j] = null;
          }
        }
      }
    }

    return result.filter((rect) => rect != null);
  }

  /**
   * Create a union of the given rectangles, and return an array of non-overlapping CPRects to represent
   * the resulting shape (possibly empty).
   *
   * @param {(CPRect|CPRect[])} rects
   * @returns {CPRect[]}
   */
  static union(rects) {
    let result;

    if (rects instanceof CPRect) {
      result = [rects];
    } else {
      result = rects.slice(0); // Clone to avoid damaging the original array

      for (let i = 0; i < result.length; i++) {
        // Intersect this rectangle with all the others
        let rectA = result[i],
          resultLength = result.length;

        if (!rectA) {
          continue;
        }

        // Don't re-examine any new rectangles we push onto the result
        for (let j = i + 1; j < resultLength; j++) {
          let rectB = result[j];

          if (!rectB) {
            continue;
          }

          let intersection = rectA.getIntersection(rectB);

          if (intersection && !intersection.isEmpty()) {
            /* We need to eliminate the overlap between these rectangles. Subtract rectA from rectB and leave
             * rectA alone.
             */

            let newRects = CPRect.subtract(rectB, rectA);

            // Replace rectB with one of the fragments
            result[j] = newRects[0];

            // And add the rest of the fragments to the end
            for (let k = 1; k < newRects.length; k++) {
              result.push(newRects[k]);
            }
          }
        }
      }
    }

    return result.filter((rect) => rect && !rect.isEmpty());
  }
}

/*
 * Chrome is initially eager to optimize CPRect and users assuming that all the fields are SMIs, then later on decides
 * that they should be tagged numbers after all. This causes all the blending operation functions to be reoptimized
 * a couple of times.
 *
 * Avoid that mess by starting things off with floats in the members.
 */
if (typeof window == "object") {
  window["cpRectGarbage"] = new CPRect(1.5, 2.5, 3.5, 4.5);
}

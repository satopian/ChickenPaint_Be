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

import CPColorBmp from "./CPColorBmp.js";
import CPLayer from "./CPLayer.js";
import CPRect from "../util/CPRect.js";

export default class CPImageLayer extends CPLayer {
  /**
   * Note layer image data is not cleared to any specific values upon creation, use layer.image.clearAll().
   *
   * @param {number} width - Width of the bitmap, or zero to start the bitmap out empty (if you're planning to call copyFrom())
   * @param {number} height
   * @param {String} name
   *
   */
  constructor(width, height, name) {
    super(name);
    this.image = null;
    if (width > 0 && height > 0) {
      this.image = new CPColorBmp(width, height);
    }

    /**
     * True if this layer should be clipped onto the CPImageLayer beneath it.
     *
     * @type {boolean}
     */
    this.clip = false;

    /**
     *
     * @type {?CPColorBmp}
     */
    this.imageThumbnail = null;
  }
  static createFromImage(image, name) {
    let result = new CPImageLayer(0, 0, name);

    result.image = image;

    return result;
  }

  /**
   * Returns an independent copy of this layer.
   *
   * @returns {CPImageLayer}
   * @this {any}
   */
  clone() {
    var result = new CPImageLayer(0, 0, this.name);

    result.copyFrom(this);

    return result;
  }

  /**
   *
   * @param {CPImageLayer} layer
   */
  copyFrom(layer) {
    super.copyFrom(layer);

    this.clip = layer.clip;
    if (layer.image) {
      if (!this.image) {
        this.image = layer.image.clone();
      } else {
        this.image.copyPixelsFrom(layer.image);
      }
    }
  }

  /**
   * Do we have any non-opaque pixels in the entire layer?
   * @returns {boolean}
   */
  hasAlpha() {
    if (this.alpha != 100) {
      return true;
    }
    if (!this.image) {
      return false;
    }
    return this.image.hasAlpha();
  }

  /**
   * Do we have any semi-transparent pixels in the given rectangle?
   *
   * @param {CPRect} rect
   * @returns {boolean}
   */
  hasAlphaInRect(rect) {
    if (this.alpha != 100) {
      return true;
    }
    if (!this.image) {
      return false;
    }
    return this.image.hasAlphaInRect(rect);
  }

  /**
   *
   * @param {CPColorBmp} that
   */
  copyImageFrom(that) {
    if (!this.image) {
      return;
    }
    this.image.copyPixelsFrom(that);
  }

  /**
   * If this layer is clipped, return the layer that this layer is clipped to, otherwise return null.
   *
   * @returns {?CPImageLayer}
   */
  getClippingBase() {
    if (this.clip && this.parent) {
      for (var i = this.parent.indexOf(this) - 1; i >= 0; i--) {
        if (this.parent.layers[i] instanceof CPImageLayer) {
          if (!this.parent.layers[i].clip) {
            return this.parent.layers[i];
          }
        } else {
          // We can't clip to non-image layers, so something went wrong here...
          break;
        }
      }
    }
    return null;
  }

  /**
   *
   * @returns {boolean}
   */
  getClip() {
    return this.clip;
  }

  /**
   *
   * @param {boolean} clip
   */
  setClip(clip) {
    this.clip = clip;
  }

  /**
   * Get a rectangle that encloses any non-transparent pixels in the layer within the given initialBounds (or an empty
   * rect if the pixels inside the given bounds are 100% transparent).
   *
   * Ignores the layer alpha and visibility properties, you may want to check .getEffectiveAlpha() > 0 before calling.
   *
   * @param {CPRect} initialBounds - The rect to search within
   *
   * @returns {any} CPRect
   */
  getNonTransparentBounds(initialBounds) {
    return this.image?.getNonTransparentBounds(initialBounds);
  }

  /**
   * @returns {CPRect}
   */
  getBounds() {
    return new CPRect(0, 0, this.image?.width ?? 0, this.image?.height ?? 0);
  }

  /**
   * Get an approximation of the number of bytes of memory used by this layer.
   *
   * @returns {number}
   */
  getMemoryUsed() {
    return this.image ? this.image.getMemorySize() : 0;
  }

  /**
   * Recreate the image thumbnail for this layer.
   */
  rebuildImageThumbnail() {
    if (!this.image) {
      return null;
    }

    if (!this.imageThumbnail) {
      var scaleDivider = Math.ceil(
        Math.max(
          this.image.width / CPLayer.LAYER_THUMBNAIL_WIDTH,
          this.image.height / CPLayer.LAYER_THUMBNAIL_HEIGHT,
        ),
      );

      this.imageThumbnail = new CPColorBmp(
        Math.floor(this.image.width / scaleDivider),
        Math.floor(this.image.height / scaleDivider),
      );
    }

    this.imageThumbnail.createThumbnailFrom(this.image);
  }

  /**
   * Get the image thumbnail for this layer (or build one if one was not already built)
   *
   * @returns {?CPColorBmp}
   */
  getImageThumbnail() {
    if (!this.imageThumbnail) {
      this.rebuildImageThumbnail();
    }

    return this.imageThumbnail;
  }
}

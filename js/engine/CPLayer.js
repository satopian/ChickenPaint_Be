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

import CPBlend from "./CPBlend.js";
import CPGreyBmp from "./CPGreyBmp.js";
import CPRect from "../util/CPRect.js";
/**
 * @typedef {import("./CPImageLayer.js").default} CPImageLayer
 */
/**
 * @typedef {import("./CPLayerGroup.js").default} CPLayerGroup
 */

export default class CPLayer {
  /**
   * @param {String} name
   */
  constructor(name) {
    /**
     *
     * @type {String}
     */
    this.name = name || "";

    /**
     * The parent of this layer, if this node is in a layer group.
     *
     * @typedef {CPLayerGroup}
     * @property {CPLayer[]} layers
     * ...
     */
    this.parent = null;

    /**
     * True if drawing operations on the image of this layer should not change the alpha component of the layer.
     *
     * @type {boolean}
     */
    this.lockAlpha = false;

    /**
     * The opacity of this layer (0 = transparent, 100 = opaque)
     *
     * @type {number}
     */
    this.alpha = 100;

    /**
     * True if this layer and its children should be drawn.
     *
     * @type {boolean}
     */
    this.visible = true;

    /**
     * One of the CMBlend.LM_* constants.
     *
     * @type {number}
     */
    this.blendMode = CPBlend.LM_NORMAL;

    /**
     * The layer mask (if present)
     *
     * @type {?CPGreyBmp}
     */
    this.mask = null;

    /**
     * True if transformations applied to the layer should also be applied to the mask (and vice versa)
     *
     * @type {boolean}
     */
    this.maskLinked = true;

    /**
     * True if the mask should be applied (if present)
     *
     * @type {boolean}
     */
    this.maskVisible = true;

    /**
     * The thumbnail of the mask (if a mask is present and the thumb has been built)
     * @type {?CPGreyBmp}
     */
    this.maskThumbnail = null;

    /**
     * True if this layer should use CPBlend.LM_MULTIPLY instead of CPBlend.LM_MULTIPLY2
     * @type {boolean}
     */
    this.useLegacyMultiply = false;
    /**
     * @type {any}
     */
    this.image = null;
    /**
     * When true, we should clip the layers in this group to the bottom layer of the stack
     *
     * @type {boolean}
     */
    this.clip = false;
  }
  /**
   * @param {CPLayer|Object} layer
   */
  copyFrom(layer) {
    this.name = layer.name;
    this.blendMode = layer.blendMode;
    this.useLegacyMultiply = layer.useLegacyMultiply;
    this.alpha = layer.alpha;
    this.visible = layer.visible;
    this.parent = layer.parent;
    this.lockAlpha = layer.lockAlpha;

    if (!layer.mask) {
      this.mask = null;
    } else if (this.mask) {
      this.mask.copyPixelsFrom(layer.mask);
    } else {
      this.mask = layer.mask.clone();
    }
    this.maskLinked = layer.maskLinked;
    this.maskVisible = layer.maskVisible;

    if (!layer.maskThumbnail) {
      this.maskThumbnail = null;
    } else if (this.maskThumbnail) {
      this.maskThumbnail.copyPixelsFrom(layer.maskThumbnail);
    } else {
      this.maskThumbnail = layer.maskThumbnail.clone();
    }
  }

  /**
   * @memberof CPLayer
   * @param {CPGreyBmp|null} mask
   */
  setMask(mask) {
    this.mask = mask;
    if (!mask) {
      this.maskThumbnail = null;
    }
  }
  /**
   * レイヤーの不透明度
   * @param {number} alpha
   * @note 0-100
   */
  setAlpha(alpha) {
    this.alpha = alpha;
  }
  /**
   * レイヤーの不透明度を取得
   * @returns {number}
   */
  getAlpha() {
    return this.alpha;
  }

  /**
   * Get the alpha of this layer, or zero if this layer is hidden.
   *
   * @returns {number}
   */
  getEffectiveAlpha() {
    if (this.visible) {
      return this.alpha;
    }
    return 0;
  }

  /**
   * Get the mask for this layer, or null if the mask is not present or hidden.
   *
   * @returns {?CPGreyBmp}
   */
  getEffectiveMask() {
    if (this.maskVisible) {
      return this.mask;
    }
    return null;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
  /**
   * @param {number} blendMode
   */
  setBlendMode(blendMode) {
    this.blendMode = blendMode;

    if (blendMode === CPBlend.LM_MULTIPLY) {
      /* If the blend mode is ever set to this legacy one, we'll keep this flag set on the layer so that the
       * user can change to a different blending mode, and still be able to change it back to the legacy one.
       */
      this.useLegacyMultiply = true;
    } else if (blendMode === CPBlend.LM_MULTIPLY2) {
      this.useLegacyMultiply = false;
    }
  }

  getBlendMode() {
    return this.blendMode;
  }

  getLockAlpha() {
    return this.lockAlpha;
  }

  setLockAlpha(value) {
    this.lockAlpha = value;
  }

  /**
   * @param {boolean|undefined} visible
   */
  setVisible(visible) {
    this.visible = !!visible;
  }

  //どこからも呼ばれていない?
  getVisible() {
    return this.visible;
  }

  //どこからも呼ばれていない?
  isVisible() {
    return this.getVisible();
  }
  /**
   * @param {boolean|undefined} linked
   */
  setMaskLinked(linked) {
    this.maskLinked = !!linked;
  }

  //どこからも呼ばれていない?
  getMaskLinked() {
    return this.maskLinked;
  }

  /**
   * @param {boolean|undefined} visible
   */
  setMaskVisible(visible) {
    this.maskVisible = !!visible;
  }

  getMaskVisible() {
    return this.maskVisible;
  }

  getMemoryUsed() {
    return 0;
  }

  getDepth() {
    if (this.parent == null) {
      return 0;
    }
    return this.parent.getDepth() + 1;
  }

  ancestorsAreVisible() {
    return (
      this.parent == null ||
      (this.parent.visible && this.parent.ancestorsAreVisible())
    );
  }

  /**
   * Returns true if this layer has the given group as one of its ancestors.
   *
   * @param {CPLayerGroup|CPImageLayer} group
   * @returns {boolean}
   */
  hasAncestor(group) {
    return (
      !!(this.parent == group) ||
      !!(this.parent && this.parent.hasAncestor(group))
    );
  }
  /**
   * Returns an independent copy of this layer.
   *
   */
  /**
   * Returns an independent copy of this layer.
   *
   * @this {CPLayer}
   */
  clone() {
    return /** @type {any} */ (null);
  }
  /**
   * Get a rectangle that encloses any non-transparent pixels in the layer within the given initialBounds (or an empty
   * rect if the pixels inside the given bounds are 100% transparent).
   *
   * @param {CPRect} initialBounds - The rect to search within
   *
   * @returns {CPRect}
   */
  getNonTransparentBounds(initialBounds) {
    return new CPRect(0, 0, 0, 0);
  }

  /**
   * Recreate the image thumbnail for this layer.
   */
  rebuildMaskThumbnail() {
    if (this.mask) {
      if (!this.maskThumbnail) {
        var scaleDivider = Math.ceil(
          Math.max(
            this.mask.width / CPLayer.LAYER_THUMBNAIL_WIDTH,
            this.mask.height / CPLayer.LAYER_THUMBNAIL_HEIGHT,
          ),
        );

        this.maskThumbnail = new CPGreyBmp(
          Math.floor(this.mask.width / scaleDivider),
          Math.floor(this.mask.height / scaleDivider),
          8,
        );
      }

      this.maskThumbnail.createThumbnailFrom(this.mask);
    } else {
      this.maskThumbnail = null;
    }
  }

  /**
   * Get the mask thumbnail for this layer (or build one if one was not already built). If the layer has no mask, null
   * is returned.
   *
   * @returns {?CPGreyBmp}
   */
  getMaskThumbnail() {
    if (!this.maskThumbnail && this.mask) {
      this.rebuildMaskThumbnail();
    }

    return this.maskThumbnail;
  }
}

CPLayer.LAYER_THUMBNAIL_WIDTH = 80;
CPLayer.LAYER_THUMBNAIL_HEIGHT = 50;

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

import CPLayer from "./CPLayer.js";
import CPRect from "../util/CPRect.js";

export default class CPLayerGroup extends CPLayer {
  /**
   *
   * @param {string} name
   * @param {number} blendMode
   */

  constructor(name = "", blendMode = 0) {
    super(name);

    /**
     * @type {CPLayer[]}
     */
    this.layers = [];
    this.expanded = true;
    this.blendMode = blendMode;
  }

  /**
   * Returns an array of layers in this group in display order, excluding this group itself.
   *
   * @param {boolean} respectCollapse - Set to true to omit the children of collapsed groups
   * @param {CPLayer[]} list
   * @returns {CPLayer[]}
   */
  getLinearizedLayerList(respectCollapse, list = []) {
    for (let layer of this.layers) {
      if (
        layer instanceof CPLayerGroup &&
        (layer.expanded || !respectCollapse)
      ) {
        layer.getLinearizedLayerList(respectCollapse, list);
      }
      list.push(layer);
    }

    return list;
  }

  clearLayers() {
    this.layers = [];
  }

  /** @param {CPLayer} layer */
  addLayer(layer) {
    layer.parent = this;
    this.layers.push(layer);
  }

  /**
   * @param {Number} index
   *  @param {CPLayer} layer
   */
  insertLayer(index, layer) {
    layer.parent = this;
    this.layers.splice(index, 0, layer);
  }

  /** @param {CPLayer} layer */
  removeLayer(layer) {
    var index = this.layers.indexOf(layer);

    if (index > -1) {
      this.layers.splice(index, 1);
    }
  }

  /** @param {Number} index */
  removeLayerAtIndex(index) {
    var layer = this.layers[index];

    if (layer) {
      this.layers.splice(index, 1);
    }

    return layer;
  }

  /**
   * @param {Number} index
   *  @param {CPLayer} layer
   */
  setLayerAtIndex(index, layer) {
    var oldLayer = this.layers[index];

    layer.parent = this;
    this.layers[index] = layer;

    return oldLayer;
  }
  /** @param  {boolean} expanded */
  setExpanded(expanded) {
    this.expanded = expanded;
  }

  getExpanded() {
    return this.expanded;
  }

  /**
   * Get the index of the given layer in this group, or -1 if the layer is not in the group.
   *
   * @param {CPLayer} layer
   * @returns {number}
   */
  indexOf(layer) {
    return this.layers.indexOf(layer);
  }

  /**
   *
   * @param {Number} a
   * @param {Number} b
   * @returns {Number}
   */
  static sum(a, b) {
    return a + b;
  }

  /**
   * Get an approximation of the number of bytes of memory used by this layer.
   *
   * @returns {number}
   */
  getMemoryUsed() {
    return this.layers
      .map((layer) => layer.getMemoryUsed())
      .reduce(CPLayerGroup.sum);
  }

  clone() {
    var result = new CPLayerGroup(this.name, this.blendMode);

    result.copyFrom(this);
    result.expanded = this.expanded;
    result.layers = this.layers.map((layer) => layer.clone());
    result.layers.forEach((layer) => (layer.parent = result));

    return result;
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
    var nonTransparentRect = new CPRect(0, 0, 0, 0);

    this.layers.forEach((layer) =>
      nonTransparentRect.union(layer.getNonTransparentBounds(initialBounds)),
    );

    return nonTransparentRect;
  }
}

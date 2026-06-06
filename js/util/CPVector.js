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
export default class CPVector {
  /**
   * @param {number} x
   * @param {number} y
   *
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   *
   * @returns {CPVector} This vector for chaining
   */
  normalize() {
    var length = this.getLength();

    this.x /= length;
    this.y /= length;

    return this;
  }

  /**
   *
   * @param {CPVector} that
   */
  getDotProduct(that) {
    return this.x * that.x + this.y * that.y;
  }

  /**
   *
   * @param {Number} scaleFactor
   * @returns {CPVector} This vector for chaining
   */
  scale(scaleFactor) {
    this.x *= scaleFactor;
    this.y *= scaleFactor;

    return this;
  }

  getScaled(scaleFactor) {
    var result = new CPVector(this.x, this.y);

    result.scale(scaleFactor);

    return result;
  }

  getRounded() {
    return new CPVector(Math.round(this.x), Math.round(this.y));
  }

  getTruncated() {
    return new CPVector(~~this.x, ~~this.y);
  }

  getPerpendicular() {
    return new CPVector(-this.y, this.x);
  }

  /**
   * Add that vector to this one
   *
   * @param {CPVector} that
   * @returns {CPVector} This vector for chaining
   */
  add(that) {
    this.x += that.x;
    this.y += that.y;

    return this;
  }

  /**
   * Subtract that vector from this one
   *
   * @param {CPVector} that
   * @returns {CPVector} This vector for chaining
   */
  subtract(that) {
    this.x -= that.x;
    this.y -= that.y;

    return this;
  }

  /**
   * Get the sum of this vector and that one.
   *
   * @param {CPVector} that
   * @returns {CPVector}
   */
  getSum(that) {
    return new CPVector(this.x + that.x, this.y + that.y);
  }

  /**
   * Create a new vector by p1 - p2
   *
   * @param {{x: number, y: number}} p1
   * @param {{x: number, y: number}} p2
   * @returns {CPVector}
   */
  static subtractPoints(p1, p2) {
    return new CPVector(p1.x - p2.x, p1.y - p2.y);
  }
}

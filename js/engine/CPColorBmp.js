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

import CPBitmap from "./CPBitmap.js";
import CPRect from "../util/CPRect.js";
import { createCanvas } from "../util/Canvas.js";
import { createImageData } from "../util/Canvas.js";

/**
 * A 32bpp bitmap class (one byte per channel in RGBA order)
 *
 * @param {(ImageData|number)} width - The width of the bitmap, or the ImageData object to use by reference
 * @param {?number} height - The height of the bitmap
 *
 * @constructor
 * @extends {CPBitmap}
 *
 * @property {number} width
 * @property {number} height
 * @property {CanvasPixelArray} data - The bitmap data array (one byte per channel in RGBA order). We'd prefer this to
 *                                     be Uint8ClampedArray, but IE 10 doesn't support it
 * @property {ImageData} imageData
 */
export default function CPColorBmp(width, height) {
    if (typeof width == "number") {
        CPBitmap.call(this, width, height);

        this.imageData = createImageData(this.width, this.height);
    } else {
        var imageData = width;

        CPBitmap.call(this, imageData.width, imageData.height);

        this.imageData = imageData;
    }

    this.data = this.imageData.data;
}

CPColorBmp.prototype = Object.create(CPBitmap.prototype);
CPColorBmp.prototype.constructor = CPColorBmp;

CPColorBmp.BYTES_PER_PIXEL = 4;
CPColorBmp.RED_BYTE_OFFSET = 0;
CPColorBmp.GREEN_BYTE_OFFSET = 1;
CPColorBmp.BLUE_BYTE_OFFSET = 2;
CPColorBmp.ALPHA_BYTE_OFFSET = 3;

/**
 * Create an independent copy of this bitmap.
 *
 * @returns {CPColorBmp}
 */
CPColorBmp.prototype.clone = function () {
    return this.cloneRect(this.getBounds());
};

/**
 * Creates a CPColorBmp from a portion of this bitmap
 *
 * @param {CPRect} rect
 * @returns {CPColorBmp}
 */
CPColorBmp.prototype.cloneRect = function (rect) {
    var result = new CPColorBmp(rect.getWidth(), rect.getHeight());

    result.copyBitmapRect(this, 0, 0, rect);

    return result;
};

/**
 * Pixel access with friendly clipping.
 *
 * @returns {number} 32-bit integer in ARGB format
 */
CPColorBmp.prototype.getPixel = function (x, y) {
    x = Math.max(0, Math.min(this.width - 1, x));
    y = Math.max(0, Math.min(this.height - 1, y));

    var pixIndex = this.offsetOfPixel(x, y);

    return (
        (this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] << 24) |
        (this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] << 16) |
        (this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] << 8) |
        this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET]
    );
};

/**
 * 指定座標のピクセルにARGB値を設定します（座標は自動でキャンバス内に補正されます）
 *
 * @param {number} x - X座標
 * @param {number} y - Y座標
 * @param {number} argb - 32ビット整数のARGB値
 */
CPColorBmp.prototype.setPixel = function (x, y, argb) {
    x = Math.max(0, Math.min(this.width - 1, x));
    y = Math.max(0, Math.min(this.height - 1, y));

    const pixIndex = this.offsetOfPixel(x, y);

    this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = (argb >> 24) & 0xff;
    this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = (argb >> 16) & 0xff;
    this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = (argb >> 8) & 0xff;
    this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = argb & 0xff;
};

/**
 * Get an r,g,b,a array of the xor of this bitmap and the given one, within the given rectangle
 *
 * @param {CPColorBmp} bmp
 * @param {CPRect} rect
 *
 * @returns {Uint8Array}
 */
CPColorBmp.prototype.copyRectXOR = function (bmp, rect) {
    rect = this.getBounds().clipTo(rect);

    var w = rect.getWidth(),
        h = rect.getHeight(),
        buffer = new Uint8Array(w * h * CPColorBmp.BYTES_PER_PIXEL),
        outputIndex = 0,
        bmp1Index = this.offsetOfPixel(rect.left, rect.top),
        bmp2Index = bmp.offsetOfPixel(rect.left, rect.top),
        bmp1YSkip = (this.width - w) * CPColorBmp.BYTES_PER_PIXEL,
        bmp2YSkip = (bmp.width - w) * CPColorBmp.BYTES_PER_PIXEL,
        widthBytes = w * CPColorBmp.BYTES_PER_PIXEL;

    for (
        var y = rect.top;
        y < rect.bottom;
        y++, bmp1Index += bmp1YSkip, bmp2Index += bmp2YSkip
    ) {
        for (
            var x = 0;
            x < widthBytes;
            x++, outputIndex++, bmp1Index++, bmp2Index++
        ) {
            buffer[outputIndex] = this.data[bmp1Index] ^ bmp.data[bmp2Index];
        }
    }

    return buffer;
};

CPColorBmp.prototype.setRectXOR = function (buffer, rect) {
    rect = this.getBounds().clipTo(rect);

    var w = rect.getWidth(),
        h = rect.getHeight(),
        bmp1Index = this.offsetOfPixel(rect.left, rect.top),
        bufferIndex = 0,
        bmp1YSkip = (this.width - w) * CPColorBmp.BYTES_PER_PIXEL,
        widthBytes = w * CPColorBmp.BYTES_PER_PIXEL;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < widthBytes; x++) {
            this.data[bmp1Index++] ^= buffer[bufferIndex++];
        }
        bmp1Index += bmp1YSkip;
    }
};

/**
 * Copy the rectangle at srcRect from bmp onto this image at (dstX, dstY).
 *
 * @param {CPColorBmp} bmp
 * @param {number} dstX
 * @param {number} dstY
 * @param {CPRect} srcRect
 */
CPColorBmp.prototype.copyBitmapRect = function (bmp, dstX, dstY, srcRect) {
    var dstRect = new CPRect(dstX, dstY, 0, 0);

    srcRect = srcRect.clone();

    this.getBounds().clipSourceDest(srcRect, dstRect);

    var w = dstRect.getWidth() | 0,
        h = dstRect.getHeight() | 0;

    // Are we just trying to duplicate the bitmap?
    if (
        dstRect.left == 0 &&
        dstRect.top == 0 &&
        w == this.width &&
        h == this.height &&
        w == bmp.width &&
        h == bmp.height
    ) {
        this.copyPixelsFrom(bmp);
    } else {
        var dstIndex = this.offsetOfPixel(dstRect.left, dstRect.top),
            dstYSkip = (this.width - w) * CPColorBmp.BYTES_PER_PIXEL,
            srcIndex = bmp.offsetOfPixel(srcRect.left, srcRect.top),
            srcYSkip = (bmp.width - w) * CPColorBmp.BYTES_PER_PIXEL;

        for (
            var y = 0;
            y < h;
            y++, srcIndex += srcYSkip, dstIndex += dstYSkip
        ) {
            for (
                var x = 0;
                x < w;
                x++,
                    srcIndex += CPColorBmp.BYTES_PER_PIXEL,
                    dstIndex += CPColorBmp.BYTES_PER_PIXEL
            ) {
                this.data[dstIndex] = bmp.data[srcIndex];
                this.data[dstIndex + 1] = bmp.data[srcIndex + 1];
                this.data[dstIndex + 2] = bmp.data[srcIndex + 2];
                this.data[dstIndex + 3] = bmp.data[srcIndex + 3];
            }
        }
    }
};

//
// Copies the Alpha channel from another bitmap. Assumes both bitmaps are the same width.
//
CPColorBmp.prototype.copyAlphaFrom = function (bmp, rect) {
    rect = this.getBounds().clipTo(rect);

    var w = rect.getWidth() | 0,
        h = rect.getHeight() | 0,
        pixIndex =
            (this.offsetOfPixel(rect.left, rect.top) +
                CPColorBmp.ALPHA_BYTE_OFFSET) |
            0 /* Apply offset here so we don't have to do it per-pixel*/,
        ySkip = ((this.width - w) * CPColorBmp.BYTES_PER_PIXEL) | 0;

    for (var y = 0; y < h; y++, pixIndex += ySkip) {
        for (var x = 0; x < w; x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL) {
            this.data[pixIndex] = bmp.data[pixIndex];
        }
    }
};

/**
 * Resize this bitmap to be the same size as that one
 *
 * @param {CPBitmap} bmp
 */
CPColorBmp.prototype.setToSize = function (bmp) {
    if (bmp.width != this.width || bmp.height != this.height) {
        this.width = bmp.width;
        this.height = bmp.height;

        this.imageData = createImageData(this.width, this.height);
        this.data = this.imageData.data;
    }
};

/**
 *
 * @param {CPColorBmp} bmp
 */
CPColorBmp.prototype.copyPixelsFrom = function (bmp) {
    this.setToSize(bmp);

    if ("set" in this.data) {
        this.data.set(bmp.data);
    } else {
        // IE doesn't use Uint8ClampedArray for ImageData, so set() isn't available
        for (var i = 0; i < this.data.length; i++) {
            this.data[i] = bmp.data[i];
        }
    }
};

CPColorBmp.prototype.copyPixelsFromGreyscale = function (bmp) {
    var srcIndex,
        dstIndex = 0,
        pixels = bmp.width * bmp.height;

    this.setToSize(bmp);

    for (
        srcIndex = 0;
        srcIndex < pixels;
        srcIndex++, dstIndex += CPColorBmp.BYTES_PER_PIXEL
    ) {
        this.data[dstIndex + CPColorBmp.RED_BYTE_OFFSET] = bmp.data[srcIndex];
        this.data[dstIndex + CPColorBmp.GREEN_BYTE_OFFSET] = bmp.data[srcIndex];
        this.data[dstIndex + CPColorBmp.BLUE_BYTE_OFFSET] = bmp.data[srcIndex];
        this.data[dstIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = 0xff;
    }
};

/**
 * Use nearest-neighbor (subsampling) to scale that bitmap to replace the pixels of this one.
 *
 * @param {CPColorBmp} that
 */
CPColorBmp.prototype.copyScaledNearestNeighbor = function (that) {
    var destPixIndex = 0,
        xSkip = that.width / this.width,
        ySkip = that.height / this.height,
        srcRowStart;

    for (var y = 0, srcRow = 0; y < this.height; y++, srcRow += ySkip) {
        srcRowStart = that.offsetOfPixel(0, Math.round(srcRow));

        for (
            var x = 0, srcCol = 0;
            x < this.width;
            x++, destPixIndex += CPColorBmp.BYTES_PER_PIXEL, srcCol += xSkip
        ) {
            var srcPixIndex =
                srcRowStart + Math.round(srcCol) * CPColorBmp.BYTES_PER_PIXEL;

            this.data[destPixIndex] = that.data[srcPixIndex];
            this.data[destPixIndex + 1] = that.data[srcPixIndex + 1];
            this.data[destPixIndex + 2] = that.data[srcPixIndex + 2];
            this.data[destPixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] =
                that.data[srcPixIndex + CPColorBmp.ALPHA_BYTE_OFFSET];
        }
    }
};

/**
 * Replace the pixels in this image with a scaled down thumbnail of that image.
 *
 * The thumbnail will attempt to exaggerate the contribution of thin opaque strokes on a transparent background, in order
 * to make lineart layers more visible.
 *
 * @param {CPColorBmp} that
 */
CPColorBmp.prototype.createThumbnailFrom = function (that) {
    const MAX_SAMPLES_PER_OUTPUT_PIXEL = 3,
        numSamples = Math.min(
            Math.floor(that.width / this.width),
            MAX_SAMPLES_PER_OUTPUT_PIXEL,
        );

    if (numSamples < 2) {
        // If we only take one sample per output pixel, there's no need for our filtering strategy
        this.copyScaledNearestNeighbor(that);
        return;
    }

    const // Uint16 means we can have up to 16 (since 16*16 ~= 65535/255) times scale reduction without overflow
        rowBuffer = new Uint16Array(
            this.width *
                5 /* 4 bytes of RGBA plus one to record the max alpha of the samples */,
        ),
        srcRowByteLength = that.width * CPColorBmp.BYTES_PER_PIXEL,
        sourceBytesBetweenOutputCols =
            Math.floor(that.width / this.width) * CPColorBmp.BYTES_PER_PIXEL,
        intersampleXByteSpacing =
            Math.floor(that.width / this.width / numSamples) *
            CPColorBmp.BYTES_PER_PIXEL,
        /* Due to the floor() in intersampleXByteSkip, it's likely that the gap between the last sample for an output pixel
         * and the start of the sample for the next pixel will be higher than the intersample gap. So we'll add this between
         * pixels if needed.
         */
        interpixelXByteSkip =
            sourceBytesBetweenOutputCols - intersampleXByteSpacing * numSamples,
        // Now we do the same for rows...
        sourceRowsBetweenOutputRows = Math.floor(that.height / this.height),
        intersampleYRowsSpacing = Math.floor(
            that.height / this.height / numSamples,
        ),
        intersampleYByteSkip =
            intersampleYRowsSpacing * srcRowByteLength -
            sourceBytesBetweenOutputCols * this.width,
        interpixelYByteSkip =
            (sourceRowsBetweenOutputRows -
                intersampleYRowsSpacing * numSamples) *
            srcRowByteLength;

    let srcPixIndex = 0,
        dstPixIndex = 0;

    // For each output thumbnail row...
    for (let y = 0; y < this.height; y++, srcPixIndex += interpixelYByteSkip) {
        let bufferIndex = 0;

        rowBuffer.fill(0);

        // Sum the contributions of the input rows that correspond to this output row
        for (
            let y2 = 0;
            y2 < numSamples;
            y2++, srcPixIndex += intersampleYByteSkip
        ) {
            bufferIndex = 0;
            for (
                let x = 0;
                x < this.width;
                x++, bufferIndex += 5, srcPixIndex += interpixelXByteSkip
            ) {
                for (
                    let x2 = 0;
                    x2 < numSamples;
                    x2++, srcPixIndex += intersampleXByteSpacing
                ) {
                    let sourceAlpha =
                            that.data[
                                srcPixIndex + CPColorBmp.ALPHA_BYTE_OFFSET
                            ],
                        sourceAlphaScale = sourceAlpha / 255;

                    // Accumulate the pre-multiplied pixels in the sample area
                    rowBuffer[bufferIndex] +=
                        that.data[srcPixIndex] * sourceAlphaScale;
                    rowBuffer[bufferIndex + 1] +=
                        that.data[srcPixIndex + 1] * sourceAlphaScale;
                    rowBuffer[bufferIndex + 2] +=
                        that.data[srcPixIndex + 2] * sourceAlphaScale;
                    rowBuffer[bufferIndex + CPColorBmp.ALPHA_BYTE_OFFSET] +=
                        sourceAlpha;

                    // And keep track of the highest alpha we see
                    rowBuffer[bufferIndex + 4] = Math.max(
                        rowBuffer[bufferIndex + 4],
                        sourceAlpha,
                    );
                }
            }
        }

        // Now this thumbnail row is complete and we can write the buffer to the output
        bufferIndex = 0;
        for (
            let x = 0;
            x < this.width;
            x++, bufferIndex += 5, dstPixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            let maxAlphaForSample = rowBuffer[bufferIndex + 4];

            if (maxAlphaForSample == 0) {
                this.data[dstPixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = 0;
            } else {
                // Undo the premultiplication of the pixel data, scaling it to the max() alpha we want
                let sampleAlphaScale =
                    maxAlphaForSample /
                    rowBuffer[bufferIndex + CPColorBmp.ALPHA_BYTE_OFFSET];

                this.data[dstPixIndex] =
                    rowBuffer[bufferIndex] * sampleAlphaScale;
                this.data[dstPixIndex + 1] =
                    rowBuffer[bufferIndex + 1] * sampleAlphaScale;
                this.data[dstPixIndex + 2] =
                    rowBuffer[bufferIndex + 2] * sampleAlphaScale;

                this.data[dstPixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] =
                    maxAlphaForSample;
            }
        }
    }
};

/**
 * Flood Fill（塗りつぶし）＋縁取り拡張
 * - fillColor: 0xAARRGGBB
 * - expandBy: 塗りつぶし範囲を拡張するピクセル数
 * - alpha255: 不透明度 (1-255)
 * - mergedData: 判定用に渡す全レイヤー合成結果 (Uint8ClampedArray)
 *   null の場合は現在のレイヤーを基準にする
 */
CPColorBmp.prototype.floodFillWithBorder = function (
    x,
    y,
    fillColor,
    expandBy = 2,
    alpha255 = 255,
    fusion = null,
) {
    if (!this.isInside(x, y)) return;

    const w = this.width;
    const h = this.height;
    const data = this.data; // 書き込み先
    const srcData = fusion ? fusion.data : data; // 判定元
    const BYTES = CPColorBmp.BYTES_PER_PIXEL;

    const fillR = (fillColor >> 16) & 0xff;
    const fillG = (fillColor >> 8) & 0xff;
    const fillB = fillColor & 0xff;

    const Processed = new Uint8Array(w * h);
    const stack = [{ x, y }];

    // 元色を fusion から取得
    const idx0 = (y * w + x) * BYTES;
    const oldR = srcData[idx0 + CPColorBmp.RED_BYTE_OFFSET];
    const oldG = srcData[idx0 + CPColorBmp.GREEN_BYTE_OFFSET];
    const oldB = srcData[idx0 + CPColorBmp.BLUE_BYTE_OFFSET];
    const oldA = srcData[idx0 + CPColorBmp.ALPHA_BYTE_OFFSET];

    const comparePixel = (px, py) => {
        if (px < 0 || py < 0 || px >= w || py >= h) return false;
        if (Processed[py * w + px]) return false;
        const idx = (py * w + px) * BYTES;
        return (
            srcData[idx + CPColorBmp.RED_BYTE_OFFSET] === oldR &&
            srcData[idx + CPColorBmp.GREEN_BYTE_OFFSET] === oldG &&
            srcData[idx + CPColorBmp.BLUE_BYTE_OFFSET] === oldB &&
            srcData[idx + CPColorBmp.ALPHA_BYTE_OFFSET] === oldA
        );
    };

    const setPixel = (px, py, r, g, b, a) => {
        const idx = (py * w + px) * BYTES;
        data[idx + CPColorBmp.RED_BYTE_OFFSET] = r;
        data[idx + CPColorBmp.GREEN_BYTE_OFFSET] = g;
        data[idx + CPColorBmp.BLUE_BYTE_OFFSET] = b;
        data[idx + CPColorBmp.ALPHA_BYTE_OFFSET] = a;
    };

    // flood fill 本体
    while (stack.length) {
        const { x: px, y: py } = stack.pop();
        if (!comparePixel(px, py)) continue;

        Processed[py * w + px] = 1;
        setPixel(px, py, fillR, fillG, fillB, alpha255);

        if (comparePixel(px, py - 1)) stack.push({ x: px, y: py - 1 });
        if (comparePixel(px + 1, py)) stack.push({ x: px + 1, y: py });
        if (comparePixel(px, py + 1)) stack.push({ x: px, y: py + 1 });
        if (comparePixel(px - 1, py)) stack.push({ x: px - 1, y: py });
    }

    // 縁取り拡張
    const expandedData = new Uint8ClampedArray(data);
    for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
            if (!Processed[py * w + px]) continue;

            for (let dy = -expandBy; dy <= expandBy; dy++) {
                for (let dx = -expandBy; dx <= expandBy; dx++) {
                    const nx = px + dx;
                    const ny = py + dy;
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                    if (Processed[ny * w + nx]) continue;

                    const nidx = (ny * w + nx) * BYTES;
                    expandedData[nidx + CPColorBmp.RED_BYTE_OFFSET] = fillR;
                    expandedData[nidx + CPColorBmp.GREEN_BYTE_OFFSET] = fillG;
                    expandedData[nidx + CPColorBmp.BLUE_BYTE_OFFSET] = fillB;
                    expandedData[nidx + CPColorBmp.ALPHA_BYTE_OFFSET] =
                        alpha255;
                }
            }
        }
    }
    data.set(expandedData);
};

/**
 * Premultiply the RGB channels in the given R,G,B,A channel buffer with the alpha channel.
 *
 * @param {Uint8Array} buffer - buffer R,G,B,A channel array
 * @param {number} len - Number of pixels in buffer to modify
 */
function multiplyAlpha(buffer, len) {
    var pixIndex = 0;

    for (var i = 0; i < len; i++) {
        var alpha = buffer[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET];

        // Multiply the RGB channels by alpha
        for (var j = 0; j < 3; j++, pixIndex++) {
            buffer[pixIndex] = Math.round((buffer[pixIndex] * alpha) / 255);
        }
        pixIndex++; // Don't modify alpha channel
    }
}

/**
 * Inverse of multiplyAlpha()
 */
function separateAlpha(buffer, len) {
    var pixIndex = 0;

    for (var i = 0; i < len; i++) {
        var alpha = buffer[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET];

        if (alpha != 0) {
            var invAlpha = 255 / alpha;

            for (var j = 0; j < 3; j++, pixIndex++) {
                buffer[pixIndex] = Math.min(
                    Math.round(buffer[pixIndex] * invAlpha),
                    255,
                );
            }
            // Don't modify alpha channel
            pixIndex++;
        } else {
            pixIndex += CPColorBmp.BYTES_PER_PIXEL;
        }
    }
}

/**
 * Blur the first `len` pixels in the src array by `radius` pixels, and store the result in the `dst` array.
 *
 * @param {Uint8Array} src
 * @param {Uint8Array} dst
 * @param {number} len
 * @param {number} radius - Number of pixels that will be averaged either side of a target pixel.
 */
function boxBlurLine(src, dst, len, radius) {
    var pixelCount = 0,
        channelSums = [0, 0, 0, 0],
        pixIndex,
        dstIndex;

    pixIndex = 0;
    for (let i = 0; i < radius && i < len; i++) {
        for (let j = 0; j < CPColorBmp.BYTES_PER_PIXEL; j++) {
            channelSums[j] += src[pixIndex++];
        }
        pixelCount++;
    }

    dstIndex = 0;
    for (let i = 0; i < len; i++) {
        // New pixel joins the window at the right
        if (i + radius < len) {
            pixIndex = (i + radius) * CPColorBmp.BYTES_PER_PIXEL;

            for (let j = 0; j < CPColorBmp.BYTES_PER_PIXEL; j++) {
                channelSums[j] += src[pixIndex++];
            }
            pixelCount++;
        }

        for (let j = 0; j < CPColorBmp.BYTES_PER_PIXEL; j++) {
            dst[dstIndex++] = Math.round(channelSums[j] / pixelCount);
        }

        // Old pixel leaves the window at the left
        if (i - radius >= 0) {
            pixIndex = (i - radius) * CPColorBmp.BYTES_PER_PIXEL;

            for (let j = 0; j < CPColorBmp.BYTES_PER_PIXEL; j++) {
                channelSums[j] -= src[pixIndex++];
            }
            pixelCount--;
        }
    }
}

/**
 * Copy a column of pixels in the bitmap to the given R,G,B,A buffer.
 *
 * @param {number} x X-coordinate of column
 * @param {number} y Y-coordinate of top of column to copy
 * @param {number} len Number of pixels to copy
 * @param {Uint8Array} buffer R,G,B,A array
 */
CPColorBmp.prototype.copyPixelColumnToArray = function (x, y, len, buffer) {
    var yJump = (this.width - 1) * CPColorBmp.BYTES_PER_PIXEL,
        dstOffset = 0,
        srcOffset = this.offsetOfPixel(x, y);

    for (var i = 0; i < len; i++) {
        for (var j = 0; j < CPColorBmp.BYTES_PER_PIXEL; j++) {
            buffer[dstOffset++] = this.data[srcOffset++];
        }

        srcOffset += yJump;
    }
};

/**
 * Copy the pixels from the given R,G,B,A buffer to a column of pixels in the bitmap.
 *
 * @param {number} x X-coordinate of column
 * @param {number} y Y-coordinate of top of column to copy
 * @param {number} len Number of pixels to copy
 * @param {Uint8Array} buffer R,G,B,A array to copy from
 */
CPColorBmp.prototype.copyArrayToPixelColumn = function (x, y, len, buffer) {
    var yJump = (this.width - 1) * CPColorBmp.BYTES_PER_PIXEL,
        srcOffset = 0,
        dstOffset = this.offsetOfPixel(x, y);

    for (var i = 0; i < len; i++) {
        for (var j = 0; j < CPColorBmp.BYTES_PER_PIXEL; j++) {
            this.data[dstOffset++] = buffer[srcOffset++];
        }

        dstOffset += yJump;
    }
};

/**
 * 指定矩形内のピクセルに対してボックスぼかし （Box Blur） を適用する。
 * 横方向に radiusX、縦方向に radiusY の半径でぼかす。
 * 透明部分はアルファ値を考慮して処理する。
 *
 * @param rect - ぼかしを適用する範囲。
 * @param {number} radiusX - 横方向のぼかし半径（ピクセル単位）。
 * @param {number} radiusY - 縦方向のぼかし半径（ピクセル単位）。
 */
CPColorBmp.prototype.boxBlur = function (rect, radiusX, radiusY) {
    rect = this.getBounds().clipTo(rect);

    let rectWidth = rect.getWidth(),
        rectWidthBytes = rectWidth * CPColorBmp.BYTES_PER_PIXEL,
        rectHeight = rect.getHeight(),
        rectLength = Math.max(rectWidth, rectHeight),
        src = new Uint8Array(rectLength * CPColorBmp.BYTES_PER_PIXEL),
        dst = new Uint8Array(rectLength * CPColorBmp.BYTES_PER_PIXEL);

    // 横方向のぼかし
    for (let y = rect.top; y < rect.bottom; y++) {
        var pixOffset = this.offsetOfPixel(rect.left, y);

        // ピクセルデータをコピー
        for (let x = 0; x < rectWidthBytes; x++) {
            src[x] = this.data[pixOffset++];
        }

        // 透明部分を考慮してアルファを掛ける
        multiplyAlpha(src, rectWidth);

        // ぼかし処理
        boxBlurLine(src, dst, rectWidth, radiusX);

        // 結果を元のデータにコピー
        pixOffset = this.offsetOfPixel(rect.left, y);

        for (let x = 0; x < rectWidthBytes; x++) {
            this.data[pixOffset++] = dst[x];
        }
    }

    // 縦方向のぼかし
    for (let x = rect.left; x < rect.right; x++) {
        this.copyPixelColumnToArray(x, rect.top, rectHeight, src);

        // 縦方向のぼかし処理
        boxBlurLine(src, dst, rectHeight, radiusY);

        // 透明部分を分離して再設定
        separateAlpha(dst, rectHeight);

        this.copyArrayToPixelColumn(x, rect.top, rectHeight, dst);
    }
};

/**
 * 指定矩形内のピクセルに対してモザイクを適用する。
 *
 * @param rect - モザイクを適用する範囲
 * @param {number} blockSize - ブロックサイズ（ピクセル）
 */
CPColorBmp.prototype.mosaic = function (rect, blockSize) {
    rect = this.getBounds().clipTo(rect);
    blockSize = Math.max(1, blockSize | 0);

    const bpp = CPColorBmp.BYTES_PER_PIXEL;
    const width = this.width;
    const data = this.data;

    for (let by = rect.top; by < rect.bottom; by += blockSize) {
        const yEnd = Math.min(by + blockSize, rect.bottom);

        for (let bx = rect.left; bx < rect.right; bx += blockSize) {
            const xEnd = Math.min(bx + blockSize, rect.right);

            let rSum = 0,
                gSum = 0,
                bSum = 0,
                aSum = 0;
            let count = 0;

            // --- ブロック内の平均色を計算 ---
            for (let y = by; y < yEnd; y++) {
                let idx = (y * width + bx) * bpp;
                for (let x = bx; x < xEnd; x++) {
                    rSum += data[idx];
                    gSum += data[idx + 1];
                    bSum += data[idx + 2];
                    aSum += data[idx + 3];
                    count++;
                    idx += bpp;
                }
            }

            const rAvg = (rSum / count) | 0;
            const gAvg = (gSum / count) | 0;
            const bAvg = (bSum / count) | 0;
            const aAvg = (aSum / count) | 0;

            // --- ブロック全体を同一色で塗る ---
            for (let y = by; y < yEnd; y++) {
                let idx = (y * width + bx) * bpp;
                for (let x = bx; x < xEnd; x++) {
                    data[idx] = rAvg;
                    data[idx + 1] = gAvg;
                    data[idx + 2] = bAvg;
                    data[idx + 3] = aAvg;
                    idx += bpp;
                }
            }
        }
    }
};

/**
 * 指定した矩形範囲に対して色収差（RGBずらし）を適用する。
 *
 * X・Y方向のオフセットを指定することで、
 * RGB各チャンネルを同じ軸上で分離する。
 *
 * チャンネルごとの移動量：
 * - RED   : (+offsetX, +offsetY)
 * - GREEN: (0, 0)
 * - BLUE : (-offsetX, -offsetY)
 *
 * offsetX を指定すると横方向のみの色収差が発生し、
 * offsetY を指定すると縦方向のみの色収差が発生する。
 * 両方指定した場合は斜め方向の色収差となる。
 *
 * オフセット値は -64 ～ 64 ピクセルの範囲に制限される。
 * アルファ値が 0（完全透明）のピクセルは処理されない。
 *
 * @param {CPRect} rect
 *        色収差を適用する矩形範囲。
 *        ビットマップ範囲外は自動的にクリップされる。
 *
 * @param {number} offsetX
 *        X方向のずれ量（ピクセル単位）。
 *        正の値で右、負の値で左にずれる。
 *
 * @param {number} offsetY
 *        Y方向のずれ量（ピクセル単位）。
 *        正の値で下、負の値で上にずれる。
 */
CPColorBmp.prototype.chromaticAberration = function (rect, offsetX, offsetY) {
    offsetX = Math.max(-64, Math.min(64, offsetX | 0));
    offsetY = Math.max(-64, Math.min(64, offsetY | 0));

    rect = this.getBounds().clipTo(rect);

    const w = this.width;
    const h = this.height;
    const BYTES = CPColorBmp.BYTES_PER_PIXEL;

    const src = new Uint8ClampedArray(this.data);
    const dst = new Uint8ClampedArray(this.data.length);
    dst.set(src);

    for (let y = rect.top; y < rect.bottom; y++) {
        for (let x = rect.left; x < rect.right; x++) {
            const idx = (y * w + x) * BYTES;
            const a0 = src[idx + CPColorBmp.ALPHA_BYTE_OFFSET] / 255;
            if (a0 === 0) continue;

            // === BLUE（左側）===
            let bx = Math.min(w - 1, Math.max(0, x + offsetX));
            let by = Math.min(h - 1, Math.max(0, y + offsetY));
            let bIdx = (by * w + bx) * BYTES;
            dst[bIdx + CPColorBmp.BLUE_BYTE_OFFSET] = Math.round(
                src[idx + CPColorBmp.BLUE_BYTE_OFFSET] * a0 +
                    dst[bIdx + CPColorBmp.BLUE_BYTE_OFFSET] * (1 - a0),
            );

            // === RED（右側）===
            let rx = Math.min(w - 1, Math.max(0, x - offsetX));
            let ry = Math.min(h - 1, Math.max(0, y - offsetY));
            let rIdx = (ry * w + rx) * BYTES;
            dst[rIdx + CPColorBmp.RED_BYTE_OFFSET] = Math.round(
                src[idx + CPColorBmp.RED_BYTE_OFFSET] * a0 +
                    dst[rIdx + CPColorBmp.RED_BYTE_OFFSET] * (1 - a0),
            );

            // GREEN は中央（元のまま）
        }
    }

    this.data.set(dst);
};

/**
 * カラーハーフトーン（CMY・スクリーン角度方式）
 * 端が欠けないよう拡張キャンバスで描画
 *
 * ・1セル1ドット
 * ・CMYごとにスクリーン角度
 * ・ドット配置のみ回転（色ズレなし）
 * ・Multiply的に重なって黒になる
 * ・透明に近いほど白扱い
 * ・最後に白だけ透明化
 *
 * @param {CPRect} rect   対象矩形
 * @param {number} dotSize ドット基準サイズ（px）
 * @param {number} [density=1.0] ドット配置間隔の倍率（0.5–2.0）
 *        小さいほど密／大きいほど疎
 */
CPColorBmp.prototype.colorHalftone = function (rect, dotSize, density = 1.0) {
    dotSize = Math.max(2, dotSize | 0);
    rect = this.getBounds().clipTo(rect);

    const w = this.width;
    const h = this.height;
    const B = CPColorBmp.BYTES_PER_PIXEL;

    const src = new Uint8ClampedArray(this.data);
    const dst = new Uint8ClampedArray(this.data.length);

    const centerX = w * 0.5;
    const centerY = h * 0.5;

    // 背景白
    for (let i = 0; i < dst.length; i += 4) {
        dst[i] = dst[i + 1] = dst[i + 2] = 255;
        dst[i + 3] = 255;
    }

    const CHANNELS = [
        { idx: 0, r: 0, g: 255, b: 255, angle: (15 * Math.PI) / 180 }, // C
        { idx: 1, r: 255, g: 0, b: 255, angle: (75 * Math.PI) / 180 }, // M
        { idx: 2, r: 255, g: 255, b: 0, angle: (30 * Math.PI) / 180 }, // Y
    ];

    const step = dotSize * density;
    const maxR = dotSize * 0.5;
    const minR = 0.6;

    const diag = Math.ceil(Math.sqrt(w * w + h * h));
    const offsetX = (diag - w) * 0.5;
    const offsetY = (diag - h) * 0.5;

    for (const ch of CHANNELS) {
        const cos = Math.cos(ch.angle);
        const sin = Math.sin(ch.angle);

        for (let gy = -offsetY; gy < h + offsetY; gy += step) {
            for (let gx = -offsetX; gx < w + offsetX; gx += step) {
                const cx = gx + step * 0.5;
                const cy = gy + step * 0.5;

                const dx = cx - centerX;
                const dy = cy - centerY;
                const rx = dx * cos - dy * sin + centerX;
                const ry = dx * sin + dy * cos + centerY;

                const sx = Math.round(rx);
                const sy = Math.round(ry);
                if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;

                const i = (sy * w + sx) * B;

                const a = src[i + 3] / 255;
                if (a <= 0) continue;

                // αを考慮して白にブレンド
                const r = (src[i] / 255) * a + (1 - a);
                const g = (src[i + 1] / 255) * a + (1 - a);
                const b = (src[i + 2] / 255) * a + (1 - a);

                const cmy = [1 - r, 1 - g, 1 - b];
                const v = cmy[ch.idx];
                if (v <= 0) continue;

                const radius = minR + (maxR - minR) * Math.pow(v, 0.85);
                drawDot(rx, ry, radius, ch.r, ch.g, ch.b);
            }
        }
    }

    // 白を透明化
    for (let i = 0; i < dst.length; i += 4) {
        if (dst[i] === 255 && dst[i + 1] === 255 && dst[i + 2] === 255) {
            dst[i + 3] = 0;
        }
    }

    this.data.set(dst);

    function drawDot(cx, cy, radius, r, g, b) {
        const r2 = radius * radius;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx * dx + dy * dy > r2) continue;

                const px = Math.round(cx + dx);
                const py = Math.round(cy + dy);
                if (px < 0 || py < 0 || px >= w || py >= h) continue;

                const p = (py * w + px) * B;
                dst[p] = (dst[p] * r) >> 8;
                dst[p + 1] = (dst[p + 1] * g) >> 8;
                dst[p + 2] = (dst[p + 2] * b) >> 8;
                dst[p + 3] = 255;
            }
        }
    }
};

/**
 * 縁取り
 *
 * ・内側＋縁取り範囲をすべて縁取り色で塗り潰す
 * ・外側境界 1px のみアンチエイリアス
 * ・最後に元画像を α 合成で戻す
 *
 * @param {CPRect} rect
 * @param {number} outlineWidth px
 * @param {number} color 0xRRGGBB
 * @param {boolean} replaceWithOutline true で内側を縁取り色で塗りつぶす
 */
CPColorBmp.prototype.outlineOuter = function (
    rect,
    outlineWidth,
    color,
    replaceWithOutline,
) {
    outlineWidth = Math.max(1, outlineWidth | 0);
    rect = this.getBounds().clipTo(rect);

    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    const w = this.width;
    const h = this.height;
    const B = CPColorBmp.BYTES_PER_PIXEL;

    const src = new Uint8ClampedArray(this.data);
    const dst = new Uint8ClampedArray(this.data.length);

    const INF = 1e9;
    const dist = new Int32Array(w * h);

    // 1) 距離初期化
    for (let y = rect.top; y < rect.bottom; y++) {
        for (let x = rect.left; x < rect.right; x++) {
            const i = (y * w + x) * B;
            dist[y * w + x] = src[i + 3] > 0 ? 0 : INF;
        }
    }

    const R = outlineWidth * 10; // Chamfer単位

    // 2) 前方パス（Chamfer 10/14）
    for (let y = rect.top; y < rect.bottom; y++) {
        for (let x = rect.left; x < rect.right; x++) {
            const i = y * w + x;
            let d = dist[i];
            if (x > rect.left) d = Math.min(d, dist[i - 1] + 10);
            if (y > rect.top) d = Math.min(d, dist[i - w] + 10);
            if (x > rect.left && y > rect.top)
                d = Math.min(d, dist[i - w - 1] + 14);
            if (x < rect.right - 1 && y > rect.top)
                d = Math.min(d, dist[i - w + 1] + 14);
            dist[i] = d;
        }
    }

    // 3) 後方パス
    for (let y = rect.bottom - 1; y >= rect.top; y--) {
        for (let x = rect.right - 1; x >= rect.left; x--) {
            const i = y * w + x;
            let d = dist[i];
            if (x < rect.right - 1) d = Math.min(d, dist[i + 1] + 10);
            if (y < rect.bottom - 1) d = Math.min(d, dist[i + w] + 10);
            if (x < rect.right - 1 && y < rect.bottom - 1)
                d = Math.min(d, dist[i + w + 1] + 14);
            if (x > rect.left && y < rect.bottom - 1)
                d = Math.min(d, dist[i + w - 1] + 14);
            dist[i] = d;
        }
    }

    // 4) 内側＋縁取り塗り（外縁AA）
    for (let y = rect.top; y < rect.bottom; y++) {
        for (let x = rect.left; x < rect.right; x++) {
            const idx = y * w + x;
            const d = dist[idx];
            if (d > R) continue;

            const i = idx * B;
            let a = 1;

            // 外側1pxのみAA
            if (d > R - 10) {
                a = (R - d) / 10;
                a = a * a; // 適度シャープ
            }

            dst[i] = r;
            dst[i + 1] = g;
            dst[i + 2] = b;
            dst[i + 3] = a * 255;
        }
    }

    if (!replaceWithOutline) {
        // 5) 元画像 α 合成で戻す
        for (let i = 0; i < dst.length; i += 4) {
            const sa = src[i + 3] / 255;
            if (sa === 0) continue;

            const da = dst[i + 3] / 255;
            const outA = sa + da * (1 - sa);

            dst[i] = (src[i] * sa + dst[i] * da * (1 - sa)) / outA;
            dst[i + 1] = (src[i + 1] * sa + dst[i + 1] * da * (1 - sa)) / outA;
            dst[i + 2] = (src[i + 2] * sa + dst[i + 2] * da * (1 - sa)) / outA;
            dst[i + 3] = outA * 255;
        }
    }

    this.data.set(dst);
};

/**
 * 単色ハーフトーン（45°・円ドット）
 *
 * ・1セル1ドット
 * ・角度 45°
 * ・明るいほど小さく、暗いほど大きい
 * ・単色ドット
 * ・透明に近いほど白扱い（＝ドットなし）
 *
 * @param {Object} rect    対象矩形
 * @param {number} dotSize ドット基準サイズ（px）
 * @param {number} color   0xRRGGBB
 * @param {number} [density=1.0] ドット配置間隔の倍率（0.5–2.0）
 */
CPColorBmp.prototype.monoHalftone = function (
    rect,
    dotSize,
    color = 0x000000,
    density = 1.0,
) {
    dotSize = Math.max(2, dotSize | 0);
    rect = this.getBounds().clipTo(rect);

    const w = this.width;
    const h = this.height;
    const B = CPColorBmp.BYTES_PER_PIXEL;

    const src = new Uint8ClampedArray(this.data);
    const dst = new Uint8ClampedArray(this.data.length);

    // ===== 背景は最初から完全透明 =====
    for (let i = 0; i < dst.length; i += 4) {
        dst[i] = dst[i + 1] = dst[i + 2] = 0;
        dst[i + 3] = 0;
    }

    // ドット色
    const dr = (color >> 16) & 0xff;
    const dg = (color >> 8) & 0xff;
    const db = color & 0xff;

    // 回転中心
    const centerX = w * 0.5;
    const centerY = h * 0.5;

    // 45°
    const angle = (45 * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const step = dotSize * density;
    const maxR = dotSize * 0.5;
    const minR = 0.5;

    // 端欠け防止用拡張
    const diag = Math.ceil(Math.sqrt(w * w + h * h));
    const offsetX = (diag - w) * 0.5;
    const offsetY = (diag - h) * 0.5;

    for (let gy = -offsetY; gy < h + offsetY; gy += step) {
        for (let gx = -offsetX; gx < w + offsetX; gx += step) {
            const cx = gx + step * 0.5;
            const cy = gy + step * 0.5;

            // 回転
            const dx = cx - centerX;
            const dy = cy - centerY;
            const rx = dx * cos - dy * sin + centerX;
            const ry = dx * sin + dy * cos + centerY;

            const sx = rx | 0;
            const sy = ry | 0;
            if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;

            const i = (sy * w + sx) * B;

            const r = src[i];
            const g = src[i + 1];
            const b = src[i + 2];
            const a = src[i + 3] / 255;

            // RGB輝度（Rec.709）
            const lumRGB = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

            // 透明に近いほど白扱い
            const lum = lumRGB * a + (1.0 - a);

            // 暗いほどドット大
            const v = 1.0 - lum;
            if (v <= 0) continue; // ← 白は「何も描かれない」＝透明

            const radius = minR + (maxR - minR) * Math.pow(v, 0.9);
            drawDot(rx, ry, radius);
        }
    }

    this.data.set(dst);

    /* ===== 内部 ===== */

    function drawDot(cx, cy, radius) {
        const r2 = radius * radius;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx * dx + dy * dy > r2) continue;

                const px = (cx + dx) | 0;
                const py = (cy + dy) | 0;
                if (px < 0 || py < 0 || px >= w || py >= h) continue;

                const p = (py * w + px) * B;

                dst[p] = dr;
                dst[p + 1] = dg;
                dst[p + 2] = db;
                dst[p + 3] = 255;
            }
        }
    }
};

CPColorBmp.prototype.offsetOfPixel = function (x, y) {
    return ((y * this.width + x) * 4) | 0;
};

CPColorBmp.prototype.getMemorySize = function () {
    return this.data.length;
};

CPColorBmp.prototype.getImageData = function () {
    return this.imageData;
};

/**
 * Replace the image data with the provided ImageData object (i.e. use it by reference).
 *
 * @param imageData {ImageData}
 */
CPColorBmp.prototype.setImageData = function (imageData) {
    this.width = imageData.width;
    this.height = imageData.height;
    this.imageData = imageData;
    this.data = imageData.data;
};

CPColorBmp.prototype.clearAll = function (color) {
    if (color == 0 && "fill" in this.data) {
        this.data.fill(0);
    } else {
        var a = (color >> 24) & 0xff,
            r = (color >> 16) & 0xff,
            g = (color >> 8) & 0xff,
            b = color & 0xff;

        for (
            var i = 0;
            i < this.width * this.height * CPColorBmp.BYTES_PER_PIXEL;
        ) {
            this.data[i++] = r;
            this.data[i++] = g;
            this.data[i++] = b;
            this.data[i++] = a;
        }
    }
};

/**
 *
 * @param {CPRect} rect
 * @param {number} color
 */
CPColorBmp.prototype.clearRect = function (rect, color) {
    rect = this.getBounds().clipTo(rect);

    var a = (color >> 24) & 0xff,
        r = (color >> 16) & 0xff,
        g = (color >> 8) & 0xff,
        b = color & 0xff,
        yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top);

    for (var y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        for (var x = rect.left; x < rect.right; x++) {
            this.data[pixIndex++] = r;
            this.data[pixIndex++] = g;
            this.data[pixIndex++] = b;
            this.data[pixIndex++] = a;
        }
    }
};

/**
 * @param rect CPRect
 * @param source CPColorBmp
 */
CPColorBmp.prototype.copyRegionHFlip = function (rect, source) {
    rect = this.getBounds().clipTo(rect);

    for (var y = rect.top; y < rect.bottom; y++) {
        var dstOffset = this.offsetOfPixel(rect.left, y),
            srcOffset = source.offsetOfPixel(rect.right - 1, y);

        for (
            var x = rect.left;
            x < rect.right;
            x++, srcOffset -= CPColorBmp.BYTES_PER_PIXEL * 2
        ) {
            for (var i = 0; i < CPColorBmp.BYTES_PER_PIXEL; i++) {
                this.data[dstOffset++] = source.data[srcOffset++];
            }
        }
    }
};

/**
 * @param rect CPRect
 * @param source CPColorBmp
 */
CPColorBmp.prototype.copyRegionVFlip = function (rect, source) {
    rect = this.getBounds().clipTo(rect);

    var widthBytes = rect.getWidth() * CPColorBmp.BYTES_PER_PIXEL;

    for (var y = rect.top; y < rect.bottom; y++) {
        var dstOffset = this.offsetOfPixel(rect.left, y),
            srcOffset = source.offsetOfPixel(
                rect.left,
                rect.bottom - 1 - (y - rect.top),
            );

        for (var x = 0; x < widthBytes; x++) {
            this.data[dstOffset++] = source.data[srcOffset++];
        }
    }
};

/**
 * @param {CPRect} rect
 * @param {number} color
 */
CPColorBmp.prototype.fillWithNoise = function (rect, color = 0) {
    rect = this.getBounds().clipTo(rect);

    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    var value,
        yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top);

    for (var y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        for (
            var x = rect.left;
            x < rect.right;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            value = (Math.random() * 0x100) | 0;

            const k = 1 - value / 255;

            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] =
                (255 - (255 - r) * k) | 0;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] =
                (255 - (255 - g) * k) | 0;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] =
                (255 - (255 - b) * k) | 0;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = 0xff;
        }
    }
};

/**
 * Replace the pixels in the given rect with the given horizontal gradient.
 *
 * @param rect CPRect
 * @param fromX int
 * @param toX int
 * @param gradientPoints int[]
 */
CPColorBmp.prototype.gradientHorzReplace = function (
    rect,
    fromX,
    toX,
    gradientPoints,
) {
    var fromColor = {
            r: (gradientPoints[0] >> 16) & 0xff,
            g: (gradientPoints[0] >> 8) & 0xff,
            b: gradientPoints[0] & 0xff,
            a: (gradientPoints[0] >> 24) & 0xff,
        },
        toColor = {
            r: (gradientPoints[1] >> 16) & 0xff,
            g: (gradientPoints[1] >> 8) & 0xff,
            b: gradientPoints[1] & 0xff,
            a: (gradientPoints[1] >> 24) & 0xff,
        },
        yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top) | 0,
        h = (rect.bottom - rect.top) | 0;

    if (toX < fromX) {
        var temp = toX;
        toX = fromX;
        fromX = temp;

        temp = fromColor;
        fromColor = toColor;
        toColor = temp;
    }

    var gradientRange = (toX - fromX) | 0,
        rStep = (toColor.r - fromColor.r) / gradientRange,
        gStep = (toColor.g - fromColor.g) / gradientRange,
        bStep = (toColor.b - fromColor.b) / gradientRange,
        aStep = (toColor.a - fromColor.a) / gradientRange,
        jump = Math.max(rect.left - fromX, 0);

    for (var y = 0; y < h; y++, pixIndex += yStride) {
        // The solid color section before the gradient
        var x = rect.left;

        for (
            var xEnd = Math.min(fromX, rect.right) | 0;
            x < xEnd;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = fromColor.r;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = fromColor.g;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = fromColor.b;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = fromColor.a;
        }

        // In the gradient
        var r = fromColor.r + rStep * jump,
            g = fromColor.g + gStep * jump,
            b = fromColor.b + bStep * jump,
            a = fromColor.a + aStep * jump;

        for (
            xEnd = Math.min(toX, rect.right) | 0;
            x < xEnd;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = r;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = g;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = b;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = a;

            r += rStep;
            g += gStep;
            b += bStep;
            a += aStep;
        }

        // The section after the end of the gradient
        for (; x < rect.right; x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL) {
            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = toColor.r;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = toColor.g;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = toColor.b;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = toColor.a;
        }
    }
};

/**
 * Replace the pixels in the given rect with the given vertical gradient.
 *
 * @param {CPRect} rect
 * @param fromY int
 * @param toY int
 * @param gradientPoints int[]
 */
CPColorBmp.prototype.gradientVertReplace = function (
    rect,
    fromY,
    toY,
    gradientPoints,
) {
    let fromColor = {
            r: (gradientPoints[0] >> 16) & 0xff,
            g: (gradientPoints[0] >> 8) & 0xff,
            b: gradientPoints[0] & 0xff,
            a: (gradientPoints[0] >> 24) & 0xff,
        },
        toColor = {
            r: (gradientPoints[1] >> 16) & 0xff,
            g: (gradientPoints[1] >> 8) & 0xff,
            b: gradientPoints[1] & 0xff,
            a: (gradientPoints[1] >> 24) & 0xff,
        },
        yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top) | 0,
        w = (rect.right - rect.left) | 0;

    if (toY < fromY) {
        let temp = toY;
        toY = fromY;
        fromY = temp;

        temp = fromColor;
        fromColor = toColor;
        toColor = temp;
    }

    let y = rect.top;

    // The solid color section before the start of the gradient
    for (
        let yEnd = Math.min(rect.bottom, fromY) | 0;
        y < yEnd;
        y++, pixIndex += yStride
    ) {
        for (let x = 0; x < w; x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL) {
            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = fromColor.r;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = fromColor.g;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = fromColor.b;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = fromColor.a;
        }
    }

    // Inside the gradient
    var gradientRange = (toY - fromY) | 0,
        rStep = (toColor.r - fromColor.r) / gradientRange,
        gStep = (toColor.g - fromColor.g) / gradientRange,
        bStep = (toColor.b - fromColor.b) / gradientRange,
        aStep = (toColor.a - fromColor.a) / gradientRange,
        jump = Math.max(y - fromY, 0),
        r = fromColor.r + rStep * jump,
        g = fromColor.g + gStep * jump,
        b = fromColor.b + bStep * jump,
        a = fromColor.a + aStep * jump;

    for (
        let yEnd = Math.min(rect.bottom, toY) | 0;
        y < yEnd;
        y++, pixIndex += yStride
    ) {
        for (let x = 0; x < w; x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL) {
            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = r;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = g;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = b;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = a;
        }

        r += rStep;
        g += gStep;
        b += bStep;
        a += aStep;
    }

    // The section after the end of the gradient
    for (; y < rect.bottom; y++, pixIndex += yStride) {
        for (let x = 0; x < w; x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL) {
            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = toColor.r;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = toColor.g;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = toColor.b;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = toColor.a;
        }
    }
};

/**
 * Replace the pixels in the given rect with the given gradient.
 *
 * @param rect CPRect
 * @param fromX int
 * @param fromY int
 * @param toX int
 * @param toY int
 * @param gradientPoints int[]
 */
CPColorBmp.prototype.gradientReplace = function (
    rect,
    fromX,
    fromY,
    toX,
    toY,
    gradientPoints,
) {
    var yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top) | 0,
        w = (rect.right - rect.left) | 0,
        fromColor = {
            r: (gradientPoints[0] >> 16) & 0xff,
            g: (gradientPoints[0] >> 8) & 0xff,
            b: gradientPoints[0] & 0xff,
            a: (gradientPoints[0] >> 24) & 0xff,
        },
        toColor = {
            r: (gradientPoints[1] >> 16) & 0xff,
            g: (gradientPoints[1] >> 8) & 0xff,
            b: gradientPoints[1] & 0xff,
            a: (gradientPoints[1] >> 24) & 0xff,
        },
        // How many pixels vertically does the gradient sequence complete over (+infinity for horizontal gradients!)
        vertRange =
            toY - fromY + ((toX - fromX) * (toX - fromX)) / (toY - fromY),
        // Same for horizontal
        horzRange =
            toX - fromX + ((toY - fromY) * (toY - fromY)) / (toX - fromX),
        horzStep = 1 / horzRange;

    for (var y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        var // The position the row starts at in the gradient [0.0 ... 1.0)
            prop = (rect.left - fromX) / horzRange + (y - fromY) / vertRange;

        for (var x = 0; x < w; x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL) {
            var propClamped = Math.min(Math.max(prop, 0.0), 1.0),
                invPropClamped = 1 - propClamped;

            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] =
                fromColor.r * invPropClamped + toColor.r * propClamped;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] =
                fromColor.g * invPropClamped + toColor.g * propClamped;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] =
                fromColor.b * invPropClamped + toColor.b * propClamped;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] =
                fromColor.a * invPropClamped + toColor.a * propClamped;

            prop += horzStep;
        }
    }
};

/**
 * Alpha blend the given gradient onto the pixels in the given rect.
 *
 * @param rect CPRect
 * @param fromX int
 * @param fromY int
 * @param toX int
 * @param toY int
 * @param gradientPoints int[]
 */
CPColorBmp.prototype.gradientAlpha = function (
    rect,
    fromX,
    fromY,
    toX,
    toY,
    gradientPoints,
) {
    var yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top) | 0,
        w = (rect.right - rect.left) | 0,
        fromColor = {
            r: (gradientPoints[0] >> 16) & 0xff,
            g: (gradientPoints[0] >> 8) & 0xff,
            b: gradientPoints[0] & 0xff,
            a: (gradientPoints[0] >> 24) & 0xff,
        },
        toColor = {
            r: (gradientPoints[1] >> 16) & 0xff,
            g: (gradientPoints[1] >> 8) & 0xff,
            b: gradientPoints[1] & 0xff,
            a: (gradientPoints[1] >> 24) & 0xff,
        },
        // How many pixels vertically does the gradient sequence complete over (+infinity for horizontal gradients!)
        vertRange =
            toY - fromY + ((toX - fromX) * (toX - fromX)) / (toY - fromY),
        // Same for horizontal
        horzRange =
            toX - fromX + ((toY - fromY) * (toY - fromY)) / (toX - fromX),
        horzStep = 1 / horzRange;

    for (var y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        var // The position the row starts at in the gradient [0.0 ... 1.0)
            prop = (rect.left - fromX) / horzRange + (y - fromY) / vertRange;

        for (var x = 0; x < w; x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL) {
            var propClamped = Math.min(Math.max(prop, 0.0), 1.0),
                invPropClamped = 1 - propClamped,
                // The gradient color to draw
                r = fromColor.r * invPropClamped + toColor.r * propClamped,
                g = fromColor.g * invPropClamped + toColor.g * propClamped,
                b = fromColor.b * invPropClamped + toColor.b * propClamped,
                a = fromColor.a * invPropClamped + toColor.a * propClamped,
                alpha2 = this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET],
                newAlpha = (a + alpha2 - (a * alpha2) / 255) | 0;

            if (newAlpha > 0) {
                var realAlpha = ((a * 255) / newAlpha) | 0,
                    invAlpha = 255 - realAlpha;

                this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] =
                    ((r * realAlpha +
                        this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] *
                            invAlpha) /
                        255) |
                    0;
                this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] =
                    ((g * realAlpha +
                        this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] *
                            invAlpha) /
                        255) |
                    0;
                this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] =
                    ((b * realAlpha +
                        this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] *
                            invAlpha) /
                        255) |
                    0;
                this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = newAlpha;
            }

            prop += horzStep;
        }
    }
};

/**
 * Draw a gradient which begins at fromX, fromY and ends at toX, toY, clipped to the given rect, on top of the
 * pixels in the bitmap.
 *
 * @param {CPRect} rect
 * @param {Object[]} gradientPoints Array with gradient colors (ARGB integers)
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {boolean} replace - True if the contents of the destination should be ignored (opaque blend)
 */
CPColorBmp.prototype.gradient = function (
    rect,
    fromX,
    fromY,
    toX,
    toY,
    gradientPoints,
    replace,
) {
    rect = this.getBounds().clipTo(rect);

    // Degenerate case
    if (fromX == toX && fromY == toY) {
        return;
    }

    // Opaque blend if possible
    if (
        replace ||
        (gradientPoints[0] >>> 24 == 255 && gradientPoints[1] >>> 24 == 255)
    ) {
        if (fromX == toX) {
            this.gradientVertReplace(rect, fromY, toY, gradientPoints);
        } else if (fromY == toY) {
            this.gradientHorzReplace(rect, fromX, toX, gradientPoints);
        } else {
            this.gradientReplace(rect, fromX, fromY, toX, toY, gradientPoints);
        }
    } else {
        this.gradientAlpha(rect, fromX, fromY, toX, toY, gradientPoints);
    }
};

/**
 * @param {CPRect} rect
 */
CPColorBmp.prototype.fillWithColorNoise = function (rect) {
    rect = this.getBounds().clipTo(rect);

    var value,
        yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top);

    for (var y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        for (
            var x = rect.left;
            x < rect.right;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            value = (Math.random() * 0x1000000) | 0;

            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] =
                (value >> 16) & 0xff;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] =
                (value >> 8) & 0xff;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = value & 0xff;
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = 0xff;
        }
    }
};

/**
 * @param {CPRect} rect
 */
CPColorBmp.prototype.invert = function (rect) {
    rect = this.getBounds().clipTo(rect);

    var yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex = this.offsetOfPixel(rect.left, rect.top);

    for (var y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        for (
            var x = rect.left;
            x < rect.right;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] ^= 0xff;
            this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] ^= 0xff;
            this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] ^= 0xff;
        }
    }
};

/**
 * @param {CPRect} rect
 */
CPColorBmp.prototype.brightnessToOpacity = function (rect) {
    rect = this.getBounds().clipTo(rect);
    const threshold = 250;

    const yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL;
    let pixIndex = this.offsetOfPixel(rect.left, rect.top);

    for (let y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        for (
            let x = rect.left;
            x < rect.right;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            // 輝度の計算
            const brightness =
                (this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] +
                    this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] +
                    this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET]) /
                3;

            // 元のアルファ値を取得
            const originalAlpha =
                this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] / 255;

            // しきい値を基に透明度を設定
            let newAlpha;
            if (brightness > threshold) {
                newAlpha = 0; // 完全に透明
            } else {
                // 線形にマッピングして中間の透明度を計算 (輝度が高いほど透明に近づく)
                newAlpha = Math.round((1 - brightness / threshold) * 255);
            }

            // 元のアルファ値を考慮して透明度を更新
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] = Math.round(
                newAlpha * originalAlpha,
            );

            // 不透明な線画の明度を0に
            if (newAlpha > 0) {
                // 不透明な部分の明度を0に
                this.data[pixIndex + CPColorBmp.RED_BYTE_OFFSET] = 0;
                this.data[pixIndex + CPColorBmp.GREEN_BYTE_OFFSET] = 0;
                this.data[pixIndex + CPColorBmp.BLUE_BYTE_OFFSET] = 0;
            }
        }
    }
};
/**
 * Get a rectangle that encloses any non-transparent pixels in the bitmap within the given initialBounds (or an empty
 * rect if the pixels inside the given bounds are 100% transparent).
 *
 * @param {CPRect} initialBounds - The rect to search within (pass getBounds() to search the whole bitmap)
 *
 * @returns {CPRect}
 */
CPColorBmp.prototype.getNonTransparentBounds = function (initialBounds) {
    var pixIndex,
        result = initialBounds.clone(),
        x,
        y,
        alphaOred,
        yStride;

    // Find the first non-transparent row
    yStride = (this.width - result.getWidth()) * CPColorBmp.BYTES_PER_PIXEL;
    pixIndex =
        this.offsetOfPixel(result.left, result.top) +
        CPColorBmp.ALPHA_BYTE_OFFSET;

    for (y = result.top; y < result.bottom; y++, pixIndex += yStride) {
        alphaOred = 0x00;

        for (
            x = result.left;
            x < result.right;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            alphaOred |= this.data[pixIndex];
        }

        // Only check once per row in order to reduce branching in the inner loop
        if (alphaOred != 0x00) {
            break;
        }
    }

    result.top = y;

    if (result.top == result.bottom) {
        // Rect is empty, no opaque pixels in the initialBounds
        return result;
    }

    // Now the last non-transparent row
    pixIndex =
        this.offsetOfPixel(result.right - 1, result.bottom - 1) +
        CPColorBmp.ALPHA_BYTE_OFFSET;
    for (y = result.bottom - 1; y >= result.top; y--, pixIndex -= yStride) {
        alphaOred = 0x00;

        for (
            x = result.right - 1;
            x >= result.left;
            x--, pixIndex -= CPColorBmp.BYTES_PER_PIXEL
        ) {
            alphaOred |= this.data[pixIndex];
        }

        // Only check once per row in order to reduce branching in the inner loop
        if (alphaOred != 0x00) {
            break;
        }
    }

    result.bottom =
        y + 1; /* +1 since the bottom/right edges of the rect are exclusive */

    // Now columns from the left
    yStride = CPColorBmp.BYTES_PER_PIXEL * this.width;
    for (x = result.left; x < result.right; x++) {
        pixIndex =
            this.offsetOfPixel(x, result.top) + CPColorBmp.ALPHA_BYTE_OFFSET;
        alphaOred = 0x00;

        for (y = result.top; y < result.bottom; y++, pixIndex += yStride) {
            alphaOred |= this.data[pixIndex];
        }

        if (alphaOred != 0x00) {
            break;
        }
    }

    result.left = x;

    // And columns from the right
    for (x = result.right - 1; x >= result.left; x--) {
        pixIndex =
            this.offsetOfPixel(x, result.top) + CPColorBmp.ALPHA_BYTE_OFFSET;
        alphaOred = 0x00;

        for (y = result.top; y < result.bottom; y++, pixIndex += yStride) {
            alphaOred |= this.data[pixIndex];
        }

        if (alphaOred != 0x00) {
            break;
        }
    }

    result.right = x + 1;

    return result;
};

/**
 * Returns a new canvas with a rotated version of the given canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} rotation - [0..3], selects a multiple of 90 degrees of clockwise rotation to be applied.
 */
export function getRotatedCanvas(canvas, rotation) {
    rotation = rotation % 4;

    if (rotation == 0) {
        return canvas;
    }

    let rotatedCanvas = createCanvas(0, 0),
        rotatedCanvasContext = rotatedCanvas.getContext("2d");

    if (rotation % 2 == 0) {
        rotatedCanvas.width = canvas.width;
        rotatedCanvas.height = canvas.height;
    } else {
        //noinspection JSSuspiciousNameCombination
        rotatedCanvas.width = canvas.height;
        //noinspection JSSuspiciousNameCombination
        rotatedCanvas.height = canvas.width;
    }

    switch (rotation) {
        case 1:
            // 90 degree clockwise:
            rotatedCanvasContext.rotate(Math.PI / 2);
            rotatedCanvasContext.drawImage(canvas, 0, -canvas.height);
            break;
        case 2:
            rotatedCanvasContext.rotate(Math.PI);
            rotatedCanvasContext.drawImage(
                canvas,
                -canvas.width,
                -canvas.height,
            );
            break;
        case 3:
            // 90 degree counter-clockwise:
            rotatedCanvasContext.rotate(-Math.PI / 2);
            rotatedCanvasContext.drawImage(canvas, -canvas.width, 0);
            break;
        case 0:
        default:
            return canvas;
    }

    return rotatedCanvas;
}

function decodeBase64PNGDataURL(url) {
    if (typeof url !== "string" || !url.match(/^data:image\/png;base64,/i)) {
        return false;
    }

    return window.atob(url.substring("data:image/png;base64,".length));
}

/**
 * Get the image as Canvas.
 *
 * Rotation is [0..3] and selects a multiple of 90 degrees of clockwise rotation to be applied, or 0 to leave
 * unrotated.
 *
 * @returns {HTMLCanvasElement}
 */
CPColorBmp.prototype.getAsCanvas = function (rotation) {
    var canvas = createCanvas(this.imageData.width, this.imageData.height),
        canvasContext = canvas.getContext("2d");

    canvasContext.putImageData(this.imageData, 0, 0);

    // Rotate it if needed
    return getRotatedCanvas(canvas, rotation || 0);
};

/**
 * Get the image as a PNG image.
 *
 * Rotation is [0..3] and selects a multiple of 90 degrees of clockwise rotation to be applied, or 0 to leave
 * unrotated.
 *
 * @returns {string} - "Binary string" representation of the PNG file
 */
CPColorBmp.prototype.getAsPNG = function (rotation) {
    let canvas = this.getAsCanvas(rotation);

    return decodeBase64PNGDataURL(canvas.toDataURL("image/png"));
};

/**
 * Get the image as a PNG image.
 *
 * Rotation is [0..3] and selects a multiple of 90 degrees of clockwise rotation to be applied, or 0 to leave
 * unrotated.
 *
 * @returns {Buffer}
 */
CPColorBmp.prototype.getAsPNGBuffer = function (rotation) {
    let canvas = this.getAsCanvas(rotation);

    // API provided by node-canvas for running on Node (browsers don't support this)
    return canvas.toBuffer("image/png");
};

/**
 * Returns true if any of the pixels in the given rectangle are not opaque.
 *
 * @param {CPRect} rect
 * @returns {boolean}
 */
CPColorBmp.prototype.hasAlphaInRect = function (rect) {
    rect = this.getBounds().clipTo(rect);

    var yStride = (this.width - rect.getWidth()) * CPColorBmp.BYTES_PER_PIXEL,
        pixIndex =
            this.offsetOfPixel(rect.left, rect.top) +
            CPColorBmp.ALPHA_BYTE_OFFSET;

    for (var y = rect.top; y < rect.bottom; y++, pixIndex += yStride) {
        var alphaAnded = 0xff;

        for (
            var x = rect.left;
            x < rect.right;
            x++, pixIndex += CPColorBmp.BYTES_PER_PIXEL
        ) {
            alphaAnded &= this.data[pixIndex];
        }

        // Only check once per row in order to reduce branching in the inner loop
        if (alphaAnded != 0xff) {
            return true;
        }
    }

    return false;
};

/**
 * Returns true if there are any transparent pixels in this image.
 *
 * @returns {boolean}
 */
CPColorBmp.prototype.hasAlpha = function () {
    return this.hasAlphaInRect(this.getBounds());
};

/**
 * Create from a loaded HTML Image object
 *
 * @param {HTMLImageElement} image
 */
CPColorBmp.createFromImage = function (image) {
    var imageCanvas = createCanvas(image.width, image.height),
        imageContext = imageCanvas.getContext("2d");

    imageContext.globalCompositeOperation = "copy";
    imageContext.drawImage(image, 0, 0);

    return new CPColorBmp(
        imageContext.getImageData(0, 0, image.width, image.height),
    );
};

/**
 * Are all the pixels in this image identical to those of that?
 *
 * @param {CPColorBmp} that
 */
CPColorBmp.prototype.equals = function (that) {
    if (this.width != that.width || this.height != that.height) {
        return false;
    }

    for (
        let pixIndex = 0;
        pixIndex < this.data.length;
        pixIndex += CPColorBmp.BYTES_PER_PIXEL
    ) {
        // Fully transparent pixels don't need their color channels compared
        if (
            this.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] != 0 ||
            that.data[pixIndex + CPColorBmp.ALPHA_BYTE_OFFSET] != 0
        ) {
            if (
                this.data[pixIndex] != that.data[pixIndex] ||
                this.data[pixIndex + 1] != that.data[pixIndex + 1] ||
                this.data[pixIndex + 2] != that.data[pixIndex + 2] ||
                this.data[pixIndex + 3] != that.data[pixIndex + 3]
            ) {
                return false;
            }
        }
    }

    return true;
};

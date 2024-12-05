// This file is generated, please see codegenerator/BlendGenerator.js!
	
import CPColorBmp from './CPColorBmp.js';
import CPGreyBmp from './CPGreyBmp.js';
import CPLayer from './CPLayer.js';
import CPRect from '../util/CPRect.js';

export default function CPBlend() {
}

const
	BYTES_PER_PIXEL = 4,
	ALPHA_BYTE_OFFSET = 3,
	
	softLightLUTSquare = new Array(256),
	softLightLUTSquareRoot = new Array(256);


/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiplyOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - (((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - (((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - (((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiplyOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - (((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - (((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - (((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiplyOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
				                    newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
				                    alpha12 = ((alpha1 * alpha2) / 255 | 0),
				                    alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
				                    alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiplyOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
				                    newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
				                    alpha12 = ((alpha1 * alpha2) / 255 | 0),
				                    alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
				                    alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiplyOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - (((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - (((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - (((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiplyOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - (((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - (((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - (((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255) | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiplyOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
				                    newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
				                    alpha12 = ((alpha1 * alpha2) / 255 | 0),
				                    alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
				                    alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiplyOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
				                    newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
				                    alpha12 = ((alpha1 * alpha2) / 255 | 0),
				                    alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
				                    alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiply2OntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - Math.ceil(((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - Math.ceil(((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - Math.ceil(((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiply2OntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - Math.ceil(((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - Math.ceil(((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - Math.ceil(((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiply2OntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.multiply2OntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiply2OntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - Math.ceil(((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - Math.ceil(((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - Math.ceil(((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiply2OntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color2;
			
			if (alpha1) {
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 - Math.ceil(((layer.data[pixIndex] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 - Math.ceil(((layer.data[pixIndex + 1] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 - Math.ceil(((layer.data[pixIndex + 2] ^ 0xFF) * color2 * alpha1) / (255 * 255));
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiply2OntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the multiply blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.multiply2OntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
				
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2 + color2 * alphan12 + ((color1 * color2 * alpha12) / 255 | 0)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.normalOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1;
			
			if (alpha1) {
				if (alpha1 == 255) {
				fusion.data[pixIndex] = layer.data[pixIndex];
				fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
				
								} else {
									let
										invAlpha1 = 255 - alpha1;
				color1 = layer.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1 + fusion.data[pixIndex] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1 + fusion.data[pixIndex + 1] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1 + fusion.data[pixIndex + 2] * invAlpha1) / 255 | 0);
				
								}
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.normalOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1;
			
			if (alpha1) {
				if (false) {
				fusion.data[pixIndex] = layer.data[pixIndex];
				fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
				
								} else {
									let
										invAlpha1 = 255 - alpha1;
				color1 = layer.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1 + fusion.data[pixIndex] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1 + fusion.data[pixIndex + 1] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1 + fusion.data[pixIndex + 2] * invAlpha1) / 255 | 0);
				
								}
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.normalOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									realAlpha = ((alpha1 * 255) / newAlpha | 0),
									invAlpha = 255 - realAlpha;
				fusion.data[pixIndex] = ((layer.data[pixIndex] * realAlpha + fusion.data[pixIndex] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * realAlpha + fusion.data[pixIndex + 1] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * realAlpha + fusion.data[pixIndex + 2] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.normalOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									realAlpha = ((alpha1 * 255) / newAlpha | 0),
									invAlpha = 255 - realAlpha;
				fusion.data[pixIndex] = ((layer.data[pixIndex] * realAlpha + fusion.data[pixIndex] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * realAlpha + fusion.data[pixIndex + 1] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * realAlpha + fusion.data[pixIndex + 2] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.normalOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1;
			
			if (alpha1) {
				if (alpha1 == 255) {
				fusion.data[pixIndex] = layer.data[pixIndex];
				fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
				
								} else {
									let
										invAlpha1 = 255 - alpha1;
				color1 = layer.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1 + fusion.data[pixIndex] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1 + fusion.data[pixIndex + 1] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1 + fusion.data[pixIndex + 2] * invAlpha1) / 255 | 0);
				
								}
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.normalOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1;
			
			if (alpha1) {
				if (false) {
				fusion.data[pixIndex] = layer.data[pixIndex];
				fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
				
								} else {
									let
										invAlpha1 = 255 - alpha1;
				color1 = layer.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1 + fusion.data[pixIndex] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1 + fusion.data[pixIndex + 1] * invAlpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1 + fusion.data[pixIndex + 2] * invAlpha1) / 255 | 0);
				
								}
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.normalOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									realAlpha = ((alpha1 * 255) / newAlpha | 0),
									invAlpha = 255 - realAlpha;
				fusion.data[pixIndex] = ((layer.data[pixIndex] * realAlpha + fusion.data[pixIndex] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * realAlpha + fusion.data[pixIndex + 1] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * realAlpha + fusion.data[pixIndex + 2] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.normalOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									realAlpha = ((alpha1 * 255) / newAlpha | 0),
									invAlpha = 255 - realAlpha;
				fusion.data[pixIndex] = ((layer.data[pixIndex] * realAlpha + fusion.data[pixIndex] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * realAlpha + fusion.data[pixIndex + 1] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * realAlpha + fusion.data[pixIndex + 2] * invAlpha) / 255 | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.addOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET];
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.addOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0);
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.addOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0;
								
								// No need to clamp the color to 0...255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex]) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1]) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2]) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.addOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0;
								
								// No need to clamp the color to 0...255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex]) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1]) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2]) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.addOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0);
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.addOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0);
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.addOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0;
								
								// No need to clamp the color to 0...255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex]) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1]) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2]) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the add blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.addOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0;
								
								// No need to clamp the color to 0...255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex]) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1]) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2]) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.subtractOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET];
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255 - alpha1) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.subtractOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0);
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255 - alpha1) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.subtractOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = alpha1 * alpha2;
								
								// No need to clamp the color to 255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.subtractOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = alpha1 * alpha2;
								
								// No need to clamp the color to 255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.subtractOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0);
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255 - alpha1) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.subtractOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0);
			
			if (alpha1) {
				fusion.data[pixIndex] = (fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 1] = (fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] / 255 - alpha1) | 0;
				fusion.data[pixIndex + 2] = (fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] / 255 - alpha1) | 0;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.subtractOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = alpha1 * alpha2;
								
								// No need to clamp the color to 255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the subtract blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.subtractOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = alpha1 * alpha2;
								
								// No need to clamp the color to 255 since we're writing to a clamped array anyway
				fusion.data[pixIndex] = ((alpha2 * fusion.data[pixIndex] + alpha1 * layer.data[pixIndex] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 1] = ((alpha2 * fusion.data[pixIndex + 1] + alpha1 * layer.data[pixIndex + 1] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + 2] = ((alpha2 * fusion.data[pixIndex + 2] + alpha1 * layer.data[pixIndex + 2] - alpha12) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.screenOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 1] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 2] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.screenOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 1] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 2] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.screenOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.screenOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.screenOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 1] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 2] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.screenOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 1] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color2 ^ 0xFF) * invAlpha1
										+ (layer.data[pixIndex + 2] ^ 0xFF) * (color2 ^ 0xFF) * alpha1 / 255
									)
									/ 255
								);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.screenOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the screen blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.screenOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = 0xFF ^ (
									(
										(color1 ^ 0xFF) * alpha1n2
										+ (color2 ^ 0xFF) * alphan12
										+ (color1 ^ 0xFF) * (color2 ^ 0xFF) * alpha12 / 255
									)
									/ newAlpha
								);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.lightenOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.lightenOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.lightenOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.lightenOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.lightenOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.lightenOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? color2 : ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.lightenOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the lighten blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.lightenOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color1 * alpha21 + color2 * invAlpha21) : (color2 * alpha12 + color1 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.darkenOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.darkenOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.darkenOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.darkenOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.darkenOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.darkenOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = color2 >= color1 ? ((color2 * invAlpha1 + color1 * alpha1) / 255 | 0) : color2;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.darkenOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the darken blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.darkenOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
								
								// This alpha is used when color1 > color2
									alpha12 = ((alpha1 * (alpha2 ^ 0xFF)) / newAlpha | 0),
									invAlpha12 = alpha12 ^ 0xFF,
								
								// This alpha is used when color2 > color1
									alpha21 = ((alpha2 * (alpha1 ^ 0xFF)) / newAlpha | 0),
									invAlpha21 = alpha21 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color2 >= color1) ? (color2 * alpha21 + color1 * invAlpha21) : (color1 * alpha12 + color2 * invAlpha12)) / 255) | 0;
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.dodgeOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.dodgeOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.dodgeOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.dodgeOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.dodgeOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.dodgeOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.dodgeOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the dodge blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.dodgeOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = (((color1 * alpha1n2)
										+ (color2 * alphan12)
										+ alpha12 * (color1 == 255 ? 255 : Math.min(255, ((255 * color2) / (color1 ^ 0xFF) | 0)))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.burnOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.burnOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.burnOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.burnOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.burnOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.burnOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color2 * invAlpha1
										+ alpha1 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.burnOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the burn blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.burnOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((color1 * alpha1n2
										+ color2 * alphan12
										+ alpha12 * (color1 == 0 ? 0 : Math.min(255, 255 * (color2 ^ 0xFF) / color1) ^ 0xFF)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.overlayOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.overlayOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.overlayOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.overlayOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.overlayOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.overlayOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xFF;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color2 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.overlayOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the overlay blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.overlayOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color2 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.hardLightOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.hardLightOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.hardLightOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.hardLightOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.hardLightOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.hardLightOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * 2 * color1 * color2 / 255)
												: (alpha1 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.hardLightOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the hard light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.hardLightOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * 2 * color1 * color2 / 255)
												: (alpha12 * ((2 * (color1 ^ 0xff) * (color2 ^ 0xff) / 255) ^ 0xff))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.softLightOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.softLightOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.softLightOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.softLightOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.softLightOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.softLightOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * (
											color1 <= 127
												? ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.softLightOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the soft light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.softLightOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? alpha12 * ((((2 * color1 - 255) * softLightLUTSquare[color2]) / 255 | 0) + color2)
												: alpha12 * ((((2 * color1 - 255) * softLightLUTSquareRoot[color2]) / 255 | 0) + color2)
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.vividLightOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.vividLightOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.vividLightOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.vividLightOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.vividLightOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.vividLightOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ (
											color1 <= 127
												? (alpha1 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha1 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.vividLightOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the vivid light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.vividLightOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ (
											color1 <= 127
												? (alpha12 * ((color1 == 0) ? 0 : 255 - Math.min(255, (((255 - color2) * 255) / (2 * color1) | 0))))
												: (alpha12 * (color1 == 255 ? 255 : Math.min(255, ((color2 * 255) / (2 * (255 - color1)) | 0))))
										)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.linearLightOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 1] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 2] - 255))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.linearLightOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 1] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 2] - 255))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.linearLightOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.linearLightOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.linearLightOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 1] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 2] - 255))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.linearLightOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 1] - 255))) / 255 | 0);
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * Math.min(255, Math.max(0, color2 + 2 * layer.data[pixIndex + 2] - 255))) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.linearLightOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the linear light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.linearLightOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * Math.min(255, Math.max(0, color2 + 2 * color1 - 255))) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.pinLightOntoOpaqueFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.pinLightOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.pinLightOntoTransparentFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.pinLightOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.pinLightOntoOpaqueFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.pinLightOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				let
									invAlpha1 = alpha1 ^ 0xff;
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((invAlpha1 * color2
										+ alpha1 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / 255 | 0);
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.pinLightOntoTransparentFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};

/**
 * Blend the given layer onto the fusion using the pin light blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.pinLightOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0),
				alpha2,
				color1,
				color2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									
									alpha12 = ((alpha1 * alpha2) / 255 | 0),
									alpha1n2 = ((alpha1 * (alpha2 ^ 0xFF)) / 255 | 0),
									alphan12 = (((alpha1 ^ 0xFF) * alpha2) / 255 | 0);
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				fusion.data[pixIndex] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				fusion.data[pixIndex + 1] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				fusion.data[pixIndex + 2] = ((alpha1n2 * color1
										+ alphan12 * color2
										+ alpha12 * ((color2 >= 2 * color1) ? (2 * color1) : (color2 <= 2 * color1 - 255) ? (2 * color1 - 255) : color2)) / newAlpha | 0);
				fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};


// Blending operations with non-standard variants 


/**
 * Blend the given layer onto the fusion using the passthrough blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.passthroughOntoOpaqueFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2 = 255,
				alphaMix = (layerAlpha / 100),
				invAlphaMix = 1.0 - alphaMix;
			
			let
							realAlpha = alpha1 * alphaMix + alpha2 * invAlphaMix;
			
						// Effectively use pre-multiplied alpha so that fully transparent colors have no effect on the result
			fusion.data[pixIndex] = ((layer.data[pixIndex] * alpha1 * alphaMix + fusion.data[pixIndex] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * alpha1 * alphaMix + fusion.data[pixIndex + 1] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * alpha1 * alphaMix + fusion.data[pixIndex + 2] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = realAlpha;
			
		}
	}
};


CPBlend.passthroughOntoOpaqueFusionWithOpaqueLayer = CPBlend.passthroughOntoOpaqueFusionWithTransparentLayer;
	

/**
 * Blend the given layer onto the fusion using the passthrough blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.passthroughOntoTransparentFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET],
				alphaMix = (layerAlpha / 100),
				invAlphaMix = 1.0 - alphaMix;
			
			let
							realAlpha = alpha1 * alphaMix + alpha2 * invAlphaMix;
			
						// Effectively use pre-multiplied alpha so that fully transparent colors have no effect on the result
			fusion.data[pixIndex] = ((layer.data[pixIndex] * alpha1 * alphaMix + fusion.data[pixIndex] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * alpha1 * alphaMix + fusion.data[pixIndex + 1] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * alpha1 * alphaMix + fusion.data[pixIndex + 2] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = realAlpha;
			
		}
	}
};


CPBlend.passthroughOntoTransparentFusionWithOpaqueLayer = CPBlend.passthroughOntoTransparentFusionWithTransparentLayer;


/**
 * Blend the given layer onto the fusion using the passthrough blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.passthroughOntoOpaqueFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2 = 255,
				alphaMix = (mask.data[maskIndex] * layerAlpha / 25500),
				invAlphaMix = 1.0 - alphaMix;
			
			let
							realAlpha = alpha1 * alphaMix + alpha2 * invAlphaMix;
			
						// Effectively use pre-multiplied alpha so that fully transparent colors have no effect on the result
			fusion.data[pixIndex] = ((layer.data[pixIndex] * alpha1 * alphaMix + fusion.data[pixIndex] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * alpha1 * alphaMix + fusion.data[pixIndex + 1] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * alpha1 * alphaMix + fusion.data[pixIndex + 2] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = realAlpha;
			
		}
	}
};


CPBlend.passthroughOntoOpaqueFusionWithOpaqueLayerMasked = CPBlend.passthroughOntoOpaqueFusionWithTransparentLayerMasked;
	

/**
 * Blend the given layer onto the fusion using the passthrough blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.passthroughOntoTransparentFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2 = fusion.data[pixIndex + ALPHA_BYTE_OFFSET],
				alphaMix = (mask.data[maskIndex] * layerAlpha / 25500),
				invAlphaMix = 1.0 - alphaMix;
			
			let
							realAlpha = alpha1 * alphaMix + alpha2 * invAlphaMix;
			
						// Effectively use pre-multiplied alpha so that fully transparent colors have no effect on the result
			fusion.data[pixIndex] = ((layer.data[pixIndex] * alpha1 * alphaMix + fusion.data[pixIndex] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 1] = ((layer.data[pixIndex + 1] * alpha1 * alphaMix + fusion.data[pixIndex + 1] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + 2] = ((layer.data[pixIndex + 2] * alpha1 * alphaMix + fusion.data[pixIndex + 2] * alpha2 * invAlphaMix) / realAlpha | 0);
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = realAlpha;
			
		}
	}
};


CPBlend.passthroughOntoTransparentFusionWithOpaqueLayerMasked = CPBlend.passthroughOntoTransparentFusionWithTransparentLayerMasked;

// These "replace" routines disregard the original contents of the fusion, so we need not make both an opaque and transparent fusion variant


/**
 * Blend the given layer onto the fusion using the replace blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.replaceOntoFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0);
			
			fusion.data[pixIndex] = layer.data[pixIndex];
			fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
			fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};



/**
 * Blend the given layer onto the fusion using the replace blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.replaceOntoFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET];
			
			fusion.data[pixIndex] = layer.data[pixIndex];
			fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
			fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};



/**
 * Blend the given layer onto the fusion using the replace blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.replaceOntoFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0);
			
			fusion.data[pixIndex] = layer.data[pixIndex];
			fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
			fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};



/**
 * Blend the given layer onto the fusion using the replace blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.replaceOntoFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0);
			
			fusion.data[pixIndex] = layer.data[pixIndex];
			fusion.data[pixIndex + 1] = layer.data[pixIndex + 1];
			fusion.data[pixIndex + 2] = layer.data[pixIndex + 2];
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};



/**
 * Blend the given layer onto the fusion using the replaceAlpha blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.replaceAlphaOntoFusionWithTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0);
			
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};



/**
 * Blend the given layer onto the fusion using the replaceAlpha blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.replaceAlphaOntoFusionWithTransparentLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] * layerAlpha / 25500)  | 0);
			
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};

	

/**
 * Blend the given layer onto the fusion using the replaceAlpha blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.replaceAlphaOntoFusionWithOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET];
			
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};



/**
 * Blend the given layer onto the fusion using the replaceAlpha blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * The given alpha mask will be multiplied with the layer alpha before blending.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {CPGreyBmp} mask
 * 
 */
CPBlend.replaceAlphaOntoFusionWithOpaqueLayerMasked = function(fusion, layer, layerAlpha, srcRect, mask) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideMask = (mask.width - w) | 0,
		maskIndex = mask.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, maskIndex += yStrideMask) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, maskIndex++) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * mask.data[maskIndex] / 255)  | 0);
			
			fusion.data[pixIndex + ALPHA_BYTE_OFFSET] = alpha1;
			
		}
	}
};



/**
 * Modify the given layer using the multiplyUpgrade blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.upgradeMultiplyOfOpaqueLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				color1,
				color2;
			
			if (alpha1) {
				// Legacy formula: color2 - Math.floor(((color1 ^ 0xFF) * color2 * alpha1) / (255 * 255))
							// New formula:    color2 -  Math.ceil(((color1 ^ 0xFF) * color2 * alpha1) / (255 * 255))
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				layer.data[pixIndex] = color1 + Math.ceil((((255 - color1) * color2 * alpha1) % (255 * 255)) / (color2 * alpha1));
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				layer.data[pixIndex + 1] = color1 + Math.ceil((((255 - color1) * color2 * alpha1) % (255 * 255)) / (color2 * alpha1));
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				layer.data[pixIndex + 2] = color1 + Math.ceil((((255 - color1) * color2 * alpha1) % (255 * 255)) / (color2 * alpha1));
				
			}
		}
	}
};



/**
 * Modify the given layer using the multiplyUpgrade blending operator.
 * 
 * The layer alpha must be less than 100
 * 
 * Fusion pixels must be opaque.
 * 
 * The destination co-ordinates will be the same as the source ones, so both fusion and layer
 * must be the same dimensions.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * 
 */
CPBlend.upgradeMultiplyOfTransparentLayer = function(fusion, layer, layerAlpha, srcRect) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL) {
			let
				alpha1 = (((layer.data[pixIndex + ALPHA_BYTE_OFFSET]) * layerAlpha / 100)  | 0),
				color1,
				color2;
			
			if (alpha1) {
				// Legacy formula: color2 - Math.floor(((color1 ^ 0xFF) * color2 * alpha1) / (255 * 255))
							// New formula:    color2 -  Math.ceil(((color1 ^ 0xFF) * color2 * alpha1) / (255 * 255))
				color1 = layer.data[pixIndex];
				color2 = fusion.data[pixIndex];
				layer.data[pixIndex] = color1 + Math.ceil((((255 - color1) * color2 * alpha1) % (255 * 255)) / (color2 * alpha1));
				color1 = layer.data[pixIndex + 1];
				color2 = fusion.data[pixIndex + 1];
				layer.data[pixIndex + 1] = color1 + Math.ceil((((255 - color1) * color2 * alpha1) % (255 * 255)) / (color2 * alpha1));
				color1 = layer.data[pixIndex + 2];
				color2 = fusion.data[pixIndex + 2];
				layer.data[pixIndex + 2] = color1 + Math.ceil((((255 - color1) * color2 * alpha1) % (255 * 255)) / (color2 * alpha1));
				
			}
		}
	}
};



/**
 * Blend the given layer onto the fusion using the normal blending operator.
 * 
 * The layer must have its layer alpha set to 100
 * 
 * Fusion can contain transparent pixels.
 * 
 * The destination's top left will be at destX, destY. The fusion can be a different size to
 * the layer.
 * 
 * @param {CPColorBmp} fusion
 * @param {CPColorBmp} layer
 * @param {int} layerAlpha
 * @param {CPRect} srcRect
 * @param {int} destX
 * @param {int} destY
 * 
 */
CPBlend._normalFuseImageOntoImageAtPosition = function(fusion, layer, layerAlpha, srcRect, destX, destY) {
	let
		h = srcRect.getHeight() | 0,
		w = srcRect.getWidth() | 0,
		yStride = ((layer.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndex = layer.offsetOfPixel(srcRect.left, srcRect.top) | 0,
		yStrideDest = ((fusion.width - w) * BYTES_PER_PIXEL) | 0,
		pixIndexDest = fusion.offsetOfPixel(destX, destY) | 0;
		
	for (let y = 0 ; y < h; y++, pixIndex += yStride, pixIndexDest += yStrideDest) {
		for (let x = 0; x < w; x++, pixIndex += BYTES_PER_PIXEL, pixIndexDest += BYTES_PER_PIXEL) {
			let
				alpha1 = layer.data[pixIndex + ALPHA_BYTE_OFFSET],
				alpha2;
			
			if (alpha1) {
				alpha2 = fusion.data[pixIndexDest + ALPHA_BYTE_OFFSET];
				let
									newAlpha = (alpha1 + alpha2 - ((alpha1 * alpha2) / 255 | 0)) | 0,
									realAlpha = ((alpha1 * 255) / newAlpha | 0),
									invAlpha = 255 - realAlpha;
				fusion.data[pixIndexDest] = ((layer.data[pixIndex] * realAlpha + fusion.data[pixIndexDest] * invAlpha) / 255 | 0);
				fusion.data[pixIndexDest + 1] = ((layer.data[pixIndex + 1] * realAlpha + fusion.data[pixIndexDest + 1] * invAlpha) / 255 | 0);
				fusion.data[pixIndexDest + 2] = ((layer.data[pixIndex + 2] * realAlpha + fusion.data[pixIndexDest + 2] * invAlpha) / 255 | 0);
				fusion.data[pixIndexDest + ALPHA_BYTE_OFFSET] = newAlpha;
				
			}
		}
	}
};


function makeLookupTables() {
	// V - V^2 table
	for (let i = 0; i < 256; i++) {
		let
			v = i / 255;

		softLightLUTSquare[i] = ((v - v * v) * 255) | 0;
	}

	// sqrt(V) - V table
	for (let i = 0; i < 256; i++) {
		let
			v = i / 255;

		softLightLUTSquareRoot[i] = ((Math.sqrt(v) - v) * 255) | 0;
	}
}
	
CPBlend.LM_NORMAL = 0;
CPBlend.LM_MULTIPLY = 1;
CPBlend.LM_ADD = 2;
CPBlend.LM_SCREEN = 3;
CPBlend.LM_LIGHTEN = 4;
CPBlend.LM_DARKEN = 5;
CPBlend.LM_SUBTRACT = 6;
CPBlend.LM_DODGE = 7;
CPBlend.LM_BURN = 8;
CPBlend.LM_OVERLAY = 9;
CPBlend.LM_HARDLIGHT = 10;
CPBlend.LM_SOFTLIGHT = 11;
CPBlend.LM_VIVIDLIGHT = 12;
CPBlend.LM_LINEARLIGHT = 13;
CPBlend.LM_PINLIGHT = 14;

CPBlend.LM_PASSTHROUGH = 15;
CPBlend.LM_MULTIPLY2 = 16;

CPBlend.LM_FIRST = 0;
CPBlend.LM_LAST = 16;
CPBlend.LM_LAST_CHIBIPAINT = CPBlend.LM_PINLIGHT;

CPBlend.BLEND_MODE_CODENAMES = [
	"normal",
	"multiply",
	"add",
	"screen",
	"lighten",
	"darken",
	"subtract",
	"dodge",
	"burn",
	"overlay",
	"hardLight",
	"softLight",
	"vividLight",
	"linearLight",
	"pinLight",
	"passthrough",
	"multiply2"
];

CPBlend.BLEND_MODE_DISPLAY_NAMES = [
	  "Normal", "Multiply", "Add", "Screen", "Lighten", "Darken", "Subtract", "Dodge", "Burn",
	  "Overlay", "Hard Light", "Soft Light", "Vivid Light", "Linear Light", "Pin Light", "Passthrough", "Multiply"
];

makeLookupTables();


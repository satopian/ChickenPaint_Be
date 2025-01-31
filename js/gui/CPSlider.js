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
import {_} from "../languages/lang.js";

/**
 * A simple slider control.
 */
export default function CPSlider(minValue, maxValue, centerMode, expMode, defaultWidth = 150) {
    const
        PRECISE_DRAG_SCALE = 4,
        EXP_MODE_FACTOR = 1.5,

        DRAG_MODE_IDLE = 0,
        DRAG_MODE_NORMAL = 1,
        DRAG_MODE_PRECISE = 2;

    let
        canvas = document.createElement("canvas"),
        canvasContext = canvas.getContext("2d"),
        
        valueRange = maxValue - minValue,
        
        dragMode = DRAG_MODE_IDLE,
        dragPreciseX,
        
        doneInitialPaint = false,
        
        that = this;

    this.value = undefined;

    /**
     * Either a string to draw on the slider, or a function(value) which receives the current value of the slider and
     * should return the string to be painted to the slider.
     *
     * @name CPSlider#title
     * @default ""
     */
    this.title = "";
    
    centerMode = centerMode || false;

    function paint() {
        
        let width = canvas.width || defaultWidth;
        let height = canvas.height;
        let title = typeof that.title === "string" ? _(that.title) : that.title(that.value);
        let textX = 3 * window.devicePixelRatio;
        let textY = canvas.height * 0.75;

        if (centerMode) {
            canvasContext.save();
            
            canvasContext.fillStyle = 'white';

            canvasContext.fillRect(0, 0, width, height);
            
            canvasContext.fillStyle = 'black';

            canvasContext.fillText(title, textX, textY);
            canvasContext.beginPath();
            
            if (that.value >= valueRange / 2) {
                canvasContext.rect(width / 2, 0, (that.value - valueRange / 2) * width / valueRange, height);
            } else {
                canvasContext.rect(that.value * width / valueRange, 0, (valueRange / 2 - that.value) * width / valueRange, height);
            }
            
            canvasContext.fill();
            canvasContext.clip();
            
            canvasContext.fillStyle = 'white';
            canvasContext.fillText(title, textX, textY);
            
            canvasContext.restore();
        } else {
            let
                barProp = (that.value - minValue) / valueRange,
                barWidth;

            if (expMode) {
                barProp = Math.pow(barProp, 1 / EXP_MODE_FACTOR);
            }

            barWidth = barProp * width;

            canvasContext.save();
            canvasContext.save();
            
            canvasContext.fillStyle = 'black';

            canvasContext.beginPath();
            canvasContext.rect(0, 0, barWidth, height);
            canvasContext.fill();
            
            canvasContext.clip();
            
            canvasContext.fillStyle = 'white';
            canvasContext.fillText(title, textX, textY);
            
            // Remove the clip region
            canvasContext.restore();
            
            canvasContext.fillStyle = 'white';

            canvasContext.beginPath();
            canvasContext.rect(barWidth, 0, width, height);
            canvasContext.fill();
            
            canvasContext.clip();
            
            canvasContext.fillStyle = 'black';
            canvasContext.fillText(title, textX, textY);
            
            canvasContext.restore();
        }
    }

    function mouseSelect(e) {

        let width = canvas.clientWidth; 
        let left = canvas.getBoundingClientRect().left + window.scrollX; 
            proportion = (e.pageX - left) / width;

        if (expMode) {
            // Give the user finer control over the low values
            proportion = Math.pow(Math.max(proportion, 0.0), EXP_MODE_FACTOR);
        }

        that.setValue(proportion * valueRange + minValue);
    }
        
    function pointerDragged(e) {
        switch (dragMode) {
            case DRAG_MODE_NORMAL:
                return mouseSelect(e);
            case DRAG_MODE_PRECISE:

            let title=that.title();
            //ブラシサイズと不透明度以外は細やかなスライダーの動作をしない
            if(!(title.includes(_("Brush size"))||title.includes(_("Opacity")))){
                return mouseSelect(e);
            }
            let diff = (e.pageX - dragPreciseX) / PRECISE_DRAG_SCALE;
            if (diff !== 0) {

                let unrounded = that.value + diff;
                let rounded = Math.floor(unrounded);

                that.setValue(rounded);
            
                /* Tweak the "old mouseX" position such that the fractional part of the value we were unable to set
                    * will be accumulated
                    */
                dragPreciseX = e.pageX - (unrounded - rounded) * PRECISE_DRAG_SCALE;
            }
        break;
        }
    }

    canvas.addEventListener("pointerup", (e)=>{

        if (dragMode === DRAG_MODE_IDLE) {
            canvas.releasePointerCapture(e.pointerId);
            return canvas.removeEventListener("pointermove", pointerDragged);
        }
        if (dragMode !== DRAG_MODE_IDLE) {
            switch (dragMode) {
                case DRAG_MODE_NORMAL:
                    if (e.button === 0 && !e.shiftKey) {
                        dragMode = DRAG_MODE_IDLE;
                    }
                    break;
                case DRAG_MODE_PRECISE:
                    if (e.button == 2 ||(e.button === 0 && e.shiftKey)) {
                        dragMode = DRAG_MODE_IDLE;
                    }
                    break;
                default:
                    return;
            }
        }
        canvas.releasePointerCapture(e.pointerId);
        return canvas.removeEventListener("pointermove", pointerDragged);
    });
    
    this.setValue = function(_value) {
        _value = ~~Math.max(minValue, Math.min(maxValue, _value));
        
        if (this.value != _value) {
            this.value = _value;

            // The event listeners might like to update our title property at this point to reflect the new value
            this.emitEvent('valueChange', [this.value]);
        
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
    this.getElement = function() {
        return canvas;
    };
    
    this.resize = function() {
        canvas.width = canvas.clientWidth || defaultWidth;
        canvas.height = canvas.clientHeight || 20;
        
        if (window.devicePixelRatio > 1) {
            // Assume our width is set to 100% or similar, so we only need to the fix the height
            canvas.style.height = canvas.height + 'px';
            
            canvas.width = canvas.width * window.devicePixelRatio;
            canvas.height = canvas.height * window.devicePixelRatio;
        }
        
        canvasContext.font = (canvas.height * 0.47) + 'pt sans-serif';
        
        paint();
    };
    
    canvas.addEventListener("pointerdown", function(e) {
        if (dragMode === DRAG_MODE_IDLE) {

            if(e.button === 2 ||(e.button === 0 && e.shiftKey)){
                dragMode = DRAG_MODE_PRECISE;
                dragPreciseX = e.pageX;
            }else{
                dragMode = DRAG_MODE_NORMAL;
                mouseSelect(e);
            }

            canvas.setPointerCapture(e.pointerId);
            canvas.addEventListener("pointermove", pointerDragged);
        }
    });


    canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    canvas.setAttribute("touch-action", "none");
    canvas.className = 'chickenpaint-slider';
    
    if (!("devicePixelRatio" in window)) {
        // Old browsers
        window.devicePixelRatio = 1.0;
    }
}

CPSlider.prototype = Object.create(EventEmitter.prototype);
CPSlider.prototype.constructor = CPSlider;

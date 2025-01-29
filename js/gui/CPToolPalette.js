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

import key from "../../lib/keymaster.js";

import CPPalette from './CPPalette.js';
import ChickenPaint from '../ChickenPaint.js';

import {_} from "../languages/lang.js";

export default function CPToolPalette(cpController) {
    CPPalette.call(this, cpController, "tool", "Tools");
    
    let
        that = this,

        buttons = [
            {
                className: "chickenpaint-tool-rect-selection",
                command: "CPRectSelection",
                toolTip: "Marquee",
                shortcut: "m",
                mode: ChickenPaint.M_RECT_SELECTION
            },
            {
                className: "chickenpaint-tool-move",
                command: "CPMoveTool",
                toolTip: "Move tool",
                shortcut: "v",
                mode: ChickenPaint.M_MOVE_TOOL
            },
            {
                className: "chickenpaint-tool-flood-fill",
                command: "CPFloodFill",
                toolTip: "Flood fill",
                shortcut: "f",
                mode: ChickenPaint.M_FLOODFILL
            },
            {
                className: "chickenpaint-tool-gradient-fill",
                command: "CPGradientFill",
                toolTip: "Gradient fill",
                shortcut: "g",
                mode: ChickenPaint.M_GRADIENTFILL
            },
            {
                className: "chickenpaint-tool-color-picker",
                command: "CPColorPicker",
                toolTip: "Color picker",
                shortcut: "i",
                mode: ChickenPaint.M_COLOR_PICKER
            },
            {
                className: "chickenpaint-tool-blur",
                command: "CPBlur",
                toolTip: "Blur",
                shortcut: "u",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_BLUR
            },
            {
                className: "chickenpaint-tool-pencil",
                command: "CPPencil",
                toolTip: "Pencil",
                shortcut: "n",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_PENCIL
            },
            {
                className: "chickenpaint-tool-pen",
                command: "CPPen",
                toolTip: "Pen",
                selected: true, // TODO a better mechanism for the controller to let us know the initial tool
                shortcut: "b",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_PEN
            },
            {
                className: "chickenpaint-tool-airbrush",
                command: "CPAirbrush",
                toolTip: "Airbrush",
                shortcut: "a",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_AIRBRUSH
            },
            {
                className: "chickenpaint-tool-water",
                command: "CPWater",
                toolTip: "Waterpaint",
                shortcut: "w",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_WATER
            },
            {
                className: "chickenpaint-tool-eraser",
                command: "CPEraser",
                toolTip: "Eraser",
                shortcut: "e",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_ERASER
            },
            {
                className: "chickenpaint-tool-soft-eraser",
                command: "CPSoftEraser",
                toolTip: "Soft eraser",
                shortcut: "s",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_SOFTERASER
            },
            {
                className: "chickenpaint-tool-smudge",
                command: "CPSmudge",
                toolTip: "Smudge",
                shortcut: "d",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_SMUDGE
            },
            {
                className: "chickenpaint-tool-blender",
                command: "CPBlender",
                toolTip: "Blender",
                shortcut: "c",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_BLENDER
            },
            {
                className: "chickenpaint-tool-dodge",
                command: "CPDodge",
                toolTip: "Dodge (tool)",
                shortcut: "o",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_DODGE
            },
            {
                className: "chickenpaint-tool-burn",
                command: "CPBurn",
                toolTip: "Burn (tool)",
                shortcut: "p",
                mode: ChickenPaint.M_DRAW,
                tool: ChickenPaint.T_BURN
            },
            {
                className: "chickenpaint-tool-rotate-canvas",
                command: "CPRotateCanvas",
                commandDoubleClick: "CPResetCanvasRotation",
                toolTip: "Rotate canvas",
				mode: ChickenPaint.M_ROTATE_CANVAS
            },
            {
                className: "chickenpaint-tool-pan-canvas",
                command: "CPPanCanvas",
                toolTip: "Grab canvas",
                mode: ChickenPaint.M_PAN_CANVAS
            },
        ],
        listElem = document.createElement("ul");
    
    function buttonClicked(e) {
        if (this.nodeName == "LI") {
            let
                button = buttons[parseInt(this.getAttribute("data-buttonIndex"), 10)];

            cpController.actionPerformed({action: button.command});
            // that.userIsDoneWithUs();
			//ボタンクリック時にパレットを折りたたむ機能を削除
        }
    }

    function buildButtons() {
        let
            body = that.getBodyElement();
        
        listElem.className = "chickenpaint-tools list-unstyled";
        
        for (let i in buttons) {
            (function(i) {
                let
                    button = buttons[i],
                    buttonElem = document.createElement("li"),
                    buttonIcon = document.createElement("div");
                
                buttonElem.className = "chickenpaint-toolbar-button " + button.className;
                buttonElem.setAttribute("data-buttonIndex", i);

                buttonElem.setAttribute('data-mode', button.mode);
                if (button.tool !== undefined) {
                    buttonElem.setAttribute('data-tool', button.tool);
                }
                
                buttonElem.title = _(button.toolTip);
                
                if (button.shortcut) {
                    buttonElem.title += " (" + button.shortcut.toUpperCase() + ")";
                    
                    key(button.shortcut, function() {
                        buttonClicked.call(buttonElem);
                        
                        return false;
                    });
                }
                
                if (button.selected) {
                    buttonElem.className = buttonElem.className + " selected";
                }

                buttonIcon.className = "chickenpaint-toolbar-button-icon";
                buttonElem.appendChild(buttonIcon);

                listElem.appendChild(buttonElem);
            })(i);
        }
        
        listElem.addEventListener("click", function(e) {
            const liElem = e.target.closest("li"); // クリックされた要素が li の場合、それを取得
        
            if (liElem) {
                buttonClicked.call(liElem, e); // クリックされた li 要素を引数に渡す
            }
        });
        listElem.addEventListener("dblclick", function(e) {
            const liElem = e.target.closest("li");
        
            if (liElem) {
                let buttonIndex = parseInt(liElem.getAttribute("data-buttonIndex"), 10);
                let button = buttons[buttonIndex];
                
                // クリックされた時に処理を実行
                if (button.commandDoubleClick) {
                cpController.actionPerformed({ action: button.commandDoubleClick });
                }
            }
        });
        
        body.appendChild(listElem);
    }

    cpController.on("modeChange", function(newMode) {
        let body = that.getBodyElement();
        
        // 'selected' クラスを全ての <li> から削除
        const liElems = body.querySelectorAll("li");
        liElems.forEach(function(liElem) {
            liElem.classList.remove("selected");
        });
        
        // モードに応じて 'selected' クラスを追加
        if (newMode == ChickenPaint.M_DRAW) {
            const toolElem = body.querySelector(`li[data-tool="${cpController.getCurTool()}"]`);
            if (toolElem) {
                toolElem.classList.add("selected");
            }
        } else {
            const modeElem = body.querySelector(`li[data-mode="${newMode}"]`);
            if (modeElem) {
                modeElem.classList.add("selected");
            }
        }
    });
    
    cpController.on("toolChange", function(newTool) {
        let body = that.getBodyElement();
    
        if (cpController.getCurMode() == ChickenPaint.M_DRAW) {
            // 'selected' クラスを全ての <li> から削除
            const liElems = body.querySelectorAll("li");
            liElems.forEach(function(liElem) {
                liElem.classList.remove("selected");
            });
    
            // 新しいツールに対応する <li> に 'selected' クラスを追加
            const toolElem = body.querySelector(`li[data-tool="${newTool}"]`);
            if (toolElem) {
                toolElem.classList.add("selected");
            }
        }
    });
        
    buildButtons();
}

CPToolPalette.prototype = Object.create(CPPalette.prototype);
CPToolPalette.prototype.constructor = CPToolPalette;

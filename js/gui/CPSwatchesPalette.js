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

import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import FileSaver from "file-saver";

import CPPalette from './CPPalette.js';

import CPColor from '../util/CPColor.js';
import AdobeColorTable from '../util/AdobeColorTable.js';
import {_} from "../languages/lang.js";

function padLeft(string, padding, len) {
    while (string.length < len) {
        string = padding + string;
    }
    return string;
}

function fileAPIsSupported() {
    return window.File && window.FileReader && window.FileList && window.Blob;
}

export default function CPSwatchesPalette(controller) {
    CPPalette.call(this, controller, "swatches", "Color swatches");
    
    let
        INIT_COLORS = [0xffffff, 0x000000, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00],
        
        modified = false,
        swatchPanel = document.createElement("ul"),
        buttonPanel = document.createElement("div"),
        
        fileInput,
        
        that = this;

    function CPColorSwatch(color) {
        let
            wrapper = document.createElement("div"),
            swatchElem = document.createElement("a"),
            swatchMenu = document.createElement("ul"),
            
            mnuRemove = document.createElement("a"),
            mnuSetToCurrent = document.createElement("a"),
            
            that = this;
        
        this.getElement = function() {
            return wrapper;
        };
        
        this.setColor = function(color) {
            swatchElem.setAttribute("data-color", color);
            swatchElem.style.backgroundColor = "#" + padLeft("" + Number(color).toString(16), "0", 6);
        };

        this.setColor(color);
        
        swatchElem.href = "#";
        swatchElem.className = "chickenpaint-color-swatch dropdown-toggle";
		//"data-bs-toggle"に設定しない 
        // swatchElem.setAttribute("data-bs-toggle", "dropdown");

        mnuRemove.className = "dropdown-item";
        mnuRemove.href = "#";
        mnuRemove.textContent = _("Remove");
        
        mnuRemove.addEventListener("click", function(e) {
            e.preventDefault();
            wrapper.remove();

            modified = true;
        });

        mnuSetToCurrent.className = "dropdown-item";
        mnuSetToCurrent.href = "#";
        mnuSetToCurrent.textContent = _("Replace with current color");
        
        mnuSetToCurrent.addEventListener("click", function(e) {
            e.preventDefault();
            
            that.setColor(controller.getCurColor().getRgb());
            
            modified = true;
        });
        
        swatchMenu.className = "dropdown-menu";
        
		let liRemove=document.createElement("li");
		let liSetToCurrent=document.createElement("li");
		liRemove.appendChild(mnuRemove);//liで囲う
		liSetToCurrent.appendChild(mnuSetToCurrent);//liで囲う
		swatchMenu.appendChild(liRemove);
		swatchMenu.appendChild(liSetToCurrent);

		wrapper.className = "chickenpaint-color-swatch-wrapper";
        wrapper.appendChild(swatchElem);
        wrapper.appendChild(swatchMenu);
        
    }
    
    function clearSwatches() {
        while (swatchPanel.lastChild) {
            swatchPanel.removeChild(swatchPanel.lastChild);
        }
    }

    function addSwatch(color) {
        let
            swatch = new CPColorSwatch(color);

        swatchPanel.appendChild(swatch.getElement());
    }
    
    /**
     * Returns an array of colors in RGB 32-bit integer format
     */
    this.getSwatches = function() {
        let swatches = swatchPanel.querySelectorAll(".chickenpaint-color-swatch");
        let colors = new Array(swatches.length);

        for (let i = 0; i < swatches.length; i++) {
            colors[i] = parseInt(swatches.get(i).getAttribute("data-color"), 10);
        }

        return colors;
    };

    this.setSwatches = function(swatches) {
        clearSwatches();

        for (let i = 0; i < swatches.length; i++) {
            addSwatch(swatches[i]);
        }
        
        modified = true;
    };
    
    this.isModified = function() {
        return modified;
    };
    
    function loadSwatches() {
        fileInput.onchange = function() {
            let
                fileList = this.files;
            
            if (fileList.length < 1)
                return;
            
            let
                file = fileList[0],
                reader = new FileReader();
            
            reader.onload = function() {
                let
                    swatches = new AdobeColorTable().read(this.result);
                
                if (swatches != null && swatches.length > 0) {
                    that.setSwatches(swatches);
                } else {
                    alert(_("The swatches could not be read, did you select an .aco file?"));
                }
            };
            
            reader.readAsArrayBuffer(file);
        };
        
        fileInput.click();
    }
    
    function saveSwatches() {
        let
            aco = new AdobeColorTable().write(that.getSwatches()),
            blob = new Blob([aco], {type: "application/octet-stream"});
        
        FileSaver.saveAs(blob, "oekakiswatches.aco");
    }
    
    function initSwatchPanel() {
        swatchPanel.className = "chickenpaint-color-swatches list-unstyled";
        
        for (let i = 0; i < INIT_COLORS.length; i++) {
            swatchPanel.appendChild(new CPColorSwatch(INIT_COLORS[i]).getElement());
        }
        
        swatchPanel.addEventListener("click", function(e) {

			let
                swatch = e.target;
				
			if (!/^<a data-color=/i.test(swatch.outerHTML) || !/chickenpaint-color-swatch/.test(swatch.className)) {
				return;//<a data-color=で始まらない場合もreturn
			}
			//"data-bs-toggle"に設定していなければ必要ないため、コメントアウト
			//コンテキストメニューを閉じる
			// let dropdown = new bootstrap.Dropdown($(swatch)); // Bootstrap 5: ドロップダウンを初期化
			// dropdown.hide();
	
			if (e.button == 0 /* Left */ && swatch.getAttribute("data-color") !== undefined) {
                controller.setCurColor(new CPColor(parseInt(swatch.getAttribute("data-color"), 10)));
                e.stopPropagation();
                e.preventDefault();
                // that.userIsDoneWithUs();
				//ボタンクリック時にパレットを折りたたむ機能を削除
            }
       });
		
		swatchPanel.addEventListener("contextmenu", function(e) {
            let
                swatch = e.target;
            
			if (!/^<a data-color=/i.test(swatch.outerHTML) || !/chickenpaint-color-swatch/.test(swatch.className)) {
				return;//<a data-color=で始まらない場合もreturn
				}
            e.preventDefault();
			var dropdown = new bootstrap.Dropdown(swatch); // Bootstrap 5: ドロップダウンを初期化
			dropdown.toggle();

			// ドロップダウンメニュー内のクリックを検出して、メニューを閉じる
			document.addEventListener("click", function onDocumentClick(event) {
				dropdown.hide();
				document.removeEventListener("click", onDocumentClick);
			});
		});
	}	
    function createIcon(iconName) {
        let
            icon = document.createElement("span");

        icon.className = "fa icon-" + iconName;

        return icon;
    }

    function initButtonsPanel() {
        let
            btnSettings = document.createElement("button"),
            btnAdd = document.createElement("button"),
            
            settingsMenu = document.createElement("ul"),
            
            mnuSave = document.createElement("a"),
            mnuLoad  = document.createElement("a");

        btnAdd.type = "button";
        btnAdd.title = _("Add the current brush color as a new swatch");
        btnAdd.className = "btn chickenpaint-small-toolbar-button chickenpaint-color-swatch-add";
        btnAdd.appendChild(createIcon("plus"));

        btnSettings.type = "button";
        btnSettings.className = "btn dropdown-toggle chickenpaint-small-toolbar-button chickenpaint-color-swatch-settings";
		//"data-bs-toggle"に設定 bs5
		btnSettings.setAttribute("data-bs-toggle", "dropdown");
        btnSettings.appendChild(createIcon("cog"));

        mnuSave.className = "dropdown-item";
        mnuSave.href = "#";
        mnuSave.textContent = _("Save swatches to your computer...");
        mnuSave.addEventListener("click", function(e) {
            e.preventDefault();
            
            saveSwatches();
        });

        mnuLoad.className = "dropdown-item";
        mnuLoad.href = "#";
        mnuLoad.textContent = _("Load swatches from your computer...");
        mnuLoad.addEventListener("click", function(e) {
            e.preventDefault();
            
            loadSwatches();
        });
        
        settingsMenu.className = "dropdown-menu";
        
		let limnuSave=document.createElement("li");
		let limnuLoad=document.createElement("li");
		limnuSave.appendChild(mnuSave);//liで囲う
		limnuLoad.appendChild(mnuLoad);//liで囲う
        settingsMenu.appendChild(limnuSave);
        settingsMenu.appendChild(limnuLoad);
        
        let
            btnSettingsContainer = document.createElement("div");
        
        btnSettingsContainer.className = "btn-group";
        btnSettingsContainer.appendChild(btnSettings);
        btnSettingsContainer.appendChild(settingsMenu);

		btnAdd.addEventListener("click", function(e) {
            addSwatch(controller.getCurColor().getRgb());
            modified = true;
        });
        
        buttonPanel.className = 'chickenpaint-color-swatches-buttons';
        
        // Don't offer to load/save swatches if we don't have the file API needed for reading them
        if (fileAPIsSupported()) {
            fileInput = document.createElement("input");
            
            fileInput.type = "file";
            fileInput.multiple = false;
            fileInput.style.display = "none";
                
            buttonPanel.appendChild(btnSettingsContainer);
            buttonPanel.appendChild(fileInput);
        }
        
        buttonPanel.appendChild(btnAdd);
    }
    
    initSwatchPanel();
    this.getBodyElement().appendChild(swatchPanel);

    initButtonsPanel();
    this.getBodyElement().appendChild(buttonPanel);
}

CPSwatchesPalette.prototype = Object.create(CPPalette.prototype);
CPSwatchesPalette.prototype.constructor = CPSwatchesPalette;
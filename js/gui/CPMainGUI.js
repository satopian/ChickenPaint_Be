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

import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

import CPCanvas from "./CPCanvas.js";
import CPPaletteManager from "./CPPaletteManager.js";
import CPMainMenu from "./CPMainMenu.js";

import EventEmitter from "wolfy87-eventemitter";

export default function CPMainGUI(controller, uiElem) {
    let lowerArea = document.createElement("div"),
        canvas = new CPCanvas(controller),
        paletteManager = new CPPaletteManager(controller),
        menuBar,
        fullScreenMode = false,
        that = this;

    this.togglePalettes = function () {
        paletteManager.togglePalettes();
    };

    this.arrangePalettes = function () {
        // Give the browser a chance to do the sizing of the palettes before we try to rearrange them
        setTimeout(paletteManager.arrangePalettes.bind(paletteManager), 0);
    };

    this.constrainPalettes = function () {
        paletteManager.constrainPalettes();
    };

    this.showPalette = function (paletteName, show) {
        paletteManager.showPaletteByName(paletteName, show);
    };

    this.getSwatches = function () {
        return paletteManager.palettes.swatches.getSwatches();
    };

    this.setSwatches = function (swatches) {
        paletteManager.palettes.swatches.setSwatches(swatches);
    };

    this.getPaletteManager = function () {
        return paletteManager;
    };

    /**
     *
     * @param {number} rotation - in 90 degree increments
     */
    this.setRotation90 = function (rotation) {
        canvas.setRotation((rotation * Math.PI) / 2);
        paletteManager.palettes.layers.setRotation90(rotation);
    };

    this.setFullScreenMode = function (value) {
        if (fullScreenMode !== value) {
            fullScreenMode = value;

            that.resize();
            that.arrangePalettes();
        }
    };

    this.resize = function (doConstrain = true) {
        let newHeight;

        let windowHeight = window.innerHeight,
            menuBarHeight = menuBar.getElement().getBoundingClientRect().height;

        if (fullScreenMode) {
            newHeight = windowHeight - menuBarHeight;
        } else {
            newHeight = Math.min(
                Math.max(windowHeight - menuBarHeight - 65, 500),
                850
            );
        }

        canvas.resize(newHeight, false);
        if( doConstrain ) {// パレットの再配置を行う
            that.constrainPalettes();
        }
    };

    menuBar = new CPMainMenu(controller, this);

    uiElem.appendChild(menuBar.getElement());

    lowerArea.className = "chickenpaint-main-section";

    lowerArea.appendChild(canvas.getElement());
    lowerArea.appendChild(paletteManager.getElement());

    uiElem.appendChild(lowerArea);

    canvas.on("canvasRotated90", function (newAngle) {
        paletteManager.palettes.layers.setRotation90(newAngle);
    });

    // デバイスの向きの変更時にパレットの配置を初期化
    if (screen.orientation) {
        //非対応ブラウザ対策
        screen.orientation.addEventListener("change", (e) => {
            //何通りも、試してどれかが有効になる事を期待
            this.resize();
            // パレット初期化
            controller.actionPerformed({ action: "CPArrangePalettes" });
            setTimeout(() => {
                this.resize();
                // パレット初期化
                controller.actionPerformed({ action: "CPArrangePalettes" });
            }, 10);
            Promise.resolve()
                .then(() => {
                    this.resize();
                })
                .then(() => {
                    // パレット初期化
                    controller.actionPerformed({ action: "CPArrangePalettes" });
                });
        });
    }
    // ハンバガーメニューとモーダルの二重表示防止
    const collapseElement = document.getElementById(
        "chickenpaint-main-menu-content"
    );
    document.addEventListener("show.bs.modal", () => {
        // chickenpaint-main-menu-contentのIDを持つcollapse要素を閉じる
        if (collapseElement && collapseElement.classList.contains("show")) {
            const bsCollapse = new bootstrap.Collapse(collapseElement, {
                toggle: false, // すでに閉じている場合のエラーを防ぐ
            });
            bsCollapse.hide();
        }
    });
    if (collapseElement) {
        const WidgetNav = document.querySelector(".chickenpaint .widget-nav");
        if (WidgetNav) {
            collapseElement.addEventListener("show.bs.collapse", (e) => {
                //ハンバガーメニューを表示する時に
                // .navbar-nav を非表示にする
                WidgetNav.classList.add("hidden");
            });
            collapseElement.addEventListener("hidden.bs.collapse", (e) => {
                //ハンバガーメニューを閉じる時に
                // .navbar-nav を表示する
                WidgetNav.classList.remove("hidden");
            });
        }
        window.addEventListener("resize", () => {
            // .navbar-nav を表示する
            WidgetNav.classList.remove("hidden");
        });
    }

    //Bootstrap5のコラプスでメニューバーが閉じる時にリサイズする
    document.addEventListener("hidden.bs.collapse", this.resize.bind(this));
    window.addEventListener("resize", this.resize.bind(this));

    let lastScrollbarVisible = null;
    let resizeScheduled = false;

    //縦スクロールバーの表示を監視してリサイズする
    const observer = new ResizeObserver(() => {
        const scrollbarVisible = window.innerWidth > document.documentElement.clientWidth;

        if (scrollbarVisible !== lastScrollbarVisible) {
            lastScrollbarVisible = scrollbarVisible;
            // console.log('Scrollbar visibility changed:', scrollbarVisible);
            if (!resizeScheduled) {
                resizeScheduled = true;
                requestAnimationFrame(() => {
                    resizeScheduled = false;
                    //doConstrain = false
                    //キャンバスのリサイズは行うがパレットの再配置は行わない
                    this.resize(false);
                });
            }
        }
    });
    observer.observe(document.body);

    controller.on("fullScreen", (fullscreen) =>
        this.setFullScreenMode(fullscreen)
    );

    controller.on("unsavedChanges", (unsaved) => {
        uiElem.classList.toggle("chickenpaint-unsaved", unsaved);
    });

    setTimeout(this.resize.bind(this), 0);
}

CPMainGUI.prototype = Object.create(EventEmitter.prototype);
CPMainGUI.prototype.constructor = CPMainGUI;

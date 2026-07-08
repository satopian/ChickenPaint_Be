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

import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

import CPCanvas from "./CPCanvas.js";
import CPPaletteManager from "./CPPaletteManager.js";
import CPMainMenu from "./CPMainMenu.js";

import EventEmitter from "wolfy87-eventemitter";

/**
 * @this {any}
 */

export default class CPMainGUI extends EventEmitter {
  /**
   * @param {import('../ChickenPaint.js').default} controller
   * @param {HTMLElement} uiElem
   */
  constructor(controller, uiElem) {
    super();
    this.controller = controller;
    this.uiElem = uiElem;
    this.lowerArea = document.createElement("div");
    this.canvas = new CPCanvas(this.controller);
    this.paletteManager = new CPPaletteManager(this.controller);
    this.fullScreenMode = false;

    this.menuBar = new CPMainMenu(this.controller, this);

    this.uiElem.appendChild(this.menuBar.getElement());

    this.lowerArea.className = "chickenpaint-main-section";

    this.lowerArea.appendChild(this.canvas.getElement());
    this.lowerArea.appendChild(this.paletteManager.getElement());

    this.uiElem.appendChild(this.lowerArea);

    this.togglePalettes = this.togglePalettes.bind(this);
    this.resize = this.resize.bind(this);

    const that = this;
    this.canvas.on("canvasRotated90", function (newAngle) {
      that.paletteManager.palettes.layers.setRotation90(newAngle);
    });

    // デバイスの向きの変更時にパレットの配置を初期化
    if (screen.orientation) {
      //非対応ブラウザ対策
      screen.orientation.addEventListener("change", (e) => {
        this.resize();
        requestAnimationFrame(() => {
          //3フレーム待機
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              //一回では並び変わらないため3回リアレンジ
              this.controller.actionPerformed({
                action: "CPArrangePalettes",
              });
              this.controller.actionPerformed({
                action: "CPArrangePalettes",
              });
              this.controller.actionPerformed({
                action: "CPArrangePalettes",
              });
            });
          });
        });
      });
    }
    // ハンバガーメニューとモーダルの二重表示防止
    const collapseElement = document.getElementById(
      "chickenpaint-main-menu-content",
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
        WidgetNav?.classList.remove("hidden");
      });
    }

    //Bootstrap5のコラプスでメニューバーが閉じる時にリサイズする
    document.addEventListener("hidden.bs.collapse", () => {
      this.resize();
    });
    window.addEventListener("resize", () => this.resize());

    let lastScrollbarVisible = null;
    let resizeScheduled = false;

    //縦スクロールバーの表示を監視してリサイズする
    const observer = new ResizeObserver(() => {
      const scrollbarVisible =
        window.innerWidth > document.documentElement.clientWidth;

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

    this.controller.on("fullScreen", (fullscreen) =>
      this.setFullScreenMode(fullscreen),
    );

    this.controller.on("unsavedChanges", (unsaved) => {
      this.uiElem.classList.toggle("chickenpaint-unsaved", unsaved);
    });

    setTimeout(this.resize.bind(this), 0);
  }

  togglePalettes() {
    this.paletteManager.togglePalettes();
  }

  arrangePalettes() {
    // Give the browser a chance to do the sizing of the palettes before we try to rearrange them
    setTimeout(
      this.paletteManager.arrangePalettes.bind(this.paletteManager),
      0,
    );
  }

  constrainPalettes() {
    this.paletteManager.constrainPalettes();
  }
  /**
   * @param {string} paletteName
   * @param {boolean} show
   */
  showPalette(paletteName, show) {
    this.paletteManager.showPaletteByName(paletteName, show);
  }

  getSwatches() {
    return this.paletteManager.palettes.swatches.getSwatches();
  }

  setSwatches(swatches) {
    this.paletteManager.palettes.swatches.setSwatches(swatches);
  }

  getPaletteManager() {
    return this.paletteManager;
  }

  /**
   *
   * @param {number} rotation - in 90 degree increments
   */
  setRotation90(rotation) {
    this.canvas.setRotation((rotation * Math.PI) / 2);
    this.paletteManager.palettes.layers.setRotation90(rotation);
  }

  setFullScreenMode(value) {
    if (this.fullScreenMode !== value) {
      this.fullScreenMode = value;

      this.resize();
      this.arrangePalettes();
    }
  }

  resize(doConstrain = true) {
    let newHeight;

    let windowHeight = window.innerHeight,
      menuBarHeight = this.menuBar.getElement().getBoundingClientRect().height;

    if (this.fullScreenMode) {
      newHeight = windowHeight - menuBarHeight;
    } else {
      newHeight = Math.min(
        Math.max(windowHeight - menuBarHeight - 65, 500),
        850,
      );
    }

    this.canvas.resize(newHeight, false);
    if (doConstrain) {
      // パレットの再配置を行う
      this.constrainPalettes();
    }
  }

  getMainMenu() {
    return this.menuBar;
  }
}

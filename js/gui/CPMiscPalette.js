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

import CPPalette from "./CPPalette.js";
import { _ } from "../languages/lang.js";

export default function CPMiscPalette(cpController) {
  CPPalette.call(this, cpController, "misc", "Misc");

  /** @type {HTMLElement|null} */
  //表示の左右反転時に赤枠を付けるElement
  this.flipButton = null;

  let that = this,
    buttons = [
      {
        className: "chickenpaint-tool-zoom-in",
        command: "CPZoomIn",
        toolTip: "Zoom in",
      },
      {
        className: "chickenpaint-tool-zoom-out",
        command: "CPZoomOut",
        toolTip: "Zoom out",
      },
      {
        className: "chickenpaint-tool-zoom-100",
        command: "CPZoom100",
        toolTip: "Zoom 100%",
      },
      {
        className: "chickenpaint-tool-flip-horizontal",
        command: "CPViewHFlip",
        toolTip: "Flip View Horizontal",
      },
      {
        className: "chickenpaint-tool-undo",
        command: "CPUndo",
        toolTip: "Undo",
      },
      {
        className: "chickenpaint-tool-redo",
        command: "CPRedo",
        toolTip: "Redo",
      },
      {
        className: "chickenpaint-tool-send",
        command: "CPSend",
        toolTip: "Save Oekaki",
      },
    ];

  function buildButtons() {
    let body = that.getBodyElement(),
      listElem = document.createElement("ul");

    listElem.className = "chickenpaint-misc-tools list-unstyled";

    for (let i in buttons) {
      let button = buttons[i],
        buttonElem = document.createElement("li"),
        buttonIcon = document.createElement("div");

      if (
        button.command == "CPSend" &&
        !cpController.isActionSupported("CPContinue")
      ) {
        button.toolTip = "Post Oekaki";
        button.className = "chickenpaint-tool-send-and-end";
      }

      buttonElem.className = "chickenpaint-toolbar-button " + button.className;
      buttonElem.setAttribute("data-buttonIndex", i);
      buttonElem.setAttribute("title", _(button.toolTip));

      buttonIcon.className = "chickenpaint-toolbar-button-icon";
      buttonElem.appendChild(buttonIcon);

      listElem.appendChild(buttonElem);
      // 「左右反転ボタン」の要素を保存する
      if (button.className === "chickenpaint-tool-flip-horizontal") {
        that.flipButton = buttonElem;
      }
    }

    listElem.addEventListener("click", function (e) {
      // クリックされた要素が <li> 内の何らかの要素の場合、親の <li> を取得
      const liElem = e.target.closest("li");

      // 親が <li> であれば処理を行う
      if (liElem) {
        let buttonIndex = parseInt(liElem.getAttribute("data-buttonIndex"), 10);
        let button = buttons[buttonIndex];

        // アクションを実行
        cpController.actionPerformed({ action: button.command });
      }
    });

    body.appendChild(listElem);
  }

  buildButtons();
}

CPMiscPalette.prototype = Object.create(CPPalette.prototype);
CPMiscPalette.prototype.constructor = CPMiscPalette;

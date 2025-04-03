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
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { _ } from "../languages/lang.js";

export default function CPConfirmTransformDialog(parent, controller) {
    // ダイアログ要素を作成
    const dialog = document.createElement("div");
    dialog.classList.add("modal", "fade");
    dialog.setAttribute("tabindex", "-1");
    dialog.setAttribute("role", "dialog");
    dialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${_("Complete transform")}</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close"></button>
                </div>
                <div class="modal-body">
                    <p>
                        ${_("You need to finish transforming this layer before you can do that. What would you like to do with the transform?")}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">${_("Cancel")}</button>
                    <button type="button" class="btn btn-light chickenpaint-reject-transform" data-bs-dismiss="modal">${_("Undo transform")}</button>
                    <button type="button" class="btn btn-primary chickenpaint-accept-transform" data-bs-dismiss="modal">${_("Apply transform")}</button>
                </div>
            </div>
        </div>
    `;

    // ボタン要素を取得
    const applyButton = dialog.querySelector(".chickenpaint-accept-transform");
    const rejectButton = dialog.querySelector(".chickenpaint-reject-transform");

    // イベントリスナーを追加
    applyButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPTransformAccept" });
        that.emitEvent("accept");
    });

    rejectButton.addEventListener("click", function (e) {
        controller.actionPerformed({ action: "CPTransformReject" });
        that.emitEvent("reject");
    });

    // Bootstrap 5: Modalコンストラクタを使用してmodalを初期化
    const modal = new bootstrap.Modal(dialog);

    // モーダル表示用のメソッド
    this.show = function () {
        modal.show();
    };

    // モーダルが閉じられた後の処理
    dialog.addEventListener('hidden.bs.modal', (e) => {
        dialog.remove();
    });

    // Enterキーが押されたときの処理
    function keydown_EnterKey(e) {
        if (e.key === "Enter") {
            // Enterキーが押されたら非表示にする
            modal.hide();
            controller.actionPerformed({ action: "CPTransformAccept" }); // 変形確定
            that.emitEvent("accept");
            parent.removeEventListener("keydown", keydown_EnterKey);
        }
    }
    
    parent.addEventListener("keydown", keydown_EnterKey);

    // 親要素にダイアログを追加
    parent.appendChild(dialog);
}

// CPConfirmTransformDialogはEventEmitterを継承
CPConfirmTransformDialog.prototype = Object.create(EventEmitter.prototype);
CPConfirmTransformDialog.prototype.constructor = CPConfirmTransformDialog;

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
import { _ } from "../languages/lang.js";

export default function CPBoxBlurDialog(parent, controller) {
    // ダイアログ要素を作成
    const dialog = document.createElement("div");
    dialog.classList.add("modal", "fade");
    dialog.setAttribute("tabindex", "-1");
    dialog.setAttribute("role", "dialog");
    dialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${_("Box blur")}</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="btn btn-close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label>${_("Blur amount (pixels)")}</label>
                            <input type="number" class="form-control chickenpaint-blur-amount" value="3" min="1">
                        </div>
                        <div class="form-group">
                            <label>${_("Iterations (1-8, larger gives smoother blur)")}</label>
                            <input type="number" class="form-control chickenpaint-blur-iterations" value="1" min="1" max="8">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">${_("Cancel")}</button>
                    <button type="button" class="btn btn-primary chickenpaint-apply-box-blur" data-bs-dismiss="modal">${_("Ok")}</button>
                </div>
            </div>
        </div>
    `;

    const blurAmountElem = dialog.querySelector(".chickenpaint-blur-amount");
    const blurIterationsElem = dialog.querySelector(".chickenpaint-blur-iterations");
    const applyButton = dialog.querySelector(".chickenpaint-apply-box-blur");

    // Bootstrap 5: Modalコンストラクタを使用してmodalを初期化
    const modal = new bootstrap.Modal(dialog);

    // モーダル表示用のメソッド
    this.show = function () {
        // ハンバガーメニューとモーダルの二重表示防止
        const collapseElement = document.getElementById("chickenpaint-main-menu-content");
        if (collapseElement && collapseElement.classList.contains("show")) {
            const bsCollapse = new bootstrap.Collapse(collapseElement, {
                toggle: false, // すでに閉じている場合のエラーを防ぐ
            });
            bsCollapse.hide();
        }
        // モーダルを表示
        modal.show();
    };

    // モーダル内でOKボタンがクリックされた時の処理
    applyButton.addEventListener("click", (e) => {
        let blur = Math.max(parseInt(blurAmountElem.value, 10), 1),
            iterations = Math.min(Math.max(parseInt(blurIterationsElem.value, 10), 1), 8);

        controller.getArtwork().boxBlur(blur, blur, iterations);
        modal.hide(); // モーダルを閉じる
    });

    // モーダルが閉じられた後の処理
    dialog.addEventListener("hidden.bs.modal", () => {
        document.activeElement.blur(); // フォーカスを外す
        dialog.remove(); // ダイアログを削除
    });

    // モーダルが表示された時の処理
    dialog.addEventListener("shown.bs.modal", () => {
        blurAmountElem.focus(); // フォーカスを入力欄に当てる
    });

    // エンターキーが押されたときの処理
    dialog.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && dialog.classList.contains("show")) {
            applyButton.click(); // OKボタンをクリック
            e.preventDefault(); // デフォルトのフォーム送信を阻止
        }
    });

    // 親要素にダイアログを追加
    parent.appendChild(dialog);
}

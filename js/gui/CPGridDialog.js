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

export default function CPGridDialog(parent, canvas) {
    // ダイアログ要素を作成
    const dialog = document.createElement("div");
    dialog.classList.add("modal", "fade");
    dialog.setAttribute("tabindex", "-1");
    dialog.setAttribute("role", "dialog");
    dialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${_("Grid options")}</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label>${_("Grid size")}</label>
                            <input type="number" class="form-control chickenpaint-grid-size" value="" min="3">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">${_(
                        "Cancel"
                    )}</button>
                    <button type="button" class="btn btn-primary chickenpaint-apply-grid-settings" data-bs-dismiss="modal">${_(
                        "Ok"
                    )}</button>
                </div>
            </div>
        </div>
    `;

    const gridSizeElem = dialog.querySelector(".chickenpaint-grid-size");
    const applyButton = dialog.querySelector(
        ".chickenpaint-apply-grid-settings"
    );

    // Bootstrap 5: Modalコンストラクタを使用してモーダルを初期化
    const modal = new bootstrap.Modal(dialog);

    this.show = function () {
        // ハンバガーメニューとモーダルの二重表示防止
        const collapseElement = document.getElementById(
            "chickenpaint-main-menu-content"
        );
        if (collapseElement && collapseElement.classList.contains("show")) {
            const bsCollapse = new bootstrap.Collapse(collapseElement, {
                toggle: false,
            });
            bsCollapse.hide();
        }
        // モーダルを表示
        modal.show();
    };

    // グリッドサイズの初期値を設定
    gridSizeElem.value = canvas.getGridSize();

    // モーダルが閉じられた後にダイアログを削除
    dialog.addEventListener("hidden.bs.modal", () => {
        dialog.remove();
    });

    // 「OK」ボタンのクリックイベント
    applyButton.addEventListener("click", () => {
        const gridSize = parseInt(gridSizeElem.value, 10);
        canvas.setGridSize(gridSize);
        canvas.modalIsShown(false);
        modal.hide(); // モーダルを手動で閉じる
    });

    // モーダルが表示されたときに、グリッドサイズの入力フィールドにフォーカス
    dialog.addEventListener("shown.bs.modal", () => {
        canvas.modalIsShown(true);
        gridSizeElem.focus();
    });

    // Enterキーが押されたときの処理
    dialog.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // フォーム送信を防ぐ
            applyButton.click(); // OKボタンをクリックしたことにする
        }
    });

    // 親要素にダイアログを追加
    parent.appendChild(dialog);
}

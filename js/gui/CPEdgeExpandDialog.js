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

export default function CPEdge(parent, controller) {
    // ダイアログ要素を作成
    const dialog = document.createElement("div");
    dialog.classList.add("modal", "fade");
    dialog.setAttribute("tabindex", "-1");
    dialog.setAttribute("role", "dialog");
    dialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${_("Edge expand")}</h5>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label>${_("Edge expand width")} (1px ~ 128px)</label>
                            <input type="number" class="form-control chickenpaint-aberration-edgeWidth" value="" min="1", max="128">
                        </div>
                    </form>
                    <div class="form-check mt-3">
                    <input class="form-check-input" type="checkbox" id="replaceWithInnerFill">
                    <label class="form-check-label" for="replaceWithInnerFill">
                    ${_("Fill Inside with edge color")}
                    </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">${_(
                        "Cancel",
                    )}</button>
                    <button type="button" class="btn btn-primary chickenpaint-apply-aberration-settings" data-bs-dismiss="modal">${_(
                        "Ok",
                    )}</button>
                </div>
            </div>
        </div>
    `;

    const edgeWidthElem = dialog.querySelector(
        ".chickenpaint-aberration-edgeWidth",
    );
    const applyButton = dialog.querySelector(
        ".chickenpaint-apply-aberration-settings",
    );

    // Bootstrap 5: Modalコンストラクタを使用してモーダルを初期化
    const modal = new bootstrap.Modal(dialog);

    this.show = function () {
        // ハンバガーメニューとモーダルの二重表示防止
        const collapseElement = document.getElementById(
            "chickenpaint-main-menu-content",
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

    // 縁取り幅のデフォルト値を設定
    edgeWidthElem.value = 5;

    // モーダルが閉じられた後にダイアログを削除
    dialog.addEventListener("hidden.bs.modal", () => {
        dialog.remove();
    });

    // 「OK」ボタンのクリックイベント
    applyButton?.addEventListener("click", () => {
        const edgeWidth = Math.max(
            1,
            Math.min(128, parseInt(edgeWidthElem?.value, 10) || 0),
        );

        const replaceWithInnerFill = dialog.querySelector(
            "#replaceWithInnerFill",
        )?.checked;
        controller.getArtwork().edge(edgeWidth, replaceWithInnerFill);
        controller.setModalShown(false);

        modal.hide(); // モーダルを手動で閉じる
    });

    // モーダルが表示されたときに、入力フィールドにフォーカス
    dialog.addEventListener("shown.bs.modal", () => {
        controller.setModalShown(true);
        edgeWidthElem?.focus();
    });

    // Enterキーが押されたときの処理
    dialog.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // フォーム送信を防ぐ
            applyButton?.click(); // OKボタンをクリックしたことにする
        }
    });

    // 親要素にダイアログを追加
    parent.appendChild(dialog);
}

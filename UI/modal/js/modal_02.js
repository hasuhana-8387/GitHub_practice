'use strict';

/* modal 02 */
/* 中央にふわっと表示されるパターン */

/* Reference study site */

/* Web制作マガジン by GEOCODE */
/* URL: https://www.hp-maker.net/magazine/modal/ */

/* 詳細な挙動や課題や修正点などについて ここに記載する

   一部 参照元コードを修正
     var -> const
     getElementById, getElementsByClassName -> querySelector
*/



{
  const modal = document.querySelector('.modal_02>.implement_container #demo-modal');
  const btn = document.querySelector('.modal_02>.implement_container #open-modal');
  const close = document.querySelector('.modal_02>.implement_container .close');

  // When the user clicks the button, open the modal.
  btn.onclick = function () {
    modal.style.display = 'block';
  };

  // When the user clicks on 'X', close the modal
  close.onclick = function () {
    modal.style.display = 'none';
  };

  // When the user clicks outside the modal -- close it.
  window.onclick = function (event) {
    if (event.target == modal) {
      // Which means he clicked somewhere in the modal (background area), but not target = modal-content
      modal.style.display = 'none';
    }
  };
}
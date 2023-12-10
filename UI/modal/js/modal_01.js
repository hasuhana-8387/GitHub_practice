'use strict';

/* modal 01 */
/* 上から降りてくるパターン */

/* Reference study site */
/* ドットインストール - JavaScriptでモーダルウィンドウを作ろう */
/* URL: https://dotinstall.com/lessons/modal_js_v3 */

/* 詳細な挙動や課題について ここに記載する */



{
  const open = document.querySelector('.modal_01>.implement_container .open');
  const close = document.querySelector('.modal_01>.implement_container .close');
  const modal = document.querySelector('.modal_01>.implement_container .modal');
  const mask = document.querySelector('.modal_01>.implement_container .mask');

  open.addEventListener('click', () => {
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
  });

  close.addEventListener('click', () => {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });

  mask.addEventListener('click', () => {
    // modal.classList.add('hidden');
    // mask.classList.add('hidden');
    close.click(); // close の click イベントリスナーのときと同じ処理を行う。
  });
}
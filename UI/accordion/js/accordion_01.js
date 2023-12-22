'use strict';

/* accordion 01 */
/* アコーディオンUI オーソドックス */

/* Reference study site */
/* JavaScriptでアコーディオンを作ろう */
/* URL: https://dotinstall.com/lessons/accordion_js */

/* 詳細な挙動や課題について ここに記載する */



{
  const dts = document.querySelectorAll('.accordion_01>.implement_container dt');

  dts.forEach(dt => {
    dt.addEventListener('click', () => {
      dt.parentNode.classList.toggle('appear');

      dts.forEach(el => {
        if (dt !== el) {
          el.parentNode.classList.remove('appear');
        }
      });
    });
  });
}
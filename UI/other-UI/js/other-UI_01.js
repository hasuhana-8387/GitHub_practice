'use strict';

/* other-UI 01 */
/* ローディングアイコン */

/* Reference study site */

/* CSS入門 アニメーション編 */
/* URL: https:// */

/* 詳細な挙動や課題について ここに記載する */



{
  const loading = document.querySelector('.loading');
  loading.addEventListener('click', () => {
    loading.classList.toggle('loadingAnimation');
  });
}
'use strict';

/* other-UI 01 */
/* ローディングアイコン */

/* Reference study site */

/* CSS入門 アニメーション編 */
/* URL: https://dotinstall.com/lessons/basic_css_animation_v3 */

/* CSSだけで実装できる、シンプルなローディングアニメーションを5つ作ってみた */
/* URL: https://kuzlog.com/2017/02/08/1009/ */

/* 詳細な挙動や課題について ここに記載する */

/* クリックで再生・停止が行えるように修正を加える。 */



{
  const loading1_animations = [
    'loading1_1_animation',
    'loading1_2_animation',
    'loading1_3_animation',
    'loading1_4_animation',
    'loading1_5_animation',
    'loading1_6_animation',
    'loading1_7_animation',
    'loading1_8_animation'
  ];

  const loading1_Wrap = document.querySelector('.loading1-Wrap');
  const loading1_dots = document.querySelectorAll('.loading1-Wrap>div');

  loading1_Wrap.addEventListener('click', () => {
    loading1_dots.forEach((dot, index) => {
      dot.classList.toggle(loading1_animations[index]);
    });
  });



  const loading2 = document.querySelector('.loading2');
  loading2.addEventListener('click', () => {
    loading2.classList.toggle('loading2_animation');
  });



  const loading3_animations = [
    'loading3_1_animation',
    'loading3_2_animation',
    'loading3_3_animation',
    'loading3_4_animation',
    'loading3_5_animation',
  ];

  const loading3_Wrap = document.querySelector('.loading3-Wrap');
  const loading3_dots = document.querySelectorAll('.loading3-Wrap>div');

  loading3_Wrap.addEventListener('click', () => {
    loading3_dots.forEach((dot, index) => {
      dot.classList.toggle(loading3_animations[index]);
    });
  });
}
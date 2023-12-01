'use strict';

{
  // Reference study site
  // ページトップへ戻るボタンの作り方【JavaScript】
  // URL: https://sinpe-pgm.com/pagetop-button-js/

  // スムーススクロール

  // IE、Safari対応
  // smoothscroll.js読み込み
  // https://github.com/iamdustan/smoothscroll

  // セレクタ名（.pagetop）に一致する要素を取得
  const pagetop_btn = document.querySelector(".pagetop");

  // .pagetopをクリックしたら
  // pagetop_btn.addEventListener("click", scroll_top);
  pagetop_btn.addEventListener("click", (e) => {
    e.preventDefault();
    scroll_top();
  });

  // ページ上部へスムーズに移動
  function scroll_top() {
    window.scroll({ top: 0, behavior: "smooth" });
  }

  // スクロールされたら表示
  window.addEventListener("scroll", scroll_event);
  function scroll_event() {
    if (window.scrollY > 100) {
      pagetop_btn.style.opacity = "1";
      pagetop_btn.style.pointerEvents = "auto";
    } else if (window.scrollY < 100) {
      pagetop_btn.style.opacity = "0";
      pagetop_btn.style.pointerEvents = "none";
    }
  }
}
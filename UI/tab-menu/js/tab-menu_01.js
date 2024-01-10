'use strict';

/* tab-menu 01 */
/* タブメニュー オーソドックス */

/* Reference study site */

/* JavaScriptでタブメニューを作ろう */
/* URL: https://dotinstall.com/lessons/tabmenu_js_v3 */

/* 詳細な挙動や課題について ここに記載する */



{
  const menuItems = document.querySelectorAll('.tab-menu_01>.implement_container .menu li a');
  const contents = document.querySelectorAll('.tab-menu_01>.implement_container .content');

  menuItems.forEach(clickedItem => {
    clickedItem.addEventListener('click', e => {
      e.preventDefault(); // ページ遷移防止

      menuItems.forEach(item => { // .menu li a 共通設定
        // clickedItem と item は同じ値（ .menu li a タグの内容）を取得する仮引数だけど、
        // clickedItem はクリックした箇所のみに適用するという役割、
        // item は .menu li a 全体に適用するという役割で違いがあるため、
        // 混同を避けるため名称を分けている。
        // 慣れてきたら同じ名称（item）でプログラミングしたほうよい。

        item.classList.remove('active');
        // 該当箇所をクリックしたら一度すべての.menu li a の .active をリセットする。
      });

      clickedItem.classList.add('active'); // クリックした箇所のみ .active をセットする。

      contents.forEach(content => {
        content.classList.remove('active');
        // すべての.content (<section></section) の .active をリセットする。
      });

      document.getElementById(clickedItem.dataset.id).classList.add('active');
      // clickedItem にはクリックされたメニュー項目が入っていますから

      // clickedItem.dataset.id
      // によってクリックされたメニュー項目の data-id の値が取得できます。

      // たとえばこれがクリックされた場合

      // <a href="#" data-id="service">サービス内容</a>
      // clickedItem.dataset.id は service を返します。

      // ということはこの部分は

      // document.getElementById(clickedItem.dataset.id)
      // 上記のメニュー項目がクリックされたときにはこれと同じ動きになります。

      // document.getElementById('service')
      // これによって service という値の ID をもつこの要素が取得されるという流れです。
    });
  });
}
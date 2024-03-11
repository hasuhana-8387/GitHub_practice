'use strict';

/* Carousel 02 */
/* カルーセル オリジナル */

/* Reference study site */

/* JavaScriptでカルーセルを作ろう */
/* URL: https://dotinstall.com/lessons/carousel_js */

/* 詳細な挙動や課題や修正点などについて ここに記載する

   課題
   プログラムに非効率なコードが含まれてるため、あとで全体を整理する。
   そもそもバッティング対策関数を用意する必要があるのだろうか？
*/



{
  // メインイメージの要素取得
  const mainImageContainer = document.querySelector('.carousel_02 .main-image_container>ul');

  // メインイメージのマウスカーソルイベント

  // メインイメージ上にマウスカーソルが乗っている
  // 自動再生がストップ状態 = play-pause ボタンが Play と表示されてる状態 => アーリーリターン
  // 自動再生が再生状態 = play-pause ボタンが Pause と表示されてる状態 => タイマーをクリア
  mainImageContainer.addEventListener('mouseover', () => {
    if (isPlaying === false) {
      return;
    }
    clearTimeout(timeoutId);
  });

  // メインイメージ上からマウスカーソルが離れる
  // 自動再生がストップ状態 = play-pause ボタンが Play と表示されてる状態 => アーリーリターン
  // 自動再生が再生状態 = play-pause ボタンが Pause と表示されてる状態 => タイマーを再開
  mainImageContainer.addEventListener('mouseleave', () => {
    if (isPlaying === false) {
      return;
    }
    playSlideshow();
  });



  // メインイメージのソース情報を管理するための配列
  const mainImagesSrc = [
    'img/pic1.jpg',
    'img/pic2.jpg',
    'img/pic3.jpg',
    'img/pic4.jpg',
    'img/pic5.jpg',
    'img/pic6.jpg',
    'img/pic7.jpg',
    'img/pic8.jpg',
  ];

  // すべての リストメインイメージ <li><img src="img/pic1.png"></li> を格納・操作するための配列
  const mainImagesElement = [];

  // すべての ドットボタン <button></button> を格納・操作するための配列
  const dots = [];

  // どの画像が選択されてるのか、選択状態を管理するための変数
  let currentIndex = 0;



  // 読み込み時に リストメインイメージ <li><img src="img/pic1.png"></li> を配列に格納・コード生成
  function setupMainImagesElement() {
    for (let i = 0; i < mainImagesSrc.length; i++) {
      const li = document.createElement('li');
      li.classList.add('hidden');

      const img = document.createElement('img');
      img.src = mainImagesSrc[i];

      li.appendChild(img);
      mainImagesElement.push(li);
      mainImageContainer.appendChild(mainImagesElement[i]);
    }

    mainImagesElement[currentIndex].classList.remove('hidden');
  }



  // クリックしたドットボタンに対応した画像を表示する
  function showCurrentMainImage() {
    for (let i = 0; i < mainImagesSrc.length; i++) {
      mainImagesElement[i].classList.add('hidden');
    }

    mainImagesElement[currentIndex].classList.remove('hidden');
  }



  // 読み込み時に ドットボタン <button></button> を配列に格納・コード生成
  function setupDots() {
    for (let i = 0; i < mainImagesSrc.length; i++) {
      const dot = document.createElement('button');

      dot.addEventListener('click', () => {
        currentIndex = i;
        updateDots();
        showCurrentMainImage();
      });

      dots.push(dot);
      document.querySelector('.carousel_02 .control>.dots').appendChild(dot);
    }

    dots[currentIndex].classList.add('current');
  }



  // クリックしたドットボタンを選択状態にする
  function updateDots() {
    dots.forEach(dot => {
      dot.classList.remove('current');
    });
    dots[currentIndex].classList.add('current');
  }



  // next ボタンの挙動を設定
  const next = document.querySelector('.carousel_02 .next');

  next.addEventListener('click', () => {
    let target = getNextImageNumber();
    preventButtingImageChange(target);
  });



  // prev ボタンの挙動を設定
  const prev = document.querySelector('.carousel_02 .prev');

  prev.addEventListener('click', () => {
    let target = currentIndex - 1;
    if (target < 0) {
      target = mainImagesSrc.length - 1;
    }
    preventButtingImageChange(target);
  });



  // 次のメインイメージ画像の番号を取得する
  function getNextImageNumber() {
    let target = currentIndex + 1;
    if (target === mainImagesSrc.length) {
      target = 0;
    }
    return target;
  }



  // 自動再生による画像切り替わりと next, prev ボタンによる画像切り替わりのバッティング防止対策
  function preventButtingImageChange(target) {
    // 自動再生オフならクリックイベントのみ実行
    if (isPlaying === false) {
      document.querySelectorAll('.carousel_02 .dots > button')[target].click();
      return;
      // 生成された<button></button>タグにはクリックイベントが組み込まれてるため、
      // click()でクリックイベントを呼び出すことができる。
    }

    // 自動再生オンなら

    // 一度自動再生のタイマーを停止・初期化
    // ナビゲーションのクリックイベントを実行
    // 自動再生開始
    clearTimeout(timeoutId);
    playSlideshow();
    document.querySelectorAll('.carousel_02 .dots > button')[target].click();
  }



  // メインイメージのスライドショーを設定
  let timeoutId;

  function playSlideshow() {
    timeoutId = setTimeout(() => {
      // next.click();

      let target = getNextImageNumber();
      document.querySelectorAll('.carousel_02 .dots > button')[target].click();

      playSlideshow();
    }, 3000);
  }



  // play-pause ボタンの挙動を設定
  let isPlaying = true;

  const play = document.querySelector('.carousel_02 .play-pause>.play');

  play.addEventListener('click', () => {
    if (isPlaying === false) {
      playSlideshow();
      play.textContent = 'Pause';
    } else {
      clearTimeout(timeoutId);
      play.textContent = 'Play';
    }
    isPlaying = !isPlaying;
  });



  setupMainImagesElement();
  setupDots();
  playSlideshow();
}
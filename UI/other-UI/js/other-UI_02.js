'use strict';

/* other-UI 02 */
/* プログレスバー */

/* Reference study site */

/* コピペで簡単！CSSとJavaScriptで作られた動くオシャレで綺麗なローディング画面アニメーション10選！【ロード画面/画像を使わない】 - WebDesignFacts - */
/* URL: https://webdesignfacts.net/entry/page-loader/#gsc.tab=0 */

/* 詳細な挙動や課題について ここに記載する */

/* 元コードの jQuery を JavaScript へ修正する。 */

/* 元コードの setInterval を setTimeout へ修正すると動作がどうなるか検証する。
   動作の違いは感じないため、どちらの処理のほうが望ましいのか分からない。
   何となく setTimeout のほうが処理の負荷が少なく安定する印象があるため、 setTimeout を採用してみる。 */

/* また、 WebDesignFacts 様は setInterval の処理を 80ms 、
   CSS の transition を 100ms に設定しているけど、
   どうして差を開いておく必要があるのか分からない。

   試しに CSS の transition を 80ms に設定すると、さほど挙動に差異は見られない。
   どちらかというと、 100ms のほうが何となく滑らかな感じがするため、 WebDesignFacts 様のスタンスを継承する。

   ちなみに ここで極端な値として、 10ms に設定すると、プログレスバーがいっぱいになる前に数字が100%になり、
   その後、急速にプログレスバーがいっぱいになってしまい不自然な挙動になる。 */



{
  let bar = document.querySelector('#progress_bar');
  let percentage = parseInt(document.querySelector('#progress_percentage').textContent);

  // setTimeout で処理

  function stopProgress() {
    clearTimeout(timeoutId);
  }

  let timeoutId;

  function showClock() {
    timeoutId = setTimeout(() => {
      percentage++;
      if (percentage <= 100) {
        document.querySelector('#progress_percentage').textContent = percentage + '%';
        if (percentage > 10) {
          bar.style.width = percentage + '%';
        }
        showClock();
      }
      else {
        stopProgress()
      }
    }, 80);
  }

  showClock();



  // setInterval で処理

  // function stopProgress() {
  //   clearTimeout(progress);
  // }

  // let progress = setTimeout(() => {
  //   percentage++;
  //   if (percentage <= 100) {
  //     document.querySelector('#progress_percentage').textContent = percentage + '%';
  //     if (percentage > 10) {
  //       bar.style.width = percentage + '%';
  //     }
  //   }
  //   else {
  //     stopProgress()
  //   }
  // }, 80);
}
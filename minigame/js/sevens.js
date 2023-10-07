'use strict';
(() => {

  // Class
  // Load Class 読み込み時にのみ実行するクラス
  // Restart Class 読み込み時からゲーム開始までと、ゲームセット後の初期化を実行するクラス
  // Message Class すべてのプレイヤーのセリフ全般を管理するクラス
  // Sevens Class ゲーム開始後からゲームセットまでのゲーム（七並べ）全体の進行を管理するクラス


  // 問題点など

  // 開発するときには最初から SASS を使って開発すべきだった……。
  // そのほうが拡張性・保守性の高いコードが生成できたはず……。

  //  1920 × 1200 から 1920 × 1080 に変更するのは大変だった。
  // どうすれば効率的に画面解像度の修正ができるか課題が残る。



  // thinking

  // サブプレイヤーの思考方法
  // 七並べは出せるカードがあってもあえてパスすることができるけど、どうするべきか？
  // ５ ６ や ８ ９など低い数値のカードを所持してること
  // 同じ絵柄でほかに数字の少ないまたは大きいカードを所持していないこと
  // パス３回を超過しないこと
  // ほかに出せるカードがないこと
  // ……といった条件をそろえてはじめて、あえてパスするといった戦略が取れる。
  // 戦略を取るとしても、実行は１回だけにしておく？



  // 読み込み時からの settimeout の流れ

  // スタートボタンを表示
  // スタートボタンをクリック
  // 内部情報を生成
  // およそ３秒かけて、ストックアニメーションを実行
  // ＋２秒後、テーブルと手札を描画
  // ＋３秒後、手札の状況（有利 不利 普通）に応じたメッセージを表示する
  // ＋３秒後、ゲーム開始ボタンを表示する

  // ゲーム開始ボタンをクリック後、３枚の７のカードを出す
  // ＋５秒後、ダイヤの７のカードを出す
  // ＋５秒後、ゲーム開始

  // ※ここからは分岐によって異なる

  // サブプレイヤーのターンになったら、 => （ this.subPlayerTurn() が実行されたら）

  // サブプレイヤーがカードを出す場合、
  // ターンになってから５秒後に
  // メッセージとカードを出すアニメーションを実行（ this.subPlayerTurn() 参照）
  // （ちなみにカードを出すアニメーション完了に１秒かかる。）
  // カードを出して上がったら、アニメーション実行から１秒後にメッセージを表示（ playingCard(li, e) 参照）
  // アニメーション実行から３秒後に次のターンへ（ renderPlayerHand(id, index) 参照）

  // サブプレイヤーがパスする場合、
  // ターンになってからすぐにパスボタンを表示（ this.gameFlow() 参照）
  // ３秒後にパスをするメッセージを表示（ this.createPassbtn() 参照）
  // ３秒後に次のターンへ（ this.createPassbtn() 参照）

  // サブプレイヤーがあえてパスする場合、
  // ターンになってから３秒後にパスボタンを表示（ this.subPlayerTurn() 参照）
  // パスボタン表示と同時にメッセージを表示
  // その後、さらに３秒後に次のターンへ（ this.createPassbtn() 参照）


  // パス超過する場合、（ this.createPassbtn() 参照）
  // サブプレイヤーがパスする場合、
  // ターンになってからすぐにパスボタンを表示（ this.gameFlow() 参照）
  // ３秒後にパス超過をするメッセージを表示（ this.createPassbtn() 参照）
  // さらに３秒後にパス超過アニメーションを実行（ this.createPassbtn() 参照）
  // パス超過アニメーション完了まで２秒かかる
  // パス超過アニメーション完了から３秒後に this.nextTurn() を実行


  // ３人の手札が０枚、残りのプレイヤーが一人の場合（ this.gameFlow() 参照）
  // ターンになってから３秒後に this.playingRestCardAnimation(xPos, yPos) を実行
  // 残りのカードをすべて出すアニメーション完了まで２秒かかる
  // アニメーション完了から３秒後に this.gameFlow() => this.gameSet() を実行

  // 全員の手札が０枚の場合ゲームセット（ this.gameSet() ）を実行



  // パス超過に関するルールの追加 実装済み！

  // 出せるカードがない場合はパスする。
  // pass++ する。
  // pass が３回を超えたらゲームを離脱する。
  // passOverRank = 4; などの変数を用意して、順位を割り当て後、 passOverRank-- する。
  // そして手札のカードをすべて場に出す。
  // その際に最小値 最大値の判断に支障を来さないように、プロパティを付加したり、条件を適切に設定する。



  // アニメーション 実装済み！

  // ストックアニメーション

  // ストックから各プレイヤーの手札にカードが１枚ずつ配られる表現を演出
  // ストックの位置はテーブル中央
  // カードはプレイヤー０ ２は裏のカードが移動する。
  // プレイヤー１ ３は横向きの裏のカードが移動する。
  // プレイヤー０１２３の順にカードがテーブル中央から手札の所定の位置へ高速に移動する。

  // ゲーム開始時、手札から７のカードが場の所定の位置までスーッと移動する演出。

  // まずダイヤの７以外の３枚の７のカードを場にアニメーションで出す。
  // その後、ダイヤの７のカードの所持者が簡単にスタートのセリフを表示（ここから時計回りでスタートする）
  // そして、ダイヤの７のカードを所持者から場にアニメーションで出す。

  // 手札からカードを選択してアニメーションでテーブルに出す



  // メッセージ 実装済み！

  // セリフを簡単に表示する
  // セリフの表示・非表示を切り替えられるボタンを作成

  // スタートする前に手札の状況に応じたセリフを表示
  //   いい感じ！　普通。　きついな……。　など
  // スタートする前にダイヤの７を所持しているプレイヤーが開始のセリフを表示
  //   私のターンから時計回りに開始！　など
  // ターンになったら悩む様子のセリフを表示
  //   う～ん・・・。　どれにしようか・・・。　など
  // カードを出したら またはパスしたらセリフを表示
  //   これを出す！　これにするか。　パス……。　あえてパス……。　など
  // ゲームセットになったときに順位に応じてセリフを表示
  //   よし！１位！　２位だ！　３位か～。　４位……。　など



  // ボタン配置関係 実装済み！

  // 読み込み時に「メッセージオンオフ切り替え」「ルール説明」ボタンを表示
  // 読み込み時に「START」「難易度変更」「パス超過回数設定」ボタンを表示
  // 「START」クリック後、「ゲーム開始」「もう一度シャッフルする」「難易度を指定し直す」ボタンを表示
  // ゲームセット後、「最初に戻る」ボタンを表示
  // ゲーム中は各プレイヤー手札の状況に応じて「PASS」「PASS無効」「PASS超過」ボタンを表示



  // 難易度に関するコード 実装済み！
  // カード配布時、有利なカード・普通のカード・不利なカードの比率調整



  // 設定関係 実装済み！

  // 初期設定 ゲーム開始前に条件を指定できるようにする。
  // パス超過のルールの有無、パス超過の回数指定、難易度の設定
  // などを指定できるようにする。



  // ルール説明 実装済み！
  // モーダルウインドウで上から下へ移動するように表示
  // ルール説明領域を表示中は他の領域はクリックできないようにする。



  // バグの解消や細かい挙動の調整 調整済み

  // メインプレイヤーがカードを出したら、
  // カードがテーブルまで移動するアニメーションが完了して次のターンへ進むまで、
  // パスボタンがクリックできるようになってしまってるため、対処が必要。
  // 手札のカードもクリックできるようになってしまってるため、対処が必要。
  // メインプレイヤーがパスボタンをクリックしたら即座にセリフを表示したほうがよい。

  // サブプレイヤーが３人とも離脱後、メインプレイヤーが残りのカードをすべて出すとき、
  // クリックできてしまうのを防止する必要がある。

  // メインプレイヤーがパス超過時、アニメーション完了前にカードをクリックできてしまうため、
  // 対策を講じる必要がある。

  // カードを出したら、手札のカードを即座に１枚減らさないとよく見ると不自然



  // 読み込み時にのみ実行するクラス
  class Load {
    constructor() {
      this.page = 1;
      this.pageMax = 3;
      this.textBox = document.querySelector('#ruleBox>dl');
      this.createMessagebtn();
      this.createRulebtn();
      this.createRuleBox();
    }

    // ロード時、メッセージオンオフ切り替えボタンを表示
    createMessagebtn() {
      const messagebtn = document.querySelector('.messagebtn');
      let messagebtnClicked = false;

      messagebtn.innerHTML = 'メッセージ<br>O N';

      messagebtn.addEventListener('click', () => {

        const player00_text = document.querySelector('.player00_text');
        const player01_text = document.querySelector('.player01_text');
        const player02_text = document.querySelector('.player02_text');
        const player03_text = document.querySelector('.player03_text');

        player00_text.classList.toggle('messege_on_off');
        player01_text.classList.toggle('messege_on_off');
        player02_text.classList.toggle('messege_on_off');
        player03_text.classList.toggle('messege_on_off');

        if (!messagebtnClicked) {
          messagebtnClicked = true;
          messagebtn.innerHTML = 'メッセージ<br>OFF';
        } else {
          messagebtnClicked = false;
          messagebtn.innerHTML = 'メッセージ<br>O N';
        }
      });
    }



    // ロード時、ルール説明ボタンを表示
    createRulebtn() {
      const ruleBox = document.getElementById('ruleBox');
      const mask = document.getElementById('mask');
      let rulebtnClicked = false;

      const rulebtn = document.querySelector('.rulebtn');
      rulebtn.innerHTML = 'ルール 説明';

      rulebtn.addEventListener('click', () => {
        ruleBox.classList.remove('hidden');
        mask.classList.remove('hidden');

        if (!rulebtnClicked) {
          while (this.textBox.firstChild) {
            this.textBox.firstChild.remove();
          }
          this.createRuleText();
          rulebtnClicked = true;
        } else {
          return;
        }
      });
    }



    // ルール説明領域を生成
    createRuleBox() {
      this.createRuleText();

      const pagePrev = document.getElementById('pagePrev');
      pagePrev.addEventListener('click', () => {
        if (this.page === 1) {
          return;
        } else {
          while (this.textBox.firstChild) {
            this.textBox.firstChild.remove();
          }
          this.page--;
          this.createRuleText();
        }
      });

      const pageNext = document.getElementById('pageNext');
      pageNext.addEventListener('click', () => {
        if (this.page === this.pageMax) {
          return;
        } else {
          while (this.textBox.firstChild) {
            this.textBox.firstChild.remove();
          }
          this.page++;
          this.createRuleText();
        }
      });

      // ページ数の生成
      const pageCurrent = document.getElementById('pageCurrent');
      pageCurrent.textContent = `${this.page} / ${this.pageMax}`;

      const close = document.getElementById('close');
      close.addEventListener('click', () => {
        ruleBox.classList.add('hidden');
        mask.classList.add('hidden');
      });
    }



    // ルール説明領域を生成
    createRuleText() {

      const titleText = [];
      const sentenceText = [];

      // 詳細な説明文

      // １ページ目
      if (this.page === 1) {
        titleText.push(`始め方について`);

        sentenceText.push(
          `「設定」欄からお好みの設定ボタンをクリックする。（こだわりがなければ そのままで OK。）<br>
       「START」ボタンをクリックすると、すべてのプレイヤーに均等にカードが配られる。<br><br>

       「シャッフルし直す」ボタンでカードを配り直す。<br>
       「最初に戻る」ボタンで最初の画面に戻る。<br>
       「ゲーム開始！」ボタンでゲームが始まる。<br><br>

       ゲーム開始後、まずは手札の中に「７」のカードがあったら、テーブルに並べる。<br>
       「ダイヤの７」を出したプレイヤーから時計回りにスタート！<br><br>`
        );

        titleText.push(`出せるカードについて`);

        sentenceText.push(
          `絵柄別にテーブルに出されてるカードの「最小の番号」または「最大の番号」、<br>
       これらと隣り合う番号で、絵柄が一致しているカードを出すことができる。<br>
       最初は「７」と隣り合う番号「６」または「８」のカードを出すことができる。<br>
       手札のカードをすべて出したら上がり。<br><br>

       （次のページに続く）`
        );
      }

      // ２ページ目
      else if (this.page === 2) {
        titleText.push(`「パス」について`);

        sentenceText.push(
          `出せるカードがない場合は「パス」して、次のプレイヤーのターンになる。<br>
       出せるカードがあっても「あえてパス」することもできる。<br>
       ただし、「パス」は３回まで！（※パスできる回数は設定から変更可能。）<br><br>`
        );

        titleText.push(`「パス超過」について`);

        sentenceText.push(
          `パスの回数が３回を超えたら、手札のカードをすべてテーブルに出して、ゲームを離脱する。<br>
       パス超過で出したカードは出せるカードの「最小の番号」または「最大の番号」に影響を与えない。<br><br>

       たとえば、テーブルにスペードの「６」「７」「８」のカードが出ているときに、<br>
       パス超過で手札のカードにあったスペードの「２」を出した場合、<br>
       スペードのカードの最小の番号は「６」、最大の番号は「８」のままであり、<br>
       出せるカードは隣り合う番号、スペードの「５」または「９」となる。<br>
       スペードの「２」と隣り合う番号、スペードの「１」や「３」は出せない。<br><br>

       （次のページに続く）`
        );
      }

      // ３ページ目
      else if (this.page === 3) {
        titleText.push(`自分のターンになったとき`);

        sentenceText.push(
          `自分のターンになったときに「PASS」ボタンと「全員の手札を表にする」ボタンが表示される。<br>
      出せるカードは どのカードが出せるのか判別しやすくするため、ほかのカードより少し上に表示される。<br><br>

      出せるカードをクリックするとカードをテーブルに出すことができる。<br>
      「PASS」ボタンをクリックすると、そのターンをパスすることができる。<br><br>

      「全員の手札を表にする」ボタンから、すべてのプレイヤーの手札を表にしたり裏にしたりできる。<br>
      難易度を「難しい」にした場合の攻略などが主な活用例。<br>
      使う、使わないはプレイヤーの自由。<br><br>`
        );

        titleText.push(`プレイヤー情報と設定変更について`);

        sentenceText.push(
          `左上にすべてのプレイヤーの情報（残り枚数・パス回数・順位）が表示される。<br>
       左下の「メッセージ」ボタンから、プレイヤーのセリフの表示・非表示を切り替えることができる。<br><br>

       「難易度 設定」ボタンから、難易度を変更することができる。<br>
       「パス超過回数」ボタンから、パス超過回数を変更したり、<br>
       「パス超過 無効」ボタンで、無限にパスできるように変更することができる。`
        );
      }


      // ルール説明ページ 生成
      for (let i = 0; i < titleText.length; i++) {
        this.insertRuleTitle(titleText[i]);
        this.insertRuleSentence(sentenceText[i]);
      }

      // 現在ページ数の更新
      const pageCurrent = document.getElementById('pageCurrent');
      pageCurrent.textContent = `${this.page} / ${this.pageMax}`;
    }


    // ルール タイトル文 生成
    insertRuleTitle(titleText) {
      const title = document.createElement('dt');
      title.innerHTML = titleText;

      this.textBox.appendChild(title);
    }


    // ルール 説明文 生成
    insertRuleSentence(sentenceText) {
      const sentence = document.createElement('dd');
      sentence.innerHTML = sentenceText;

      this.textBox.appendChild(sentence);
    }
  }



  // 読み込み時からゲーム開始までと、ゲームセット後の初期化を実行するクラス
  class Restart {
    constructor() {

      if (difficulty) {
        this.difficulty = difficulty;
      }

      if (passOverCount) {
        this.passOverCount = passOverCount;
      }

      this.table = document.getElementById('table');

      this.createStartbtn();
      this.createDifficultyBox();
      this.createPassOverCountBox();
      this.createLoadStock();
    }


    // ロード時、スタートボタンをテーブル中央に表示
    createStartbtn() {
      const startbtn = document.createElement('div');

      startbtn.classList.add('startbtn');
      startbtn.textContent = 'START';

      startbtn.addEventListener('click', () => {
        new Sevens(this);
      });

      this.table.appendChild(startbtn);
    }


    // ロード時、難易度 調整領域を表示
    createDifficultyBox() {

      const difficultyBox = document.createElement('div');
      difficultyBox.classList.add('setting_box');

      const p = document.createElement('p');
      p.textContent = '難易度 設定';

      const container = document.createElement('div');
      container.classList.add('setting_box__container');


      const btn_not = document.createElement('div');
      if (this.difficulty === 'not') {
        btn_not.classList.add('difficultybtn', 'btn_check');
      } else {
        btn_not.classList.add('difficultybtn', 'btn_not_check');
      }
      btn_not.textContent = '設定しない';

      btn_not.addEventListener('click', () => {
        this.difficulty = 'not';
        this.difficultybtnClassRemove(btn_not, btn_easy, btn_normal, btn_hard);
      });


      const btn_easy = document.createElement('div');
      if (this.difficulty === 'easy') {
        btn_easy.classList.add('difficultybtn', 'btn_check');
      } else {
        btn_easy.classList.add('difficultybtn', 'btn_not_check');
      }
      btn_easy.textContent = 'やさしい';

      btn_easy.addEventListener('click', () => {
        this.difficulty = 'easy';
        this.difficultybtnClassRemove(btn_not, btn_easy, btn_normal, btn_hard);
      });


      const btn_normal = document.createElement('div');
      if (this.difficulty === 'normal') {
        btn_normal.classList.add('difficultybtn', 'btn_check');
      } else {
        btn_normal.classList.add('difficultybtn', 'btn_not_check');
      }
      btn_normal.textContent = '普通';

      btn_normal.addEventListener('click', () => {
        this.difficulty = 'normal';
        this.difficultybtnClassRemove(btn_not, btn_easy, btn_normal, btn_hard);
      });


      const btn_hard = document.createElement('div');
      if (this.difficulty === 'hard') {
        btn_hard.classList.add('difficultybtn', 'btn_check');
      } else {
        btn_hard.classList.add('difficultybtn', 'btn_not_check');
      }
      btn_hard.textContent = '難しい';

      btn_hard.addEventListener('click', () => {
        this.difficulty = 'hard';
        this.difficultybtnClassRemove(btn_not, btn_easy, btn_normal, btn_hard);
      });


      container.appendChild(btn_not);
      container.appendChild(btn_easy);
      container.appendChild(btn_normal);
      container.appendChild(btn_hard);

      difficultyBox.appendChild(p);
      difficultyBox.appendChild(container);

      this.table.appendChild(difficultyBox);


      // <div class="setting_box">
      //   <p>- 難易度 設定 -</p>
      //   <div class="setting_box__container">
      //     <div class="difficultybtn btn_check">設定しない</div>
      //     <div class="difficultybtn btn_not_check">やさしい</div>
      //     <div class="difficultybtn btn_not_check">普通</div>
      //     <div class="difficultybtn btn_not_check">難しい</div>
      //   </div>
      // </div>
    }


    // ロード時、パス超過回数 調整領域を表示
    createPassOverCountBox() {

      const passOverCountBox = document.createElement('div');
      passOverCountBox.classList.add('setting_box', 'passOverCountBox');

      const p = document.createElement('p');
      p.textContent = 'パス超過回数 設定';

      const container = document.createElement('div');
      container.classList.add('setting_box__container');


      const btn_not = document.createElement('div');
      if (this.passOverCount === 'not') {
        btn_not.classList.add('pass_over_btn', 'btn_check');
      } else {
        btn_not.classList.add('pass_over_btn', 'btn_not_check');
      }
      btn_not.textContent = 'パス超過 無効';

      btn_not.addEventListener('click', () => {
        this.passOverCount = 'not';
        this.passOverCountbtnClassRemove(btn_not, btn_0, btn_1, btn_2, btn_3);
      });


      const btn_0 = document.createElement('div');
      if (this.passOverCount === '0') {
        btn_0.classList.add('pass_over_btn', 'btn_check');
      } else {
        btn_0.classList.add('pass_over_btn', 'btn_not_check');
      }
      btn_0.textContent = '0 回';

      btn_0.addEventListener('click', () => {
        this.passOverCount = '0';
        this.passOverCountbtnClassRemove(btn_not, btn_0, btn_1, btn_2, btn_3);
      });


      const btn_1 = document.createElement('div');
      if (this.passOverCount === '1') {
        btn_1.classList.add('pass_over_btn', 'btn_check');
      } else {
        btn_1.classList.add('pass_over_btn', 'btn_not_check');
      }
      btn_1.textContent = '1 回';

      btn_1.addEventListener('click', () => {
        this.passOverCount = '1';
        this.passOverCountbtnClassRemove(btn_not, btn_0, btn_1, btn_2, btn_3);
      });


      const btn_2 = document.createElement('div');
      if (this.passOverCount === '2') {
        btn_2.classList.add('pass_over_btn', 'btn_check');
      } else {
        btn_2.classList.add('pass_over_btn', 'btn_not_check');
      }
      btn_2.textContent = '2 回';

      btn_2.addEventListener('click', () => {
        this.passOverCount = '2';
        this.passOverCountbtnClassRemove(btn_not, btn_0, btn_1, btn_2, btn_3);
      });


      const btn_3 = document.createElement('div');
      if (this.passOverCount === '3') {
        btn_3.classList.add('pass_over_btn', 'btn_check');
      } else {
        btn_3.classList.add('pass_over_btn', 'btn_not_check');
      }
      btn_3.textContent = '3 回';

      btn_3.addEventListener('click', () => {
        this.passOverCount = '3';
        this.passOverCountbtnClassRemove(btn_not, btn_0, btn_1, btn_2, btn_3);
      });


      container.appendChild(btn_not);
      container.appendChild(btn_0);
      container.appendChild(btn_1);
      container.appendChild(btn_2);
      container.appendChild(btn_3);

      passOverCountBox.appendChild(p);
      passOverCountBox.appendChild(container);

      this.table.appendChild(passOverCountBox);

      // <div class="setting_box passOverCountBox">
      //   <p>- パス超過回数 設定 -</p>
      //   <div class="setting_box__container">
      //     <div class="pass_over_btn btn_check">設定しない</div>
      //     <div class="pass_over_btn btn_not_check">0 回</div>
      //     <div class="pass_over_btn btn_not_check">1 回</div>
      //     <div class="pass_over_btn btn_not_check">2 回</div>
      //     <div class="pass_over_btn btn_not_check">3 回</div>
      //   </div>
      // </div>
    }


    // 難易度ボタンをクリックしたら、適切に CSS class を適用する
    difficultybtnClassRemove(btn_not, btn_easy, btn_normal, btn_hard) {
      btn_not.classList.remove('btn_check', 'btn_not_check');
      btn_easy.classList.remove('btn_check', 'btn_not_check');
      btn_normal.classList.remove('btn_check', 'btn_not_check');
      btn_hard.classList.remove('btn_check', 'btn_not_check');

      if (this.difficulty === 'not') {
        btn_not.classList.add('btn_check');
        btn_easy.classList.add('btn_not_check');
        btn_normal.classList.add('btn_not_check');
        btn_hard.classList.add('btn_not_check');
      } else if (this.difficulty === 'easy') {
        btn_not.classList.add('btn_not_check');
        btn_easy.classList.add('btn_check');
        btn_normal.classList.add('btn_not_check');
        btn_hard.classList.add('btn_not_check');
      } else if (this.difficulty === 'normal') {
        btn_not.classList.add('btn_not_check');
        btn_easy.classList.add('btn_not_check');
        btn_normal.classList.add('btn_check');
        btn_hard.classList.add('btn_not_check');
      } else if (this.difficulty === 'hard') {
        btn_not.classList.add('btn_not_check');
        btn_easy.classList.add('btn_not_check');
        btn_normal.classList.add('btn_not_check');
        btn_hard.classList.add('btn_check');
      }
    }


    // パス超過回数ボタンをクリックしたら、適切に CSS class を適用する
    passOverCountbtnClassRemove(btn_not, btn_0, btn_1, btn_2, btn_3) {
      btn_not.classList.remove('btn_check', 'btn_not_check');
      btn_0.classList.remove('btn_check', 'btn_not_check');
      btn_1.classList.remove('btn_check', 'btn_not_check');
      btn_2.classList.remove('btn_check', 'btn_not_check');
      btn_3.classList.remove('btn_check', 'btn_not_check');

      if (this.passOverCount === 'not') {
        btn_not.classList.add('btn_check');
        btn_0.classList.add('btn_not_check');
        btn_1.classList.add('btn_not_check');
        btn_2.classList.add('btn_not_check');
        btn_3.classList.add('btn_not_check');
      } else if (this.passOverCount === '0') {
        btn_not.classList.add('btn_not_check');
        btn_0.classList.add('btn_check');
        btn_1.classList.add('btn_not_check');
        btn_2.classList.add('btn_not_check');
        btn_3.classList.add('btn_not_check');
      } else if (this.passOverCount === '1') {
        btn_not.classList.add('btn_not_check');
        btn_0.classList.add('btn_not_check');
        btn_1.classList.add('btn_check');
        btn_2.classList.add('btn_not_check');
        btn_3.classList.add('btn_not_check');
      } else if (this.passOverCount === '2') {
        btn_not.classList.add('btn_not_check');
        btn_0.classList.add('btn_not_check');
        btn_1.classList.add('btn_not_check');
        btn_2.classList.add('btn_check');
        btn_3.classList.add('btn_not_check');
      } else if (this.passOverCount === '3') {
        btn_not.classList.add('btn_not_check');
        btn_0.classList.add('btn_not_check');
        btn_1.classList.add('btn_not_check');
        btn_2.classList.add('btn_not_check');
        btn_3.classList.add('btn_check');
      }
    }


    // ロード時、ストックカードをテーブル中央に表示
    createLoadStock() {
      const loadStock = document.createElement('div');

      loadStock.classList.add('loadStock');

      const img = document.createElement('img');
      img.src = 'img/cards/back.png';
      img.height = 130;

      loadStock.appendChild(img);

      this.table.appendChild(loadStock);
    }
  }



  // すべてのプレイヤーのセリフ全般を管理するクラス
  class Message {
    constructor(sevens, restart) {
      this.sevens = sevens;
      this.restart = restart;

      this.hasSpadeSeven = false;
      this.hasHeartSeven = false;
      this.hasClubSeven = false;
    }


    removeMessage() {
      const player00_text = document.querySelector('.player00_text');
      const player01_text = document.querySelector('.player01_text');
      const player02_text = document.querySelector('.player02_text');
      const player03_text = document.querySelector('.player03_text');

      player00_text.classList.add('text-none');
      player01_text.classList.add('text-none');
      player02_text.classList.add('text-none');
      player03_text.classList.add('text-none');
    }

    renderJudgeHandSituation(player, handSituation) {
      // とても有利 +8 ~ +6
      // 有利 +5 ~ +3
      // 普通 +2 ~ -2
      // 不利 -3 ~ -5
      // とても不利 -6 ~ -8

      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');

      if (handSituation >= 6) {
        playerText.innerHTML =
          `よ～し！！！<br>
         とても有利な手札だ！`;
      } else if (handSituation >= 3) {
        playerText.innerHTML =
          `よし！<br>
         有利な手札だ！`;
      } else if (handSituation >= -2) {
        playerText.innerHTML =
          `まずまずな手札だ。`;
      } else if (handSituation >= -5) {
        playerText.innerHTML =
          `う～ん<br>
         不利な手札だ。`;
      } else if (handSituation >= -8) {
        playerText.innerHTML =
          `うわぁ～……<br>
         とても不利な手札だ……。`;
      }
    }


    renderDiscardSeven(id, suit) {
      const idNode = document.querySelector(id); // player??_hands
      const parent = idNode.parentNode; // .player??-wrapper
      let playerText;

      if (id === '#player01_hands' || id === '#player02_hands') {
        playerText = parent.firstElementChild; // player 01 02 _text
      } else if (id === '#player00_hands' || id === '#player03_hands') {
        playerText = parent.lastElementChild; // player 00 03 _text
      }

      playerText.classList.remove('text-none');

      if (suit === 'spade') { this.hasSpadeSeven = true; }
      if (suit === 'heart') { this.hasHeartSeven = true; }
      if (suit === 'club') { this.hasClubSeven = true; }

      if (this.hasSpadeSeven && this.hasHeartSeven && this.hasClubSeven) {
        playerText.innerHTML =
          `スペードの７！<br>
          ハートの７！<br>
          クラブの７！`;
      }
      else if (this.hasSpadeSeven && this.hasHeartSeven) {
        playerText.innerHTML =
          `スペードの７！<br>
          ハートの７！`;
      }
      else if (this.hasSpadeSeven && this.hasClubSeven) {
        playerText.innerHTML =
          `スペードの７！<br>
          クラブの７！`;
      }
      else if (this.hasHeartSeven && this.hasClubSeven) {
        playerText.innerHTML =
          `ハートの７！<br>
          クラブの７！`;
      }
      else if (this.hasSpadeSeven) {
        playerText.innerHTML =
          `スペードの７！`;
      }
      else if (this.hasHeartSeven) {
        playerText.innerHTML =
          `ハートの７！`;
      }
      else if (this.hasClubSeven) {
        playerText.innerHTML =
          `クラブの７！`;
      }
    }


    renderDiscardDiamondSeven(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');
      playerText.innerHTML =
        `ダイヤの７！<br>
         私のターンから時計回りで開始！`;
    }


    renderThinking(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');

      const textLists = [
        `う～ん、それじゃあ……`,
        `私のターン！`,
        `それじゃあ、次は……`,
        `どれを出そうか……`,
        `ここは……`,
        `むむむ～……`,
        `この場合は～……`,
      ];

      playerText.innerHTML =
        textLists[Math.floor(Math.random() * textLists.length)];
    }


    renderPlayingCard(player, li) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');

      let cardName = '';
      let playingCardSuit = '';

      if (li.dataset.suit === 'spade') {
        playingCardSuit = 'スペード';
      } else if (li.dataset.suit === 'heart') {
        playingCardSuit = 'ハート';
      } else if (li.dataset.suit === 'diamond') {
        playingCardSuit = 'ダイヤ';
      } else if (li.dataset.suit === 'club') {
        playingCardSuit = 'クラブ';
      }

      if (li.dataset.number === '1') { cardName = 'エース'; }
      else if (li.dataset.number === '11') { cardName = 'ジャック'; }
      else if (li.dataset.number === '12') { cardName = 'クイーン'; }
      else if (li.dataset.number === '13') { cardName = 'キング'; }
      else { cardName = li.dataset.number }

      playerText.innerHTML =
        `${playingCardSuit} の ${cardName} ！`;
    }


    renderPass(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');
      playerText.innerHTML =
        `パス！`;
    }


    renderDarePass(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');
      playerText.innerHTML =
        `ここはあえてパス！`;
    }


    renderPassOver(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');
      playerText.innerHTML =
        `パス ${parseInt(this.restart.passOverCount)} 回超過……。<br>
         ゲーム離脱します……。`;
    }


    renderClearGame(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');
      playerText.innerHTML =
        `上がり！`;
    }


    renderPlayingRestCard(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');
      playerText.innerHTML =
        `残りのカードを<br>
         すべて出します！`;
    }


    renderPlayersAddRank(player) {
      const playerText = document.querySelector(`.player0${player}-wrapper>.player0${player}_text`);
      playerText.classList.remove('text-none');
      if (this.sevens.players[player].rank === 1) {
        playerText.innerHTML =
          `よし！１位！！！`;
      } else if (this.sevens.players[player].rank === 2) {
        playerText.innerHTML =
          `２位だ！`;
      } else if (this.sevens.players[player].rank === 3) {
        playerText.innerHTML =
          `３位か～。`;
      } else if (this.sevens.players[player].rank === 4) {
        playerText.innerHTML =
          `４位……。`;
      }
    }
  } // Message クラス ここまで



  // ゲーム開始後からゲームセットまでのゲーム（七並べ）全体の進行を管理するクラス
  class Sevens {
    constructor(restart) {

      this.restart = restart;

      this.message = new Message(this, this.restart);

      this.message.removeMessage();

      this.getRegion();

      this.removeContainer(); // テーブル・手札を消去、スタートボタン消去、リロード後 リロードボタン消去

      this.trump = [];

      this.suits = [ // 絵柄
        'spade',
        'heart',
        'diamond',
        'club',
      ];

      this.createTrump(); // トランプカードを生成

      this.sevens = [...this.trump];
      // sevens = 七並べ　スプレッドだと浅いデータをコピーするだけで、深い階層まではコピーされない。
      // 参照情報のみコピーとなる。そのため あとで深いコピーに要修正。
      this.sevens.pop(); // Joker は除く。

      this.stock = [...this.sevens]; // stock = 山札, 値をコピー

      this.players = [];
      this.createPlayers(); // プレイヤーを生成
      this.renderPlayersName(); // プレイヤー名を描画

      this.playerTurn = 0; // どのプレイヤーから開始するか、プレイヤーのインデックス番号で管理
      this.clickableCard = false; // カードをクリックできるか できないかの状態を管理

      this.openCards = false; // サブプレイヤーのカードを表にする（難易度 難しい 対策などに活用）

      this.dealCards(); // 内部的にカードを配る
      this.rearrangesCards(); // 内部的に配布されたカードを並び替える

      this.table = [];
      this.createTable(); // 場 = table の生成

      this.clearPlayer = 0; // ゲーム離脱者（this.rank this.passOverRank 変動時加算）を管理
      this.rank = 0; // 上がったプレイヤーに順位を割り当てる
      this.passOverRank = this.players.length; // パス超過で離脱したプレイヤーに順位を割り当てる

      this.playingCardzIndex = 0;
      // 出したカードが手札からテーブル上に移動する際に必ずテーブル上のカードの前面を移動する

      // this.startElapsedTime = 0; // ゲームスタートまでのアニメーションの実行間隔を管理
      // ※おそらく同期処理を組まないと想定通りの動作にならないと思われる。

      this.renderInformation(); // 各プレイヤーのステータスを表示

      // ↑ ここまでがスタートボタンをクリック後、瞬時に行う処理



      // ストックアニメーションをひとまとめに管理・実行
      // ストックアニメーションが完了するのに厳密には 2560 ms かかる。
      this.startStockAnimation(); // ストックから各プレイヤー手札へカードを配布するアニメーション



      setTimeout(() => {
        this.renderTable(this.tableId); // テーブルを描画する
        this.renderAllPlayerHand(); // すべてのプレイヤーの手札を描画する
      }, 5000);



      // 手札の状況（有利 不利 普通）に応じたメッセージを表示する
      setTimeout(() => {
        this.judgeHandSituation();
      }, 8000);



      // ＋３秒後、ゲーム開始ボタンを表示する
      setTimeout(() => {
        this.createGameStartbtn();
        this.createShuffleReloadbtn();
        this.createBackToStartbtn('table');
      }, 11000);
    }


    getRegion() {
      this.tableId = document.getElementById('table');
      this.player00_hands = document.getElementById('player00_hands');
      this.player01_hands = document.getElementById('player01_hands');
      this.player02_hands = document.getElementById('player02_hands');
      this.player03_hands = document.getElementById('player03_hands');

      this.info_player00 = document.querySelector('.information>.info_player00');
      this.info_player01 = document.querySelector('.information>.info_player01');
      this.info_player02 = document.querySelector('.information>.info_player02');
      this.info_player03 = document.querySelector('.information>.info_player03');
    }


    removeContainer() {
      this.elementsRemoveClass('playerTurn');
      this.elementsRemoveClass('winPlayer');
      this.elementsRemoveClass('losePlayer');

      while (this.tableId.firstChild) {
        this.tableId.firstChild.remove();
      }

      while (this.player00_hands.firstChild) {
        this.player00_hands.firstChild.remove();
      }

      while (this.player01_hands.firstChild) {
        this.player01_hands.firstChild.remove();
      }

      while (this.player02_hands.firstChild) {
        this.player02_hands.firstChild.remove();
      }

      while (this.player03_hands.firstChild) {
        this.player03_hands.firstChild.remove();
      }
    }


    createTrump() {
      // トランプカードの中身
      // {
      //   suit: 'spade', // 絵柄 'spade', 'heart', 'diamond', 'club', 'joker',
      //   number: 1, // 番号 1 ~ 13　'joker'は 0 とする。
      //   posNum: 1, // 1 ~ 52　テーブルのインデックス番号を指定する際に便利
      //   url: 'img/01.png', // イメージファイルURL 裏面のカードは別で管理
      //   isFront: true, // 表か裏か 表ならば true 裏ならば false
      //   playable: false, // 手札の中で どのカードが出せるのかを判定するためのプロパティ 出せるなら true 初期値は false
      // },

      this.suits.forEach(suit => {
        for (let i = 1; i <= 13; i++) {
          this.trump.push({
            suit: suit,
            number: i,
          });
        }
      });

      for (let i = 1; i <= this.trump.length; i++) {
        this.trump[i - 1].posNum = i;
        this.trump[i - 1].url = `img/cards/${String(i).padStart(2, '0')}.png`;
        this.trump[i - 1].isFront = true;
        this.trump[i - 1].playable = false;
      }

      this.trump.push({
        suit: 'joker',
        number: 0,
        posNum: 53,
        url: 'img/cards/53.png',
        isFront: true,
        playable: false,
      });
    }


    createPlayers() {
      this.players = [
        // プレイヤー名, hand = 手札, パスは３回まで
        // ルール設定でパスを無制限にできるようにするのも良いかも。
        // パスを無制限にして、出せるカードがある場合は必ず出さなければならないルールにするほうが面白いかも。
        { name: 'You', hand: [], pass: 0, rank: 0, handStartPosition: [] }, // メインプレイヤー
        { name: 'player1', hand: [], pass: 0, rank: 0, handStartPosition: [] }, // サブプレイヤー
        { name: 'player2', hand: [], pass: 0, rank: 0, handStartPosition: [] }, // サブプレイヤー
        { name: 'player3', hand: [], pass: 0, rank: 0, handStartPosition: [] }, // サブプレイヤー
      ];

      const player00HandLeftPoint = 280; // player00Hand 一番左の座標
      const player00HandTopPoint = 890; // player00Hand 一番上の座標
      const player00HandNextXPoint = 106; // card width 86.5px + margin right 19.5px
      const player00HandNextYPoint = 0; // すべて同じ Y 座標

      const player01HandLeftPoint = 120; // player01Hand 一番左の座標
      const player01HandTopPoint = 43; // player01Hand 一番上の座標
      const player01HandNextXPoint = 0; // すべて同じ X 座標
      const player01HandNextYPoint = 78.5; // card height 75px + margin bottom 3.5px

      const player02HandLeftPoint = 280; // player02Hand 一番左の座標
      const player02HandTopPoint = 140; // player02Hand 一番上の座標
      const player02HandNextXPoint = 106; // card width 86.5px + margin right 19.5px
      const player02HandNextYPoint = 0; // すべて同じ Y 座標

      const player03HandLeftPoint = 1687; // player03Hand 一番左の座標
      const player03HandTopPoint = 43; // player03Hand 一番上の座標
      const player03HandNextXPoint = 0; // すべて同じ X 座標
      const player03HandNextYPoint = 78.5; // card height 75px + margin bottom 3.5px

      for (let n = 0; n < 13; n++) {
        this.players[0].handStartPosition[n] = {
          x: player00HandLeftPoint + player00HandNextXPoint * n,
          y: player00HandTopPoint,
        };

        this.players[1].handStartPosition[n] = {
          x: player01HandLeftPoint,
          y: player01HandTopPoint + player01HandNextYPoint * n,
        };

        this.players[2].handStartPosition[n] = {
          x: player02HandLeftPoint + player02HandNextXPoint * n,
          y: player02HandTopPoint,
        };

        this.players[3].handStartPosition[n] = {
          x: player03HandLeftPoint,
          y: player03HandTopPoint + player03HandNextYPoint * n,
        };
      }
    }


    renderPlayersName() {
      const player00_name = document.querySelector('.player00-name');
      player00_name.textContent = this.players[0].name;

      const player01_name = document.querySelector('.player01-name');
      player01_name.textContent = this.players[1].name;

      const player02_name = document.querySelector('.player02-name');
      player02_name.textContent = this.players[2].name;

      const player03_name = document.querySelector('.player03-name');
      player03_name.textContent = this.players[3].name;
    }


    startStockAnimation() {

      this.stockListZIndex = 0; // ストックカードを配布する際の上下の順番・配置を管理する
      this.animationGap = 0; // ストックアニメーションの実行間隔

      // プレイヤーの手札を描画する ゲーム開始時のみ１度だけ実行
      this.renderPlayerHandForStockAnimation(this.player00_hands, 0);
      this.renderPlayerHandForStockAnimation(this.player01_hands, 1);
      this.renderPlayerHandForStockAnimation(this.player02_hands, 2);
      this.renderPlayerHandForStockAnimation(this.player03_hands, 3);

      this.renderStock(); // ストックを描画する

      // ストックアニメーションに必要なノードを取得
      const stockList = document.querySelector('#table>div');

      const player00Lists = document.querySelectorAll('#player00_hands>li');
      const player01Lists = document.querySelectorAll('#player01_hands>li');
      const player02Lists = document.querySelectorAll('#player02_hands>li');
      const player03Lists = document.querySelectorAll('#player03_hands>li');

      // ストックを各プレイヤー手札に配布するアニメーション
      // すべてのカードを配り終えるのに厳密には 2560 ms かかる。
      for (let n = 0; n < 13; n++) {
        this.renderStockAnimation(player00Lists, n);
        this.renderStockAnimation(player01Lists, n);
        this.renderStockAnimation(player02Lists, n);
        this.renderStockAnimation(player03Lists, n);
      }

      // カードを配布するアニメーションが完了する直前でストックを消去
      // 最後のカードがストックから手札に移動する瞬間は 2510 ms そのタイミングでストックを消去
      setTimeout(() => {
        stockList.remove();
      }, 2500);
    }


    renderPlayerHandForStockAnimation(id, index) {

      while (id.firstChild) {
        id.firstChild.remove();
      }

      this.players[index].handStartPosition.forEach((handPos, ind) => {
        const li = document.createElement('li');

        // 属性の付加（共通）
        li.dataset.index = ind;
        li.dataset.positionX = handPos.x;
        li.dataset.positionY = handPos.y;
        li.style.opacity = 0; // 最初は opacity で見えないようにしておく。
        li.style.zIndex = 0;


        const img = document.createElement('img');
        if (index === 0 || index === 2) {
          img.src = 'img/cards/back.png';
          img.width = 100;
        } else if (index === 1 || index === 3) {
          img.src = 'img/cards/side_back.png';
          img.height = 75;
        }

        li.appendChild(img);
        id.appendChild(li);
      });
    }


    renderStock() {
      // ストックをテーブル中央に表示する。
      // ストックの position を把握する必要がある。 => (915, 515)
      const table = document.getElementById('table');

      const stockCards = document.createElement('div');
      stockCards.dataset.positionX = 915;
      stockCards.dataset.positionY = 515;
      stockCards.classList.add('stockCards');
      stockCards.style.zIndex = 0;

      const img = document.createElement('img');
      img.src = 'img/cards/back.png';
      img.height = 130;

      stockCards.appendChild(img);

      table.appendChild(stockCards);
    }


    renderStockAnimation(lists, index) {

      const stockList = document.querySelector('#table>div');

      lists[index].style.zIndex = 10 + this.stockListZIndex;
      this.stockListZIndex++;

      lists[index].style.transform =
        `translate(
          ${stockList.dataset.positionX - lists[index].dataset.positionX}px,
          ${stockList.dataset.positionY - lists[index].dataset.positionY}px
      )`;

      setTimeout(() => {
        lists[index].style.opacity = 1;
        lists[index].style.transition = 'transform 1s';
        lists[index].style.transform = 'translate(0px, 0px)';
      }, 10 + 50 * this.animationGap);

      this.animationGap++;
    }


    dealCards() { // 内部的にカードを配る
      // 7 に近いカードほど有利
      // 有利 5 6 7 8 9
      // 普通 3 4   10 11
      // 不利 1 2   12 13

      const cardsBox = {
        // カードの番号 - 1 => 番号が格納されてるインデックス番号
        // index => カードの絵柄の種類の数（0 ~ 3）が格納される
        strong: [
          // this.stock[(5 - 1) + 13 * index].posNum,
          // this.stock[(6 - 1) + 13 * index].posNum,
          // this.stock[(7 - 1) + 13 * index].posNum,
          // this.stock[(8 - 1) + 13 * index].posNum,
          // this.stock[(9 - 1) + 13 * index].posNum,
        ],
        normal: [
          // this.stock[(3 - 1) + 13 * index].posNum,
          // this.stock[(4 - 1) + 13 * index].posNum,
          // this.stock[(10 - 1) + 13 * index].posNum,
          // this.stock[(11 - 1) + 13 * index].posNum,
        ],
        weak: [
          // this.stock[(1 - 1) + 13 * index].posNum,
          // this.stock[(2 - 1) + 13 * index].posNum,
          // this.stock[(12 - 1) + 13 * index].posNum,
          // this.stock[(13 - 1) + 13 * index].posNum,
        ],
      };

      this.suits.forEach((suit, index) => {
        cardsBox.strong.push(this.stock[(5 - 1) + 13 * index].posNum);
        cardsBox.strong.push(this.stock[(6 - 1) + 13 * index].posNum);
        cardsBox.strong.push(this.stock[(7 - 1) + 13 * index].posNum);
        cardsBox.strong.push(this.stock[(8 - 1) + 13 * index].posNum);
        cardsBox.strong.push(this.stock[(9 - 1) + 13 * index].posNum);
      });

      this.suits.forEach((suit, index) => {
        cardsBox.normal.push(this.stock[(3 - 1) + 13 * index].posNum);
        cardsBox.normal.push(this.stock[(4 - 1) + 13 * index].posNum);
        cardsBox.normal.push(this.stock[(10 - 1) + 13 * index].posNum);
        cardsBox.normal.push(this.stock[(11 - 1) + 13 * index].posNum);
      });

      this.suits.forEach((suit, index) => {
        cardsBox.weak.push(this.stock[(1 - 1) + 13 * index].posNum);
        cardsBox.weak.push(this.stock[(2 - 1) + 13 * index].posNum);
        cardsBox.weak.push(this.stock[(12 - 1) + 13 * index].posNum);
        cardsBox.weak.push(this.stock[(13 - 1) + 13 * index].posNum);
      });


      this.shuffle(cardsBox.strong);
      this.shuffle(cardsBox.normal);
      this.shuffle(cardsBox.weak);


      if (this.restart.difficulty === 'not') {
        // 順番に均等配布 メインプレイヤー・サブプレイヤー 全員 手札が確定する
        while (this.stock.length >= this.players.length) {
          for (let i = 0; i < this.players.length; i++) {
            this.players[i].hand.push(this.stock.splice(Math.floor(Math.random() * this.stock.length), 1)[0]);
          }
        }
      } else if (this.restart.difficulty === 'easy') {
        // 有利なカードから 10 枚、普通のカードから 3 枚取得する
        for (let i = 0; i < 10; i++) {
          this.players[0].hand.push(this.stock[cardsBox.strong[i] - 1]);
          this.stock[cardsBox.strong[i] - 1].dealed = true;
        }

        for (let i = 0; i < 3; i++) {
          this.players[0].hand.push(this.stock[cardsBox.normal[i] - 1]);
          this.stock[cardsBox.normal[i] - 1].dealed = true;
        }
      } else if (this.restart.difficulty === 'normal') {
        // 普通のカードから 8 枚、有利なカードから 3 枚、不利なカードから 2 枚取得する
        for (let i = 0; i < 8; i++) {
          this.players[0].hand.push(this.stock[cardsBox.normal[i] - 1]);
          this.stock[cardsBox.normal[i] - 1].dealed = true;
        }

        for (let i = 0; i < 3; i++) {
          this.players[0].hand.push(this.stock[cardsBox.strong[i] - 1]);
          this.stock[cardsBox.strong[i] - 1].dealed = true;
        }

        for (let i = 0; i < 2; i++) {
          this.players[0].hand.push(this.stock[cardsBox.weak[i] - 1]);
          this.stock[cardsBox.weak[i] - 1].dealed = true;
        }
      } else if (this.restart.difficulty === 'hard') {
        // 不利なカードから 8 枚、普通のカードから 3 枚、有利なカードから 2 枚取得する
        for (let i = 0; i < 8; i++) {
          this.players[0].hand.push(this.stock[cardsBox.weak[i] - 1]);
          this.stock[cardsBox.weak[i] - 1].dealed = true;
        }

        for (let i = 0; i < 3; i++) {
          this.players[0].hand.push(this.stock[cardsBox.normal[i] - 1]);
          this.stock[cardsBox.normal[i] - 1].dealed = true;
        }

        for (let i = 0; i < 2; i++) {
          this.players[0].hand.push(this.stock[cardsBox.strong[i] - 1]);
          this.stock[cardsBox.strong[i] - 1].dealed = true;
        }
      }


      // 難易度を設定した場合、ここまででメインプレイヤーの手札が確定しただけ
      // 残りのサブプレイヤーの手札を確定する必要がある

      if (this.restart.difficulty !== 'not') {
        // メインプレイヤーに配ったカードを posNum を基準に昇順に並び替える
        const dealedStock = this.stock.filter(stock => stock.dealed);

        // 昇順
        dealedStock.sort((a, b) => {
          if (a.posNum !== b.posNum) { return a.posNum - b.posNum; }
          return 0;
        });

        // メインプレイヤーに配ったカードをストックから削除する
        for (let i = 1; i <= this.players[0].hand.length; i++) {
          this.stock.splice(dealedStock[dealedStock.length - i].posNum - 1, 1);
        }

        // 順番に均等配布 サブプレイヤーたちの手札が確定する
        while (this.stock.length >= this.players.length - 1) {
          for (let i = 1; i < this.players.length; i++) {
            this.players[i].hand.push(this.stock.splice(Math.floor(Math.random() * this.stock.length), 1)[0]);
          }
        }
      }


      // 割り切れない場合の 余り をプレイヤーに配布（※割り切れるから このコードは実行されない）
      // 配布する際はランダムにプレイヤーに配布する
      if (this.stock.length) {
        const restStock = this.stock.length;
        const drawRSPlayer = []; // draw Rest Stock Player 残りのカード（山札）を引くプレイヤー

        for (let i = 0; i < this.players.length; i++) {
          drawRSPlayer.push(i);
        }

        this.shuffle(drawRSPlayer); // drawRSPlayer の中身がシャッフルされる。

        for (let i = 0; i < restStock; i++) {
          this.players[drawRSPlayer[i]].hand.push(this.stock.splice(Math.floor(Math.random() * this.stock.length), 1)[0]);
        }
      }


      // ダイヤの「７」を所持しているプレイヤーを把握する。（そのプレイヤーから時計回りで始めるため。）
      for (let p = 0; p < this.players.length; p++) {
        this.players[p].hand.filter(hand => {
          if (hand.suit === 'diamond' && hand.number === 7) {
            this.playerTurn = p;
          }
        })
      }


      // サブプレイヤーの手札を裏にする。
      for (let i = 0; i < this.players.length; i++) {
        if (i === 0) {
          continue;
        } else { // サブプレイヤーは手札を裏にして見えないようにする。
          this.players[i].hand.map(hand => {
            hand.isFront = false;
            // hand.url = 'img/back.png'; とすると本来の画像URLが分からなくなるため、
            // 条件分岐を使って true ならば hand.url のイメージパスを適用する、
            // false ならば'img/back.png';をイメージパスに適用する、といった形式にする。
          });
        }
      }
    }


    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
      return arr;
    }


    sort(arr) {
      if (arr.length === 0) {
        return;
      }
      // 昇順
      arr.sort((a, b) => {
        if (a.number !== b.number) { return a.number - b.number; }
        return 0;
      });
    }


    rearrangesCards() { // 内部的に配布されたカードを並び替える
      // 第一優先 suit: 'spade', 'heart', 'diamond', 'club' の順番に並び替える
      // 第二優先 number: 1, 2, 3, ... 昇順に並び替える

      for (let i = 0; i < this.players.length; i++) {

        const placeSpade = this.players[i].hand.filter(hand => hand.suit === 'spade');
        const placeHeart = this.players[i].hand.filter(hand => hand.suit === 'heart');
        const placeDiamond = this.players[i].hand.filter(hand => hand.suit === 'diamond');
        const placeClub = this.players[i].hand.filter(hand => hand.suit === 'club');

        this.sort(placeSpade);
        this.sort(placeHeart);
        this.sort(placeDiamond);
        this.sort(placeClub);

        this.players[i].hand = [];
        this.players[i].hand.push(...placeSpade);
        this.players[i].hand.push(...placeHeart);
        this.players[i].hand.push(...placeDiamond);
        this.players[i].hand.push(...placeClub);
      }
    }


    createTable() {
      /* this.table = [{
      //   suit: 'spade', // 絵柄 'spade', 'heart', 'diamond', 'club', 'joker',
      //   number: 1, // 1 ~ 13
      //   posNum: 1, // 1 ~ 52
      //   url: 'img/01.png', // イメージファイルURL 裏面のカードは別で管理
      //   isFront: true, // 表か裏か 表ならば true 裏ならば false
      //   position: { // 各カードの表示位置。とりあえず 0 にしておく。
      //     x: 0,
      //     y: 0,
      //   },
      //   discard: false, // 捨て札 カードが場に出されてるか どうか 既出なら true 未出なら false 最初はすべて false
      //   passOver: false, // パス超過によりテーブルに出されたカードに true を割り振る
      // }];
      */

      this.suits.forEach(suit => {
        for (let n = 1; n <= 13; n++) {
          this.table.push({
            suit: suit,
            number: n,
          });
        }
      });

      for (let i = 1; i <= this.table.length; i++) {
        this.table[i - 1].posNum = i;
        this.table[i - 1].url = `img/cards/${String(i).padStart(2, '0')}.png`;
        this.table[i - 1].isFront = true;
        this.table[i - 1].discard = false;
        this.table[i - 1].passOver = false;
      }


      const tableLeftPoint = 280; // table 一番左の座標
      const tableTopPoint = 290; // table 一番上の座標

      const tableNextXPoint = 106; // card width 86.5px + margin right 19.5px
      const tableNextYPoint = 150; // card height 130px + margin bottom 20px

      this.suits.forEach(suit => {
        if (suit === 'spade') {
          for (let n = 0; n < 13; n++) {
            this.table[n + 13 * 0].position = {
              x: tableLeftPoint + tableNextXPoint * n,
              y: tableTopPoint + tableNextYPoint * 0,
            };
          }
        } else if (suit === 'heart') {
          for (let n = 0; n < 13; n++) {
            this.table[n + 13 * 1].position = {
              x: tableLeftPoint + tableNextXPoint * n,
              y: tableTopPoint + tableNextYPoint * 1,
            };
          }
        } else if (suit === 'diamond') {
          for (let n = 0; n < 13; n++) {
            this.table[n + 13 * 2].position = {
              x: tableLeftPoint + tableNextXPoint * n,
              y: tableTopPoint + tableNextYPoint * 2,
            };
          }
        } else if (suit === 'club') {
          for (let n = 0; n < 13; n++) {
            this.table[n + 13 * 3].position = {
              x: tableLeftPoint + tableNextXPoint * n,
              y: tableTopPoint + tableNextYPoint * 3,
            };
          }
        }
      });
    }


    judgeHandSituation() {
      // 7 に近いカードほど有利
      // 有利 5 6   8 9
      // 普通 3 4   10 11
      // 不利 1 2   12 13

      // 絵柄別・7 より小さいカード・7 より大きいカード、合計 8 パターンで状況を判断
      // 有利なら +1 、普通なら 0 、不利なら -1 として加減算する。
      // 最大値 +8 ~ 最小値 -8

      // 8 パターンの合計値に応じて状況を判断
      // とても有利 +8 ~ +6
      // 有利 +5 ~ +3
      // 普通 +2 ~ -2
      // 不利 -3 ~ -5
      // とても不利 -6 ~ -8

      // 状況に応じたメッセージを表示

      this.players.forEach((player, index) => {
        let handSituation = this.getHandSuitsMinMax(index);
        this.message.renderJudgeHandSituation(index, handSituation);
      });
    }


    getHandSuitsMinMax(index) { // 手札の絵柄別のカードの最小値・最大値の把握

      let handSituation = 0;

      const cardSpade = this.players[index].hand.filter(card => card.suit === 'spade');
      const cardHeart = this.players[index].hand.filter(card => card.suit === 'heart');
      const cardDiamond = this.players[index].hand.filter(card => card.suit === 'diamond');
      const cardClub = this.players[index].hand.filter(card => card.suit === 'club');

      let cardSpadeMinNumber = 0;
      let cardHeartMinNumber = 0;
      let cardDiamondMinNumber = 0;
      let cardClubMinNumber = 0;

      let cardSpadeMaxNumber = 0;
      let cardHeartMaxNumber = 0;
      let cardDiamondMaxNumber = 0;
      let cardClubMaxNumber = 0;


      // cardSpade[index].number が最小値 と 最大値 を抽出する。
      // number を昇順で並べ替えると、一番最初に来るインデックス番号が最小値の number
      // 一番最後に来るインデックス番号（cardSpade.length - 1）が最大値の number になる。

      this.sort(cardSpade);
      this.sort(cardHeart);
      this.sort(cardDiamond);
      this.sort(cardClub);


      // suit ごとの最小値の number
      if (cardSpade.length) { cardSpadeMinNumber = cardSpade[0].number; }
      if (cardHeart.length) { cardHeartMinNumber = cardHeart[0].number; }
      if (cardDiamond.length) { cardDiamondMinNumber = cardDiamond[0].number; }
      if (cardClub.length) { cardClubMinNumber = cardClub[0].number; }

      // suit ごとの最大値の number
      if (cardSpade.length) { cardSpadeMaxNumber = cardSpade[cardSpade.length - 1].number; }
      if (cardHeart.length) { cardHeartMaxNumber = cardHeart[cardHeart.length - 1].number; }
      if (cardDiamond.length) { cardDiamondMaxNumber = cardDiamond[cardDiamond.length - 1].number; }
      if (cardClub.length) { cardClubMaxNumber = cardClub[cardClub.length - 1].number; }


      // handSituation の加減算
      if (cardSpadeMinNumber === 6 || cardSpadeMinNumber === 5) { handSituation++; }
      else if (cardSpadeMinNumber === 2 || cardSpadeMinNumber === 1) { handSituation--; }

      if (cardHeartMinNumber === 6 || cardHeartMinNumber === 5) { handSituation++; }
      else if (cardHeartMinNumber === 2 || cardHeartMinNumber === 1) { handSituation--; }

      if (cardDiamondMinNumber === 6 || cardDiamondMinNumber === 5) { handSituation++; }
      else if (cardDiamondMinNumber === 2 || cardDiamondMinNumber === 1) { handSituation--; }

      if (cardClubMinNumber === 6 || cardClubMinNumber === 5) { handSituation++; }
      else if (cardClubMinNumber === 2 || cardClubMinNumber === 1) { handSituation--; }


      if (cardSpadeMaxNumber === 8 || cardSpadeMaxNumber === 9) { handSituation++; }
      else if (cardSpadeMaxNumber === 12 || cardSpadeMaxNumber === 13) { handSituation--; }

      if (cardHeartMaxNumber === 8 || cardHeartMaxNumber === 9) { handSituation++; }
      else if (cardHeartMaxNumber === 12 || cardHeartMaxNumber === 13) { handSituation--; }

      if (cardDiamondMaxNumber === 8 || cardDiamondMaxNumber === 9) { handSituation++; }
      else if (cardDiamondMaxNumber === 12 || cardDiamondMaxNumber === 13) { handSituation--; }

      if (cardClubMaxNumber === 8 || cardClubMaxNumber === 9) { handSituation++; }
      else if (cardClubMaxNumber === 12 || cardClubMaxNumber === 13) { handSituation--; }


      console.log(`cardSpadeMinNumber:${cardSpadeMinNumber}`);
      console.log(`cardHeartMinNumber:${cardHeartMinNumber}`);
      console.log(`cardDiamondMinNumber:${cardDiamondMinNumber}`);
      console.log(`cardClubMinNumber:${cardClubMinNumber}`);

      console.log(`cardSpadeMaxNumber:${cardSpadeMaxNumber}`);
      console.log(`cardHeartMaxNumber:${cardHeartMaxNumber}`);
      console.log(`cardDiamondMaxNumber:${cardDiamondMaxNumber}`);
      console.log(`cardClubMaxNumber:${cardClubMaxNumber}`);

      console.log(`handSituation:${handSituation}`);

      return handSituation;
    }


    createGameStartbtn() {
      const table = document.getElementById('table');
      const startbtn = document.createElement('div');

      const tableChildren = table.children;
      let tableDiv = [];

      startbtn.classList.add('startbtn');
      startbtn.style.top = '30%';
      startbtn.textContent = 'ゲーム 開始！';

      startbtn.addEventListener('click', () => {

        this.message.removeMessage(); // メッセージを消去

        // div 要素で作成されたボタン（ゲーム開始ボタン・シャッフルボタン）を消去
        for (let i = 0; i < tableChildren.length; i++) {
          if (tableChildren[i].nodeName === 'DIV') {
            tableDiv.push(tableChildren[i]);
          }
        }

        tableDiv.forEach(val => {
          val.remove();
        });


        // 「７」のカードを場に出すアニメーションを実行
        // ３枚の７のカードを出す
        // ＋５秒後、ダイヤの７のカードを出す
        this.discardSevenAnimation('#player00_hands', 920, 890);
        this.discardSevenAnimation('#player01_hands', 120, 515);
        this.discardSevenAnimation('#player02_hands', 920, 140);
        this.discardSevenAnimation('#player03_hands', 1690, 515);

        // さらに＋５秒後、ゲーム開始
        setTimeout(() => {
          this.message.removeMessage(); // メッセージを非表示にする
          this.getTableSuitsMinMax(); // 場札の絵柄別のカードの最小値・最大値の把握
          this.playableCard(); // どのカードが出せるのかを判定
          this.clickableCard = true; // カードをクリックできる状態にする
          this.renderAllPlayerHand(); // すべてのプレイヤーの手札を再描画する
          this.gameFlow(); // ゲーム全体の進行を制御する
        }, 10000);
      });

      table.appendChild(startbtn);
    }


    createShuffleReloadbtn() {
      const table = document.getElementById('table');
      const shuffleReloadbtn = document.createElement('div');

      shuffleReloadbtn.classList.add('shuffleReloadbtn');
      shuffleReloadbtn.innerHTML = 'シャッフル<br>し直す';

      shuffleReloadbtn.addEventListener('click', () => {
        this.restart.createLoadStock();
        new Sevens(this.restart);
      });

      table.appendChild(shuffleReloadbtn);
    }


    createBackToStartbtn(element) {
      const backToStartbtn = document.createElement('div');

      backToStartbtn.classList.add('backToStartbtn');
      backToStartbtn.innerHTML = '最初に戻る';

      backToStartbtn.addEventListener('click', () => {

        this.message.removeMessage();
        this.removeContainer();

        this.players.forEach((player, index) => {
          this.players[index].pass = 0;
          this.players[index].rank = 0;
        });

        this.renderInformation();

        this.restart.createStartbtn();
        this.restart.createDifficultyBox();
        this.restart.createPassOverCountBox();
        this.restart.createLoadStock();
      });

      if (element === 'table') {
        const table = document.getElementById('table');
        table.appendChild(backToStartbtn);
      } else if (element === 'hand') {
        const player00_hands = document.getElementById('player00_hands');
        player00_hands.appendChild(backToStartbtn);
      }
    }


    discardSevenAnimation(id, xPos, yPos) {
      // #idname > li => player00_hands, player01_hands, player02_hands, player03_hands

      const playerLists = document.querySelectorAll(`${id}>li`);

      let spadeList = false;
      let heartList = false;
      let diamondList = false;
      let clubList = false;


      playerLists.forEach(list => {
        if (list.dataset.suit === 'spade' && list.dataset.number === '7') {
          spadeList = true;
        }

        if (list.dataset.suit === 'heart' && list.dataset.number === '7') {
          heartList = true;
        }

        if (list.dataset.suit === 'diamond' && list.dataset.number === '7') {
          diamondList = true;
        }

        if (list.dataset.suit === 'club' && list.dataset.number === '7') {
          clubList = true;
        }
      });


      // スペード ハート クラブ の 7 のカードを場に出す
      if (spadeList) {
        this.message.renderDiscardSeven(id, 'spade');
        this.prepareSevensCard(0, xPos, yPos)
        this.executeSevensCard(0);
      }

      if (heartList) {
        this.message.renderDiscardSeven(id, 'heart');
        this.prepareSevensCard(1, xPos, yPos)
        this.executeSevensCard(1);
      }

      if (clubList) {
        this.message.renderDiscardSeven(id, 'club');
        this.prepareSevensCard(3, xPos, yPos)
        this.executeSevensCard(3);
      }

      // 絵柄別 ７ のカード所持 検証後 Message class のプロパティを初期化
      this.message.hasSpadeSeven = false;
      this.message.hasHeartSeven = false;
      this.message.hasClubSeven = false;

      this.players.forEach(player => {
        for (let i = player.hand.length - 1; i >= 0; i--) {
          if (
            (player.hand[i].suit === 'spade' && player.hand[i].number === 7) ||
            (player.hand[i].suit === 'heart' && player.hand[i].number === 7) ||
            (player.hand[i].suit === 'club' && player.hand[i].number === 7)
          ) {
            player.hand.splice(i, 1);
          }
        }
      });

      setTimeout(() => {
        // プレイヤーの手札を再描画
        if (id === '#player00_hands') {
          this.renderPlayerHand(this.player00_hands, 0);
        } else if (id === '#player01_hands') {
          this.renderPlayerHand(this.player01_hands, 1);
        } else if (id === '#player02_hands') {
          this.renderPlayerHand(this.player02_hands, 2);
        } else if (id === '#player03_hands') {
          this.renderPlayerHand(this.player03_hands, 3);
        }
        this.renderInformation(); // 各プレイヤーのステータスを表示
      }, 30);


      // 5 秒後にダイヤの 7 を場に出す
      setTimeout(() => {
        if (diamondList) {
          this.message.removeMessage();
          this.message.renderDiscardDiamondSeven(this.playerTurn);

          this.prepareSevensCard(2, xPos, yPos)
          this.executeSevensCard(2);
        }

        this.players.forEach(player => {
          for (let i = player.hand.length - 1; i >= 0; i--) {
            if (
              (player.hand[i].suit === 'diamond' && player.hand[i].number === 7)
            ) {
              player.hand.splice(i, 1);
            }
          }
        });
      }, 5000);

      setTimeout(() => {
        if (diamondList) {
          // プレイヤーの手札を再描画
          if (id === '#player00_hands') {
            this.renderPlayerHand(this.player00_hands, 0);
          } else if (id === '#player01_hands') {
            this.renderPlayerHand(this.player01_hands, 1);
          } else if (id === '#player02_hands') {
            this.renderPlayerHand(this.player02_hands, 2);
          } else if (id === '#player03_hands') {
            this.renderPlayerHand(this.player03_hands, 3);
          }

          this.renderInformation(); // 各プレイヤーのステータスを表示
        }
      }, 5030);
    }


    prepareSevensCard(num, xPos, yPos) {
      this.table[(7 + 13 * num) - 1].discard = true;
      this.tableLists[(7 + 13 * num) - 1].classList.remove('discard');

      this.tableLists[(7 + 13 * num) - 1].style.transform =
        `translate(
                  ${xPos - this.tableLists[(7 + 13 * num) - 1].dataset.positionX}px,
                  ${yPos - this.tableLists[(7 + 13 * num) - 1].dataset.positionY}px
            )`;
    }


    executeSevensCard(num) {
      setTimeout(() => {
        this.playingCardzIndex++;
        this.tableLists[(7 + 13 * num) - 1].style.zIndex = 20 + this.playingCardzIndex;
        this.tableLists[(7 + 13 * num) - 1].style.transition = 'transform 1s';
        this.tableLists[(7 + 13 * num) - 1].style.transform = 'translate(0px, 0px)';
      }, 30);
    }


    getTableSuitsMinMax() { // 場札の絵柄別のカードの最小値・最大値の把握

      // パス超過によりテーブルに出されたカードを除外して最小値・最大値を把握する必要がある
      // パス超過によりテーブルに出されたカードは passOver に true が代入されてる

      // カードが出されたときに、以下の検証が必要になる

      // ７より左側のカードが出されたときに隣り合う場合（passOver true のカード + 1）
      // ７より右側のカードが出されたときに隣り合う場合（passOver true のカード - 1）
      // passOver false にする必要がある

      const discardTable = this.table.filter(table => table.discard && !table.passOver);
      const discardSpade = discardTable.filter(discard => discard.suit === 'spade');
      const discardHeart = discardTable.filter(discard => discard.suit === 'heart');
      const discardDiamond = discardTable.filter(discard => discard.suit === 'diamond');
      const discardClub = discardTable.filter(discard => discard.suit === 'club');


      console.log('discardTable:', discardTable);
      console.log('discardSpade:', discardSpade);
      console.log('discardHeart:', discardHeart);
      console.log('discardDiamond:', discardDiamond);
      console.log('discardClub:', discardClub);


      // discardSpade[index].number が最小値 と 最大値 を抽出する。
      // number を昇順で並べ替えると、一番最初に来るインデックス番号が最小値の number
      // 一番最後に来るインデックス番号（discardSpade.length - 1）が最大値の number になる。

      this.sort(discardSpade);
      this.sort(discardHeart);
      this.sort(discardDiamond);
      this.sort(discardClub);


      // suit ごとの最小値の number
      this.discardSpadeMinNumber = discardSpade[0].number;
      this.discardHeartMinNumber = discardHeart[0].number;
      this.discardDiamondMinNumber = discardDiamond[0].number;
      this.discardClubMinNumber = discardClub[0].number;

      // suit ごとの最大値の number
      this.discardSpadeMaxNumber = discardSpade[discardSpade.length - 1].number;
      this.discardHeartMaxNumber = discardHeart[discardHeart.length - 1].number;
      this.discardDiamondMaxNumber = discardDiamond[discardDiamond.length - 1].number;
      this.discardClubMaxNumber = discardClub[discardClub.length - 1].number;


      console.log(`this.discardSpadeMinNumber:${this.discardSpadeMinNumber}`);
      console.log(`this.discardHeartMinNumber:${this.discardHeartMinNumber}`);
      console.log(`this.discardDiamondMinNumber:${this.discardDiamondMinNumber}`);
      console.log(`this.discardClubMinNumber:${this.discardClubMinNumber}`);

      console.log(`this.discardSpadeMaxNumber:${this.discardSpadeMaxNumber}`);
      console.log(`this.discardHeartMaxNumber:${this.discardHeartMaxNumber}`);
      console.log(`this.discardDiamondMaxNumber:${this.discardDiamondMaxNumber}`);
      console.log(`this.discardClubMaxNumber:${this.discardClubMaxNumber}`);


      // カードの最小値 最大値を posNum に変換
      this.discardSpadeMinPosNum = this.discardSpadeMinNumber + 13 * 0;
      this.discardHeartMinPosNum = this.discardHeartMinNumber + 13 * 1;
      this.discardDiamondMinPosNum = this.discardDiamondMinNumber + 13 * 2;
      this.discardClubMinPosNum = this.discardClubMinNumber + 13 * 3;

      this.discardSpadeMaxPosNum = this.discardSpadeMaxNumber + 13 * 0;
      this.discardHeartMaxPosNum = this.discardHeartMaxNumber + 13 * 1;
      this.discardDiamondMaxPosNum = this.discardDiamondMaxNumber + 13 * 2;
      this.discardClubMaxPosNum = this.discardClubMaxNumber + 13 * 3;


      console.log(`this.discardSpadeMinPosNum:${this.discardSpadeMinPosNum}`);
      console.log(`this.discardHeartMinPosNum:${this.discardHeartMinPosNum}`);
      console.log(`this.discardDiamondMinPosNum:${this.discardDiamondMinPosNum}`);
      console.log(`this.discardClubMinPosNum:${this.discardClubMinPosNum}`);

      console.log(`this.discardSpadeMaxPosNum:${this.discardSpadeMaxPosNum}`);
      console.log(`this.discardHeartMaxPosNum:${this.discardHeartMaxPosNum}`);
      console.log(`this.discardDiamondMaxPosNum:${this.discardDiamondMaxPosNum}`);
      console.log(`this.discardClubMaxPosNum:${this.discardClubMaxPosNum}`);
    }


    playableCard() { // どのカードが出せるのかを判定する

      this.players[this.playerTurn].hand.forEach(hand => {
        if (
          (hand.suit === 'spade' && hand.number === this.discardSpadeMinNumber - 1) ||
          (hand.suit === 'heart' && hand.number === this.discardHeartMinNumber - 1) ||
          (hand.suit === 'diamond' && hand.number === this.discardDiamondMinNumber - 1) ||
          (hand.suit === 'club' && hand.number === this.discardClubMinNumber - 1) ||

          (hand.suit === 'spade' && hand.number === this.discardSpadeMaxNumber + 1) ||
          (hand.suit === 'heart' && hand.number === this.discardHeartMaxNumber + 1) ||
          (hand.suit === 'diamond' && hand.number === this.discardDiamondMaxNumber + 1) ||
          (hand.suit === 'club' && hand.number === this.discardClubMaxNumber + 1)
        ) {
          hand.playable = true;
        }
      });
    }


    // すべてのプレイヤーの手札を描画する
    renderAllPlayerHand() {
      this.renderPlayerHand(this.player00_hands, 0);
      this.renderPlayerHand(this.player01_hands, 1);
      this.renderPlayerHand(this.player02_hands, 2);
      this.renderPlayerHand(this.player03_hands, 3);
    }


    renderTable(id) {
      // 読み込み時にすべて表示
      // ただし、 opacity で透明にしておく。
      // discard が true のカードを opacity を解いて表示する。

      while (id.firstChild) {
        id.firstChild.remove();
      }

      this.table.forEach(table => {
        const li = document.createElement('li');

        li.dataset.positionX = table.position.x;
        li.dataset.positionY = table.position.y;

        if (!table.discard) {
          li.classList.add('discard');
        }

        const img = document.createElement('img');
        img.src = table.url;
        // img.width = 100;
        img.height = 130; // 画面解像度 1920 * 1080

        li.appendChild(img);
        id.appendChild(li);

        // <ul id="table">
        // <li class="discard"><img src="img/cards/01.png" height="130"></li>
        // </ul>
      });

      this.tableLists = document.querySelectorAll('#table>li');
    }


    renderPlayerHand(id, index) {

      while (id.firstChild) {
        id.firstChild.remove();
      }

      this.players[index].hand.forEach((hand, ind) => {
        const li = document.createElement('li');

        // 属性の付加（共通）
        li.dataset.index = ind;
        li.dataset.suit = hand.suit;
        li.dataset.number = hand.number;
        li.dataset.posNum = hand.posNum;

        // 属性の付加（プレイヤーターンかそれ以外のプレイヤーかで分岐）
        if (index === this.playerTurn) {
          li.dataset.playable = hand.playable;
        } else {
          li.dataset.playable = false;
        }

        // クラスのつけ外し（プレイヤーターンのときに全員分実行）
        if (index === this.playerTurn) {
          this.elementsAddClass(this.playerTurn, 'playerTurn');
        }

        // クラスの付加 クリックイベントの付加（プレイヤーターンのみ）
        if (index === this.playerTurn && hand.playable === true) {
          if (this.playerTurn === 0) {
            li.classList.add('playable');
          }

          li.addEventListener('click', e => {
            if (this.clickableCard) {

              this.message.renderPlayingCard(this.playerTurn, li);
              this.playingCardzIndex++;
              this.playingCard(li, e);

              // ターンプレイヤーの手札を描画する
              const turnPlayer = [
                this.player00_hands,
                this.player01_hands,
                this.player02_hands,
                this.player03_hands,
              ];

              this.renderPlayerHand(turnPlayer[this.playerTurn], this.playerTurn);


              // カードのクリック連打防止対策
              this.clickableCard = false;

              setTimeout(() => {
                this.nextTurn();
              }, 3000);
            }
          });
        }

        const img = document.createElement('img');

        if (!this.openCards) { // サブプレイヤーの手札を裏にして表示する
          if (index === 0) {
            img.src = hand.url;
            // img.width = 100;
            img.height = 130; // 画面解像度 1920 * 1080
          } else if (index === 2) {
            img.src = 'img/cards/back.png';
            // img.width = 100;
            img.height = 130; // 画面解像度 1920 * 1080
          } else if (index === 1) {
            img.src = 'img/cards/side_back.png';
            img.height = 75;
          } else if (index === 3) {
            img.src = 'img/cards/side_back.png';
            img.height = 75;
          }
        } else { // サブプレイヤーの手札を表にして表示する
          if (index === 0) {
            img.src = hand.url;
            // img.width = 100;
            img.height = 130; // 画面解像度 1920 * 1080
          } else if (index === 2) {
            img.src = hand.url;
            // img.width = 100;
            img.height = 130; // 画面解像度 1920 * 1080
          } else if (index === 1) {
            li.style.height = '75px';
            li.style.marginLeft = '18px';
            img.height = 113;
            img.src = hand.url;
            img.style.transform = 'rotate(90deg)';
          } else if (index === 3) {
            li.style.height = '75px';
            li.style.marginLeft = '18px';
            img.height = 113;
            img.src = hand.url;
            img.style.transform = 'rotate(270deg)';
          }
        }

        li.appendChild(img);
        id.appendChild(li);

        // 表と裏の位置が同じになるように調整
        // 最初のリストのみ margin-top: -36px;
        if (this.openCards) {
          if (index === 1 || index === 3) {
            id.firstChild.style.marginTop = '-36px';
          }
        }

        // 生成されるコード
        // <ul id="player00_hands">
        //   <li class="playerTurn playable" data-custom="value">
        //     <img src="img/cards/01.png" height="130" alt="">
        //   </li>
        //   <li class="playerTurn" data-custom="value">
        //     <img src="img/cards/01.png" height="130" alt="">
        //   </li>
        // </ul>

        // <ul id="player01_hands">
        //   <li class="" data-custom="value">
        //     <img src="img/cards/side_back.png" height="75" alt="">
        //   </li>
        // </ul>

        // <ul id="player02_hands">
        //   <li class="" data-custom="value">
        //     <img src="img/cards/back.png" height="130" alt="">
        //   </li>
        // </ul>

        // <ul id="player03_hands">
        //   <li class="" data-custom="value">
        //     <img src="img/cards/side_back.png" height="75" alt="">
        //   </li>
        // </ul>
      });
    }


    gameFlow() { // ゲームの進行 状況に応じて分岐

      // 全員の手札が０枚の場合ゲームセットを実行

      // ターンプレイヤーの手札が０枚の場合（上がってるか、パス超過）
      //   次のプレイヤーへ。

      // ３人の手札が０枚、残りのプレイヤーが一人の場合
      //   this.playingRestCardAnimation(xPos, yPos) を実行

      // 手札の中から、どのカードが出せるか特定する。
      // その結果、手札から出せるカードがない場合と、出せる場合で処理を分岐

      //   手札から出せるカードがない場合、
      //     パスする。
      //     （各プレイヤーの手札中央に３秒パスボタンを表示。）
      //     （サブプレイヤー側に表示されるパスボタンはクリックできない。その後、パスを自動実行。）
      //     （メインプレイヤーは自分でパスボタンをクリックしてパスを実行。）
      //     次のプレイヤーへ。

      //   手札から出せるカードがある場合、
      //     サブプレイヤーは出せるカードの中からランダムに１枚選び、手札からカードを出す。
      //       （メインプレイヤーは自分でカードを選ぶ。）
      //     出されたカードをテーブルに反映する。
      //     次のプレイヤーへ。

      this.renderInformation(); // 各プレイヤーのステータスを表示

      if (
        this.clearPlayer === this.players.length
      ) {
        console.log(`playerTurn:${this.playerTurn}`, '全員の手札が０枚');
        this.gameSet();
      }
      else if (
        this.players[this.playerTurn].hand.length === 0
      ) {
        console.log(`playerTurn:${this.playerTurn}`, 'ターンプレイヤーの手札が０枚');
        this.nextTurn();
      }
      else if (
        this.clearPlayer === this.players.length - 1
      ) {
        console.log(`playerTurn:${this.playerTurn}`, '３人の手札が０枚');

        this.message.renderPlayingRestCard(this.playerTurn);

        setTimeout(() => {
          this.clickableCard = false;
          this.message.removeMessage();

          if (this.playerTurn === 0) {
            this.onePersonLeft(920, 890);
          } else if (this.playerTurn === 1) {
            this.onePersonLeft(120, 515);
          } else if (this.playerTurn === 2) {
            this.onePersonLeft(920, 140);
          } else if (this.playerTurn === 3) {
            this.onePersonLeft(1690, 515);
          }
        }, 3000);
      }
      else if (
        (this.players[this.playerTurn].hand.filter(hand => hand.playable)).length === 0
      ) {
        console.log(`playerTurn:${this.playerTurn}`, 'ターンプレイヤーの手札に出せるカードが１枚もない');
        this.message.renderThinking(this.playerTurn);
        this.createPassbtn(); // click(); => this.nextTurn();

        if (this.playerTurn === 0) {
          this.createOpenCardsbtn();
        }
      }
      else if (
        (this.players[this.playerTurn].hand.filter(hand => hand.playable)).length !== 0
      ) {
        console.log(`playerTurn:${this.playerTurn}`, 'ターンプレイヤーの手札に出せるカードがある');

        this.message.renderThinking(this.playerTurn);

        // メインプレイヤーは何もしない 手札を自分でクリックして実行
        // サブプレイヤーは this.playingCard(li) をクリックメソッドで実行
        // click(); => this.playingCard(li); this.nextTurn();

        if (this.playerTurn === 0) {
          this.createPassbtn(); // click(); => this.nextTurn();
          this.createOpenCardsbtn();
        } else {
          this.subPlayerTurn();
        }
      }
    }


    subPlayerTurn() { // サブプレイヤーのターン

      // #idname > li => player01_hands, player02_hands, player03_hands　※player00_hands は関係ない
      const playerLists = document.querySelectorAll(`#player0${this.playerTurn}_hands > li`);

      const playableList = [];
      playerLists.forEach(list => {
        if (list.dataset.playable === 'true') {
          playableList.push(list);
        }
      });

      // サブプレイヤーの意思決定 （とりあえず難易度は考えないでランダムで１枚選び、実行）
      // パスの数が2回までで、あえてパスする場合、とりあえず 5 分の 1 の確率でパスする
      if (this.players[this.playerTurn].pass <= parseInt(this.restart.passOverCount) - 1) {
        if (Math.floor(Math.random() * 10) >= 8) {
          setTimeout(() => {
            this.createPassbtn(); // click(); => this.nextTurn();
          }, 3000);
        } else {
          setTimeout(() => {
            // click() => this.playingCard(li); this.nextTurn();
            playableList[Math.floor(Math.random() * playableList.length)].click();
          }, 5000);
        }
      } else {
        setTimeout(() => {
          // click() => this.playingCard(li); this.nextTurn();
          playableList[Math.floor(Math.random() * playableList.length)].click();
        }, 5000);
      }
    }


    playingCard(li, e) { // クリックしたカードを場に出す
      // 絵柄と番号が一致した discard を true にする。

      this.table[li.dataset.posNum - 1].discard = true;

      if (parseInt(li.dataset.number) < 7) {
        this.checkLTSevenPassOver(li, 1); // 7 より小さい範囲内で隣り合うパス超過のカードをチェック
      } else {
        this.checkGTSevenPassOver(li, 1); // 7 より大きい範囲内で隣り合うパス超過のカードをチェック
      }


      // 手札から出されたカードをテーブルに表示する
      this.tableLists[li.dataset.posNum - 1].classList.remove('discard');


      // 手札のカードをテーブル上の該当する場所に移動する

      //   メインプレイヤーの場合
      //   クリックしたときの x, y 座標を取得して、
      //   テーブル上のカードをその座標から元の位置に移動する

      //   サブプレイヤーの場合
      //   手札の中央（パスボタンが表示される位置）の座標を調べて、
      //   その座標から元の位置に移動する

      //   移動するために必要な座標は
      //   メインプレイヤーの場合
      //   （手札のカードをクリックしたときの座標） - （テーブル上の該当するカードの座標）
      //   サブプレイヤーの場合
      //   （手札中央の座標） - （テーブル上の該当するカードの座標）
      //   で算出する。

      //   参考情報
      //   player00 手札中央座標 920px, 890px ※この情報は使わない
      //   player01 手札中央座標 120px, 515px
      //   player02 手札中央座標 920px, 140px
      //   player03 手札中央座標 1690px, 515px

      if (this.playerTurn === 0) {
        // クリックした位置によっては下端を超えてスクロールバーが表示されてしまう。
        // それを防ぐため、カードの幅と高さをそれぞれの座標から差し引いた座標を使用する。
        this.playingCardAnimation(li, (e.clientX - 87), (e.clientY - 130));
      } else if (this.playerTurn === 1) {
        this.playingCardAnimation(li, 120, 515);
      } else if (this.playerTurn === 2) {
        this.playingCardAnimation(li, 920, 140);
      } else if (this.playerTurn === 3) {
        this.playingCardAnimation(li, 1690, 515);
      }


      // 絵柄と番号が一致した 手札のカードを削除する。
      this.players[this.playerTurn].hand.splice(li.dataset.index, 1);


      // カードを削除した結果、手札が０枚になったら上がり。順位を割り当てる。
      if (this.players[this.playerTurn].hand.length === 0) {
        this.rank++;
        this.clearPlayer++;
        this.players[this.playerTurn].rank = this.rank;

        setTimeout(() => {
          this.message.removeMessage();
        }, 1000);

        setTimeout(() => {
          this.message.renderClearGame(this.playerTurn);
        }, 1030);
      }
    }


    checkLTSevenPassOver(li, next) {
      if ((parseInt(li.dataset.number) - next) - 1 < 0) {
        return;
      }

      if (
        (li.dataset.suit === 'spade' && this.table[(parseInt(li.dataset.posNum) - next) - 1].passOver) ||
        (li.dataset.suit === 'heart' && this.table[(parseInt(li.dataset.posNum) - next) - 1].passOver) ||
        (li.dataset.suit === 'diamond' && this.table[(parseInt(li.dataset.posNum) - next) - 1].passOver) ||
        (li.dataset.suit === 'club' && this.table[(parseInt(li.dataset.posNum) - next) - 1].passOver)
      ) {
        this.table[(parseInt(li.dataset.posNum) - next) - 1].passOver = false;
        next++;
        this.checkLTSevenPassOver(li, next);
      }
    }


    checkGTSevenPassOver(li, next) {
      if ((parseInt(li.dataset.number) + next) - 1 >= 13) {
        return;
      }

      if (
        (li.dataset.suit === 'spade' && this.table[(parseInt(li.dataset.posNum) + next) - 1].passOver) ||
        (li.dataset.suit === 'heart' && this.table[(parseInt(li.dataset.posNum) + next) - 1].passOver) ||
        (li.dataset.suit === 'diamond' && this.table[(parseInt(li.dataset.posNum) + next) - 1].passOver) ||
        (li.dataset.suit === 'club' && this.table[(parseInt(li.dataset.posNum) + next) - 1].passOver)
      ) {
        this.table[(parseInt(li.dataset.posNum) + next) - 1].passOver = false;
        next++;
        this.checkGTSevenPassOver(li, next);
      }
    }


    playingCardAnimation(li, xPos, yPos) {
      this.tableLists[li.dataset.posNum - 1].style.transform =
        `translate(
            ${xPos - this.tableLists[li.dataset.posNum - 1].dataset.positionX}px,
            ${yPos - this.tableLists[li.dataset.posNum - 1].dataset.positionY}px
      )`;

      // 上記の動作は一瞬で行い、下記の動作は１秒かけて行いたい。
      // 上記の動作と下記の動作を同時に行うと、 'transform 1s' が機能せず、
      // 一瞬でカードが表示されてしまうため、分けて行う。
      setTimeout(() => {
        this.tableLists[li.dataset.posNum - 1].style.zIndex = 20 + this.playingCardzIndex;
        this.tableLists[li.dataset.posNum - 1].style.transition = 'transform 1s';
        this.tableLists[li.dataset.posNum - 1].style.transform = 'translate(0px, 0px)';
      }, 30);
    }


    nextTurn() {
      // メッセージ消去
      this.message.removeMessage();

      this.clickableCard = true; // カードのクリックをできる状態にする

      // プレイヤーターンを ++ する。
      this.playerTurn++;
      if (this.playerTurn > 3) {
        this.playerTurn = 0;
      }

      this.getTableSuitsMinMax(); // 場札の絵柄別のカードの最小値・最大値の把握
      this.playableCard(); // どのカードが出せるのかを判定

      // すべてのプレイヤーの手札を再描画する
      this.renderAllPlayerHand();

      // 次のプレイヤーのターンへ
      this.gameFlow();
    }


    createPassbtn() {

      const passbtn = document.createElement('div');
      passbtn.classList.add('passbtn');

      if (this.playerTurn !== 0) {
        passbtn.classList.add('not_click');
      }

      passbtn.textContent = 'P A S S';

      // メインプレイヤーのパス回数が３回でこれ以上「あえてパス」ができない場合
      if (this.playerTurn === 0 && this.players[0].pass === parseInt(this.restart.passOverCount) &&
        this.players[0].hand.filter(hand => hand.playable).length !== 0) {
        passbtn.textContent = 'PASS無効';
      }

      // メインプレイヤーのパス回数が３回で、出せるカードがなくて、パス超過が確定している場合
      if (this.players[this.playerTurn].pass === parseInt(this.restart.passOverCount) &&
        this.players[this.playerTurn].hand.filter(hand => hand.playable).length === 0) {
        passbtn.textContent = 'PASS超過';
      }


      passbtn.addEventListener('click', () => {

        // メインプレイヤーの誤操作 防止対策

        // メインプレイヤーの手札に出せるカードがあるのにパス３回超過してしまうのを防止
        if (this.playerTurn === 0 && this.players[0].pass === parseInt(this.restart.passOverCount) &&
          this.players[0].hand.filter(hand => hand.playable).length !== 0) {
          return;
        }

        // メインプレイヤーがパスボタンを連打してしまうのを防止するため、クリック後 パスボタンを消去
        // パスボタンをクリックしたあとで、手札のカードへのクリックを防止
        if (this.playerTurn === 0) {
          // ターンプレイヤーの手札を描画する
          this.renderPlayerHand(this.player00_hands, this.playerTurn);
          // カードのクリック連打防止対策
          this.clickableCard = false;
        }


        // pass を ++ する。
        this.players[this.playerTurn].pass++;

        let passTime = 3000; // サブプレイヤー用 実行タイミング
        if (this.playerTurn === 0) {
          passTime = 0; // メインプレイヤー用 実行タイミング
        }

        // パス超過処理
        if (this.players[this.playerTurn].pass > parseInt(this.restart.passOverCount)) {
          // pass++ した結果、 pass が 3 を超えたら、ゲームを離脱するためのメソッドを実行
          // サブプレイヤーのターンになってから 3 秒後に実行
          // メインプレイヤーはパスボタンをクリックしてから すぐに実行

          // パス超過のメッセージを表示
          setTimeout(() => {
            this.clickableCard = false;
            this.message.renderPassOver(this.playerTurn);
          }, passTime);

          // さらに 3 秒後にパス超過のアニメーションを実行
          setTimeout(() => {
            this.message.removeMessage(); // メッセージを非表示にする

            if (this.playerTurn === 0) { this.passOver(920, 890); }
            else if (this.playerTurn === 1) { this.passOver(120, 515); }
            else if (this.playerTurn === 2) { this.passOver(920, 140); }
            else if (this.playerTurn === 3) { this.passOver(1690, 515); }
          }, passTime + 3000);

          // this.passOver のアニメーション完了におよそ 2 秒、
          // そこから 3 秒後に this.nextTurn() を実行するため、
          // メッセージ表示分（3 秒）を含めて setTimeout を 11 秒に設定する（※サブプレイヤーの場合）
          setTimeout(() => {
            this.nextTurn();
          }, passTime + 8000);
        }

        // 通常のパス処理
        else {
          // パスをする場合、ターン後、サブプレイヤーは３秒後にメッセージ、さらに３秒後に次のターンへ
          // メインプレイヤーはクリック後すぐにメッセージ、さらに３秒後に次のターンへ
          if (this.players[this.playerTurn].hand.filter(hand => hand.playable).length === 0) {
            setTimeout(() => {
              this.message.renderPass(this.playerTurn); // メッセージを表示する
            }, passTime);

            setTimeout(() => {
              this.nextTurn();
            }, passTime + 3000);
          }

          // あえてパスをする場合、すぐにメッセージ、さらに３秒後に次のターンへ
          else {
            this.message.renderDarePass(this.playerTurn); // メッセージを表示する

            setTimeout(() => {
              this.nextTurn();
            }, 3000);
          }
        }
      });

      if (this.playerTurn === 0) {
        this.player00_hands.appendChild(passbtn);
      } else if (this.playerTurn === 1) {
        this.player01_hands.appendChild(passbtn);
      } else if (this.playerTurn === 2) {
        this.player02_hands.appendChild(passbtn);
      } else if (this.playerTurn === 3) {
        this.player03_hands.appendChild(passbtn);
      }
      // <div class="passbtn">P A S S</div>

      // サブプレイヤーのターンの場合、３秒後にパスボタンをクリック
      if (this.playerTurn !== 0) {
        passbtn.click();
      }
    }



    createOpenCardsbtn() {
      const openCardsbtn = document.createElement('div');
      openCardsbtn.classList.add('openCardsbtn');

      openCardsbtn.innerHTML = '全員の手札を<br>表にする';

      openCardsbtn.addEventListener('click', () => {
        if (!this.openCards) {
          this.openCards = true;
          openCardsbtn.innerHTML = '全員の手札を<br>裏にする';
        } else {
          this.openCards = false;
          openCardsbtn.innerHTML = '全員の手札を<br>表にする';
        }

        this.renderPlayerHand(this.player01_hands, 1);
        this.renderPlayerHand(this.player02_hands, 2);
        this.renderPlayerHand(this.player03_hands, 3);
      });

      this.player00_hands.appendChild(openCardsbtn);
    }



    // パスを３回超過した場合の処理
    passOver(xPos, yPos) {

      this.playingRestCardAnimation(xPos, yPos);

      // パス超過したプレイヤーにランクを割り当てる
      this.players[this.playerTurn].rank = this.passOverRank;
      this.passOverRank--;
      this.clearPlayer++;
    }



    // 残りのプレイヤーが一人だけになった場合の処理
    onePersonLeft(xPos, yPos) {

      this.playingRestCardAnimation(xPos, yPos);

      // 残りのプレイヤーにランクを割り当てる
      this.rank++;
      this.clearPlayer++;
      this.players[this.playerTurn].rank = this.rank;

      setTimeout(() => {
        this.gameFlow();
      }, 5000);
    }



    playingRestCardAnimation(xPos, yPos) {

      const turnPlayer = [
        this.player00_hands,
        this.player01_hands,
        this.player02_hands,
        this.player03_hands,
      ];

      const animationCount = this.players[this.playerTurn].hand.length;
      let animationTime = 100;

      for (let i = 0; i < animationCount; i++) {

        // 残りの手札をおよそ２秒かけてテーブルにすべて出す
        animationTime = animationTime + (2000 / animationCount);

        setTimeout(() => {

          if (this.players[this.playerTurn].pass > parseInt(this.restart.passOverCount)) {
            this.table[(this.players[this.playerTurn].hand[0].posNum) - 1].passOver = true;
          }

          this.table[(this.players[this.playerTurn].hand[0].posNum) - 1].discard = true;

          this.tableLists[(this.players[this.playerTurn].hand[0].posNum) - 1].classList.remove('discard');

          this.tableLists[(this.players[this.playerTurn].hand[0].posNum) - 1].style.transform =
            `translate(
            ${xPos - this.tableLists[(this.players[this.playerTurn].hand[0].posNum) - 1].dataset.positionX}px,
            ${yPos - this.tableLists[(this.players[this.playerTurn].hand[0].posNum) - 1].dataset.positionY}px
          )`;


          setTimeout(() => {
            this.playingCardzIndex++;
            this.tableLists[(this.players[this.playerTurn].hand[0].posNum) - 1].style.zIndex = 20 + this.playingCardzIndex;
            this.tableLists[(this.players[this.playerTurn].hand[0].posNum) - 1].style.transition = 'transform 1s';
            this.tableLists[(this.players[this.playerTurn].hand[0].posNum) - 1].style.transform = 'translate(0px, 0px)';
          }, 30);


          setTimeout(() => {
            this.players[this.playerTurn].hand.splice(0, 1); // 内部情報の手札を削除

            // ターンプレイヤーの手札を描画する
            this.renderPlayerHand(turnPlayer[this.playerTurn], this.playerTurn);
          }, 50);

        }, animationTime);
      }
    }



    gameSet() {

      // プレイヤーターンのクラスを全員外しておく。
      this.elementsRemoveClass('playerTurn');


      // １位のプレイヤーの手札の背景色を変更しておく。
      let winPlayerIndex = 0;

      this.players.forEach((player, index) => {
        if (player.rank === 1) {
          winPlayerIndex = index;
        }
      });

      this.elementsAddClass(winPlayerIndex, 'winPlayer');


      // ※順位に応じたセリフを表示する。
      this.message.renderPlayersAddRank(0);
      this.message.renderPlayersAddRank(1);
      this.message.renderPlayersAddRank(2);
      this.message.renderPlayersAddRank(3);

      // 最初に戻るボタンを生成する。
      this.createBackToStartbtn('hand');
    }


    elementsRemoveClass(className) { // すべてのプレイヤーのクラスを外す
      this.player00_hands.classList.remove(className);
      this.player01_hands.classList.remove(className);
      this.player02_hands.classList.remove(className);
      this.player03_hands.classList.remove(className);

      this.info_player00.classList.remove(className);
      this.info_player01.classList.remove(className);
      this.info_player02.classList.remove(className);
      this.info_player03.classList.remove(className);
    }



    elementsAddClass(num, className) { // クラスのつけ外し
      if (num === 0) {
        this.player00_hands.classList.add(className);
        this.player01_hands.classList.remove(className);
        this.player02_hands.classList.remove(className);
        this.player03_hands.classList.remove(className);

        this.info_player00.classList.add(className);
        this.info_player01.classList.remove(className);
        this.info_player02.classList.remove(className);
        this.info_player03.classList.remove(className);

      } else if (num === 1) {
        this.player00_hands.classList.remove(className);
        this.player01_hands.classList.add(className);
        this.player02_hands.classList.remove(className);
        this.player03_hands.classList.remove(className);

        this.info_player00.classList.remove(className);
        this.info_player01.classList.add(className);
        this.info_player02.classList.remove(className);
        this.info_player03.classList.remove(className);

      } else if (num === 2) {
        this.player00_hands.classList.remove(className);
        this.player01_hands.classList.remove(className);
        this.player02_hands.classList.add(className);
        this.player03_hands.classList.remove(className);

        this.info_player00.classList.remove(className);
        this.info_player01.classList.remove(className);
        this.info_player02.classList.add(className);
        this.info_player03.classList.remove(className);

      } else if (num === 3) {
        this.player00_hands.classList.remove(className);
        this.player01_hands.classList.remove(className);
        this.player02_hands.classList.remove(className);
        this.player03_hands.classList.add(className);

        this.info_player00.classList.remove(className);
        this.info_player01.classList.remove(className);
        this.info_player02.classList.remove(className);
        this.info_player03.classList.add(className);
      }

      if (num !== 0) {
        this.player01_hands.classList.add('not_click');
        this.player02_hands.classList.add('not_click');
        this.player03_hands.classList.add('not_click');
      }
    }


    renderInformation() {
      this.info_player00.textContent =
        `${this.players[0].name}:
          残り ${String(this.players[0].hand.length).padStart(2, '0')} 枚　
          パス ${this.players[0].pass} 回　
          順位 第 ${this.players[0].rank} 位`;
      this.info_player01.textContent =
        `${this.players[1].name}:
          残り ${String(this.players[1].hand.length).padStart(2, '0')} 枚　
          パス ${this.players[1].pass} 回　
          順位 第 ${this.players[1].rank} 位`;
      this.info_player02.textContent =
        `${this.players[2].name}:
          残り ${String(this.players[2].hand.length).padStart(2, '0')} 枚　
          パス ${this.players[2].pass} 回　
          順位 第 ${this.players[2].rank} 位`;
      this.info_player03.textContent =
        `${this.players[3].name}:
          残り ${String(this.players[3].hand.length).padStart(2, '0')} 枚　
          パス ${this.players[3].pass} 回　
          順位 第 ${this.players[3].rank} 位`;
    }
  } // Sevens クラス ここまで


  // ゲーム開始

  // グローバル変数 読み込み時にのみ参照する
  let difficulty = 'not';
  let passOverCount = '3';

  new Load();
  new Restart();



  // // 座標取得 コード開発用 必要なければ消去すること
  // document.addEventListener('click', e => {
  //   console.log(e.clientX, e.clientY);
  // });

})();
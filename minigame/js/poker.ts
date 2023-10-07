'use strict';

// よく使うコマンド

// tsc ウォッチ  shift + ctrl + b
// コードを整える  shift + alt + f
// Beautify sass  ctrl + shit + p => コマンドパレット


// 目的

// TypeScript の基本的な機能の習得



// 不具合など

// 数字の連続性のコードにバグがある。 => サブプレイヤーの意思決定ミスにつながる。 decisionMaking_straight_number(bool_straight_number: boolean)
// ex) 3 8 9 10 11 => 3 を捨てる => 正しい意思決定
// ex) 1 2 6 7 8 => 6 を捨てる => 意思決定ミス
// ex) 6 7 11 12 13 => 11 を捨てる => 意思決定ミス
// ex) 2 3 12 13 1 => 12 を捨てる => 意思決定ミス
// ex) 10 12 13 11 11 => 11 を 2 枚捨てる => 意思決定ミス

// => 解消済み！


// ※手札のカードが他のプレイヤー手札とまったく同じ場合、順位は同一にすべき。
// => 対処は済んでいるけど、挙動の確認は済んでいない。



// 実装後 反省点など

// カードアニメーション
// 各カードの座標の取得は、個別に直接的に取得したほうがよい。 => area > li > img

// 今回のやり方（エリアごとに取得して各カードの座標を設定する => area ）では、
// 後からエリア内の配置の修正が必要になった場合に、その都度 修正が必要になってしまう。


// ツーペアを検証するコードに関しては、
// 効率的なコードよりも、たとえコードの重複が発生しても
// 可読性を重視したコードにしたほうがよかったかもしれない。



// 疑問
// return がキャンセルできる範囲 return 挙動



// サブプレイヤーの思考方法 => 実装済み
// 以下 subPlayerThought() の参考情報
{
  // 意思決定の仕方

  // 絵柄が同じか
  // 数字が同じか
  // 数字が連続してるか

  // ex) sp 13, da 12, cl 07, cl 09, cl 11

  // 数字の連続性に着目すると、11 12 13 が連続してる。
  // また 09 11 の間に 10 が来ればストレートになる。
  // 07 を捨てて、カードを補充する。

  // 絵柄の共通性に着目すると、 club のカードが３枚ある。
  // club のカードが２枚来ればフラッシュになる。
  // 残り２枚を捨ててカードを補充する。

  // 手札にペアがあれば、それらは交換しない
  // 手札に 01 または 13 があれば、そのカードは交換しない



  // 強い役から順番に手札が近いかどうか走査して、どの役を狙って意思決定を行うのか決める。

  // １ 絵柄が一致しているかどうか
  // ２ 数字が一致しているかどうか
  // ３ 数字が連続してるかどうか

  // ２ と ３ を同時に満たすことは絶対にありえない。
  // １ と ２ 、 １ と ３ を同時に満たすことはありえる。

  // １ と ３ はロイヤル ストレート フラッシュ ストレート フラッシュ。
  // １ と ２ は同時に満たしても特にメリットはない。フォーカードのまま。


  // ロイヤル ストレート フラッシュ ストレート フラッシュ
  // 絵柄が一致しているかどうか
  // 数字が連続してるかどうか

  // １枚入れ替えるだけで成立するような状態ならば狙うように設定するのもありかもしれない。
  // ノーハンドなら当然狙う。
  // 逆にノーハンドになるリスクがある場合、どうするべきか判断が難しい……。


  // フォーカード
  // 数字が一致しているかどうかの最強

  // 成立してる場合は何もしない。


  // フルハウス
  // 数字が一致しているかどうか

  // 成立してる場合は何もしない。


  // フラッシュ
  // 絵柄が一致しているかどうかの最強

  // 成立してる場合は、数字が連続（4 枚）してるかどうかで、
  // ロイヤル ストレート フラッシュ ストレート フラッシュも狙えるけど、
  // 外せばノーハンドに下がる。

  // フラッシュ かつ ツーペアがそろっていればフルハウスも狙えるけど、
  // 外せばツーペアに下がる。

  // 基本的にカード交換は行わない。


  // ストレート
  // 数字が連続してるかどうかの最強

  // 成立してる場合は、絵柄が一致（4 枚）してるかどうかで、
  // ロイヤル ストレート フラッシュ ストレート フラッシュ フラッシュも狙えるけど、
  // 外せばノーハンドに下がる。

  // 基本的にカード交換は行わない。


  // スリーカード
  // 数字が一致しているかどうか

  // 一致してない 2 枚のカードを捨て札に出して、フォーカード フルハウスを狙うのが定石。


  // ツーペア
  // 数字が一致しているかどうか

  // 一致してない 1 枚のカードを捨て札に出して、フルハウスを狙うのが定石。


  // ワンペア
  // 数字が一致しているかどうか

  // 絵柄が一致（4 枚）しているかどうか => フラッシュを狙う。
  // （ワンペアからノーハンドになるリスクをどう比較する？） => 基本的には狙うべき。

  // 数字が連続してる（4 枚）かどうか => ストレートを狙う。
  // （ワンペアからノーハンドになるリスクをどう比較する？） => 基本的には狙うべき。

  // 上記条件に合致してない
  // => 一致してない 3 枚のカードを捨て札に出して、フォーカード フルハウス スリーカード ツーペアを狙う。
  // 基本的にはスリーカードを狙うのが定石。


  // ノーハンド
  // 数字がまったく一致していない

  // 絵柄が一致（4 枚）・数字が連続（4 枚） 両方満たしてる
  //   => ロイヤル ストレート フラッシュ・ストレート フラッシュを狙う。

  // 絵柄が一致しているかどうか （3 枚以上） => フラッシュを狙う。

  // 数字が連続してるかどうか （3 枚以上） => ストレートを狙う。

  // （※ありえない）数字が一致しているかどうか => フォーカード フルハウス スリーカード ツーペアを狙う。

  // 上記条件に合致してない
  // 強いカード 1 13 12 などがあれば捨てない？で、ほかのカードをすべて捨てる。
  // 強いカードもないなら、すべてのカードを捨てる。
}



(() => {

  // 読み込み時にのみ実行するクラス
  class Load {
    private _page: number;
    private _pageMax: number;
    private _textBox: HTMLElement | null;
    private _tool: Tool;

    constructor() {
      this._page = 1;
      this._pageMax = 5;
      this._textBox = document.querySelector('.rule_container>dl');

      this._tool = new Tool();

      this.createMessageBtn();
      this.createRuleBtn();
      this.createRuleBox();
    }

    // ロード時、メッセージオンオフ切り替えボタンを表示
    createMessageBtn() {
      const messageBtn = document.querySelector<HTMLDivElement>('.messageBtn');
      this._tool.nullCheck(messageBtn);

      let messageBtnClicked = false;

      messageBtn!.innerHTML = 'メッセージ<br>O N';

      messageBtn!.addEventListener('click', () => {

        const player0_message = document.querySelector<HTMLDivElement>('.player0_message');
        const player1_message = document.querySelector<HTMLDivElement>('.player1_message');
        const player2_message = document.querySelector<HTMLDivElement>('.player2_message');
        const player3_message = document.querySelector<HTMLDivElement>('.player3_message');

        this._tool.nullCheck(player0_message);
        this._tool.nullCheck(player1_message);
        this._tool.nullCheck(player2_message);
        this._tool.nullCheck(player3_message);

        player0_message!.classList.toggle('message_off');
        player1_message!.classList.toggle('message_off');
        player2_message!.classList.toggle('message_off');
        player3_message!.classList.toggle('message_off');

        if (!messageBtnClicked) {
          messageBtnClicked = true;
          messageBtn!.innerHTML = 'メッセージ<br>OFF';
        } else {
          messageBtnClicked = false;
          messageBtn!.innerHTML = 'メッセージ<br>O N';
        }
      });
    }



    // ロード時、ルール説明ボタンを表示
    createRuleBtn() {
      const rule_container = document.querySelector<HTMLDivElement>('.rule_container');
      const mask = document.querySelector<HTMLDivElement>('#mask');
      const ruleBtn = document.querySelector<HTMLDivElement>('.ruleBtn');

      this._tool.nullCheck(rule_container);
      this._tool.nullCheck(mask);
      this._tool.nullCheck(ruleBtn);

      let ruleBtnClicked = false;

      ruleBtn!.innerHTML = 'ルール 説明';

      ruleBtn!.addEventListener('click', () => {
        rule_container!.classList.remove('hide');
        mask!.classList.remove('hide');

        if (!ruleBtnClicked) {
          while (this._textBox!.firstChild) {
            this._textBox!.firstChild.remove();
          }
          this.createRuleText();
          ruleBtnClicked = true;
        } else {
          return;
        }
      });
    }



    // ルール説明領域を生成
    createRuleBox() {
      this.createRuleText();

      // pagePrev 前のページへ戻る の挙動
      const pagePrev = document.querySelector<HTMLElement>('.pagePrev');
      this._tool.nullCheck(pagePrev);
      pagePrev!.addEventListener('click', () => {
        if (this._page === 1) {
          return;
        } else {
          while (this._textBox!.firstChild) {
            this._textBox!.firstChild.remove();
          }
          this._page--;
          this.createRuleText();
        }
      });

      // pageNext 次のページへ進む の挙動
      const pageNext = document.querySelector<HTMLElement>('.pageNext');
      this._tool.nullCheck(pageNext);
      pageNext!.addEventListener('click', () => {
        if (this._page === this._pageMax) {
          return;
        } else {
          while (this._textBox!.firstChild) {
            this._textBox!.firstChild.remove();
          }
          this._page++;
          this.createRuleText();
        }
      });


      // ページ数の生成
      const pageCurrent = document.querySelector<HTMLElement>('.pageCurrent');
      this._tool.nullCheck(pageCurrent);
      pageCurrent!.textContent = `${this._page} / ${this._pageMax}`;


      // 閉じるボタンの挙動
      const close = document.querySelector<HTMLElement>('.close');
      const rule_container = document.querySelector<HTMLDivElement>('.rule_container');
      const mask = document.querySelector<HTMLDivElement>('#mask');

      this._tool.nullCheck(close);
      this._tool.nullCheck(rule_container);
      this._tool.nullCheck(mask);

      close!.addEventListener('click', () => {
        rule_container!.classList.add('hide'); // cssClass と組み合わせることで translate(0, -1000px); 実行
        mask!.classList.add('hide'); // cssClass と組み合わせることで display: none; 実行
      });
    }



    // ルール説明領域を生成
    createRuleText() {

      const titleText = [];
      const sentenceText = [];

      // 詳細な説明文

      // １ページ目
      if (this._page === 1) {
        titleText.push(`日本式ポーカー（クローズド・ポーカー）`);

        sentenceText.push(
          `チップやベット・アンティ・フォールドなどのない簡易なポーカー。<br>
           左側の役一覧（※上に記載された役ほど強い）を参考に手札をそろえて、<br>
           より強い役を作ったプレイヤーが勝ち。<br><br>`
        );

        titleText.push(`「ゲームの進め方」について`);

        sentenceText.push(
          `「カードを配る」ボタンをクリックすると、すべてのプレイヤーにカードが 5 枚ずつ配られる。<br><br>
           自分のターンになったら、手札から不要なカードを捨て札に出して、<br>
           積み札から捨てた枚数分 補充することができる。<br><br>
           カードの補充ができるのは一回だけ。補充が終わったら次のプレイヤーのターンへ。<br>
           補充しない場合は そのまま 次のプレイヤーのターンへ。<br><br>

           すべてのプレイヤーのターンが終わったら、一斉に手札を公開する。<br>
           お互いの役を見比べて、順位が確定する。<br><br>

           （次のページに続く）`
        );
      }

      // ２ページ目
      else if (this._page === 2) {
        titleText.push(`「役の種類」について（強い順に記載）`);

        sentenceText.push(
          `ロイヤルストレートフラッシュ<br>
           　手札のカードがすべて同じ絵柄で、数字「 10 J Q K A 」がそろった役。<br><br>

           ストレートフラッシュ<br>
           　手札のカードがすべて同じ絵柄で、すべて連続した数字である役。<br><br>

           フォーカード<br>
           　手札に同じ数字が 4 枚そろった役。<br><br>

           フルハウス<br>
           　スリーカードとワンペアがそろった役。<br>
           　フルハウスの強さはスリーカードの数字によって判断される。<br>
           　同じ数字のスリーカードを相手も持っていた場合はワンペアの数字によって判断される。<br><br>

           フラッシュ<br>
           　手札のカードがすべて同じ絵柄である役。<br><br>

           （次のページに続く）`
        );
      }

      // ３ページ目
      else if (this._page === 3) {
        titleText.push(`「役の種類」について（強い順に記載）`);

        sentenceText.push(
          `ストレート<br>
           　手札のカードがすべて連続した数字である役。<br><br>

           スリーカード<br>
           　手札に同じ数字が 3 枚そろった役。<br><br>

           ツーペア<br>
           　手札にワンペアが 2 つそろった役。<br><br>

           ワンペア<br>
           　手札に同じ数字が 2 枚そろった役。<br><br>

           ノーハンド（ハイカード）<br>
           　上記のどの役もそろわない役。<br><br>

           （次のページに続く）`
        );
      }

      // ４ページ目
      else if (this._page === 4) {
        titleText.push(`「順位の決め方」について`);

        sentenceText.push(
          `ポーカーの役が強いほど、高い順位が割り当てられる。<br><br>

          ポーカーの役が同じ場合は、そろえた役の中の数字の強さで順位が決まる。<br><br>

          そろえた役の中の数字も同じ場合は、役に属さないカードの数字の強さで順位が決まる。<br><br>

          役に属さないカードの数字も同じ<br>
          （※同じ役で、自分の手札と相手の手札のカードの数字がすべて同じ）場合は、<br>
          同一の順位が割り当てられる。<br><br>

          （次のページに続く）`
        );
      }

      // ５ページ目
      else if (this._page === 5) {
        titleText.push(`「カードの数字の強さ」について`);

        sentenceText.push(
          `ポーカーは「A」が一番強く、<br>
           「K」→「Q」→「J」→「10」と順番に弱くなっていき、「2」が一番弱いカード。<br><br>

           ただし、例外として、手札が「 A 2 3 4 5 」となっている場合は、「A」が一番弱いカードになる。<br><br>`
        );

        titleText.push(`「ストレート系の役の注意点」について`);

        sentenceText.push(
          `「 A 2 3 4 5 」  これはストレート。この場合 A が最も弱くなる。<br><br>

           「 10 J Q K A 」 これはストレート。この場合 A が最も強くなる。<br><br>

           「 J Q K A 2 」  これはストレートではない。`
        );
      }


      // ルール説明ページ 生成
      for (let i = 0; i < titleText.length; i++) {
        this.insertRuleTitle(titleText[i]);
        this.insertRuleSentence(sentenceText[i]);
      }

      // 現在ページ数の更新
      const pageCurrent = document.querySelector<HTMLElement>('.pageCurrent');
      this._tool.nullCheck(pageCurrent);
      pageCurrent!.textContent = `${this._page} / ${this._pageMax}`;
    }


    // ルール タイトル文 生成
    insertRuleTitle(titleText: string) {
      const title = document.createElement('dt');
      title.innerHTML = titleText;

      this._textBox!.appendChild(title);
    }


    // ルール 説明文 生成
    insertRuleSentence(sentenceText: string) {
      const sentence = document.createElement('dd');
      sentence.innerHTML = sentenceText;

      this._textBox!.appendChild(sentence);
    }
  }





  // メッセージ関係のメソッドはこちらにまとめておく。
  class Message {
    public readonly messagesArea: (HTMLElement | null)[];
    players: { handListNumber: number; bluff: boolean; }[];

    constructor() {
      this.messagesArea = [
        document.querySelector('.player0_message'),
        document.querySelector('.player1_message'),
        document.querySelector('.player2_message'),
        document.querySelector('.player3_message')
      ];

      this.players = [];
      for (let i = 0; i < this.messagesArea.length; i++) {
        this.players[i] = {
          handListNumber: 0,
          bluff: false
        };
      }
    }



    // セリフを１文字ずつ表示する
    animation(texts: string[], area: HTMLElement) {

      let newText = '';
      let gap = 0;

      texts.forEach((text) => {
        text.split("").forEach((value) => {
          newText += '<span style ="animation:showtext 0.05s ease ' + gap * 0.03 + 's forwards;">' + value + '</span>';
          gap++;
        });
        newText += '<br>';
      });

      area.innerHTML = newText;
    }



    // 各プレイヤーのメッセージを表示する 全員表示したい場合は 'all' を指定すること。
    openMessage(playerNum: string | number) {
      // ※データ型にもとづいて分岐
      if (typeof playerNum === 'string') {
        for (let i = 0; i < this.messagesArea.length; i++) {
          this.messagesArea[i]!.classList.remove('hide');
        }
      }
      else if (typeof playerNum === 'number') {
        this.messagesArea[playerNum]!.classList.remove('hide');
      }
    }

    // すべてのプレイヤーのメッセージを非表示にする
    hideMessage() {
      for (let i = 0; i < this.messagesArea.length; i++) {
        this.messagesArea[i]!.classList.add('hide');
      }
    }



    // ストックアニメーション完了後、手札を確認して、手札の中身に応じたセリフを表示 ブラフなし
    // 補充後の手札から適切なセリフを表示 ブラフあり
    handCondition(
      handListNumber: number,
      playerNumber: number,
      bluff: boolean = false // ブラフはカード補充後の手札がノーハンドの場合のみ、一定の確率にもとづいて適用する
    ) {

      // ノーハンド
      const high_card = [
        'う～ん・・・',
        'むぅ～・・・'
      ];

      // ワンペア
      const a_pair = [
        'なるほど・・・',
        'まあまあ・・・',
        '悪くない。'
      ];

      // ツーペア
      const two_pair = [
        'いい感じ。',
        'いいかも。'
      ];

      // スリーカード
      const three_of_a_kind = [
        'よし、きた！',
        'これならいける！'
      ];

      // ストレート フラッシュ フルハウス ストレートフラッシュ ロイヤルストレートフラッシュ
      const strong_handList = [
        'こっ・・・これは・・・！！！'
      ];

      // 役にもとづいたセリフを一括管理
      const message_handLists = [
        high_card,
        a_pair,
        two_pair,
        three_of_a_kind,
        strong_handList
      ];

      this.players[playerNumber].handListNumber = handListNumber;

      // プレイヤー手札にもとづいてセリフを表示
      for (
        let checkHandListNum = 0;
        checkHandListNum < message_handLists.length;
        checkHandListNum++
      ) {
        // ブラフを実行するかどうか決める。
        let bluffExecution = 0;

        // ブラフあり かつ ノーハンド の場合
        // とりあえず 66 % の確率で実行することにする
        // メインプレイヤーはブラフを実行しない。
        if (bluff === true && handListNumber === 0 && playerNumber !== 0) {
          bluffExecution = Math.floor(Math.random() * 3);
          if (bluffExecution === 0) {
            console.log(`ノーハンド ブラフ 実行しない！`);
          }
        }

        // ブラフあり かつ ノーハンド かつ ブラフ実行変数が一定値以上 の場合
        if (bluff === true && handListNumber === 0 && bluffExecution >= 1) {
          console.log(`ノーハンド ブラフ 実行！`);
          const randomNumber = Math.floor(Math.random() * strong_handList.length);

          this.animation(
            [strong_handList[randomNumber]],
            this.messagesArea[playerNumber]!
          );

          this.players[playerNumber].bluff = true;
          break;
        }
        // ノーハンド ワンペア ツーペア スリーカード ストレート の場合
        else if (handListNumber === checkHandListNum) {
          const randomNumber = Math.floor(Math.random() * message_handLists[checkHandListNum].length);

          this.animation(
            [message_handLists[checkHandListNum][randomNumber]],
            this.messagesArea[playerNumber]!
          );
          break;
        }
        // フラッシュ フルハウス ストレートフラッシュ ロイヤルストレートフラッシュ の場合
        else if (handListNumber >= message_handLists.length) {
          const randomNumber = Math.floor(Math.random() * strong_handList.length);

          this.animation(
            [strong_handList[randomNumber]],
            this.messagesArea[playerNumber]!
          );
          break;
        }
      }

      // 上記コードは下記コードと同じ ただしメインプレイヤーのみ例示
      {
        // // ノーハンド
        // if (players_handListNumber[0] === 0) {
        //   const randomNumber = Math.floor(Math.random() * message_handLists[0].length);
        //   this.messagesArea[0]!.textContent = message_handLists[0][randomNumber];
        // }

        // // ワンペア
        // else if (players_handListNumber[0] === 1) {
        //   const randomNumber = Math.floor(Math.random() * message_handLists[1].length);
        //   this.messagesArea[0]!.textContent = message_handLists[1][randomNumber];
        // }

        // // ツーペア
        // else if (players_handListNumber[0] === 2) {
        //   const randomNumber = Math.floor(Math.random() * message_handLists[2].length);
        //   this.messagesArea[0]!.textContent = message_handLists[2][randomNumber];
        // }

        // // スリーカード
        // else if (players_handListNumber[0] === 3) {
        //   const randomNumber = Math.floor(Math.random() * message_handLists[3].length);
        //   this.messagesArea[0]!.textContent = message_handLists[3][randomNumber];
        // }

        // // ストレート フラッシュ フルハウス ストレートフラッシュ ロイヤルストレートフラッシュ
        // else if (players_handListNumber[0] >= 4) {
        //   const randomNumber = Math.floor(Math.random() * message_handLists[4].length);
        //   this.messagesArea[0]!.textContent = message_handLists[4][randomNumber];
        // }
      }
    }


    // サブプレイヤー思考中のセリフ
    playerThought(playerNumber: number) {
      const messages = [
        'う～ん、それじゃあ・・・',
        'どうしようか・・・',
        'どれを出すべきか・・・',
        'ここは・・・',
        'この手札なら・・・'
      ];

      if (this.messagesArea[playerNumber] === null) {
        throw new Error(`Error! this.messagesArea[${playerNumber}] === null`);
      }

      this.animation(
        [messages[Math.floor(Math.random() * messages.length)]],
        this.messagesArea[playerNumber]!
      );
    }



    // 意思決定のセリフ
    // カードを１枚も選択していない場合で分岐させる
    playerDecide(playerNumber: number, selectedCardsCount: number) {
      let messages: string[] = [];
      if (selectedCardsCount !== 0) {
        messages = [
          'よし、これにしよう！',
          'じゃあ、これだ！'
        ];
      } else if (selectedCardsCount === 0) {
        messages = [
          'ここは このまま 勝負！'
        ];
      }

      if (this.messagesArea[playerNumber] === null) {
        throw new Error(`Error! this.messagesArea[${playerNumber}] === null`);
      }

      this.animation(
        [messages[Math.floor(Math.random() * messages.length)]],
        this.messagesArea[playerNumber]!
      );
    }



    // メインプレイヤーがサブプレイヤーたちの思惑を推察するセリフを表示

    // メインプレイヤーのターンになったら、サブプレイヤーたちのセリフを表示
    // サブプレイヤーたちのセリフから自信があるかどうかを判別して、
    // メインプレイヤーのセリフを表示

    predict_subPlayers_handList(subPlayerNames: string[]) {
      const messages = [
        `は自信がありそうだ・・・。`, // ツーペア以上
        `は微妙な感じがする・・・。`, // ワンペア
        `は自信がなさそうだ・・・。`, // ノーハンド ブラフなし
        `は自信があるフリをしてそうだ・・・。` // ノーハンド ブラフあり
      ];

      if (this.messagesArea[0] === null) {
        throw new Error(`Error! this.messagesArea[${0}] === null`);
      }

      // サブプレイヤー別に どのセリフを表示するか管理するための配列
      let messagesIndex = [0, 0, 0];

      for (let i = 1; i < this.players.length; i++) {
        if (this.players[i].handListNumber >= 2) {
          messagesIndex[i - 1] = 0;
        } else if (this.players[i].handListNumber === 1) {
          messagesIndex[i - 1] = 1;
        } else if (this.players[i].handListNumber === 0 && this.players[i].bluff === false) {
          messagesIndex[i - 1] = 2;
        } else if (this.players[i].handListNumber === 0 && this.players[i].bluff === true) {
          messagesIndex[i - 1] = 3;
        }
      }

      this.animation(
        [
          `${subPlayerNames[0]} ${messages[messagesIndex[0]]}`,
          `${subPlayerNames[1]} ${messages[messagesIndex[1]]}`,
          `${subPlayerNames[2]} ${messages[messagesIndex[2]]}`,
          `このまま勝負すべきか・・・。`,
          `より強い手札を目指すべきか・・・。`
        ],
        this.messagesArea[0]!
      );
    };



    // 手札を公開する前のセリフを表示
    before_Open_PlayersHand() {
      const messages = [
        'これならいける！', // スリーカード以上
        'これはいけるか・・・。', // ツーペア
        '微妙だな・・・。', // ワンペア
        'うーん、どうだろう・・・。', // ノーハンド ブラフなし
        'これは勝ったも同然！' // ノーハンド ブラフあり
      ];

      for (let i = 0; i < this.messagesArea.length; i++) {
        if (this.messagesArea[i] === null) {
          throw new Error(`Error! this.messagesArea[${i}] === null`);
        }
      }

      // サブプレイヤー別に どのセリフを表示するか管理するための配列
      let messagesIndex = [0, 0, 0];

      for (let i = 1; i < this.players.length; i++) {
        console.log(
          `this.players[${i}].handListNumber: ${this.players[i].handListNumber}`,
          `this.players[${i}].bluff: ${this.players[i].bluff}`
        );

        if (this.players[i].handListNumber >= 3) {
          messagesIndex[i - 1] = 0;
        } else if (this.players[i].handListNumber === 2) {
          messagesIndex[i - 1] = 1;
        } else if (this.players[i].handListNumber === 1) {
          messagesIndex[i - 1] = 2;
        } else if (this.players[i].handListNumber === 0 && this.players[i].bluff === false) {
          messagesIndex[i - 1] = 3;
        } else if (this.players[i].handListNumber === 0 && this.players[i].bluff === true) {
          messagesIndex[i - 1] = 4;
        }

        this.animation(
          [`${messages[messagesIndex[i - 1]]}`],
          this.messagesArea[i]!
        );
      }

      this.animation(
        ['それでは結果発表！'],
        this.messagesArea[0]!
      );
    }



    // 手札を公開するときのセリフを表示
    open_PlayersHand() {
      const messages = [
        'せーの オープン！'
      ];

      for (let i = 0; i < this.messagesArea.length; i++) {
        if (this.messagesArea[i] === null) {
          throw new Error(`Error! this.messagesArea[${i}] === null`);
        }

        this.animation(
          [messages[Math.floor(Math.random() * messages.length)]],
          this.messagesArea[i]!
        );
      }
    }



    // それぞれのプレイヤーが順番に手札の役名をセリフで表示
    show_playerHand(
      handList: string,
      strongNumber: number,
      playerNumber: number
    ) {
      if (this.messagesArea[playerNumber] === null) {
        throw new Error(`Error! this.messagesArea[${playerNumber}] === null`);
      }

      let strongCardName = '';
      if (strongNumber === 1) { strongCardName = 'エース'; }
      else if (strongNumber === 11) { strongCardName = 'ジャック'; }
      else if (strongNumber === 12) { strongCardName = 'クイーン'; }
      else if (strongNumber === 13) { strongCardName = 'キング'; }

      if (
        strongNumber === 1 ||
        strongNumber === 11 ||
        strongNumber === 12 ||
        strongNumber === 13
      ) {

        this.animation(
          [`${handList} の ${strongCardName} ！`],
          this.messagesArea[playerNumber]!
        );
      }
      else {

        this.animation(
          [`${handList} の ${strongNumber} ！`],
          this.messagesArea[playerNumber]!
        );

      }
    }



    // 結果リストを表示する直前のセリフを表示
    before_resultList() {
      for (let i = 0; i < this.messagesArea.length; i++) {
        if (this.messagesArea[i] === null) {
          throw new Error(`Error! this.messagesArea[${i}] === null`);
        }

        this.animation(
          ['ということは～・・・'],
          this.messagesArea[i]!
        );
      }
    }



    // 順位に応じたセリフを表示
    playerRank(rank: number, playerNumber: number) {
      if (this.messagesArea[playerNumber] === null) {
        throw new Error(`Error! this.messagesArea[${playerNumber}] === null`);
      }

      if (rank === 1) {
        this.animation(
          [`よし！ ${rank} 位！！！`],
          this.messagesArea[playerNumber]!
        );

      } else if (rank === 2) {
        this.animation(
          [`${rank} 位だ！`],
          this.messagesArea[playerNumber]!
        );

      } else if (rank === 3) {
        this.animation(
          [`${rank} 位か～。`],
          this.messagesArea[playerNumber]!
        );

      } else {
        this.animation(
          [`${rank} 位……。`],
          this.messagesArea[playerNumber]!
        );
      }
    }
  }



  // よく使うメソッドはこちらにまとめておく。
  class Tool {

    public constructor(private _poker?: Poker) {
    }


    public nullCheck(checkObject: HTMLElement | null | NodeListOf<HTMLElement>) {
      if (checkObject === null) {
        throw new Error(`Error! ${checkObject} === null`);
      }
    }

    // メモ

    // 今回は nullcheck() を行った後、チェック対象に後置演算子 ! を使用して対処したけど、
    // そのあとで、もし間違って nullcheck() を行ったコードを消してしまった場合、
    // typescript 側で エラーが検出されず、nullcheck() を行っていないのに実行されてしまうことになる。

    // this._tool.nullCheck(this._player0_handArea); ← このコードを間違って消してしまった場合
    // this.renderHand(this._player0_handArea!, 0); 「!」があるため、エラーが検出されなくなってしまう。


    // やはり面倒でも、都度 個別にチェックしたほうがよいかもしれない。

    // if (this._player0_handArea === null) {
    //   this._tool.showError('createExchangeBtn', 'this._player0_handArea');
    //   return; ← 呼び出し先で throw するから return は必要ないけど、付けないとエラーが表示される。
    // }
    // this.renderHand(this._player0_handArea, 0); 「!」はつけない。


    // あるいはメソッドを呼び出さないで throw だけにしたほうがよい。
    // 結局 これが一番安全な方法かもしれない。

    // if (this._player0_handArea === null) {
    //   throw new Error(`null Error!`); これなら 都度 return を付ける必要がない。
    // }
    // this.renderHand(this._player0_handArea, 0); 「!」はつけない。



    public createSingleLineBtn(
      area: HTMLElement,
      cssName: string,
      text: string,
    ): void {
      const btn = document.createElement('div');
      btn.classList.add('btn', 'singleLineBtn', cssName);
      btn.textContent = text; // ex) '交換する'

      if (this._poker !== undefined && this._poker.playerTurn !== 0) {
        btn.classList.add('hide'); // 透明化
        btn.style.pointerEvents = 'none'; // クリックイベント禁止 ドラッグ＆ドロップ禁止
      }

      area.appendChild(btn);
    }



    public createDoubleLineBtn(
      area: HTMLElement,
      cssName: string,
      text: string,
    ): void {
      const btn = document.createElement('div');
      btn.classList.add('btn', 'doubleLineBtn', cssName);
      btn.innerHTML = text; // ex) text = 'カードを<br>交換する'

      // サブプレイヤーの交換ボタンは非表示 クリック禁止
      if (cssName === 'exchangeBtn') {
        if (this._poker !== undefined && this._poker.playerTurn !== 0) {
          btn.classList.add('hide'); // 透明化
          btn.style.pointerEvents = 'none'; // クリックイベント禁止 ドラッグ＆ドロップ禁止
        }
      }

      area.appendChild(btn);
    }
  }



  // 手札が役一覧と一致しているかどうかをチェックするためのクラス
  class Hand_list {

    // 更新されたカードデータを手札にコピーするための仮配列
    // グローバルスコープで対処が必要なときにのみ利用する
    // 利用し終えたら念のため、空にしておく
    private placePlayerHand: trump[];

    // private _poker: Poker;

    // public constructor(Poker: Poker) {
    //   this._poker = Poker;
    // }

    // 上記コメント部分と下記コードは同じ
    public constructor(private _poker: Poker) {
      this.placePlayerHand = [];
    }



    // 現在の手札と一致している役があるなら役一覧の対象領域の背景色を変えるメソッド
    // 実行タイミング
    // 最初にカードが配られたとき（メインプレイヤーのみ）
    // カードを交換・補充したあと（メインプレイヤーのみ）
    // 全員の手札をオープンしたとき
    //   （全員 メインプレイヤーとサブプレイヤーで背景色を別々にしたほうがいい？ それともプレイヤー名を表示して対処する？）

    // 強い役から精査していき、該当したらそこで精査をキャンセルする。
    // 該当の役の領域に css クラスで背景色変更を適用する。

    // 役一覧のチェックを行ったら、役と数（同じ役同士での優劣を判断するための材料）を把握して、
    // プレイヤー情報（ this._poker.players[~].strong.~ ）に格納する。


    // 役に応じて、手札のカードの並び順を配置したほうが分かりやすい。
    // 比較対象となるカードから順に右側に配置。

    // 比較対象順に配置する、これがどの役でも共通している。

    // 右側に役と一致したカードを配置。
    // 残りのカードは強いカードほど右側に配置。
    // このほうが分かりやすい。

    // ストレート系やノーハンドなら、強いカードほど右側に配置。
    // ワンペアなら、ペアになってるカードを右側に配置。残りのカードは強いカードほど右側に配置。

    // 手札の一番 strongNumber が大きい数字
    // this._poker.players[playerNumber].hand[???].strongNumber



    // 役一覧に css クラス が適用されてる場合はすべて解除しておく。
    handList_style_remove() {
      const match_handArea = document.querySelectorAll('.match_hand');
      match_handArea.forEach((area) => {
        area.classList.remove('match_hand');
      });
    }



    public checkHand_And_rearrangesCards(playerNumber: number) {

      // Poker Class => this.dealCards() で配布されるカードを役通りに修正して挙動を確認すること


      // メインプレイヤーのみ
      // 検証前に役一覧に css クラス が適用されてる場合はすべて解除しておく。
      if (playerNumber === 0) {
        this.handList_style_remove();
      }


      // strongNumber が最強か最弱か検証する。

      // 「１」のカードは基本的に最も強い。だけど、唯一 例外がある。
      // ストレートフラッシュとストレートの手札「1, 2, 3, 4, 5」のときだけ「1」は最弱になる。

      // 手札をチェックしたときに「1, 2, 3, 4, 5」となっていた場合は
      // 「1」の strongNumber を 1 に修正する必要がある。

      // 手札を number の少ない順に並べ替える
      if (this._poker.players[playerNumber].hand.length === 0) {
        return;
      }
      // 昇順
      this._poker.players[playerNumber].hand.sort((a, b) => {
        if (a.number !== b.number) { return a.number - b.number; }
        return 0;
      });

      // 数字の並びが [1, 2, 3, 4, 5] ならば、 1 の strongNumber を 1 に修正する。
      if (
        this._poker.players[playerNumber].hand[0].number === 1 &&
        this._poker.players[playerNumber].hand[1].number === 2 &&
        this._poker.players[playerNumber].hand[2].number === 3 &&
        this._poker.players[playerNumber].hand[3].number === 4 &&
        this._poker.players[playerNumber].hand[4].number === 5
      ) {
        this._poker.players[playerNumber].hand[0].strongNumber = 1;
      }


      // 上記一連のコードで strongNumber が最強か最弱か検証が実現する。
      // その上で、手札を strongNumber の少ない順に並べ替える
      if (this._poker.players[playerNumber].hand.length === 0) {
        return;
      }
      // 昇順
      this._poker.players[playerNumber].hand.sort((a, b) => {
        if (a.strongNumber !== b.strongNumber) { return a.strongNumber - b.strongNumber; }
        return 0;
      });


      // 絵柄 ( suit ) がすべて同じならば true
      let match_suit = false;

      if (
        (
          this._poker.players[playerNumber].hand[0].suit === 'spade' &&
          this._poker.players[playerNumber].hand[1].suit === 'spade' &&
          this._poker.players[playerNumber].hand[2].suit === 'spade' &&
          this._poker.players[playerNumber].hand[3].suit === 'spade' &&
          this._poker.players[playerNumber].hand[4].suit === 'spade'
        ) ||
        (
          this._poker.players[playerNumber].hand[0].suit === 'heart' &&
          this._poker.players[playerNumber].hand[1].suit === 'heart' &&
          this._poker.players[playerNumber].hand[2].suit === 'heart' &&
          this._poker.players[playerNumber].hand[3].suit === 'heart' &&
          this._poker.players[playerNumber].hand[4].suit === 'heart'
        ) ||
        (
          this._poker.players[playerNumber].hand[0].suit === 'diamond' &&
          this._poker.players[playerNumber].hand[1].suit === 'diamond' &&
          this._poker.players[playerNumber].hand[2].suit === 'diamond' &&
          this._poker.players[playerNumber].hand[3].suit === 'diamond' &&
          this._poker.players[playerNumber].hand[4].suit === 'diamond'
        ) ||
        (
          this._poker.players[playerNumber].hand[0].suit === 'club' &&
          this._poker.players[playerNumber].hand[1].suit === 'club' &&
          this._poker.players[playerNumber].hand[2].suit === 'club' &&
          this._poker.players[playerNumber].hand[3].suit === 'club' &&
          this._poker.players[playerNumber].hand[4].suit === 'club'
        )
      ) {
        match_suit = true;
      }


      // 手札の数がすべて連続してるならば true
      let match_straight = false;

      if (
        this._poker.players[playerNumber].hand[0].strongNumber ===
        this._poker.players[playerNumber].hand[1].strongNumber - 1
        &&
        this._poker.players[playerNumber].hand[1].strongNumber ===
        this._poker.players[playerNumber].hand[2].strongNumber - 1
        &&
        this._poker.players[playerNumber].hand[2].strongNumber ===
        this._poker.players[playerNumber].hand[3].strongNumber - 1
        &&
        this._poker.players[playerNumber].hand[3].strongNumber ===
        this._poker.players[playerNumber].hand[4].strongNumber - 1
      ) {
        match_straight = true;
      }


      // フォーカード フルハウス スリーカード ツーペア ワンペア 検証
      // 手札が該当する役に一致しているならば true
      let match_four_of_a_kind = false;
      let match_a_full_house = false;
      let match_three_of_a_kind = false;
      let match_two_pair = false;
      let match_a_pair = false;

      if (
        this.check_sameNumberCount(this._poker.players[playerNumber].hand, 4, playerNumber)
      ) {
        match_four_of_a_kind = true;
      }
      else if (
        this.check_sameNumberCount(this._poker.players[playerNumber].hand, 3, playerNumber, 'a_full_house') &&
        this.check_sameNumberCount(this._poker.players[playerNumber].hand, 2, playerNumber, 'a_full_house')
      ) {
        match_a_full_house = true;
      }
      else if (
        this.check_sameNumberCount(this._poker.players[playerNumber].hand, 3, playerNumber)
      ) {
        match_three_of_a_kind = true;
      }
      else if (
        this.check_sameNumberCount(this._poker.players[playerNumber].hand, 2, playerNumber, 'two_pair')
      ) {
        match_two_pair = true;
      }
      else if (
        this.check_sameNumberCount(this._poker.players[playerNumber].hand, 2, playerNumber)
      ) {
        match_a_pair = true;
      }





      // ロイヤルストレートフラッシュと一致しているかどうかチェック
      // suit がすべて同じ
      // number 10 ~ 13 && 1 を所持している
      if (
        match_suit
        &&
        (
          this._poker.players[playerNumber].hand[0].strongNumber === 10 &&
          this._poker.players[playerNumber].hand[1].strongNumber === 11 &&
          this._poker.players[playerNumber].hand[2].strongNumber === 12 &&
          this._poker.players[playerNumber].hand[3].strongNumber === 13 &&
          this._poker.players[playerNumber].hand[4].strongNumber === 14
        )
      ) {
        this.showResultHandList('ロイヤルストレートフラッシュ', '.royal_straight_flush', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'ロイヤル<br>ストレート<br>フラッシュ';
        this._poker.players[playerNumber].strong.handListNumber = 9;
        this._poker.players[playerNumber].strong.compareNumberLists = [14, 13, 12, 11, 10];
      }


      // ストレートフラッシュと一致しているかどうかチェック
      // suit がすべて同じ
      // number が連続している
      else if (
        match_suit
        &&
        match_straight
      ) {
        this.showResultHandList('ストレートフラッシュ', '.straight_flush', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'ストレート<br>フラッシュ';
        this._poker.players[playerNumber].strong.handListNumber = 8;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[3].strongNumber,
          this._poker.players[playerNumber].hand[2].strongNumber,
          this._poker.players[playerNumber].hand[1].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }


      // フォーカードと一致しているかどうかチェック
      // 同じ number が 4 つ そろっている
      else if (match_four_of_a_kind) {

        // フォーカードは右側に役と一致した 4 枚のカードを配置。
        // 残りのカードを左側に配置。

        this.showResultHandList('フォーカード', '.four_of_a_kind', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'フォーカード';
        this._poker.players[playerNumber].strong.handListNumber = 7;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }


      // フルハウスと一致しているかどうかチェック
      // スリーカード（同じ number が 3 つ）が そろっている
      // ワンペア（同じ number が 2 つ）が そろっている
      else if (match_a_full_house) {
        this._poker.players[playerNumber].hand = [];
        this._poker.players[playerNumber].hand.push(...this.placePlayerHand);
        this.placePlayerHand = []; // 利用し終えたら念のため、空にしておく

        this.showResultHandList('フルハウス', '.a_full_house', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'フルハウス';
        this._poker.players[playerNumber].strong.handListNumber = 6;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[1].strongNumber,
        ];
      }


      // フラッシュと一致しているかどうかチェック
      // suit がすべて同じ
      else if (match_suit) {
        this.showResultHandList('フラッシュ', '.flush', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'フラッシュ';
        this._poker.players[playerNumber].strong.handListNumber = 5;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[3].strongNumber,
          this._poker.players[playerNumber].hand[2].strongNumber,
          this._poker.players[playerNumber].hand[1].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }


      // ストレートと一致しているかどうかチェック
      // number が連続している

      // 注意！ ストレート
      // 1 2 3 4 5 => ○ この場合 1 が最弱になることに注意すること。
      // 10 11 12 13 1 => ○ この場合 1 が最強になることに注意すること。
      // 11 12 13 1 2 => × これはストレートではない。

      else if (
        match_straight
      ) {
        this.showResultHandList('ストレート', '.straight', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'ストレート';
        this._poker.players[playerNumber].strong.handListNumber = 4;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[3].strongNumber,
          this._poker.players[playerNumber].hand[2].strongNumber,
          this._poker.players[playerNumber].hand[1].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }


      // スリーカードと一致しているかどうかチェック
      // 同じ number が 3 つ そろっている
      else if (match_three_of_a_kind) {
        this.showResultHandList('スリーカード', '.three_of_a_kind', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'スリーカード';
        this._poker.players[playerNumber].strong.handListNumber = 3;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[1].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }


      // ツーペアと一致しているかどうかチェック
      // 同じ number が 2 つ そろっている
      // 上記のケースが もう一つ そろっている
      else if (match_two_pair) {
        this.showResultHandList('ツーペア', '.two_pair', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'ツーペア';
        this._poker.players[playerNumber].strong.handListNumber = 2;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[2].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }


      // ワンペアと一致しているかどうかチェック
      // 同じ number が 2 つ そろっている
      else if (match_a_pair) {
        this.showResultHandList('ワンペア', '.a_pair', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'ワンペア';
        this._poker.players[playerNumber].strong.handListNumber = 1;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[2].strongNumber,
          this._poker.players[playerNumber].hand[1].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }


      // 上記のどの役にも一致しない場合はノーハンド
      else {
        this.showResultHandList('ノーハンド', '.high_card', playerNumber);

        this._poker.players[playerNumber].strong.handList = 'ノーハンド';
        this._poker.players[playerNumber].strong.handListNumber = 0;
        this._poker.players[playerNumber].strong.compareNumberLists = [
          this._poker.players[playerNumber].hand[4].strongNumber,
          this._poker.players[playerNumber].hand[3].strongNumber,
          this._poker.players[playerNumber].hand[2].strongNumber,
          this._poker.players[playerNumber].hand[1].strongNumber,
          this._poker.players[playerNumber].hand[0].strongNumber
        ];
      }

      console.log(`同じ役同士での比較対象となる数字 this._poker.players[${playerNumber}] compareNumberLists:`, this._poker.players[playerNumber].strong.compareNumberLists);
    }



    // 手札と一致している役一覧に背景色を適用する
    private showResultHandList(handListName: string, cssName: string, playerNumber: number) {

      console.log(`役名 this._poker.players[${playerNumber}].hand === ${handListName}！`);

      // 以下のコードはメインプレイヤーのみ
      if (playerNumber !== 0) {
        return;
      }

      const matchHandListArea = document.querySelectorAll(cssName);

      matchHandListArea.forEach((matchHandList) => {
        matchHandList.classList.add('match_hand');
      });
    }



    // フォーカード フルハウス スリーカード ツーペア ワンペア 検証用
    // ※内部コードがごちゃごちゃしてる。もう少しスッキリさせたい……。
    private check_sameNumberCount(
      verifyPlayerHands: Array<trump>,
      matchNumber: number,
      playerNumber: number,
      checkHandListName: 'a_full_house' | 'two_pair' | 'other' = 'other'
    ): boolean {
      // 手札内に同じ数の組み合わせによる役が存在するか否か
      let exist_sameNumber_handList = false;

      // 手札内に存在する同じ数のカード番号
      let matchNumber_Hand = 0;

      // 手札内に同じ数の組み合わせがいくつ存在するかを把握するための配列
      // 0 => 0  1 => 0  2 => 0  ... 12 => 0  インデックス番号+1 => カード番号  値 => 該当番号がいくつあるか
      let match_numberCount: number[] = [];
      for (let i = 0; i < 13; i++) {
        match_numberCount.push(0);
      }

      // 手札内に同じ数の組み合わせがいくつ存在するか検証
      verifyPlayerHands.forEach((hand) => {
        for (let i = 1; i <= 13; i++) {
          if (hand.number === i) {
            match_numberCount[i - 1]++;
            return;
          }
        }
      });

      // match_numberCount[] の中に値が 4 のインデックスがあれば フォーカード成立
      // match_numberCount[] の中に値が 3 と 2 のインデックスがあれば フルハウス成立
      // match_numberCount[] の中に値が 3 のインデックスがあれば スリーカード成立
      // match_numberCount[] の中に値が 2 のインデックスが 2 つ あれば ツーペア成立
      // match_numberCount[] の中に値が 2 のインデックスが 1 つ あれば ワンペア成立



      // フォーカード フルハウス スリーカード ワンペア 検証
      if (!(checkHandListName === 'two_pair')) {
        match_numberCount.forEach((matchCount, index) => {
          if (matchCount === matchNumber) {
            exist_sameNumber_handList = true;
            matchNumber_Hand = index + 1;
          }
        });

        // フルハウス 並び替え
        if (checkHandListName === 'a_full_house') {
          if (matchNumber === 3) {
            const placePlayerHand_uncommon = this._poker.players[playerNumber].hand.filter((card) =>
              !(card.number === matchNumber_Hand)
            );

            const placePlayerHand_common = this._poker.players[playerNumber].hand.filter((card) =>
              card.number === matchNumber_Hand
            );

            this.placePlayerHand = [];
            this.placePlayerHand.push(...placePlayerHand_uncommon);
            this.placePlayerHand.push(...placePlayerHand_common);
          }
        }

        // フォーカード スリーカード ワンペア 並び替え
        else if (checkHandListName === 'other') {
          // placePlayerHand_uncommon はstrongNumber を昇順に並び替える必要がある。
          // ただし、もとから strongNumber の昇順で並び替えられてるため、ここで処理は必要ない。
          const placePlayerHand_uncommon = this._poker.players[playerNumber].hand.filter((card) =>
            !(card.number === matchNumber_Hand)
          );

          const placePlayerHand_common = this._poker.players[playerNumber].hand.filter((card) =>
            card.number === matchNumber_Hand
          );

          this._poker.players[playerNumber].hand = [];
          this._poker.players[playerNumber].hand.push(...placePlayerHand_uncommon);
          this._poker.players[playerNumber].hand.push(...placePlayerHand_common);
        }
      }

      // ツーペア 検証
      else {
        // 手札内に同じ番号のカードがあれば抽出
        const match_two_pair = match_numberCount.filter((count) => count === 2);

        // 同じ番号のカードが 2 組あればツーペア
        if (match_two_pair.length === 2) {
          exist_sameNumber_handList = true;
          console.log('ツーペア成立！');

          // ツーペア 並び替え
          let playerHand_common: trump[] = [];

          match_numberCount.forEach((matchCount, index) => {
            if (matchCount === matchNumber) {
              matchNumber_Hand = index + 1;

              const placePlayerHand_common = this._poker.players[playerNumber].hand.filter((card) =>
                card.number === matchNumber_Hand
              );

              // ※ push() unshift() を使い分ける
              // push() を使えば数字の少ない順に左側に配置される。
              // ただし、 1 のペアの場合は右側に配置したい。

              // unshift() を使うと 1 のカードが右側に、 push() だと 1 のカードが左側に配置される。
              // ex) 正しい手札 unshift() 8 5 5 1 1  間違った手札 push() 8 1 1 5 5
              // push() を使って、 1 のペアが存在する場合は splice() などで修正する必要がある。

              playerHand_common.push(...placePlayerHand_common);
              if (playerHand_common[0].number === 1) {
                const modyfiArray = playerHand_common.splice(0, 2);
                playerHand_common.push(...modyfiArray);
              }
            }
          });


          // 配列同士の差分を取得する
          const diffHand = this._poker.players[playerNumber].hand.filter((card) => playerHand_common.indexOf(card) === -1);

          // console.log('diffHand:', diffHand);
          // console.log('playerHand_common:', playerHand_common);

          this._poker.players[playerNumber].hand = [];
          this._poker.players[playerNumber].hand.push(...diffHand);
          this._poker.players[playerNumber].hand.push(...playerHand_common);


          // 配列同士の差分

          // const array1 = [1, 2, 3, 4, 5]
          // const array2 = [1, 2, 3]

          // const array3 = array1.filter(i => array2.indexOf(i) == -1)
          // console.log(array3) // [4, 5]

          // indexOfは値が見つからない場合に -1 を返します。
          // filterとindexOfを利用することで、配列の差分を取得できます。
        }
      }

      return exist_sameNumber_handList;
    }
  }



  // type エイリアス

  type trump = {
    suit: 'spade' | 'heart' | 'diamond' | 'club';
    number: number;
    strongNumber: number;
    uniqueNumber: number;
    url: string;
    isFront: boolean;
    selected: boolean;
  };

  type player = {
    name: string;
    image: string;
    hand: Array<trump>;
    discard: Array<trump>;
    strong: {
      handList: string;
      handListNumber: number;
      compareNumberLists: Array<number>;
    };
    rank: number;
    handStartPosition: [] |
    [
      {
        left: number;
        top: number;
      }
    ];
    discardStartPosition: [] |
    [
      {
        left: number;
        top: number;
      }
    ];
  };



  // ポーカー実行 全般を管理するクラス
  class Poker {
    // 複雑なデータ形式の型指定のやり方が調べても分からない……。仕方がないから抽象的に指定しておく。

    // 加工禁止 配列内 リテラル型 Tuple 型（指定した順番通り）
    private readonly _suits: ['spade', 'heart', 'diamond', 'club'];

    // type エイリアスの配列 または 空配列 の Union 型
    private _trump: Array<trump> | [];
    private _stock: Array<trump> | [];
    private _players: Array<player> | [];

    public playerTurn: number;

    private _player0_handArea = document.querySelector<HTMLUListElement>('.player0_hand');
    private _player1_handArea = document.querySelector<HTMLUListElement>('.player1_hand');
    private _player2_handArea = document.querySelector<HTMLUListElement>('.player2_hand');
    private _player3_handArea = document.querySelector<HTMLUListElement>('.player3_hand');

    private _player0_discardArea = document.querySelector<HTMLUListElement>('.player0_discard');
    private _player1_discardArea = document.querySelector<HTMLUListElement>('.player1_discard');
    private _player2_discardArea = document.querySelector<HTMLUListElement>('.player2_discard');
    private _player3_discardArea = document.querySelector<HTMLUListElement>('.player3_discard');

    public readonly handAreas: (HTMLUListElement | null)[];
    public readonly discardAreas: (HTMLUListElement | null)[];

    private _selectedCardsCount: number = 0;

    private _tool: Tool;
    private _hand_list: Hand_list;
    private _message: Message;



    public constructor() {
      this._tool = new Tool(this);
      this._hand_list = new Hand_list(this);
      this._message = new Message();
      this._suits = ['spade', 'heart', 'diamond', 'club'];

      // トランプ・積み札の生成
      this._trump = [];
      this.createTrump();
      this._stock = [];
      this._stock = [...this._trump];

      this.handAreas = [
        this._player0_handArea,
        this._player1_handArea,
        this._player2_handArea,
        this._player3_handArea,
      ];

      this.discardAreas = [
        this._player0_discardArea,
        this._player1_discardArea,
        this._player2_discardArea,
        this._player3_discardArea,
      ];

      // 役一覧に css クラス が適用されてる場合はすべて解除しておく。
      this._hand_list.handList_style_remove();

      // カードの選択枚数
      this._selectedCardsCount = 0;

      // 結果リストの比較対象欄（プレイヤー手札表示欄）を初期化する。
      const rank_compare_numbers = document.querySelectorAll('.rank_compare_number');
      rank_compare_numbers.forEach((compareArea) => {
        while (compareArea.firstChild) {
          compareArea.firstChild.remove();
        }
      });

      // プレイヤー情報の生成
      this.playerTurn = 1; // サブプレイヤー 1 2 3 から順番に進めて、最後にメインプレイヤーという流れで進める
      this._players = [];
      this.createPlayers();

      for (let i = 0; i < this._players.length; i++) {
        this.renderPlayerName(`.player${i}_name`, i);
      }


      // null チェック handArea discardArea
      for (let i = 0; i < this._players.length; i++) {
        this._tool.nullCheck(this.handAreas[i]);
      }
      for (let i = 0; i < this._players.length; i++) {
        this._tool.nullCheck(this.discardAreas[i]);
      }


      // プレイヤー 手札 捨て札を初期化する（透明）
      for (let i = 0; i < this._players.length; i++) {
        this.initializationPlayerArea(this.handAreas[i]!);
        this.initializationPlayerArea(this.discardAreas[i]!);
      }


      // ストックアニメーション ストックから各プレイヤー手札へ裏向きのカードが配られる
      // この時点では 実際はまだ中身は確定していない。
      this.stockAnimation();



      setTimeout(() => {
        // 内部的にカードを配る ここで中身が確定する
        this.dealCards();
        for (let i = 0; i < this._players.length; i++) {
          console.log(`プレイヤーの手札 並び替え前 読み込み時 player${i}_hand:`, this._players[i].hand);
        }

        // 現在の手札と役が一致しているかどうかチェックおよび内部的に役に対応した並び替えを行う
        for (let i = 0; i < this._players.length; i++) {
          this._hand_list.checkHand_And_rearrangesCards(i);
        }

        // 手札を描画する
        for (let i = 0; i < this._players.length; i++) {
          this.renderHand(this.handAreas[i]!, i);
        }
      }, 5000);



      setTimeout(() => {
        // 各プレイヤーのメッセージを表示する
        this._message.openMessage('all');

        // 各プレイヤーが手札の状況に応じたセリフを表示
        for (let i = 0; i < this._players.length; i++) {
          this._message.handCondition(this._players[i].strong.handListNumber, i);
        }
      }, 8000);



      setTimeout(() => {
        // ストックの位置にボタンを配置
        this._tool.createDoubleLineBtn(
          document.querySelector('.stock')!,
          'startBtn',
          'ポーカー<br>開 始！'
        );

        const startBtn = document.querySelector<HTMLElement>('.startBtn');
        this._tool.nullCheck(startBtn);

        startBtn!.addEventListener('click', () => {
          // ゲーム開始ボタンを消去
          startBtn!.remove();

          // メッセージを非表示
          this._message.hideMessage();

          // メインプレイヤー・サブプレイヤーの手札の横に交換ボタンを表示
          // 最初はサブプレイヤー 1 の手札の横に交換ボタンを表示
          this.createExchangeBtn();

          // サブプレイヤーが思考して意思決定を行う
          console.log(`プレイヤー ${this.playerTurn} のターン！`);
          this.subPlayerThought();
        });
      }, 11000);
    }



    public createTrump(): void {
      // トランプカードの中身
      // {
      //   suit: 'spade', // 絵柄 'spade', 'heart', 'diamond', 'club'
      //   number: 1, // カードの番号 1 ~ 13
      //   strongNumber: 13, // カードの強さ 1 ~ 13
      //   uniqueNumber: 1, // 重複しない固有の番号 1 ~ 52
      //   url: 'img/01.png', // イメージファイルURL 裏面のカードは別で管理
      //   isFront: true, // 表か裏か 表ならば true 裏ならば false
      //   selected: false, // 手札の中で捨て札に出したいカードに true を付与する。初期値は false
      // },

      // 注意！
      // 「１」のカードは基本的に最も強い。だけど、唯一 例外がある。
      // ストレートフラッシュとストレートの手札「1, 2, 3, 4, 5」のときだけ「1」は最弱になる。

      // 手札をチェックしたときに「1, 2, 3, 4, 5」となっていた場合は
      // 「1」の strongNumber を 1 に修正する必要がある。

      let carsCount = 1;

      this._suits.forEach(
        (suit: 'spade' | 'heart' | 'diamond' | 'club', index) => {
          for (let i = 1; i <= 13; i++) {
            if (i === 1) {
              this._trump[i - 1 + (13 * index)] =
              {
                suit: suit,
                number: i,
                strongNumber: 14,
                uniqueNumber: carsCount,
                url: `img/cards/${String(carsCount).padStart(2, '0')}.png`,
                isFront: true,
                selected: false,
              };
            }
            else {
              this._trump[i - 1 + (13 * index)] =
              {
                suit: suit,
                number: i,
                strongNumber: i,
                uniqueNumber: carsCount,
                url: `img/cards/${String(carsCount).padStart(2, '0')}.png`,
                isFront: true,
                selected: false,
              };
            }
            carsCount++;
          }
        }
      );

      // console.log('carsCount:', carsCount);


      // 疑問　上記コードと下記コードは結果的に同じことをしてるはずなのに、下記コードはエラーが発生する。
      // 型 'any' の引数を型 'never' のパラメーターに割り当てることはできません。ts(2345)
      // 以下 エラーコード 詳細
      {
        // public createTrump(): void {
        //   // トランプカードの中身
        //   // {
        //   //   suit: 'spade', // 絵柄 'spade', 'heart', 'diamond', 'club'
        //   //   number: 1, // カードの番号 1 ~ 13
        //   //   strongNumber: 13, // カードの強さ 1 ~ 13
        //   //   uniqueNumber: 1, // 重複しない固有の番号 1 ~ 52
        //   //   url: 'img/01.png', // イメージファイルURL 裏面のカードは別で管理
        //   //   isFront: true, // 表か裏か 表ならば true 裏ならば false
        //   //   selected: false, // 手札の中で捨て札に出したいカードに true を付与する。初期値は false
        //   // },

        //   const placeTrump: Array<any> = [];

        //   this._suits.forEach(
        //     (suit: 'spade' | 'heart' | 'diamond' | 'club') => {
        //       for (let i = 1; i <= 13; i++) {
        //         if (i === 1) {
        //           placeTrump.push({
        //             suit: suit,
        //             number: i,
        //             strongNumber: 13,
        //           });
        //         }
        //         else {
        //           placeTrump.push({
        //             suit: suit,
        //             number: i,
        //             strongNumber: i - 1,
        //           });
        //         }
        //       }
        //     }
        //   );

        //   for (let i = 1; i <= placeTrump.length; i++) {
        //     placeTrump[i - 1].uniqueNumber = i;
        //     placeTrump[i - 1].url = `img/cards/${String(i).padStart(2, '0')}.png`;
        //     placeTrump[i - 1].isFront = true;
        //     placeTrump[i - 1].selected = false;
        //   }

        //   placeTrump.forEach((trump: trump, index) => {
        //     this._trump[index] = trump;
        //   });

        // 疑問　array.push(); で行うとエラーが発生する　要検索！
        //   // this._trump.push(...placeTrump);
        //   this._trump = [...placeTrump];
        // }
      }
    }



    public createPlayers(): void {
      const playersName = ['You', 'player1', 'player2', 'player3'];

      for (let i = 0; i <= 3; i++) {
        this._players[i] = {
          name: playersName[i],
          image: 'img/cards/01.png',
          hand: [],
          discard: [],
          strong: {
            handList: '', // 揃った役名
            handListNumber: 0, // 強い役ほど数字が大きい ロイヤルストレートフラッシュ => 9 ノーハンド => 0
            compareNumberLists: [] // 役の種類に応じて、比較対象となる数字の数が異なる
          },
          rank: 0,
          handStartPosition: [],
          discardStartPosition: [],
        };
      }


      // プレイヤー手札・捨て札領域の 左座標 上座標
      const player0_HandNext_LeftPoint: number = 112.5; // card width 100px + margin right 12.5px
      const player0_HandNext_TopPoint: number = 0; // すべて同じ座標
      const player0_DiscardNext_LeftPoint: number = 112.5; // card width 100px + margin right 12.5px
      const player0_DiscardNext_TopPoint: number = 0; // すべて同じ座標

      const player1_HandNext_LeftPoint: number = 0; // すべて同じ座標
      const player1_HandNext_TopPoint: number = 110.0; // card height 100px + margin bottom 10px

      const player1_DiscardNext_LeftPoint: number = 0; // すべて同じ座標
      const player1_DiscardNext_TopPoint: number = 110; // card height 100px + margin bottom 10px

      const player2_HandNext_LeftPoint: number = 112.5; // card width 100px + margin right 12.5px
      const player2_HandNext_TopPoint: number = 0; // すべて同じ座標
      const player2_DiscardNext_LeftPoint: number = 112.5; // card width 100px + margin right 12.5px
      const player2_DiscardNext_TopPoint: number = 0; // すべて同じ座標

      const player3_HandNext_LeftPoint: number = 0; // すべて同じ座標
      const player3_HandNext_TopPoint: number = 110; // card height 100px + margin bottom 10px

      const player3_DiscardNext_LeftPoint: number = 0; // すべて同じ座標
      const player3_DiscardNext_TopPoint: number = 110; // card height 100px + margin bottom 10px

      const players_HandNext_LeftPoint = [
        player0_HandNext_LeftPoint,
        player1_HandNext_LeftPoint,
        player2_HandNext_LeftPoint,
        player3_HandNext_LeftPoint
      ];

      const players_HandNext_TopPoint = [
        player0_HandNext_TopPoint,
        player1_HandNext_TopPoint,
        player2_HandNext_TopPoint,
        player3_HandNext_TopPoint
      ];

      const players_DiscardNext_LeftPoint = [
        player0_DiscardNext_LeftPoint,
        player1_DiscardNext_LeftPoint,
        player2_DiscardNext_LeftPoint,
        player3_DiscardNext_LeftPoint
      ];

      const players_DiscardNext_TopPoint = [
        player0_DiscardNext_TopPoint,
        player1_DiscardNext_TopPoint,
        player2_DiscardNext_TopPoint,
        player3_DiscardNext_TopPoint
      ];

      // 手札のカードの座標を取得
      for (let i = 0; i < this._players.length; i++) {
        this._tool.nullCheck(this.handAreas[i]);
        this._tool.nullCheck(this.discardAreas[i]);
      }

      for (let i = 0; i < this._players.length; i++) {
        this.getPoint(this.handAreas[i]!, i, players_HandNext_LeftPoint[i], players_HandNext_TopPoint[i]);

        this.getPoint(this.discardAreas[i]!, i, players_DiscardNext_LeftPoint[i], players_DiscardNext_TopPoint[i]);
      }


      // 上記コードは下記コメントの挙動と同じ
      {
        // this.getPoint(this._player0_handArea!, 0, player0_HandNext_LeftPoint, player0_HandNext_TopPoint);
        // this.getPoint(this._player0_discardArea!, 0, player0_DiscardNext_LeftPoint, player0_DiscardNext_TopPoint);

        // this.getPoint(this._player1_handArea!, 1, player1_HandNext_LeftPoint, player1_HandNext_TopPoint);
        // this.getPoint(this._player1_discardArea!, 1, player1_DiscardNext_LeftPoint, player1_DiscardNext_TopPoint);

        // this.getPoint(this._player2_handArea!, 2, player2_HandNext_LeftPoint, player2_HandNext_TopPoint);
        // this.getPoint(this._player2_discardArea!, 2, player2_DiscardNext_LeftPoint, player2_DiscardNext_TopPoint);

        // this.getPoint(this._player3_handArea!, 3, player3_HandNext_LeftPoint, player3_HandNext_TopPoint);
        // this.getPoint(this._player3_discardArea!, 3, player3_DiscardNext_LeftPoint, player3_DiscardNext_TopPoint);
      }
    }



    // 要素の「ページ全体」における位置座標を取得する
    // 座標は要素の配置に利用するのではなくて、移動量を把握するために利用する。
    public getPoint(area: HTMLElement, playerNumber: number, nextLeft: number, nextTop: number) {

      // 注意　座標取得が適正ではない。コードの修正が必要。 => 一応 解決済み。
      // topPoint => top でも bottom でも同じ値が取得されてしまう。カードの底の座標が取得されてしまう。

      // => player0_hand (ul) に height: 150px; を設定したら top bottom どちらも適正値が取得できた。
      // なぜかは不明。子要素の幅や高さがそのまま親要素の領域の値になると思っていたけど、
      // 親要素に幅や高さを入れておく必要があるらしい。

      // ※このコードを実行する前に手札・捨て札を生成・配置しておかないと、
      // 領域が生成される前の段階の座標を取得してしまう。

      // また領域に幅や高さを指定する際は相対値（ 100 % など）を指定すると、適切な座標が取得できなくなる。
      // デベロッパーで領域の範囲が適切に設定されてるかどうか確認することも必要。

      const leftPoint = window.pageXOffset + area.getBoundingClientRect().left;
      const topPoint = window.pageYOffset + area.getBoundingClientRect().top;

      console.log(`開始座標 player${playerNumber}:`, 'leftPoint:', leftPoint, 'topPoint:', topPoint);

      for (let n = 0; n < 5; n++) {
        // this._players[playerNumber].handStartPosition[n] = {
        //   left: leftPoint + nextLeft * n,
        //   top: topPoint + nextTop * n,
        // };

        // this._players[playerNumber].discardStartPosition[n] = {
        //   left: leftPoint + nextLeft * n,
        //   top: topPoint + nextTop * n - 170, // cardHeight 150 + marginBottom 20
        // };

        if (area === this.handAreas[0] || area === this.handAreas[1] || area === this.handAreas[2] || area === this.handAreas[3]) {
          this._players[playerNumber].handStartPosition[n] = {
            left: leftPoint + nextLeft * n,
            top: topPoint + nextTop * n,
          };

          // n + 1 => ( n + 1 ) 番目のカード
          console.log(`  手札の座標 ${n + 1} this._players${playerNumber}.left:`, `${this._players[playerNumber].handStartPosition[n].left}`);
          console.log(`  手札の座標 ${n + 1} this._players${playerNumber}.top:`, `${this._players[playerNumber].handStartPosition[n].top}`);

        } else if (area === this.discardAreas[0] || area === this.discardAreas[1] || area === this.discardAreas[2] || area === this.discardAreas[3]) {
          this._players[playerNumber].discardStartPosition[n] = {
            left: leftPoint + nextLeft * n,
            top: topPoint + nextTop * n,
          };

          console.log(`  捨て札の座標 ${n + 1} this._players${playerNumber}.left:`, `${this._players[playerNumber].discardStartPosition[n].left}`);
          console.log(`  捨て札の座標 ${n + 1} this._players${playerNumber}.top:`, `${this._players[playerNumber].discardStartPosition[n].top}`);
        }
      }
    }



    public renderPlayerName(area: string, index: number): void {
      const nameArea = document.querySelector<HTMLElement>(area);

      this._tool.nullCheck(nameArea);

      nameArea!.textContent = this._players[index].name;
    }


    stockAnimation() {
      // プレイヤー手札からストックの位置へ瞬時に移動
      // 移動量 = ストック座標 - 該当する手札の座標
      // const translateX = ストックの座標 - this._players[0].handStartPosition[0]?.left

      const stockArea = document.querySelector<HTMLElement>('.stock');

      this._tool.nullCheck(stockArea);

      // ストックから手札へ移動する際に捨て札の上を移動するように調整
      let zIndexCount = 30;

      // アニメーションを一度ずつ実行する際の間隔
      let animationGap = 0;

      // ストックの座標の把握
      let stock_leftPoint = 0;
      let stock_topPoint = 0;

      // player 0 => player 1 => player 2 => player 3 => player 0 => の順番で 1 枚ずつ配る
      for (let listNum = 0; listNum < 5; listNum++) {
        for (let playerNum = 0; playerNum < this._players.length; playerNum++) {

          const handLists = document.querySelectorAll<HTMLElement>(`.player${playerNum}_hand>li`);
          this._tool.nullCheck(handLists);

          stock_leftPoint = window.pageXOffset + stockArea!.getBoundingClientRect().left;
          stock_topPoint = window.pageYOffset + stockArea!.getBoundingClientRect().top;

          // 移動量 = ストック座標 - 該当する手札の座標
          const translateX_toStock = String(stock_leftPoint - this._players[playerNum].handStartPosition[listNum]!.left) + 'px';
          const translateY_toStock = String(stock_topPoint - this._players[playerNum].handStartPosition[listNum]!.top) + 'px';

          handLists[listNum].style.zIndex = String(zIndexCount);
          handLists[listNum].style.transition = 'transform';
          handLists[listNum].style.transform = `translate(${translateX_toStock}, ${translateY_toStock})`;

          // （選択済みのカード） => 補充するカードの透明化を解除する。
          handLists[listNum].classList.remove('hide');



          // ストックから手札へ移動する。 1 秒かかる。
          setTimeout(() => {
            // 元の位置に戻るため、座標は (0, 0)
            handLists[listNum].style.transition = 'transform 1s';
            handLists[listNum].style.transform = `translate(0, 0)`;
          }, 500 + 100 * animationGap);

          animationGap++;

          // ストックから手札へカードが移動する際に、手札の左側から順番にカードがストックから配られる。
          // 先に配られるカード（左側）が後から配られるカード（右側）より上に配置されてる必要がある。
          // そのため zIndexCount をデクリメントして順番を調整する。左側より右側のほうが下に配置される。
          zIndexCount--;
        }
      }
    }



    // 内部的にカードを配る
    public dealCards(): void {
      // 10 種類の役で強弱が決まる
      // 同じ役同士の場合は有利な数で勝敗が決まる
      // トランプのナンバーが 1 13 12 11 10 ... の順に有利

      // 難易度を設定する場合は まず どの役に設定するかを確率で決める。
      // その後、どの数を割り当てるかを確率で決める。

      // とりあえず難易度は考えない。

      // 順番に均等配布 メインプレイヤー・サブプレイヤー 全員 手札が確定する



      // 以下 役一覧 検証用 コード
      {
        // メインプレイヤーに役と一致するカードを配布

        // ロイヤルストレートフラッシュ 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 1 + 13 * 3 ||
        //   stock.uniqueNumber === 10 + 13 * 3 ||
        //   stock.uniqueNumber === 11 + 13 * 3 ||
        //   stock.uniqueNumber === 12 + 13 * 3 ||
        //   stock.uniqueNumber === 13 + 13 * 3
        // )
        // );

        // ストレートフラッシュ 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 1 ||
        //   stock.uniqueNumber === 1 + 1 ||
        //   stock.uniqueNumber === 1 + 2 ||
        //   stock.uniqueNumber === 1 + 3 ||
        //   stock.uniqueNumber === 1 + 4
        // )
        // );

        // フォーカード 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 3 ||
        //   stock.uniqueNumber === 3 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 13 * 2 ||
        //   stock.uniqueNumber === 3 + 13 * 3 ||
        //   stock.uniqueNumber === 52
        // )
        // );

        // フルハウス 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 3 ||
        //   stock.uniqueNumber === 3 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 13 * 2 ||
        //   stock.uniqueNumber === 13 + 13 * 2 ||
        //   stock.uniqueNumber === 52
        // )
        // );

        // フラッシュ 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 3 ||
        //   stock.uniqueNumber === 3 + 1 ||
        //   stock.uniqueNumber === 3 + 2 ||
        //   stock.uniqueNumber === 3 + 3 ||
        //   stock.uniqueNumber === 3 + 5
        // )
        // );

        // ストレート 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 3 ||
        //   stock.uniqueNumber === 3 + 1 ||
        //   stock.uniqueNumber === 3 + 2 ||
        //   stock.uniqueNumber === 3 + 3 ||
        //   stock.uniqueNumber === 3 + 4 + 13 * 1
        // )
        // );

        // ストレート 特殊ケース 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 10 ||
        //   stock.uniqueNumber === 10 + 1 ||
        //   stock.uniqueNumber === 10 + 2 ||
        //   stock.uniqueNumber === 10 + 3 ||
        //   stock.uniqueNumber === 1 + 13 * 3
        // )
        // );

        // スリーカード 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 1 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 0 ||
        //   stock.uniqueNumber === 3 + 6 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 2
        // )
        // );

        // ツーペア 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 3 ||
        //   stock.uniqueNumber === 13 ||
        //   stock.uniqueNumber === 3 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 2
        // )
        // );

        // ワンペア 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 1 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 1 ||
        //   stock.uniqueNumber === 5 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 2
        // )
        // );

        // ノーハンド 検証
        // const placeHandListCards = this._stock.filter((stock) =>
        // (
        //   stock.uniqueNumber === 3 ||
        //   stock.uniqueNumber === 3 + 1 ||
        //   stock.uniqueNumber === 3 + 6 + 13 * 1 ||
        //   stock.uniqueNumber === 5 + 13 * 1 ||
        //   stock.uniqueNumber === 3 + 5 + 13 * 2
        // )
        // );

        // 手札生成用 仮配列 確認
        // console.log('placeHandListCards:', placeHandListCards);

        // 手札 生成
        // this._players[0].hand.push(...placeHandListCards);

        // 手札 確認
        // console.log('this._players[0].hand:', this._players[0].hand);

        // ストックからメインプレイヤーに配布したカードを削除
        // for (let i = this._stock.length - 1; i >= 0; i--) {
        //   if (this._stock[i].uniqueNumber === 13) { this._stock.splice(i, 1); }
        //   if (this._stock[i].uniqueNumber === 12) { this._stock.splice(i, 1); }
        //   if (this._stock[i].uniqueNumber === 11) { this._stock.splice(i, 1); }
        //   if (this._stock[i].uniqueNumber === 10) { this._stock.splice(i, 1); }
        //   if (this._stock[i].uniqueNumber === 1) { this._stock.splice(i, 1); }
        // }

        // サブプレイヤーのみに均等配布
        // for (let stock = 0; stock > this._stock.length; stock++) {
        //   for (let i = 1; i < this._players.length; i++) {
        //     this._players[i].hand.push(this._stock.splice(Math.floor(Math.random() * this._stock.length), 1)[0]);
        //   };
        // }
      }
      // 役一覧 検証用 コード ここまで。検証を終えたらコメントアウトしておく。



      // ※サブプレイヤー 意思決定 確認用
      // 検証を終えたらコメントアウトしておく。
      // サブプレイヤー 1 に配布したいカード
      // const placeHandListCards = this._stock.filter((stock) =>
      // (
      //   stock.uniqueNumber === 9 ||
      //   stock.uniqueNumber === 10 + 13 * 1 ||
      //   stock.uniqueNumber === 12 + 13 * 2 ||
      //   stock.uniqueNumber === 13 + 13 * 2 ||
      //   stock.uniqueNumber === 1 + 13 * 3
      // )
      // );



      // 均等配布
      for (let i = 0; i < 5; i++) {
        this._players.forEach((player) => {
          player.hand.push(this._stock.splice(Math.floor(Math.random() * this._stock.length), 1)[0]);
        });
      }



      // ※サブプレイヤー 意思決定 確認用
      // 検証を終えたらコメントアウトしておく。
      // サブプレイヤー 1 に必要なカードを配布する。
      // this._players[1].hand[0] = placeHandListCards[0];
      // this._players[1].hand[1] = placeHandListCards[1];
      // this._players[1].hand[2] = placeHandListCards[2];
      // this._players[1].hand[3] = placeHandListCards[3];
      // this._players[1].hand[4] = placeHandListCards[4];



      // サブプレイヤーの手札を裏にする。
      for (let i = 0; i < this._players.length; i++) {
        if (i !== 0) {
          this._players[i].hand.map((hand: { isFront: boolean; }) => {
            hand.isFront = false;
            // hand.url = 'img/back.png'; とすると本来の画像URLが分からなくなるため、
            // 条件分岐を使って hand.isFront = true ならば hand.url のイメージパスを適用する、
            // hand.isFront = false ならば'img/back.png';をイメージパスに適用する、といった形式にする。
          });
        }
      }
    }



    // プレイヤー 手札 捨て札を初期化する（透明）
    public initializationPlayerArea(playerArea: HTMLElement): void {
      while (playerArea.firstChild) {
        playerArea.firstChild.remove();
      }

      for (let i = 0; i < 5; i++) {
        const li: HTMLLIElement = document.createElement('li');
        const img: HTMLImageElement = document.createElement('img');

        img.src = 'img/cards/back.png';

        li.classList.add('hide');

        li.appendChild(img);
        playerArea.appendChild(li);
      }
    }



    // 捨て札を描画
    public renderDiscard(discardArea: HTMLElement, index: number): void {

      while (discardArea.firstChild) {
        discardArea.firstChild.remove();
      }

      this._players[index].discard.forEach(
        (discard: trump) => {
          const li: HTMLLIElement = document.createElement('li');
          const img: HTMLImageElement = document.createElement('img');

          // 捨て札は全員 表示してもよいと思うけど、
          // player1 player3 の表示は rotate() を使う必要が出てくるため、とりあえずサブプレイヤーは非表示
          if (discardArea === this._player0_discardArea) {
            img.src = discard.url;
          } else {
            img.src = 'img/cards/back.png';
          }

          li.classList.add('hide');

          if (discard.selected) {
            li.classList.remove('hide');
          }

          li.appendChild(img);
          discardArea.appendChild(li);
        }
      );
    }


    // 手札を描画
    public renderHand(handArea: HTMLElement, index: number): void {
      while (handArea.firstChild) {
        handArea.firstChild.remove();
      }

      this._players[index].hand.forEach(
        (hand: trump) => {
          const li: HTMLLIElement = document.createElement('li');
          const img: HTMLImageElement = document.createElement('img');

          if (handArea === this._player0_handArea) {
            img.src = hand.url;
          } else {
            img.src = 'img/cards/back.png';
          }

          li.addEventListener('click', () => {
            // 選択状態 selected: true にする。
            // 選択解除 selected: false にする。
            hand.selected = !hand.selected;

            // 選択枚数を把握する。
            // 次のプレイヤーのターンになったら初期化する必要がある。
            if (hand.selected) {
              this._selectedCardsCount++;
            } else {
              this._selectedCardsCount--;
            }

            this.player_selectCard(li);
          });

          // 選択済みのカードを透明にする。
          if (hand.selected) {
            li.classList.add('hide');
          }

          li.appendChild(img);
          handArea.appendChild(li);
        }
      );
    }



    // プレイヤーが手札のカードをクリックしたときの処理

    // メインプレイヤー（this._player0）のみ
    // 選択状態 クリックしたらカードが少し上に移動する。
    // 選択解除 もう一度クリックしたらカードを元の位置に移動する。

    // ボタンのテキストは、カードを１枚でも選択した場合は「'カードを<br>交換する'」にする。
    // 再度クリックしてカードを非選択にして選択枚数が０枚なら「'この手札で<br>勝負する'」にする。

    public player_selectCard(li: HTMLLIElement) {
      console.log('カードを選択した！ player_selectCard method execution!');
      console.log('  現在のカードの選択枚数 _selectedCardsCount:', this._selectedCardsCount);

      // メインプレイヤー（this._player0）のみ
      if (this.playerTurn === 0) {
        li.classList.toggle('selected');
      }


      const exchangeBtn = document.querySelector<HTMLElement>('.exchangeBtn');
      this._tool.nullCheck(exchangeBtn);

      if (this._selectedCardsCount) {
        exchangeBtn!.innerHTML = 'カードを<br>交換する';
      } else {
        exchangeBtn!.innerHTML = 'この手札で<br>勝負する';
      }
    }



    // ドロー いらないカードを捨てて、捨てたカードと同じ枚数のカードを山札から補充すること。

    // 選択した複数枚のカードが捨て札に移動する
    // 山札から手札に 捨てた枚数分カードを補充する



    // 「カードを交換する」「この手札で勝負する」ボタンをクリックしたときの処理
    public createExchangeBtn() {
      this._tool.nullCheck(this.handAreas[this.playerTurn]);

      // 選択したカードを捨て札に出すためのボタンを表示
      this._tool.createDoubleLineBtn(
        this.handAreas[this.playerTurn]!,
        'exchangeBtn',
        'この手札で<br>勝負する'
      );

      // 疑問　適切な型の指定が分からない。仕方がないから any で対応。
      // const exchangeBtn: any = document.querySelector('.exchangeBtn');
      // 原因・対処法 「型アサーション」と「型引数」について
      {
        // 原因
        // なぜ、このエラーが発生するかというと、TypeScript は value や placeholder の型が自動で変換されないので、HTMLElement へ明示的に変換してあげる必要があります。

        // 対処法
        // 型アサーションでHTMLElementの型を指定します。
        // const exchangeBtn = <HTMLElement>document.querySelector('.exchangeBtn');

        // 別の書き方として、後ろに『as HTMLElement』を指定する方法もあります。
        // Type Assertion（型アサーション） 「アサーション = 断定」
        // const exchangeBtn = document.querySelector('.exchangeBtn') as HTMLElement;

        // JSXで<foo>スタイルのアサーションを使用する場合、言語文法にあいまいさがあります。
        // var foo = <string>bar;
        // </string>
        // したがって、一貫性のためにas fooを使うことをお勧めします。

        // 型アサーションは任意の型へ強制的に変更できるためコンパイルエラーを解消する強力な機能ですが、型安全性が保証されなくなります。
        // ですので、型アサーションはやみくもに利用するものではなく、コンパイルエラーを解消するための応急処置的な立ち位置だと認識しておくとよいです。


        // ※上記 対処法（型アサーション）より下記 記載の対処法（型引数）のほうが良いかもしれない。

        // 対処法 discard_SelectedCards_Animation() 記載 参照

        // TypeScript で querySelector、querySelectorAll メソッドを呼び出すときは、
        // 型引数を指定しましょう (メソッド名の直後の < > で囲んだ部分です)。

        // 対処法
        // 型引数を指定することで、メソッドの返り値が HTMLElement | null 型となり、
        // style プロパティにもアクセスできるようになります。
      }

      const exchangeBtn = document.querySelector<HTMLElement>('.exchangeBtn');
      this._tool.nullCheck(exchangeBtn);

      exchangeBtn!.addEventListener('click', () => {
        console.log('交換ボタンをクリック！ exchangeBtn pushed!');

        // 疑問　プロパティ 'style' は型 'Element' に存在しません。ts(2339) 要検索！
        // 原因 対処法 上記 記載と同じ

        // 自分のターンになったらクリック操作が可能になるようにするべき。 => nextTurn() 参照
        // 交換ボタンをクリックした後はボタンもカードもすべての操作をクリックできないようにするべき。
        // というより消去すべき

        // 交換ボタンを消去
        exchangeBtn!.remove();

        // exchangeBtn!.classList.add('hide'); // 透明化
        // exchangeBtn!.style.pointerEvents = 'none'; // クリックイベント禁止 ドラッグ＆ドロップ禁止


        // カードのクリックを禁止する。
        const selectedCards = document.querySelectorAll<HTMLElement>(`.player${this.playerTurn}_hand>li`);

        selectedCards.forEach((card) => {
          card.style.pointerEvents = 'none';
          card.style.cursor = 'auto';
        });

        if (this._selectedCardsCount === 0) {
          console.log('カードを選択していない。');

          // 交換ボタンを消去しないと次のプレイヤー手札に交換ボタンが作成される際、
          // 複数存在するために交換ボタンの範囲取得がうまくいかなくなる。
          // exchangeBtn!.remove();

          if (this.playerTurn === 0) {
            // メインプレイヤーは交換ボタンをクリックしたタイミングでセリフを表示するため、
            // 少し間をおいてから次のターンへ
            this._message.playerDecide(this.playerTurn, this._selectedCardsCount);

            setTimeout(() => {
              this._message.hideMessage();
              this.before_Click_OpenBtn();
            }, 3000);
          } else {
            // サブプレイヤーは交換ボタンをクリックする手前の段階でセリフを表示するため、
            // あまり間をおく必要はない
            setTimeout(() => {
              // 次のターンへ。
              this.nextTurn();
            }, 1000);
          }
        } else {
          console.log('選択したカードを捨て札に出す');

          // メインプレイヤーは交換ボタンをクリックしたタイミングでセリフを表示するため、ここに記載
          // サブプレイヤーは交換ボタンをクリックする手前 subPlayerThought() でセリフを表示する
          if (this.playerTurn === 0) {
            this._message.playerDecide(this.playerTurn, this._selectedCardsCount);
          }

          // アニメーションに関しては
          // 選択した手札が捨て札の該当する位置に移動する。
          // 捨て札の該当する位置だけ透明化を解除する。
          // ストックから手札の該当する位置に移動する。
          // ……といった流れで進めていくことにする。



          // 捨て札の内部情報を更新する。非選択の要素は空であっても作成しておく必要がある。
          // その後、捨て札を描画する際に、捨て札の該当する位置のみ透明化を解除する。

          // 捨て札を描画する
          // ここを実行するタイミングを考える必要がある。瞬時ではダメ。
          // まず手札から選択したカードがアニメーションで捨て札に移動する。 1 秒かかる。



          // 手札のカードの内部情報を内部情報（捨て札）に反映する。
          this._players[this.playerTurn].discard = [...this._players[this.playerTurn].hand];

          console.log('捨て札の中身 = 補充前の手札', `this._players[${this.playerTurn}].discard:`, this._players[this.playerTurn].discard);


          // 選択したカードを捨て札に出すアニメーション（ 1 秒かかる。）
          // 選択したカードを手札から捨て札へ移動する
          this.discard_SelectedCards_Animation();


          // 捨て札を描画する。（非選択のカードは透明にする。）
          setTimeout(() => {
            this._tool.nullCheck(this.discardAreas[this.playerTurn]);
            this.renderDiscard(this.discardAreas[this.playerTurn]!, this.playerTurn);
          }, 1500);


          // 手札をストックから内部的に補充する。
          // ストックからそのまま補充すると selected false が代入されてしまう。
          // そのため、代入後に selected true に更新する必要がある。

          // 手札のカードの内部情報を削除して、非選択のカードの内部情報を代入する。
          // ただし、非選択の手札のカードの位置はそのままにしたい。
          // そのため選択したカードを補充後の値で上書きする。
          setTimeout(() => {
            this._players[this.playerTurn].hand.forEach((hand, index) => {
              if (hand.selected) {
                this._players[this.playerTurn].hand[index] = this._stock.splice(Math.floor(Math.random() * this._stock.length), 1)[0];
                this._players[this.playerTurn].hand[index].selected = true;
              }
            });
          }, 1800);


          // 手札（見た目）を更新する。
          // その際、選択したカードは透明にしておく。

          // this.renderHand(this.handAreas[this.playerTurn]!, this.playerTurn); を実行することで
          // 手札内の情報が初期化されるため、
          // 捨て札の上に移動・配置されていた選択済みのカードは削除される。
          setTimeout(() => {
            this._tool.nullCheck(this.handAreas[this.playerTurn]);
            this.renderHand(this.handAreas[this.playerTurn]!, this.playerTurn);
          }, 2000);


          // 選択したカード（透明化されてる）を瞬時にストックに移動する。
          // 選択したカードの透明化を解除する。
          // ストックから該当する手札へ補充後のカードを移動する。 1 秒かかる。
          setTimeout(() => {
            this.refill_Cards_Animation();

            // メインプレイヤーが交換ボタンをクリックしたときのセリフを非表示
            this._message.hideMessage();
          }, 2100);


          // 手札を並べ替える前に一時的に手札を非表示にする。
          // 一瞬で並べ替えるのではなくて、ほんの少し間を置いたほうが並べ替えられたことが分かりやすくなる。
          setTimeout(() => {
            const hand_Lists = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);
            hand_Lists.forEach((card) => {
              card.classList.add('hide');
            });
          }, 6000);


          setTimeout(() => {
            // 手札の選択済み状態を解除する = 手札のすべてのカードを表示する
            this._players[this.playerTurn].hand.forEach((card: trump) => {
              card.selected = false;
            });

            // 現在の手札と役が一致しているかどうかチェックおよび内部的に役に対応した並び替えを行う
            this._hand_list.checkHand_And_rearrangesCards(this.playerTurn);

            // 手札を再描画する
            this._tool.nullCheck(this._player0_handArea);
            this.renderHand(this.handAreas[this.playerTurn]!, this.playerTurn);

            console.log(`補充後の手札 this._players[${this.playerTurn}].hand:`, this._players[this.playerTurn].hand);
          }, 6500);


          // 補充後の手札から適切なセリフを表示
          setTimeout(() => {
            this._message.openMessage(this.playerTurn);
            // 手札の状況に応じたセリフを表示 ブラフあり
            this._message.handCondition(this._players[this.playerTurn].strong.handListNumber, this.playerTurn, true);
          }, 8000);


          // 次のターンへ
          setTimeout(() => {
            this._message.hideMessage();

            if (this.playerTurn !== 0) {
              this.nextTurn();
            }
            // メインプレイヤーが最後のターンであることを前提とする
            else if (this.playerTurn === 0) {
              this.before_Click_OpenBtn();
            }
          }, 11000);
        }
      });
    }



    before_Click_OpenBtn() {
      // メインプレイヤーが最後のターンであることを前提とする
      // ストックの位置にボタンを配置
      // クリックしたら全員の手札をオープンするメソッドを実行
      this._tool.createDoubleLineBtn(
        document.querySelector('.stock')!,
        'openBtn',
        '手札を<br>公開する'
      );

      const openBtn = document.querySelector<HTMLElement>('.openBtn');
      this._tool.nullCheck(openBtn);

      // 手札を公開する前のセリフを表示
      this._message.openMessage('all');
      this._message.before_Open_PlayersHand();

      openBtn!.addEventListener('click', () => {
        // 手札公開ボタンを消去
        openBtn!.remove();

        // 全員の手札をオープンするメソッドを実行
        this.open_PlayersHand();
      });
    }



    // 選択したカードを捨て札に出すアニメーション
    discard_SelectedCards_Animation() {
      // 疑問　適切な型の指定が分からない。 NodeListOf<Element> などで要検索！仕方がないから any で対応。
      // const playerLists: any = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);

      // 参照元
      // TypeScript で querySelector メソッドを使うときに型引数を指定する
      // https://developer.hatenastaff.com/entry/2020/12/12/121212

      // 原因
      // style プロパティが存在しないと言われています。
      // 変数 foo は Element 型であり、
      // style プロパティが定義されているのは HTMLElement 型 (Element 型を継承している) なので、
      // 型定義上は確かに style プロパティにアクセスできませんね。

      // TypeScript で querySelector、querySelectorAll メソッドを呼び出すときは、
      // 型引数を指定しましょう (メソッド名の直後の < > で囲んだ部分です)。

      // 良くないやり方
      // const playerLists = document.querySelectorAll(`.player${this.playerTurn}_hand>li`) as HTMLElement;
      // これだと Element | null 型から HTMLElement 型にキャストすることになり、
      // nullability が除去されてしまいます。
      // このままコードを書き続けると、要素が見つからないときに実行時エラーを引き起こしかねません。

      // 「この要素は絶対存在するから nullability を除去したい」というときは後置 ! 演算子を使いましょう。

      // 対処法
      // 型引数を指定することで、メソッドの返り値が HTMLElement | null 型となり、
      // style プロパティにもアクセスできるようになります。
      const playerLists = document.querySelectorAll<HTMLElement>(`.player${this.playerTurn}_hand>li`);

      // querySelectorAll メソッドも同様に型引数を指定できます。
      // 型引数を指定することで、配列に変換したり forEach メソッドを使ったりしたときに、
      // 適切な型が推論されるようになります。

      // 要素と型との対応
      // a 要素は HTMLAnchorElement 型であるといった対応は、MDN の HTML 要素リファレンスから調べられます。
      // https://developer.mozilla.org/ja/docs/Web/HTML/Element
      // 調べたい要素のページに飛び、「DOM インターフェイス」という項目を探してください。

      this._tool.nullCheck(playerLists);

      // 選択したカードが捨て札の上に配置されるように調整
      let zIndexCount = 10;

      // 選択したカードを手札から捨て札へ移動する
      // 移動量はプレイヤーによって異なる

      // 移動量 = 該当する捨て札の座標 - 該当する手札の座標
      this._players[this.playerTurn].hand.forEach((card: trump, index) => {
        if (card.selected) {
          const translateX = String(this._players[this.playerTurn].discardStartPosition[index].left - this._players[this.playerTurn].handStartPosition[index].left) + 'px';
          const translateY = String(this._players[this.playerTurn].discardStartPosition[index].top - this._players[this.playerTurn].handStartPosition[index].top) + 'px';

          playerLists[index].style.zIndex = String(zIndexCount);
          playerLists[index].style.transition = 'transform 1s';
          playerLists[index].style.transform = `translate(${translateX}, ${translateY})`;
        }
      });
    }



    // 積み札（ストック）から手札へカードが移動するアニメーション
    // 見た目はストックから手札へ移動するように見せるけど、
    // 実際は手札のカードをストックの位置に表示 => 手札の位置へ戻る という流れ

    refill_Cards_Animation(): void {
      // 疑問　適切な型の指定が分からない。 NodeListOf<Element> などで要検索！仕方がないから any で対応。
      // const handLists: any = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);
      // 対処法 上記 discard_SelectedCards_Animation() と同じ

      const stockArea = document.querySelector<HTMLElement>('.stock');
      const handLists = document.querySelectorAll<HTMLElement>(`.player${this.playerTurn}_hand>li`);

      this._tool.nullCheck(stockArea);
      this._tool.nullCheck(handLists);

      // ストックから手札へ移動する際に捨て札の上を移動するように調整
      let zIndexCount = 20;

      // ストックの座標の把握
      let stock_leftPoint = 0;
      let stock_topPoint = 0;

      stock_leftPoint = window.pageXOffset + stockArea!.getBoundingClientRect().left;
      stock_topPoint = window.pageYOffset + stockArea!.getBoundingClientRect().top;

      // アニメーションを一度ずつ実行する際の間隔
      let animationGap = 0;

      // ストックから手札へ１枚ずつカードが移動するアニメーション
      this._players[this.playerTurn].hand.forEach((card: trump, index) => {
        // 補充するカード（手札にある）をストックの位置に瞬時に移動する
        if (card.selected) {
          // 移動量 = ストック座標 - 該当する手札の座標
          const translateX_toStock = String(stock_leftPoint - this._players[this.playerTurn].handStartPosition[index].left) + 'px';
          const translateY_toStock = String(stock_topPoint - this._players[this.playerTurn].handStartPosition[index].top) + 'px';

          handLists[index].style.zIndex = String(zIndexCount);
          handLists[index].style.transition = 'transform';
          handLists[index].style.transform = `translate(${translateX_toStock}, ${translateY_toStock})`;

          // （選択済みのカード） => 補充するカードの透明化を解除する。
          handLists[index].classList.remove('hide');
        }

        // ストックから手札へ移動する。 1 秒かかる。
        setTimeout(() => {
          if (card.selected) {
            // 元の位置に戻るため、座標は (0, 0)
            handLists[index].style.transition = 'transform 1s';
            handLists[index].style.transform = `translate(0, 0)`;
          }
        }, 1000 + 100 * animationGap);

        animationGap++;

        // ストックから手札へカードが移動する際に、手札の左側から順番にカードがストックから配られる。
        // 先に配られるカード（左側）が後から配られるカード（右側）より上に配置されてる必要がある。
        // そのため zIndexCount をデクリメントして順番を調整する。左側より右側のほうが下に配置される。
        zIndexCount--;
      });
    }



    // サブプレイヤーが思考して意思決定を行う
    subPlayerThought() {
      // 具体的な思考方法は冒頭のメモを参照
      // クリックメソッドを実行という流れで簡単に実装してみる。


      // サブプレイヤー思考中のセリフ
      this._message.openMessage(this.playerTurn);
      this._message.playerThought(this.playerTurn);


      // 3 秒後 どのカードを選択するか意思決定する。カードを選択する
      setTimeout(() => {
        const playerCards: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);

        // 基本的にワンペア・ノーハンドのときにのみ チェックする
        let bool_common_suit = false; // 絵柄の共通性チェック
        let bool_straight_number = false; // 数字の連続性チェック

        // 現在の手札の役名
        console.log(`${this._players[this.playerTurn].strong.handList}!`);

        // ロイヤル ストレート フラッシュ, ストレート フラッシュ, フォーカード, フルハウス, フラッシュ, ストレート
        // 基本的にカード交換は行わない。


        // スリーカード
        // 一致してない 2 枚のカードを捨て札に出して、フォーカード フルハウスを狙うのが定石。
        // 手札 左側の 2 枚のカードを捨て札に出す
        if (this._players[this.playerTurn].strong.handListNumber === 3) {
          playerCards[0].click();
          playerCards[1].click();
        }


        // ツーペア
        // 一致してない 1 枚のカードを捨て札に出して、フルハウスを狙うのが定石。
        // 手札 左側の 1 枚のカードを捨て札に出す
        else if (this._players[this.playerTurn].strong.handListNumber === 2) {
          playerCards[0].click();
        }


        // ワンペア
        // 絵柄が一致（4 枚）しているかどうか => フラッシュを狙う。
        // （ワンペアからノーハンドになるリスクをどう比較する？） => 基本的には狙うべき。

        // 数字が連続してる（4 枚）かどうか => ストレートを狙う。
        // （ワンペアからノーハンドになるリスクをどう比較する？） => 基本的には狙うべき。

        // 上記条件に合致してない
        // => 一致してない 3 枚のカードを捨て札に出して、フォーカード フルハウス スリーカード ツーペアを狙う。
        // 基本的にはスリーカードを狙うのが定石。
        // 手札 左側の 3 枚のカードを捨て札に出す
        else if (this._players[this.playerTurn].strong.handListNumber === 1) {

          console.log(`ワンペア 絵柄の共通性チェック this.decisionMaking_common_suit(bool_common_suit) execution!`);
          bool_common_suit = this.decisionMaking_common_suit(bool_common_suit);
          console.log(`ワンペア 絵柄の共通性チェック ${bool_common_suit} ！`);

          if (!bool_common_suit) {
            console.log(`ワンペア 数字の連続性チェック this.decisionMaking_straight_number(bool_straight_number) execution!`);
            bool_straight_number = this.decisionMaking_straight_number(bool_straight_number);
            console.log(`ワンペア 数字の連続性チェック ${bool_straight_number} ！`);
          }

          if (!bool_common_suit && !bool_straight_number) {
            // 絵柄が一致・数字が連続してる いずれも条件に合致してない場合、
            // 手札 左側の 3 枚のカードを捨て札に出す
            console.log(`ワンペア 絵柄の共通性 なし, 数字の連続性 なし`);
            playerCards.forEach((card: HTMLLIElement, index) => {
              if (index === 0 || index === 1 || index === 2) {
                card.click();
              }
            });
          }
        }


        // ノーハンド
        // 数字がまったく一致していない

        // 絵柄が一致（4 枚）・数字が連続（4 枚） 両方満たしてる
        //   => ロイヤル ストレート フラッシュ・ストレート フラッシュを狙う。

        // 絵柄が一致しているかどうか （3 枚以上） => フラッシュを狙う。

        // 数字が連続してるかどうか （3 枚以上） => ストレートを狙う。

        // （※ありえない）数字が一致しているかどうか => フォーカード フルハウス スリーカード ツーペアを狙う。

        // 上記条件に合致してない
        // 強いカード A K Q J などがあれば 1 枚は捨てないで、ほかのカードをすべて捨てる。
        // 強いカードもないなら、すべてのカードを捨てる。
        else if (this._players[this.playerTurn].strong.handListNumber === 0) {

          console.log(`ノーハンド 絵柄の共通性チェック this.decisionMaking_common_suit(bool_common_suit) execution!`);
          bool_common_suit = this.decisionMaking_common_suit(bool_common_suit);
          console.log(`ノーハンド 絵柄の共通性チェック ${bool_common_suit} ！`);

          if (!bool_common_suit) {
            console.log(`ノーハンド 数字の連続性チェック this.decisionMaking_straight_number(bool_straight_number) execution!`);
            bool_straight_number = this.decisionMaking_straight_number(bool_straight_number);
            console.log(`ノーハンド 数字の連続性チェック ${bool_straight_number} ！`);
          }

          if (!bool_common_suit && !bool_straight_number) {
            // 絵柄が一致・数字が連続してる いずれも条件に合致してない場合、
            // 強いカード A K Q J などがあれば 1 枚は捨てないで、ほかのカードをすべて捨てる。
            // 強いカードもないなら、すべてのカードを捨てる。
            if (this._players[this.playerTurn].hand[4].strongNumber >= 11) {
              console.log(`ノーハンド 絵柄の共通性 なし, 数字の連続性 なし, 強力なカード あり!`);
              playerCards.forEach((card: HTMLLIElement, index) => {
                if (index === 0 || index === 1 || index === 2 || index === 3) {
                  card.click();
                }
              });
            } else {
              console.log(`ノーハンド 絵柄の共通性 なし, 数字の連続性 なし, 強力なカード なし!`);
              playerCards.forEach((card: HTMLLIElement) => {
                card.click();
              });
            }
          }
        }


        // 意思決定のセリフ
        this._message.playerDecide(this.playerTurn, this._selectedCardsCount);
      }, 3000);


      // 交換ボタンをクリックする
      setTimeout(() => {
        this._message.hideMessage();

        const exchangeBtn = document.querySelector<HTMLElement>('.exchangeBtn');
        exchangeBtn!.click();
      }, 5000);
    }


    // 絵柄の一致数に基づいて意思決定する
    decisionMaking_common_suit(bool_common_suit: boolean): boolean {
      const playerCards: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);

      // 絵柄ごとの保有枚数の把握
      let spadeCount = 0;
      let heartCount = 0;
      let diamondCount = 0;
      let clubCount = 0;

      this._players[this.playerTurn].hand.forEach((playerCard) => {
        if (playerCard.suit === 'spade') {
          spadeCount++;
        }
        if (playerCard.suit === 'heart') {
          heartCount++;
        }
        if (playerCard.suit === 'diamond') {
          diamondCount++;
        }
        if (playerCard.suit === 'club') {
          clubCount++;
        }
      });

      // 共通の絵柄が 4 枚そろってる場合は、異なる絵柄のカード 1 枚のカードを捨て札に出す
      if (spadeCount === this._players[this.playerTurn].hand.length - 1) {
        this._players[this.playerTurn].hand.forEach((playerCard, index) => {
          if (playerCard.suit !== 'spade') {
            playerCards[index].click();
            bool_common_suit = true;
            return bool_common_suit;
          }
        });
      }
      else if (heartCount === this._players[this.playerTurn].hand.length - 1) {
        this._players[this.playerTurn].hand.forEach((playerCard, index) => {
          if (playerCard.suit !== 'heart') {
            playerCards[index].click();
            bool_common_suit = true;
            return bool_common_suit;
          }
        });
      }
      else if (diamondCount === this._players[this.playerTurn].hand.length - 1) {
        this._players[this.playerTurn].hand.forEach((playerCard, index) => {
          if (playerCard.suit !== 'diamond') {
            playerCards[index].click();
            bool_common_suit = true;
            return bool_common_suit;
          }
        });
        return bool_common_suit;
      }
      else if (clubCount === this._players[this.playerTurn].hand.length - 1) {
        this._players[this.playerTurn].hand.forEach((playerCard, index) => {
          if (playerCard.suit !== 'club') {
            playerCards[index].click();
            bool_common_suit = true;
            return bool_common_suit;
          }
        });
      }
      return bool_common_suit;
    }


    // 数字の連続性に基づいて意思決定する
    // ストレートを狙うのは、ワンペアかノーハンドのときのみ
    decisionMaking_straight_number(bool_straight_number: boolean): boolean {
      const playerCards: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);

      // this.dealCards() でサブプレイヤーの挙動が適切かどうか確認しながら実装すること。「※サブプレイヤー 意思決定 確認用」で検索！

      // 手札の情報をコピー
      const placeHandCards = [...this._players[this.playerTurn].hand];


      // 例外的ケース（手札内に A があり、 A が最弱になる予定のケース）

      // ノーハンドで A が最弱になる予定のケース
      // ex) 3 4 5 6 1 => 2 が抜けてる => 1 または 6 を捨てる
      // ex) 2 4 5 6 1 => 3 が抜けてる => 1 または 6 を捨てる
      // ex) 2 3 5 6 1 => 4 が抜けてる => 1 または 6 を捨てる
      // ex) 2 3 4 6~13 1 => 5 が抜けてる => 1 または 6~13 を捨てる
      // => ストレート不成立の場合を考えると 6 を捨てるほうが上策
      if (
        (
          placeHandCards[0].number === 3 &&
          placeHandCards[1].number === 4 &&
          placeHandCards[2].number === 5 &&
          placeHandCards[3].number === 6 &&
          placeHandCards[4].number === 1
        ) || (
          placeHandCards[0].number === 2 &&
          placeHandCards[1].number === 4 &&
          placeHandCards[2].number === 5 &&
          placeHandCards[3].number === 6 &&
          placeHandCards[4].number === 1
        ) || (
          placeHandCards[0].number === 2 &&
          placeHandCards[1].number === 3 &&
          placeHandCards[2].number === 5 &&
          placeHandCards[3].number === 6 &&
          placeHandCards[4].number === 1
        ) || (
          placeHandCards[0].number === 2 &&
          placeHandCards[1].number === 3 &&
          placeHandCards[2].number === 4 &&
          // placeHandCards[3].number === 6 ~ 13 &&
          placeHandCards[4].number === 1
        )
      ) {
        console.log(`ノーハンドで A が最弱になる予定のケースに該当！ => 右側（下側？）から 1 枚 隣のカードを出す！`);
        playerCards[3].click();
        bool_straight_number = true;
        return bool_straight_number;
      }

      // ワンペアで A が最弱になる予定のケース
      // => straightCount が 2 だけど、ストレートを狙えるケース
      // ex) 3 4 5 1 1 => 2 が抜けてる => 1 を捨てる
      // ex) 2 4 5 1 1 => 3 が抜けてる => 1 を捨てる
      // ex) 2 3 5 1 1 => 4 が抜けてる => 1 を捨てる
      // => ストレートを狙うか、ワンペア A は残し、別の役を狙うか 分岐
      else if (
        (
          placeHandCards[0].number === 3 &&
          placeHandCards[1].number === 4 &&
          placeHandCards[2].number === 5 &&
          placeHandCards[3].number === 1 &&
          placeHandCards[4].number === 1
        ) || (
          placeHandCards[0].number === 2 &&
          placeHandCards[1].number === 4 &&
          placeHandCards[2].number === 5 &&
          placeHandCards[3].number === 1 &&
          placeHandCards[4].number === 1
        ) || (
          placeHandCards[0].number === 2 &&
          placeHandCards[1].number === 3 &&
          placeHandCards[2].number === 5 &&
          placeHandCards[3].number === 1 &&
          placeHandCards[4].number === 1
        )
      ) {
        console.log(`ワンペアで A が最弱になる予定のケースに該当！`);
        const firstOrLast = Math.floor(Math.random() * 5);
        if (firstOrLast === 0) { // 20%
          console.log(`ワンペアが A ！ でも ストレートを狙う！ => ワンペアから 1 枚出す！ bool_straight_number = true;`);
          playerCards[4].click();
          bool_straight_number = true;
          return bool_straight_number;
        } else { // 80%
          console.log(`ワンペアが A ！ ストレートは狙わず、その他の役を狙う！ bool_straight_number = false;`);
          return bool_straight_number;
        }
      }


      // 一般的なケース

      // strongNumber を基準に昇順に並べ替える
      placeHandCards.sort((a, b) => {
        if (a.strongNumber !== b.strongNumber) { return a.strongNumber - b.strongNumber; }
        return 0;
      });

      // 手札内で数字がいくつ隣り合っているかの把握
      let straightCount = 0;

      // 隣り合う数字が 3 つある場合 ストレートを視野に入れる
      // ex) 5 7 8 9 10 => 7 8, 8 9, 9 10, 3 つ隣り合っている。 => ストレートを視野に入れる
      if (placeHandCards[0].strongNumber === placeHandCards[1].strongNumber - 1) { straightCount++; }
      if (placeHandCards[1].strongNumber === placeHandCards[2].strongNumber - 1) { straightCount++; }
      if (placeHandCards[2].strongNumber === placeHandCards[3].strongNumber - 1) { straightCount++; }
      if (placeHandCards[3].strongNumber === placeHandCards[4].strongNumber - 1) { straightCount++; }

      console.log(`straightCount: ${straightCount}`);

      if (straightCount === 3) {
        // ツーペアの場合、隣り合うケースが 3 つある場合 という条件を満たさないため、ストレートを狙わない
        // ex) 10 10 11 11 12 => 10 11 を捨てる方法もあるけど、分が悪い => ストレートを狙わない


        // ワンペアのケースを優先的に記述
        // ワンペアの場合、手札はペアになっているカードが右側に配置されてる。
        // ex) 10 12 13 11 11 => 11 を 1 枚捨てる

        // ワンペアからノーハンドになるリスクがあるけど どうするべきか？ => 基本的に狙うべき

        if (this._players[this.playerTurn].strong.handListNumber === 1) {
          // 強力なワンペア（ J 以上）の場合、ストレートを狙うかどうか分岐
          if (this._players[this.playerTurn].hand[4].number >= 11) {
            const firstOrLast = Math.floor(Math.random() * 5);
            if (firstOrLast === 0) { // 20%
              console.log(`ワンペアが強力！ でも ストレートを狙う！ => ワンペアから 1 枚出す！ bool_straight_number = true;`);
              playerCards[4].click();
              bool_straight_number = true;
              return bool_straight_number;
            } else { // 80%
              console.log(`ワンペアが強力！ ストレートは狙わず、その他の役を狙う！ bool_straight_number = false;`);
              return bool_straight_number;
            }
          } else {
            console.log(`通常のワンペア から ストレートを狙う！ => ワンペアから 1 枚出す！ bool_straight_number = true;`);
            playerCards[4].click();
            bool_straight_number = true;
            return bool_straight_number;
          }
        }


        // ノーハンドのケース
        // ノーハンドの場合、手札は strongNumber 順に配置されてる。

        // 隣り合っていないカードが手札の端側にあるパターン [0][4]
        // ex) 5 7 8 9 10 => 5 を捨てるほうが上策
        // ex) 5 6 7 8 10 => 10 を捨てるほうが上策
        // ex) 5 6 7 8 12 => 12 を捨てるほうが上策
        // => 隣り合ってないカードを出す
        // 隣り合ってない同士の数字の差は考慮する必要がない。


        // 隣り合っていないカードが手札の中側にあるパターン [1][2][3]
        // 隣り合ってない同士の数字の差が 2 であること。

        // ex) 2 3 5 6 7 => 2 または 7 を捨てる
        // 隣り合ってない同士の数字の差 5 - 3 = 2
        // => 一番最初 または 一番最後 のカードを捨てる
        // => 一番最初 のカードを捨てるほうが上策

        // ex) 2 3 6 7 8 => ストレートを狙わない
        // 隣り合ってない同士の数字の差 6 - 3 = 3

        else if (placeHandCards[0].strongNumber !== placeHandCards[1].strongNumber - 1) {
          // [0] が隣り合っていない
          if (placeHandCards[1].strongNumber === placeHandCards[2].strongNumber - 1) {
            // 隣り合ってないカードを出す
            console.log(`通常のノーハンド から ストレートを狙う！ 隣り合っていないカードが手札の 端側 にあるパターン！ => 隣り合ってないカードを出す！`);
            this._players[this.playerTurn].hand.forEach((card, index) => {
              if (card.strongNumber === placeHandCards[0].strongNumber) {
                playerCards[index].click();
                bool_straight_number = true;
                return bool_straight_number;
              }
            });
          }
          // [1] が隣り合っていない
          else {
            // 隣り合ってない同士の数字の差が 2 ならばストレートを狙う。
            if ((placeHandCards[1].strongNumber - placeHandCards[0].strongNumber) === 2) {
              console.log(`通常のノーハンド から ストレートを狙う！ 隣り合っていないカードが手札の 中側 にあるパターン！ => 一番最初 のカードを捨てる！`);
              playerCards[0].click();
              bool_straight_number = true;
            }
            return bool_straight_number;
          }
        }
        // [2] が隣り合っていない
        else if (placeHandCards[1].strongNumber !== placeHandCards[2].strongNumber - 1) {
          // 隣り合ってない同士の数字の差が 2 ならばストレートを狙う。
          if ((placeHandCards[2].strongNumber - placeHandCards[1].strongNumber) === 2) {
            console.log(`通常のノーハンド から ストレートを狙う！ 隣り合っていないカードが手札の 中側 にあるパターン！ => 一番最初 のカードを捨てる！`);
            playerCards[0].click();
            bool_straight_number = true;
          }
          return bool_straight_number;
        }
        // [3] が隣り合っていない
        else if (placeHandCards[2].strongNumber !== placeHandCards[3].strongNumber - 1) {
          // 隣り合ってない同士の数字の差が 2 ならばストレートを狙う。
          if ((placeHandCards[3].strongNumber - placeHandCards[2].strongNumber) === 2) {
            console.log(`通常のノーハンド から ストレートを狙う！ 隣り合っていないカードが手札の 中側 にあるパターン！ => 一番最初 のカードを捨てる！`);
            playerCards[0].click();
            bool_straight_number = true;
          }
          return bool_straight_number;
        }
        // [4] が隣り合っていない
        else if (placeHandCards[3].strongNumber !== placeHandCards[4].strongNumber - 1) {
          // 隣り合ってないカードを出す
          console.log(`通常のノーハンド から ストレートを狙う！ 隣り合っていないカードが手札の 端側 にあるパターン！ => 隣り合ってないカードを出す！`);
          this._players[this.playerTurn].hand.forEach((card, index) => {
            if (card.strongNumber === placeHandCards[4].strongNumber) {
              playerCards[index].click();
              bool_straight_number = true;
              return bool_straight_number;
            }
          });
        }
      }
      return bool_straight_number;
    }


    // 次のターンへ
    nextTurn() {
      // this.playerTurn を更新する
      this.playerTurn++;
      if (this.playerTurn > 3) {
        this.playerTurn = 0;
      }

      // 選択枚数を初期化する。
      this._selectedCardsCount = 0;

      console.log(`プレイヤー ${this.playerTurn} のターン！`);

      // this.playerTurn にもとづき、交換ボタンを生成 this.playerTurn で どの手札に配置すべきかが決まる
      this.createExchangeBtn();

      // サブプレイヤーの挙動
      if (this.playerTurn !== 0) {
        this.subPlayerThought();
      }
      // メインプレイヤーの挙動
      else if (this.playerTurn === 0) {
        // カードをクリックできるようにする。
        const selectedCards = document.querySelectorAll<HTMLElement>('.player0_hand>li');

        selectedCards.forEach((card) => {
          card.style.pointerEvents = 'auto';
          card.style.cursor = 'pointer';
        });


        // サブプレイヤーたちが役に応じたセリフを表示
        // メインプレイヤーがサブプレイヤーたちの思惑を推察するセリフを表示
        const subPlayerNames = [
          this._players[1].name,
          this._players[2].name,
          this._players[3].name
        ];

        this._message.openMessage('all');
        this._message.predict_subPlayers_handList(subPlayerNames);


        console.log(`プレイヤー 1 の役: ${this._players[1].strong.handList} ${this._players[1].strong.compareNumberLists}`);
        console.log(`プレイヤー 2 の役: ${this._players[2].strong.handList} ${this._players[2].strong.compareNumberLists}`);
        console.log(`プレイヤー 3 の役: ${this._players[3].strong.handList} ${this._players[3].strong.compareNumberLists}`);
      }
    }



    // 全員の手札をオープンするメソッドを実行
    open_PlayersHand() {
      console.log(`全員の手札をオープンする！ open_PlayersHand method execution!`);

      // おおまかな全体の流れ

      // 各プレイヤーが何位なのか判定する
      // 各プレイヤーにランクを割り当てる
      // 結果リストを更新（画面外に配置されてるため、瞬時に更新しても問題ない）

      // 2 秒後
      // 全員の手札を表にする

      // 5 秒後 ~ 11 秒後
      // それぞれのプレイヤーが順番に手札の役名をセリフで表示

      // 13 秒後
      // 結果リストを表示する直前のセリフを表示

      // 17 秒後
      // 結果リストを上から下へ移動して表示

      // 20 秒後
      // 順位に応じたセリフを表示

      // 23 秒後
      // カードを配り直すボタンを表示



      // 全員 セリフ 「せーの オープン！」を表示
      this._message.openMessage('all');
      this._message.open_PlayersHand();


      // 各プレイヤーが何位なのか判定する

      const playersHandList: {
        rank: number;
        name: string;
        handListNumber: number,
        compareNumberLists: number[]
      }[] = [];

      for (let i = 0; i < this._players.length; i++) {
        playersHandList[i] =
        {
          rank: 0,
          name: this._players[i].name,
          handListNumber: this._players[i].strong.handListNumber,
          compareNumberLists: this._players[i].strong.compareNumberLists
        }
      }


      // 役の強さ (handListNumber) で比較する。
      // 役の強さが同じの場合は比較対象のカードの数字 (compareNumberLists) で比較する。

      // 降順
      playersHandList.sort((a, b) => {
        if (a.handListNumber !== b.handListNumber) { return b.handListNumber - a.handListNumber; }
        else if (a.handListNumber === b.handListNumber) {
          for (let i = 0; i < a.compareNumberLists.length; i++) {
            if (a.compareNumberLists[i] !== b.compareNumberLists[i]) {
              return b.compareNumberLists[i] - a.compareNumberLists[i];
            }
          }
        }
        return 0;
      });

      console.log(` 1 位の役の情報 playersHandList[0]:`, playersHandList[0]);
      console.log(` 2 位の役の情報 playersHandList[1]:`, playersHandList[1]);
      console.log(` 3 位の役の情報 playersHandList[2]:`, playersHandList[2]);
      console.log(` 4 位の役の情報 playersHandList[3]:`, playersHandList[3]);

      // arr.sort()  a - b => 昇順  b - a => 降順


      // ※メモ　昇順と降順を入れ替える方法
      {
        // arr.reverse()  配列の順番を逆にする。

        // 昇順
        // playersHandList.sort((a, b) => {
        //   if (a.handListNumber !== b.handListNumber) { return a.handListNumber - b.handListNumber; }
        //   else if (a.handListNumber === b.handListNumber) {
        //     for (let i = 0; i < a.compareNumberLists.length; i++) {
        //       if (a.compareNumberLists[i] !== b.compareNumberLists[i]) {
        //         return a.compareNumberLists[i] - b.compareNumberLists[i];
        //       }
        //     }
        //   }
        //   return 0;
        // });

        // 降順
        // playersHandList.reverse(); // 昇順 => 降順へ並び替える
      }


      // 各プレイヤーにランクを割り当てる
      // 手札のカードがまったく同じ場合、同一の順位を割り当てる。
      // 隣同士の順位は同じか 1 の差があるか

      // ※配列の中身が完全に一致しているかどうかの確認方法
      // console.log( JSON.stringify(array1) === JSON.stringify(array2) ); // true

      // if (playersHandList[0].compareNumberLists === playersHandList[1].compareNumberLists) {}
      // => このやり方ではうまくいかないため注意

      if (
        JSON.stringify(playersHandList[0].compareNumberLists) ===
        JSON.stringify(playersHandList[1].compareNumberLists)
      ) {
        playersHandList[0].rank = 1;
        playersHandList[1].rank = playersHandList[0].rank;
      } else {
        playersHandList[0].rank = 1;
        playersHandList[1].rank = playersHandList[0].rank + 1;
      }

      if (
        JSON.stringify(playersHandList[1].compareNumberLists) ===
        JSON.stringify(playersHandList[2].compareNumberLists)
      ) {
        playersHandList[2].rank = playersHandList[1].rank;
      } else {
        playersHandList[2].rank = playersHandList[1].rank + 1;
      }

      if (
        JSON.stringify(playersHandList[2].compareNumberLists) ===
        JSON.stringify(playersHandList[3].compareNumberLists)
      ) {
        playersHandList[3].rank = playersHandList[2].rank;
      } else {
        playersHandList[3].rank = playersHandList[2].rank + 1;
      }

      this._players.forEach((player) => {
        for (let i = 0; i < playersHandList.length; i++) {
          if (player.name === playersHandList[i].name) {
            player.rank = playersHandList[i].rank;
          }
        }
      });

      console.log('プレイヤー 0 のランク this._players[0].rank:', this._players[0].rank, '位');
      console.log('プレイヤー 1 のランク this._players[1].rank:', this._players[1].rank, '位');
      console.log('プレイヤー 2 のランク this._players[2].rank:', this._players[2].rank, '位');
      console.log('プレイヤー 3 のランク this._players[3].rank:', this._players[3].rank, '位');



      // 結果リストを更新（画面外に配置されてるため、瞬時に更新しても問題ない）

      this._players.forEach((player) => {
        for (let i = 1; i < 5; i++) {
          if (player.rank === i) {
            const rank_rank = document.querySelector<HTMLTableCellElement>(`.rank${i}>.rank_rank`);
            rank_rank!.textContent = String(player.rank) + ' 位';

            const rank_image = document.querySelector<HTMLImageElement>(`.rank${i}>.rank_image>img`);
            rank_image!.src = player.image;

            const rank_name = document.querySelector<HTMLTableCellElement>(`.rank${i}>.rank_name`);
            rank_name!.textContent = player.name;

            // innerHTML を使うのはロイヤルストレートフラッシュなどの場合、改行が必要になるため。
            const rank_handlist = document.querySelector<HTMLElement>(`.rank${i}>.rank_handlist`);
            rank_handlist!.innerHTML = player.strong.handList;

            // どの役であろうと、最初の比較対象となるカードは一番右のカードになる。
            const rank_high_number_image = document.querySelector<HTMLImageElement>(`.rank${i}>.rank_high_number>img`);
            rank_high_number_image!.src = player.hand[4].url;

            const rank_compare_number_image = document.querySelector<HTMLElement>(`.rank${i}>.rank_compare_number`);
            player.hand.forEach((hand) => {
              const compareImage = document.createElement(`img`);
              compareImage.src = hand.url;
              rank_compare_number_image!.appendChild(compareImage);
            });
          }
        }
      });



      // 1.5 秒後
      // メッセージを非表示にする。

      // 2 秒後
      // 全員の手札を表にする

      // player 1 & 3 横向きのカード画像データは width の値に基づいて height が自動設定される。
      // width 150px が設定されてるため、自動で height 100px が設定される。

      // 縦向きの画像データを挿入すると
      // width 150px が設定されてるため、自動で height 225px が設定される。
      // (元画像サイズ width 100px height 150px) => (width 150px height 225px)

      // width 150px => width 100px に修正すれば、自動で height 150px が設定される。
      // そのうえで、 rotate() を実行する必要がある。

      // これは七並べのときと同様、画像サイズの異なるデータを挿入するから面倒になる。
      // 最初から同一サイズのデータを挿入するべき。
      // 最初から side_back.png ではなくて、 back.png を挿入して、 rotate() を実行するべき。 => 実装済み！

      setTimeout(() => {
        this._message.hideMessage();
      }, 1500);

      setTimeout(() => {
        for (let i = 1; i < this._players.length; i++) {
          const playerHandCardsImage = document.querySelectorAll<HTMLImageElement>(`.player${i}_hand>li>img`);

          playerHandCardsImage.forEach((card, index) => {
            card.src = this._players[i].hand[index].url;
          });
        }
      }, 2000);


      // ※以下 没コード 画像サイズの異なるデータを挿入すると、どれほど面倒なことになるかのサンプル
      {
        // player 1 & 3 横向きのカード画像データは width の値に基づいて height が自動設定される。
        // width 150px が設定されてるため、自動で height 100px が設定される。

        // 縦向きの画像データを挿入すると
        // width 150px が設定されてるため、自動で height 225px が設定される。
        // (元画像サイズ width 100px height 150px) => (width 150px height 225px)

        // width 150px => width 100px に修正すれば、自動で height 150px が設定される。
        // そのうえで、 rotate() を実行する必要がある。

        // これは七並べのときと同様、画像サイズの異なるデータを挿入するから面倒になる。
        // 最初から同一サイズのデータを挿入するべき。
        // 最初から side_back.png ではなくて、 back.png を挿入して、 rotate() を実行するべき。

        // setTimeout(() => {
        //   for (let i = 1; i < this._players.length; i++) {
        //     const playerHandCardsImage = document.querySelectorAll<HTMLImageElement>(`.player${i}_hand>li>img`);

        //     if (i === 2) {
        //       // player 2
        //       playerHandCardsImage.forEach((card, index) => {
        //         // 180deg のため、 カードが上下反転する。
        //         card.style.transform = 'rotate(180deg)';
        //         card.src = this._players[i].hand[index].url;
        //       });
        //     } else {
        //       // player 1 & 3 はカードを横向きにする必要がある。
        //       playerHandCardsImage.forEach((card, index) => {
        //         // カード画像ファイル要素 (img) の親要素 (li) の設定
        //         // top プロパティを有効にするには position: static; 以外を設定する必要がある。
        //         if (card.parentElement === null) {
        //           this._tool.nullCheck(card.parentElement);
        //         }
        //         card.parentElement!.style.position = 'relative';

        //         // 見た目は width: 100px; を設定することで変わらないように見えるけど、
        //         // ボックス領域はカード画像サイズから height 100px => 150px 確保していると思われる。
        //         // そのため、下の要素に向かうにつれて 50px ずつ ずれて配置されてしまうので座標を修正。
        //         card.parentElement!.style.top = String(-50 * index) + 'px';

        //         // カード画像ファイル要素 (img) の設定
        //         card.style.width = '100px';

        //         if (i === 1) {
        //           // 90deg のため、 100px 下へ移動する。左へ移動ではない。
        //           card.style.transform = 'rotate(90deg) translate(100px, 0)';
        //         } else if (i === 3) {
        //           // 270deg のため、 -100px 下へ移動する。左へ移動ではない。
        //           card.style.transform = 'rotate(270deg) translate(-100px, 0)';
        //         }

        //         card.src = this._players[i].hand[index].url;
        //       });
        //     }
        //   }
        // }, 2000);
      }



      // 5 秒後 ~ 11 秒後
      // それぞれのプレイヤーが順番に手札の役名をセリフで表示
      setTimeout(() => {
        this._message.openMessage(1);
        this._message.show_playerHand(
          this._players[1].strong.handList,
          this._players[1].hand[4].number,
          1
        );
      }, 5000);

      // 7 秒後
      setTimeout(() => {
        this._message.hideMessage();
        this._message.openMessage(2);
        this._message.show_playerHand(
          this._players[2].strong.handList,
          this._players[2].hand[4].number,
          2
        );
      }, 7000);

      // 9 秒後
      setTimeout(() => {
        this._message.hideMessage();
        this._message.openMessage(3);
        this._message.show_playerHand(
          this._players[3].strong.handList,
          this._players[3].hand[4].number,
          3
        );
      }, 9000);

      // 11 秒後
      setTimeout(() => {
        this._message.hideMessage();
        this._message.openMessage(0);
        this._message.show_playerHand(
          this._players[0].strong.handList,
          this._players[0].hand[4].number,
          0
        );
      }, 11000);


      // 13 秒後
      // 結果リストを表示する直前のセリフを表示
      setTimeout(() => {
        this._message.hideMessage();
        this._message.openMessage('all');
        this._message.before_resultList();
      }, 13000);



      // 17 秒後
      // 結果リストを上から下へ移動
      setTimeout(() => {
        this._message.hideMessage();
        const resultList = document.querySelector<HTMLDivElement>('.result_list');

        // 画面解像度に応じて条件分岐
        if (window.screen.height === 1200) {
          resultList!.style.top = '26.5%'; // 画面解像度 1920 * 1200
        } else {
          resultList!.style.top = '19%'; // 画面解像度 1920 * 1080 を前提とする
        }
      }, 17000);


      // 20 秒後
      // 順位に応じたセリフを表示
      setTimeout(() => {
        this._message.openMessage('all');
        for (let i = 0; i < this._players.length; i++) {
          this._message.playerRank(this._players[i].rank, i);
        }
      }, 20000);


      // 23 秒後
      // カードを配り直すボタンを表示
      setTimeout(() => {
        this._tool.createDoubleLineBtn(
          this.handAreas[0]!,
          'backToStartBtn',
          'カードを<br>配り直す'
        );

        const backToStartBtn = document.querySelector<HTMLDivElement>('.backToStartBtn');
        this._tool.nullCheck(backToStartBtn);

        backToStartBtn!.addEventListener('click', () => {
          // ボタンを消去
          backToStartBtn!.remove();

          // 結果リストを画面外に移動
          const resultList = document.querySelector<HTMLDivElement>('.result_list');
          resultList!.style.top = '-1300px';

          // 手札 捨て札を非表示
          for (let i = 0; i < this._players.length; i++) {
            this.handAreas[i]!.classList.add('hide');
            this.discardAreas[i]!.classList.add('hide');
          }

          // メッセージを非表示
          this._message.hideMessage();

          // 1 秒後にゲームを初期化して、カードを配り直す。
          setTimeout(() => {
            // 手札 捨て札を表示
            for (let i = 0; i < this._players.length; i++) {
              this.handAreas[i]!.classList.remove('hide');
              this.discardAreas[i]!.classList.remove('hide');
            }


            // ※以下 没コード 画像サイズの異なるデータを挿入すると、どれほど面倒なことになるかのサンプル
            {
              // ※ 2 周目以降、player 1 & 3 & stock がカードを捨て札に出すとき、微妙に横の位置がずれる。
              // スタート時のカードを配るストックアニメーションの時点でずれが生じている。
              // player 1 は捨て札の位置の手前 10px?程度手前で止まってしまう。
              // player 3 は捨て札の位置から 10px?程度超えて止まる。
              // stock も本来の表示される横向きのカード画像が 10px?程度 ずれた位置から表示されて手札へ移動する。
              // => 原因がよく分からない……

              // ※同じ領域でサイズの異なる画像（横向き画像と縦向き画像）を混在させるから
              // transform の配置調整という面倒な問題が発生する。
              // 最初から rotate() で調整した上で縦向き画像を配置すべきだった……。



              // player 1 2 3 は rotate() を初期化する必要がある。 => うまくいかない……。

              // for (let i = 1; i < this._players.length; i++) {
              //   const playerHandCardsImage = document.querySelectorAll<HTMLImageElement>(`.player${i}_hand>li>img`);

              //   if (i === 2) {
              //     // player 2
              //     playerHandCardsImage.forEach((card) => {
              //       // 180deg のため、 カードが上下反転する。 => 初期化
              //       // card.style.transform = 'rotate(180deg)';
              //       card.style.transform = 'rotate(0deg)';
              //     });
              //   } else {
              //     // player 1 & 3 は side_back.png を配置するため、横向きから縦向きに戻す必要がある。
              //     playerHandCardsImage.forEach((card, index) => {
              //       // カード画像ファイル要素 (img) の親要素 (li) の設定
              //       // カードを選択する際に、 top プロパティを有効にするため、
              //       //  position: relative; が設定されてる。それを初期化する。
              //       if (card.parentElement === null) {
              //         this._tool.nullCheck(card.parentElement);
              //       }
              //       card.parentElement!.style.position = 'relative';
              //       card.style.position = 'relative';

              //       // 見た目は width: 100px; を設定することで変わらないように見えるけど、
              //       // ボックス領域はカード画像サイズから height 100px => 150px 確保していると思われる。
              //       // そのため、下の要素に向かうにつれて 50px ずつ ずれて配置されてしまうので座標を修正。
              //       // card.parentElement!.style.top = String(-50 * index) + 'px';

              //       // 上記を初期化
              //       card.parentElement!.style.top = '0';

              //       // カード画像ファイル要素 (img) の設定
              //       // card.style.width = '100px';
              //       // 上記を初期化

              //       card.style.height = '150px';

              //       if (i === 1) {
              //         // 90deg のため、 100px 下へ移動する。左へ移動ではない。 => 初期化
              //         // card.style.transform = 'rotate(90deg) translate(100px, 0)';
              //         card.style.transform = 'translate(0, 0)';
              //         card.style.transform = 'rotate(0deg)';
              //       } else if (i === 3) {
              //         // 270deg のため、 -100px 下へ移動する。左へ移動ではない。 => 初期化
              //         // card.style.transform = 'rotate(270deg) translate(-100px, 0)';
              //         card.style.transform = 'translate(0, 0)';
              //         card.style.transform = 'rotate(0deg)';
              //       }
              //     });
              //   }
              // }
            }


            new Poker();
          }, 1000);
        });
      }, 23000);
    }



    get trump() {
      return this._trump;
    }

    get players() {
      return this._players;
    }
  }





  // スタートボタンを生成
  function createStartBtn() {
    const stock = document.querySelector('.stock');

    if (stock === null) {
      return;
    }

    const startBtn = document.createElement('div');
    startBtn.classList.add('btn', 'singleLineBtn', 'startBtn');
    startBtn.textContent = 'カードを配る';
    startBtn.addEventListener('click', () => {
      new Poker();
      startBtn.remove();
    });

    stock.appendChild(startBtn);
  }

  createStartBtn();
  new Load();



  // get trump() 挙動確認用
  // let poker = new Poker();
  // console.log('poker.trump:', poker.trump);

  // 座標取得 コード開発用 必要なければ消去すること
  // document.addEventListener('click', e => {
  //   console.log(e.clientX, e.clientY);
  // });
})();
'use strict';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
(function () {
    // 読み込み時にのみ実行するクラス
    var Load = /** @class */ (function () {
        function Load() {
            this._page = 1;
            this._pageMax = 5;
            this._textBox = document.querySelector('.rule_container>dl');
            this._tool = new Tool();
            this.createMessageBtn();
            this.createRuleBtn();
            this.createBackTopPageBtn();
            this.createRuleBox();
        }
        // ロード時、メッセージオンオフ切り替えボタンを表示
        Load.prototype.createMessageBtn = function () {
            var _this = this;
            var messageBtn = document.querySelector('.messageBtn');
            this._tool.nullCheck(messageBtn);
            var messageBtnClicked = false;
            messageBtn.innerHTML = 'メッセージ<br>O N';
            messageBtn.addEventListener('click', function () {
                var player0_message = document.querySelector('.player0_message');
                var player1_message = document.querySelector('.player1_message');
                var player2_message = document.querySelector('.player2_message');
                var player3_message = document.querySelector('.player3_message');
                _this._tool.nullCheck(player0_message);
                _this._tool.nullCheck(player1_message);
                _this._tool.nullCheck(player2_message);
                _this._tool.nullCheck(player3_message);
                player0_message.classList.toggle('message_off');
                player1_message.classList.toggle('message_off');
                player2_message.classList.toggle('message_off');
                player3_message.classList.toggle('message_off');
                if (!messageBtnClicked) {
                    messageBtnClicked = true;
                    messageBtn.innerHTML = 'メッセージ<br>OFF';
                }
                else {
                    messageBtnClicked = false;
                    messageBtn.innerHTML = 'メッセージ<br>O N';
                }
            });
        };
        // ロード時、ルール説明ボタンを表示
        Load.prototype.createRuleBtn = function () {
            var _this = this;
            var rule_container = document.querySelector('.rule_container');
            var mask = document.querySelector('#mask');
            var ruleBtn = document.querySelector('.ruleBtn');
            this._tool.nullCheck(rule_container);
            this._tool.nullCheck(mask);
            this._tool.nullCheck(ruleBtn);
            var ruleBtnClicked = false;
            ruleBtn.innerHTML = 'ルール 説明';
            ruleBtn.addEventListener('click', function () {
                rule_container.classList.remove('hide');
                mask.classList.remove('hide');
                if (!ruleBtnClicked) {
                    while (_this._textBox.firstChild) {
                        _this._textBox.firstChild.remove();
                    }
                    _this.createRuleText();
                    ruleBtnClicked = true;
                }
                else {
                    return;
                }
            });
        };
        // トップページに戻るボタンを表示
        Load.prototype.createBackTopPageBtn = function () {
            var backTopPageBtn = document.querySelector('.backTopPageBtn');
            this._tool.nullCheck(backTopPageBtn);
            backTopPageBtn.innerHTML = 'TOPページに<br>戻る';
            backTopPageBtn.addEventListener('click', function () {
                if (!confirm('トップページに戻りますか？')) {
                    return;
                }
                window.location.href = '../index.html';
            });
        };
        // ルール説明領域を生成
        Load.prototype.createRuleBox = function () {
            var _this = this;
            this.createRuleText();
            // pagePrev 前のページへ戻る の挙動
            var pagePrev = document.querySelector('.pagePrev');
            this._tool.nullCheck(pagePrev);
            pagePrev.addEventListener('click', function () {
                if (_this._page === 1) {
                    return;
                }
                else {
                    while (_this._textBox.firstChild) {
                        _this._textBox.firstChild.remove();
                    }
                    _this._page--;
                    _this.createRuleText();
                }
            });
            // pageNext 次のページへ進む の挙動
            var pageNext = document.querySelector('.pageNext');
            this._tool.nullCheck(pageNext);
            pageNext.addEventListener('click', function () {
                if (_this._page === _this._pageMax) {
                    return;
                }
                else {
                    while (_this._textBox.firstChild) {
                        _this._textBox.firstChild.remove();
                    }
                    _this._page++;
                    _this.createRuleText();
                }
            });
            // ページ数の生成
            var pageCurrent = document.querySelector('.pageCurrent');
            this._tool.nullCheck(pageCurrent);
            pageCurrent.textContent = "".concat(this._page, " / ").concat(this._pageMax);
            // 閉じるボタンの挙動
            var close = document.querySelector('.close');
            var rule_container = document.querySelector('.rule_container');
            var mask = document.querySelector('#mask');
            this._tool.nullCheck(close);
            this._tool.nullCheck(rule_container);
            this._tool.nullCheck(mask);
            close.addEventListener('click', function () {
                rule_container.classList.add('hide'); // cssClass と組み合わせることで translate(0, -1000px); 実行
                mask.classList.add('hide'); // cssClass と組み合わせることで display: none; 実行
            });
        };
        // ルール説明領域を生成
        Load.prototype.createRuleText = function () {
            var titleText = [];
            var sentenceText = [];
            // 詳細な説明文
            // １ページ目
            if (this._page === 1) {
                titleText.push("\u65E5\u672C\u5F0F\u30DD\u30FC\u30AB\u30FC\uFF08\u30AF\u30ED\u30FC\u30BA\u30C9\u30FB\u30DD\u30FC\u30AB\u30FC\uFF09");
                sentenceText.push("\u30C1\u30C3\u30D7\u3084\u30D9\u30C3\u30C8\u30FB\u30A2\u30F3\u30C6\u30A3\u30FB\u30D5\u30A9\u30FC\u30EB\u30C9\u306A\u3069\u306E\u306A\u3044\u7C21\u6613\u306A\u30DD\u30FC\u30AB\u30FC\u3002<br>\n           \u5DE6\u5074\u306E\u5F79\u4E00\u89A7\uFF08\u203B\u4E0A\u306B\u8A18\u8F09\u3055\u308C\u305F\u5F79\u307B\u3069\u5F37\u3044\uFF09\u3092\u53C2\u8003\u306B\u624B\u672D\u3092\u305D\u308D\u3048\u3066\u3001<br>\n           \u3088\u308A\u5F37\u3044\u5F79\u3092\u4F5C\u3063\u305F\u30D7\u30EC\u30A4\u30E4\u30FC\u304C\u52DD\u3061\u3002<br><br>");
                titleText.push("\u300C\u30B2\u30FC\u30E0\u306E\u9032\u3081\u65B9\u300D\u306B\u3064\u3044\u3066");
                sentenceText.push("\u300C\u30AB\u30FC\u30C9\u3092\u914D\u308B\u300D\u30DC\u30BF\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u3059\u3079\u3066\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u30AB\u30FC\u30C9\u304C 5 \u679A\u305A\u3064\u914D\u3089\u308C\u308B\u3002<br><br>\n           \u81EA\u5206\u306E\u30BF\u30FC\u30F3\u306B\u306A\u3063\u305F\u3089\u3001\u624B\u672D\u304B\u3089\u4E0D\u8981\u306A\u30AB\u30FC\u30C9\u3092\u6368\u3066\u672D\u306B\u51FA\u3057\u3066\u3001<br>\n           \u7A4D\u307F\u672D\u304B\u3089\u6368\u3066\u305F\u679A\u6570\u5206 \u88DC\u5145\u3059\u308B\u3053\u3068\u304C\u3067\u304D\u308B\u3002<br><br>\n           \u30AB\u30FC\u30C9\u306E\u88DC\u5145\u304C\u3067\u304D\u308B\u306E\u306F\u4E00\u56DE\u3060\u3051\u3002\u88DC\u5145\u304C\u7D42\u308F\u3063\u305F\u3089\u6B21\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u30BF\u30FC\u30F3\u3078\u3002<br>\n           \u88DC\u5145\u3057\u306A\u3044\u5834\u5408\u306F \u305D\u306E\u307E\u307E \u6B21\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u30BF\u30FC\u30F3\u3078\u3002<br><br>\n\n           \u3059\u3079\u3066\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u30BF\u30FC\u30F3\u304C\u7D42\u308F\u3063\u305F\u3089\u3001\u4E00\u6589\u306B\u624B\u672D\u3092\u516C\u958B\u3059\u308B\u3002<br>\n           \u304A\u4E92\u3044\u306E\u5F79\u3092\u898B\u6BD4\u3079\u3066\u3001\u9806\u4F4D\u304C\u78BA\u5B9A\u3059\u308B\u3002<br><br>\n\n           \uFF08\u6B21\u306E\u30DA\u30FC\u30B8\u306B\u7D9A\u304F\uFF09");
            }
            // ２ページ目
            else if (this._page === 2) {
                titleText.push("\u300C\u5F79\u306E\u7A2E\u985E\u300D\u306B\u3064\u3044\u3066\uFF08\u5F37\u3044\u9806\u306B\u8A18\u8F09\uFF09");
                sentenceText.push("\u30ED\u30A4\u30E4\u30EB\u30B9\u30C8\u30EC\u30FC\u30C8\u30D5\u30E9\u30C3\u30B7\u30E5<br>\n           \u3000\u624B\u672D\u306E\u30AB\u30FC\u30C9\u304C\u3059\u3079\u3066\u540C\u3058\u7D75\u67C4\u3067\u3001\u6570\u5B57\u300C 10 J Q K A \u300D\u304C\u305D\u308D\u3063\u305F\u5F79\u3002<br><br>\n\n           \u30B9\u30C8\u30EC\u30FC\u30C8\u30D5\u30E9\u30C3\u30B7\u30E5<br>\n           \u3000\u624B\u672D\u306E\u30AB\u30FC\u30C9\u304C\u3059\u3079\u3066\u540C\u3058\u7D75\u67C4\u3067\u3001\u3059\u3079\u3066\u9023\u7D9A\u3057\u305F\u6570\u5B57\u3067\u3042\u308B\u5F79\u3002<br><br>\n\n           \u30D5\u30A9\u30FC\u30AB\u30FC\u30C9<br>\n           \u3000\u624B\u672D\u306B\u540C\u3058\u6570\u5B57\u304C 4 \u679A\u305D\u308D\u3063\u305F\u5F79\u3002<br><br>\n\n           \u30D5\u30EB\u30CF\u30A6\u30B9<br>\n           \u3000\u30B9\u30EA\u30FC\u30AB\u30FC\u30C9\u3068\u30EF\u30F3\u30DA\u30A2\u304C\u305D\u308D\u3063\u305F\u5F79\u3002<br>\n           \u3000\u30D5\u30EB\u30CF\u30A6\u30B9\u306E\u5F37\u3055\u306F\u30B9\u30EA\u30FC\u30AB\u30FC\u30C9\u306E\u6570\u5B57\u306B\u3088\u3063\u3066\u5224\u65AD\u3055\u308C\u308B\u3002<br>\n           \u3000\u540C\u3058\u6570\u5B57\u306E\u30B9\u30EA\u30FC\u30AB\u30FC\u30C9\u3092\u76F8\u624B\u3082\u6301\u3063\u3066\u3044\u305F\u5834\u5408\u306F\u30EF\u30F3\u30DA\u30A2\u306E\u6570\u5B57\u306B\u3088\u3063\u3066\u5224\u65AD\u3055\u308C\u308B\u3002<br><br>\n\n           \u30D5\u30E9\u30C3\u30B7\u30E5<br>\n           \u3000\u624B\u672D\u306E\u30AB\u30FC\u30C9\u304C\u3059\u3079\u3066\u540C\u3058\u7D75\u67C4\u3067\u3042\u308B\u5F79\u3002<br><br>\n\n           \uFF08\u6B21\u306E\u30DA\u30FC\u30B8\u306B\u7D9A\u304F\uFF09");
            }
            // ３ページ目
            else if (this._page === 3) {
                titleText.push("\u300C\u5F79\u306E\u7A2E\u985E\u300D\u306B\u3064\u3044\u3066\uFF08\u5F37\u3044\u9806\u306B\u8A18\u8F09\uFF09");
                sentenceText.push("\u30B9\u30C8\u30EC\u30FC\u30C8<br>\n           \u3000\u624B\u672D\u306E\u30AB\u30FC\u30C9\u304C\u3059\u3079\u3066\u9023\u7D9A\u3057\u305F\u6570\u5B57\u3067\u3042\u308B\u5F79\u3002<br><br>\n\n           \u30B9\u30EA\u30FC\u30AB\u30FC\u30C9<br>\n           \u3000\u624B\u672D\u306B\u540C\u3058\u6570\u5B57\u304C 3 \u679A\u305D\u308D\u3063\u305F\u5F79\u3002<br><br>\n\n           \u30C4\u30FC\u30DA\u30A2<br>\n           \u3000\u624B\u672D\u306B\u30EF\u30F3\u30DA\u30A2\u304C 2 \u3064\u305D\u308D\u3063\u305F\u5F79\u3002<br><br>\n\n           \u30EF\u30F3\u30DA\u30A2<br>\n           \u3000\u624B\u672D\u306B\u540C\u3058\u6570\u5B57\u304C 2 \u679A\u305D\u308D\u3063\u305F\u5F79\u3002<br><br>\n\n           \u30CE\u30FC\u30CF\u30F3\u30C9\uFF08\u30CF\u30A4\u30AB\u30FC\u30C9\uFF09<br>\n           \u3000\u4E0A\u8A18\u306E\u3069\u306E\u5F79\u3082\u305D\u308D\u308F\u306A\u3044\u5F79\u3002<br><br>\n\n           \uFF08\u6B21\u306E\u30DA\u30FC\u30B8\u306B\u7D9A\u304F\uFF09");
            }
            // ４ページ目
            else if (this._page === 4) {
                titleText.push("\u300C\u9806\u4F4D\u306E\u6C7A\u3081\u65B9\u300D\u306B\u3064\u3044\u3066");
                sentenceText.push("\u30DD\u30FC\u30AB\u30FC\u306E\u5F79\u304C\u5F37\u3044\u307B\u3069\u3001\u9AD8\u3044\u9806\u4F4D\u304C\u5272\u308A\u5F53\u3066\u3089\u308C\u308B\u3002<br><br>\n\n          \u30DD\u30FC\u30AB\u30FC\u306E\u5F79\u304C\u540C\u3058\u5834\u5408\u306F\u3001\u305D\u308D\u3048\u305F\u5F79\u306E\u4E2D\u306E\u6570\u5B57\u306E\u5F37\u3055\u3067\u9806\u4F4D\u304C\u6C7A\u307E\u308B\u3002<br><br>\n\n          \u305D\u308D\u3048\u305F\u5F79\u306E\u4E2D\u306E\u6570\u5B57\u3082\u540C\u3058\u5834\u5408\u306F\u3001\u5F79\u306B\u5C5E\u3055\u306A\u3044\u30AB\u30FC\u30C9\u306E\u6570\u5B57\u306E\u5F37\u3055\u3067\u9806\u4F4D\u304C\u6C7A\u307E\u308B\u3002<br><br>\n\n          \u5F79\u306B\u5C5E\u3055\u306A\u3044\u30AB\u30FC\u30C9\u306E\u6570\u5B57\u3082\u540C\u3058<br>\n          \uFF08\u203B\u540C\u3058\u5F79\u3067\u3001\u81EA\u5206\u306E\u624B\u672D\u3068\u76F8\u624B\u306E\u624B\u672D\u306E\u30AB\u30FC\u30C9\u306E\u6570\u5B57\u304C\u3059\u3079\u3066\u540C\u3058\uFF09\u5834\u5408\u306F\u3001<br>\n          \u540C\u4E00\u306E\u9806\u4F4D\u304C\u5272\u308A\u5F53\u3066\u3089\u308C\u308B\u3002<br><br>\n\n          \uFF08\u6B21\u306E\u30DA\u30FC\u30B8\u306B\u7D9A\u304F\uFF09");
            }
            // ５ページ目
            else if (this._page === 5) {
                titleText.push("\u300C\u30AB\u30FC\u30C9\u306E\u6570\u5B57\u306E\u5F37\u3055\u300D\u306B\u3064\u3044\u3066");
                sentenceText.push("\u30DD\u30FC\u30AB\u30FC\u306F\u300CA\u300D\u304C\u4E00\u756A\u5F37\u304F\u3001<br>\n           \u300CK\u300D\u2192\u300CQ\u300D\u2192\u300CJ\u300D\u2192\u300C10\u300D\u3068\u9806\u756A\u306B\u5F31\u304F\u306A\u3063\u3066\u3044\u304D\u3001\u300C2\u300D\u304C\u4E00\u756A\u5F31\u3044\u30AB\u30FC\u30C9\u3002<br><br>\n\n           \u305F\u3060\u3057\u3001\u4F8B\u5916\u3068\u3057\u3066\u3001\u624B\u672D\u304C\u300C A 2 3 4 5 \u300D\u3068\u306A\u3063\u3066\u3044\u308B\u5834\u5408\u306F\u3001\u300CA\u300D\u304C\u4E00\u756A\u5F31\u3044\u30AB\u30FC\u30C9\u306B\u306A\u308B\u3002<br><br>");
                titleText.push("\u300C\u30B9\u30C8\u30EC\u30FC\u30C8\u7CFB\u306E\u5F79\u306E\u6CE8\u610F\u70B9\u300D\u306B\u3064\u3044\u3066");
                sentenceText.push("\u300C A 2 3 4 5 \u300D  \u3053\u308C\u306F\u30B9\u30C8\u30EC\u30FC\u30C8\u3002\u3053\u306E\u5834\u5408 A \u304C\u6700\u3082\u5F31\u304F\u306A\u308B\u3002<br><br>\n\n           \u300C 10 J Q K A \u300D \u3053\u308C\u306F\u30B9\u30C8\u30EC\u30FC\u30C8\u3002\u3053\u306E\u5834\u5408 A \u304C\u6700\u3082\u5F37\u304F\u306A\u308B\u3002<br><br>\n\n           \u300C J Q K A 2 \u300D  \u3053\u308C\u306F\u30B9\u30C8\u30EC\u30FC\u30C8\u3067\u306F\u306A\u3044\u3002");
            }
            // ルール説明ページ 生成
            for (var i = 0; i < titleText.length; i++) {
                this.insertRuleTitle(titleText[i]);
                this.insertRuleSentence(sentenceText[i]);
            }
            // 現在ページ数の更新
            var pageCurrent = document.querySelector('.pageCurrent');
            this._tool.nullCheck(pageCurrent);
            pageCurrent.textContent = "".concat(this._page, " / ").concat(this._pageMax);
        };
        // ルール タイトル文 生成
        Load.prototype.insertRuleTitle = function (titleText) {
            var title = document.createElement('dt');
            title.innerHTML = titleText;
            this._textBox.appendChild(title);
        };
        // ルール 説明文 生成
        Load.prototype.insertRuleSentence = function (sentenceText) {
            var sentence = document.createElement('dd');
            sentence.innerHTML = sentenceText;
            this._textBox.appendChild(sentence);
        };
        return Load;
    }());
    // メッセージ関係のメソッドはこちらにまとめておく。
    var Message = /** @class */ (function () {
        function Message() {
            this.messagesArea = [
                document.querySelector('.player0_message'),
                document.querySelector('.player1_message'),
                document.querySelector('.player2_message'),
                document.querySelector('.player3_message')
            ];
            this.players = [];
            for (var i = 0; i < this.messagesArea.length; i++) {
                this.players[i] = {
                    handListNumber: 0,
                    bluff: false
                };
            }
        }
        // セリフを１文字ずつ表示する
        Message.prototype.animation = function (texts, area) {
            var newText = '';
            var gap = 0;
            texts.forEach(function (text) {
                text.split("").forEach(function (value) {
                    newText += '<span style ="animation:showtext 0.05s ease ' + gap * 0.03 + 's forwards;">' + value + '</span>';
                    gap++;
                });
                newText += '<br>';
            });
            area.innerHTML = newText;
        };
        // 各プレイヤーのメッセージを表示する 全員表示したい場合は 'all' を指定すること。
        Message.prototype.openMessage = function (playerNum) {
            // ※データ型にもとづいて分岐
            if (typeof playerNum === 'string') {
                for (var i = 0; i < this.messagesArea.length; i++) {
                    this.messagesArea[i].classList.remove('hide');
                }
            }
            else if (typeof playerNum === 'number') {
                this.messagesArea[playerNum].classList.remove('hide');
            }
        };
        // すべてのプレイヤーのメッセージを非表示にする
        Message.prototype.hideMessage = function () {
            for (var i = 0; i < this.messagesArea.length; i++) {
                this.messagesArea[i].classList.add('hide');
            }
        };
        // ストックアニメーション完了後、手札を確認して、手札の中身に応じたセリフを表示 ブラフなし
        // 補充後の手札から適切なセリフを表示 ブラフあり
        Message.prototype.handCondition = function (handListNumber, playerNumber, bluff // ブラフはカード補充後の手札がノーハンドの場合のみ、一定の確率にもとづいて適用する
        ) {
            if (bluff === void 0) { bluff = false; }
            // ノーハンド
            var high_card = [
                'う～ん・・・',
                'むぅ～・・・'
            ];
            // ワンペア
            var a_pair = [
                'なるほど・・・',
                'まあまあ・・・',
                '悪くない。'
            ];
            // ツーペア
            var two_pair = [
                'いい感じ。',
                'いいかも。'
            ];
            // スリーカード
            var three_of_a_kind = [
                'よし、きた！',
                'これならいける！'
            ];
            // ストレート フラッシュ フルハウス ストレートフラッシュ ロイヤルストレートフラッシュ
            var strong_handList = [
                'こっ・・・これは・・・！！！'
            ];
            // 役にもとづいたセリフを一括管理
            var message_handLists = [
                high_card,
                a_pair,
                two_pair,
                three_of_a_kind,
                strong_handList
            ];
            this.players[playerNumber].handListNumber = handListNumber;
            // プレイヤー手札にもとづいてセリフを表示
            for (var checkHandListNum = 0; checkHandListNum < message_handLists.length; checkHandListNum++) {
                // ブラフを実行するかどうか決める。
                var bluffExecution = 0;
                // ブラフあり かつ ノーハンド の場合
                // とりあえず 66 % の確率で実行することにする
                // メインプレイヤーはブラフを実行しない。
                if (bluff === true && handListNumber === 0 && playerNumber !== 0) {
                    bluffExecution = Math.floor(Math.random() * 3);
                    if (bluffExecution === 0) {
                        console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u30D6\u30E9\u30D5 \u5B9F\u884C\u3057\u306A\u3044\uFF01");
                    }
                }
                // ブラフあり かつ ノーハンド かつ ブラフ実行変数が一定値以上 の場合
                if (bluff === true && handListNumber === 0 && bluffExecution >= 1) {
                    console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u30D6\u30E9\u30D5 \u5B9F\u884C\uFF01");
                    var randomNumber = Math.floor(Math.random() * strong_handList.length);
                    this.animation([strong_handList[randomNumber]], this.messagesArea[playerNumber]);
                    this.players[playerNumber].bluff = true;
                    break;
                }
                // ノーハンド ワンペア ツーペア スリーカード ストレート の場合
                else if (handListNumber === checkHandListNum) {
                    var randomNumber = Math.floor(Math.random() * message_handLists[checkHandListNum].length);
                    this.animation([message_handLists[checkHandListNum][randomNumber]], this.messagesArea[playerNumber]);
                    break;
                }
                // フラッシュ フルハウス ストレートフラッシュ ロイヤルストレートフラッシュ の場合
                else if (handListNumber >= message_handLists.length) {
                    var randomNumber = Math.floor(Math.random() * strong_handList.length);
                    this.animation([strong_handList[randomNumber]], this.messagesArea[playerNumber]);
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
        };
        // サブプレイヤー思考中のセリフ
        Message.prototype.playerThought = function (playerNumber) {
            var messages = [
                'う～ん、それじゃあ・・・',
                'どうしようか・・・',
                'どれを出すべきか・・・',
                'ここは・・・',
                'この手札なら・・・'
            ];
            if (this.messagesArea[playerNumber] === null) {
                throw new Error("Error! this.messagesArea[".concat(playerNumber, "] === null"));
            }
            this.animation([messages[Math.floor(Math.random() * messages.length)]], this.messagesArea[playerNumber]);
        };
        // 意思決定のセリフ
        // カードを１枚も選択していない場合で分岐させる
        Message.prototype.playerDecide = function (playerNumber, selectedCardsCount) {
            var messages = [];
            if (selectedCardsCount !== 0) {
                messages = [
                    'よし、これにしよう！',
                    'じゃあ、これだ！'
                ];
            }
            else if (selectedCardsCount === 0) {
                messages = [
                    'ここは このまま 勝負！'
                ];
            }
            if (this.messagesArea[playerNumber] === null) {
                throw new Error("Error! this.messagesArea[".concat(playerNumber, "] === null"));
            }
            this.animation([messages[Math.floor(Math.random() * messages.length)]], this.messagesArea[playerNumber]);
        };
        // メインプレイヤーがサブプレイヤーたちの思惑を推察するセリフを表示
        // メインプレイヤーのターンになったら、サブプレイヤーたちのセリフを表示
        // サブプレイヤーたちのセリフから自信があるかどうかを判別して、
        // メインプレイヤーのセリフを表示
        Message.prototype.predict_subPlayers_handList = function (subPlayerNames) {
            var messages = [
                "\u306F\u81EA\u4FE1\u304C\u3042\u308A\u305D\u3046\u3060\u30FB\u30FB\u30FB\u3002",
                "\u306F\u5FAE\u5999\u306A\u611F\u3058\u304C\u3059\u308B\u30FB\u30FB\u30FB\u3002",
                "\u306F\u81EA\u4FE1\u304C\u306A\u3055\u305D\u3046\u3060\u30FB\u30FB\u30FB\u3002",
                "\u306F\u81EA\u4FE1\u304C\u3042\u308B\u30D5\u30EA\u3092\u3057\u3066\u305D\u3046\u3060\u30FB\u30FB\u30FB\u3002" // ノーハンド ブラフあり
            ];
            if (this.messagesArea[0] === null) {
                throw new Error("Error! this.messagesArea[".concat(0, "] === null"));
            }
            // サブプレイヤー別に どのセリフを表示するか管理するための配列
            var messagesIndex = [0, 0, 0];
            for (var i = 1; i < this.players.length; i++) {
                if (this.players[i].handListNumber >= 2) {
                    messagesIndex[i - 1] = 0;
                }
                else if (this.players[i].handListNumber === 1) {
                    messagesIndex[i - 1] = 1;
                }
                else if (this.players[i].handListNumber === 0 && this.players[i].bluff === false) {
                    messagesIndex[i - 1] = 2;
                }
                else if (this.players[i].handListNumber === 0 && this.players[i].bluff === true) {
                    messagesIndex[i - 1] = 3;
                }
            }
            this.animation([
                "".concat(subPlayerNames[0], " ").concat(messages[messagesIndex[0]]),
                "".concat(subPlayerNames[1], " ").concat(messages[messagesIndex[1]]),
                "".concat(subPlayerNames[2], " ").concat(messages[messagesIndex[2]]),
                "\u3053\u306E\u307E\u307E\u52DD\u8CA0\u3059\u3079\u304D\u304B\u30FB\u30FB\u30FB\u3002",
                "\u3088\u308A\u5F37\u3044\u624B\u672D\u3092\u76EE\u6307\u3059\u3079\u304D\u304B\u30FB\u30FB\u30FB\u3002"
            ], this.messagesArea[0]);
        };
        ;
        // 手札を公開する前のセリフを表示
        Message.prototype.before_Open_PlayersHand = function () {
            var messages = [
                'これならいける！',
                'これはいけるか・・・。',
                '微妙だな・・・。',
                'うーん、どうだろう・・・。',
                'これは勝ったも同然！' // ノーハンド ブラフあり
            ];
            for (var i = 0; i < this.messagesArea.length; i++) {
                if (this.messagesArea[i] === null) {
                    throw new Error("Error! this.messagesArea[".concat(i, "] === null"));
                }
            }
            // サブプレイヤー別に どのセリフを表示するか管理するための配列
            var messagesIndex = [0, 0, 0];
            for (var i = 1; i < this.players.length; i++) {
                console.log("this.players[".concat(i, "].handListNumber: ").concat(this.players[i].handListNumber), "this.players[".concat(i, "].bluff: ").concat(this.players[i].bluff));
                if (this.players[i].handListNumber >= 3) {
                    messagesIndex[i - 1] = 0;
                }
                else if (this.players[i].handListNumber === 2) {
                    messagesIndex[i - 1] = 1;
                }
                else if (this.players[i].handListNumber === 1) {
                    messagesIndex[i - 1] = 2;
                }
                else if (this.players[i].handListNumber === 0 && this.players[i].bluff === false) {
                    messagesIndex[i - 1] = 3;
                }
                else if (this.players[i].handListNumber === 0 && this.players[i].bluff === true) {
                    messagesIndex[i - 1] = 4;
                }
                this.animation(["".concat(messages[messagesIndex[i - 1]])], this.messagesArea[i]);
            }
            this.animation(['それでは結果発表！'], this.messagesArea[0]);
        };
        // 手札を公開するときのセリフを表示
        Message.prototype.open_PlayersHand = function () {
            var messages = [
                'せーの オープン！'
            ];
            for (var i = 0; i < this.messagesArea.length; i++) {
                if (this.messagesArea[i] === null) {
                    throw new Error("Error! this.messagesArea[".concat(i, "] === null"));
                }
                this.animation([messages[Math.floor(Math.random() * messages.length)]], this.messagesArea[i]);
            }
        };
        // それぞれのプレイヤーが順番に手札の役名をセリフで表示
        Message.prototype.show_playerHand = function (handList, strongNumber, playerNumber) {
            if (this.messagesArea[playerNumber] === null) {
                throw new Error("Error! this.messagesArea[".concat(playerNumber, "] === null"));
            }
            var strongCardName = '';
            if (strongNumber === 1) {
                strongCardName = 'エース';
            }
            else if (strongNumber === 11) {
                strongCardName = 'ジャック';
            }
            else if (strongNumber === 12) {
                strongCardName = 'クイーン';
            }
            else if (strongNumber === 13) {
                strongCardName = 'キング';
            }
            if (strongNumber === 1 ||
                strongNumber === 11 ||
                strongNumber === 12 ||
                strongNumber === 13) {
                this.animation(["".concat(handList, " \u306E ").concat(strongCardName, " \uFF01")], this.messagesArea[playerNumber]);
            }
            else {
                this.animation(["".concat(handList, " \u306E ").concat(strongNumber, " \uFF01")], this.messagesArea[playerNumber]);
            }
        };
        // 結果リストを表示する直前のセリフを表示
        Message.prototype.before_resultList = function () {
            for (var i = 0; i < this.messagesArea.length; i++) {
                if (this.messagesArea[i] === null) {
                    throw new Error("Error! this.messagesArea[".concat(i, "] === null"));
                }
                this.animation(['ということは～・・・'], this.messagesArea[i]);
            }
        };
        // 順位に応じたセリフを表示
        Message.prototype.playerRank = function (rank, playerNumber) {
            if (this.messagesArea[playerNumber] === null) {
                throw new Error("Error! this.messagesArea[".concat(playerNumber, "] === null"));
            }
            if (rank === 1) {
                this.animation(["\u3088\u3057\uFF01 ".concat(rank, " \u4F4D\uFF01\uFF01\uFF01")], this.messagesArea[playerNumber]);
            }
            else if (rank === 2) {
                this.animation(["".concat(rank, " \u4F4D\u3060\uFF01")], this.messagesArea[playerNumber]);
            }
            else if (rank === 3) {
                this.animation(["".concat(rank, " \u4F4D\u304B\uFF5E\u3002")], this.messagesArea[playerNumber]);
            }
            else {
                this.animation(["".concat(rank, " \u4F4D\u2026\u2026\u3002")], this.messagesArea[playerNumber]);
            }
        };
        return Message;
    }());
    // よく使うメソッドはこちらにまとめておく。
    var Tool = /** @class */ (function () {
        function Tool(_poker) {
            this._poker = _poker;
        }
        Tool.prototype.nullCheck = function (checkObject) {
            if (checkObject === null) {
                throw new Error("Error! ".concat(checkObject, " === null"));
            }
        };
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
        Tool.prototype.createSingleLineBtn = function (area, cssName, text) {
            var btn = document.createElement('div');
            btn.classList.add('btn', 'singleLineBtn', cssName);
            btn.textContent = text; // ex) '交換する'
            if (this._poker !== undefined && this._poker.playerTurn !== 0) {
                btn.classList.add('hide'); // 透明化
                btn.style.pointerEvents = 'none'; // クリックイベント禁止 ドラッグ＆ドロップ禁止
            }
            area.appendChild(btn);
        };
        Tool.prototype.createDoubleLineBtn = function (area, cssName, text) {
            var btn = document.createElement('div');
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
        };
        return Tool;
    }());
    // 手札が役一覧と一致しているかどうかをチェックするためのクラス
    var Hand_list = /** @class */ (function () {
        // private _poker: Poker;
        // public constructor(Poker: Poker) {
        //   this._poker = Poker;
        // }
        // 上記コメント部分と下記コードは同じ
        function Hand_list(_poker) {
            this._poker = _poker;
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
        Hand_list.prototype.handList_style_remove = function () {
            var match_handArea = document.querySelectorAll('.match_hand');
            match_handArea.forEach(function (area) {
                area.classList.remove('match_hand');
            });
        };
        Hand_list.prototype.checkHand_And_rearrangesCards = function (playerNumber) {
            // Poker Class => this.dealCards() で配布されるカードを役通りに修正して挙動を確認すること
            var _a;
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
            this._poker.players[playerNumber].hand.sort(function (a, b) {
                if (a.number !== b.number) {
                    return a.number - b.number;
                }
                return 0;
            });
            // 数字の並びが [1, 2, 3, 4, 5] ならば、 1 の strongNumber を 1 に修正する。
            if (this._poker.players[playerNumber].hand[0].number === 1 &&
                this._poker.players[playerNumber].hand[1].number === 2 &&
                this._poker.players[playerNumber].hand[2].number === 3 &&
                this._poker.players[playerNumber].hand[3].number === 4 &&
                this._poker.players[playerNumber].hand[4].number === 5) {
                this._poker.players[playerNumber].hand[0].strongNumber = 1;
            }
            // 上記一連のコードで strongNumber が最強か最弱か検証が実現する。
            // その上で、手札を strongNumber の少ない順に並べ替える
            if (this._poker.players[playerNumber].hand.length === 0) {
                return;
            }
            // 昇順
            this._poker.players[playerNumber].hand.sort(function (a, b) {
                if (a.strongNumber !== b.strongNumber) {
                    return a.strongNumber - b.strongNumber;
                }
                return 0;
            });
            // 絵柄 ( suit ) がすべて同じならば true
            var match_suit = false;
            if ((this._poker.players[playerNumber].hand[0].suit === 'spade' &&
                this._poker.players[playerNumber].hand[1].suit === 'spade' &&
                this._poker.players[playerNumber].hand[2].suit === 'spade' &&
                this._poker.players[playerNumber].hand[3].suit === 'spade' &&
                this._poker.players[playerNumber].hand[4].suit === 'spade') ||
                (this._poker.players[playerNumber].hand[0].suit === 'heart' &&
                    this._poker.players[playerNumber].hand[1].suit === 'heart' &&
                    this._poker.players[playerNumber].hand[2].suit === 'heart' &&
                    this._poker.players[playerNumber].hand[3].suit === 'heart' &&
                    this._poker.players[playerNumber].hand[4].suit === 'heart') ||
                (this._poker.players[playerNumber].hand[0].suit === 'diamond' &&
                    this._poker.players[playerNumber].hand[1].suit === 'diamond' &&
                    this._poker.players[playerNumber].hand[2].suit === 'diamond' &&
                    this._poker.players[playerNumber].hand[3].suit === 'diamond' &&
                    this._poker.players[playerNumber].hand[4].suit === 'diamond') ||
                (this._poker.players[playerNumber].hand[0].suit === 'club' &&
                    this._poker.players[playerNumber].hand[1].suit === 'club' &&
                    this._poker.players[playerNumber].hand[2].suit === 'club' &&
                    this._poker.players[playerNumber].hand[3].suit === 'club' &&
                    this._poker.players[playerNumber].hand[4].suit === 'club')) {
                match_suit = true;
            }
            // 手札の数がすべて連続してるならば true
            var match_straight = false;
            if (this._poker.players[playerNumber].hand[0].strongNumber ===
                this._poker.players[playerNumber].hand[1].strongNumber - 1
                &&
                    this._poker.players[playerNumber].hand[1].strongNumber ===
                        this._poker.players[playerNumber].hand[2].strongNumber - 1
                &&
                    this._poker.players[playerNumber].hand[2].strongNumber ===
                        this._poker.players[playerNumber].hand[3].strongNumber - 1
                &&
                    this._poker.players[playerNumber].hand[3].strongNumber ===
                        this._poker.players[playerNumber].hand[4].strongNumber - 1) {
                match_straight = true;
            }
            // フォーカード フルハウス スリーカード ツーペア ワンペア 検証
            // 手札が該当する役に一致しているならば true
            var match_four_of_a_kind = false;
            var match_a_full_house = false;
            var match_three_of_a_kind = false;
            var match_two_pair = false;
            var match_a_pair = false;
            if (this.check_sameNumberCount(this._poker.players[playerNumber].hand, 4, playerNumber)) {
                match_four_of_a_kind = true;
            }
            else if (this.check_sameNumberCount(this._poker.players[playerNumber].hand, 3, playerNumber, 'a_full_house') &&
                this.check_sameNumberCount(this._poker.players[playerNumber].hand, 2, playerNumber, 'a_full_house')) {
                match_a_full_house = true;
            }
            else if (this.check_sameNumberCount(this._poker.players[playerNumber].hand, 3, playerNumber)) {
                match_three_of_a_kind = true;
            }
            else if (this.check_sameNumberCount(this._poker.players[playerNumber].hand, 2, playerNumber, 'two_pair')) {
                match_two_pair = true;
            }
            else if (this.check_sameNumberCount(this._poker.players[playerNumber].hand, 2, playerNumber)) {
                match_a_pair = true;
            }
            // ロイヤルストレートフラッシュと一致しているかどうかチェック
            // suit がすべて同じ
            // number 10 ~ 13 && 1 を所持している
            if (match_suit
                &&
                    (this._poker.players[playerNumber].hand[0].strongNumber === 10 &&
                        this._poker.players[playerNumber].hand[1].strongNumber === 11 &&
                        this._poker.players[playerNumber].hand[2].strongNumber === 12 &&
                        this._poker.players[playerNumber].hand[3].strongNumber === 13 &&
                        this._poker.players[playerNumber].hand[4].strongNumber === 14)) {
                this.showResultHandList('ロイヤルストレートフラッシュ', '.royal_straight_flush', playerNumber);
                this._poker.players[playerNumber].strong.handList = 'ロイヤル<br>ストレート<br>フラッシュ';
                this._poker.players[playerNumber].strong.handListNumber = 9;
                this._poker.players[playerNumber].strong.compareNumberLists = [14, 13, 12, 11, 10];
            }
            // ストレートフラッシュと一致しているかどうかチェック
            // suit がすべて同じ
            // number が連続している
            else if (match_suit
                &&
                    match_straight) {
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
                (_a = this._poker.players[playerNumber].hand).push.apply(_a, this.placePlayerHand);
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
            else if (match_straight) {
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
            console.log("\u540C\u3058\u5F79\u540C\u58EB\u3067\u306E\u6BD4\u8F03\u5BFE\u8C61\u3068\u306A\u308B\u6570\u5B57 this._poker.players[".concat(playerNumber, "] compareNumberLists:"), this._poker.players[playerNumber].strong.compareNumberLists);
        };
        // 手札と一致している役一覧に背景色を適用する
        Hand_list.prototype.showResultHandList = function (handListName, cssName, playerNumber) {
            console.log("\u5F79\u540D this._poker.players[".concat(playerNumber, "].hand === ").concat(handListName, "\uFF01"));
            // 以下のコードはメインプレイヤーのみ
            if (playerNumber !== 0) {
                return;
            }
            var matchHandListArea = document.querySelectorAll(cssName);
            matchHandListArea.forEach(function (matchHandList) {
                matchHandList.classList.add('match_hand');
            });
        };
        // フォーカード フルハウス スリーカード ツーペア ワンペア 検証用
        // ※内部コードがごちゃごちゃしてる。もう少しスッキリさせたい……。
        Hand_list.prototype.check_sameNumberCount = function (verifyPlayerHands, matchNumber, playerNumber, checkHandListName) {
            var _a, _b, _c, _d, _e, _f;
            var _this = this;
            if (checkHandListName === void 0) { checkHandListName = 'other'; }
            // 手札内に同じ数の組み合わせによる役が存在するか否か
            var exist_sameNumber_handList = false;
            // 手札内に存在する同じ数のカード番号
            var matchNumber_Hand = 0;
            // 手札内に同じ数の組み合わせがいくつ存在するかを把握するための配列
            // 0 => 0  1 => 0  2 => 0  ... 12 => 0  インデックス番号+1 => カード番号  値 => 該当番号がいくつあるか
            var match_numberCount = [];
            for (var i = 0; i < 13; i++) {
                match_numberCount.push(0);
            }
            // 手札内に同じ数の組み合わせがいくつ存在するか検証
            verifyPlayerHands.forEach(function (hand) {
                for (var i = 1; i <= 13; i++) {
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
                match_numberCount.forEach(function (matchCount, index) {
                    if (matchCount === matchNumber) {
                        exist_sameNumber_handList = true;
                        matchNumber_Hand = index + 1;
                    }
                });
                // フルハウス 並び替え
                if (checkHandListName === 'a_full_house') {
                    if (matchNumber === 3) {
                        var placePlayerHand_uncommon = this._poker.players[playerNumber].hand.filter(function (card) {
                            return !(card.number === matchNumber_Hand);
                        });
                        var placePlayerHand_common = this._poker.players[playerNumber].hand.filter(function (card) {
                            return card.number === matchNumber_Hand;
                        });
                        this.placePlayerHand = [];
                        (_a = this.placePlayerHand).push.apply(_a, placePlayerHand_uncommon);
                        (_b = this.placePlayerHand).push.apply(_b, placePlayerHand_common);
                    }
                }
                // フォーカード スリーカード ワンペア 並び替え
                else if (checkHandListName === 'other') {
                    // placePlayerHand_uncommon はstrongNumber を昇順に並び替える必要がある。
                    // ただし、もとから strongNumber の昇順で並び替えられてるため、ここで処理は必要ない。
                    var placePlayerHand_uncommon = this._poker.players[playerNumber].hand.filter(function (card) {
                        return !(card.number === matchNumber_Hand);
                    });
                    var placePlayerHand_common = this._poker.players[playerNumber].hand.filter(function (card) {
                        return card.number === matchNumber_Hand;
                    });
                    this._poker.players[playerNumber].hand = [];
                    (_c = this._poker.players[playerNumber].hand).push.apply(_c, placePlayerHand_uncommon);
                    (_d = this._poker.players[playerNumber].hand).push.apply(_d, placePlayerHand_common);
                }
            }
            // ツーペア 検証
            else {
                // 手札内に同じ番号のカードがあれば抽出
                var match_two_pair = match_numberCount.filter(function (count) { return count === 2; });
                // 同じ番号のカードが 2 組あればツーペア
                if (match_two_pair.length === 2) {
                    exist_sameNumber_handList = true;
                    console.log('ツーペア成立！');
                    // ツーペア 並び替え
                    var playerHand_common_1 = [];
                    match_numberCount.forEach(function (matchCount, index) {
                        if (matchCount === matchNumber) {
                            matchNumber_Hand = index + 1;
                            var placePlayerHand_common = _this._poker.players[playerNumber].hand.filter(function (card) {
                                return card.number === matchNumber_Hand;
                            });
                            // ※ push() unshift() を使い分ける
                            // push() を使えば数字の少ない順に左側に配置される。
                            // ただし、 1 のペアの場合は右側に配置したい。
                            // unshift() を使うと 1 のカードが右側に、 push() だと 1 のカードが左側に配置される。
                            // ex) 正しい手札 unshift() 8 5 5 1 1  間違った手札 push() 8 1 1 5 5
                            // push() を使って、 1 のペアが存在する場合は splice() などで修正する必要がある。
                            playerHand_common_1.push.apply(playerHand_common_1, placePlayerHand_common);
                            if (playerHand_common_1[0].number === 1) {
                                var modyfiArray = playerHand_common_1.splice(0, 2);
                                playerHand_common_1.push.apply(playerHand_common_1, modyfiArray);
                            }
                        }
                    });
                    // 配列同士の差分を取得する
                    var diffHand = this._poker.players[playerNumber].hand.filter(function (card) { return playerHand_common_1.indexOf(card) === -1; });
                    // console.log('diffHand:', diffHand);
                    // console.log('playerHand_common:', playerHand_common);
                    this._poker.players[playerNumber].hand = [];
                    (_e = this._poker.players[playerNumber].hand).push.apply(_e, diffHand);
                    (_f = this._poker.players[playerNumber].hand).push.apply(_f, playerHand_common_1);
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
        };
        return Hand_list;
    }());
    // ポーカー実行 全般を管理するクラス
    var Poker = /** @class */ (function () {
        function Poker() {
            var _this = this;
            this._player0_handArea = document.querySelector('.player0_hand');
            this._player1_handArea = document.querySelector('.player1_hand');
            this._player2_handArea = document.querySelector('.player2_hand');
            this._player3_handArea = document.querySelector('.player3_hand');
            this._player0_discardArea = document.querySelector('.player0_discard');
            this._player1_discardArea = document.querySelector('.player1_discard');
            this._player2_discardArea = document.querySelector('.player2_discard');
            this._player3_discardArea = document.querySelector('.player3_discard');
            this._selectedCardsCount = 0;
            this._tool = new Tool(this);
            this._hand_list = new Hand_list(this);
            this._message = new Message();
            this._suits = ['spade', 'heart', 'diamond', 'club'];
            // トランプ・積み札の生成
            this._trump = [];
            this.createTrump();
            this._stock = [];
            this._stock = __spreadArray([], this._trump, true);
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
            var rank_compare_numbers = document.querySelectorAll('.rank_compare_number');
            rank_compare_numbers.forEach(function (compareArea) {
                while (compareArea.firstChild) {
                    compareArea.firstChild.remove();
                }
            });
            // プレイヤー情報の生成
            this.playerTurn = 1; // サブプレイヤー 1 2 3 から順番に進めて、最後にメインプレイヤーという流れで進める
            this._players = [];
            this.createPlayers();
            for (var i = 0; i < this._players.length; i++) {
                this.renderPlayerName(".player".concat(i, "_name"), i);
            }
            // null チェック handArea discardArea
            for (var i = 0; i < this._players.length; i++) {
                this._tool.nullCheck(this.handAreas[i]);
            }
            for (var i = 0; i < this._players.length; i++) {
                this._tool.nullCheck(this.discardAreas[i]);
            }
            // プレイヤー 手札 捨て札を初期化する（透明）
            for (var i = 0; i < this._players.length; i++) {
                this.initializationPlayerArea(this.handAreas[i]);
                this.initializationPlayerArea(this.discardAreas[i]);
            }
            // ストックアニメーション ストックから各プレイヤー手札へ裏向きのカードが配られる
            // この時点では 実際はまだ中身は確定していない。
            this.stockAnimation();
            setTimeout(function () {
                // 内部的にカードを配る ここで中身が確定する
                _this.dealCards();
                for (var i = 0; i < _this._players.length; i++) {
                    console.log("\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u624B\u672D \u4E26\u3073\u66FF\u3048\u524D \u8AAD\u307F\u8FBC\u307F\u6642 player".concat(i, "_hand:"), _this._players[i].hand);
                }
                // 現在の手札と役が一致しているかどうかチェックおよび内部的に役に対応した並び替えを行う
                for (var i = 0; i < _this._players.length; i++) {
                    _this._hand_list.checkHand_And_rearrangesCards(i);
                }
                // 手札を描画する
                for (var i = 0; i < _this._players.length; i++) {
                    _this.renderHand(_this.handAreas[i], i);
                }
            }, 5000);
            setTimeout(function () {
                // 各プレイヤーのメッセージを表示する
                _this._message.openMessage('all');
                // 各プレイヤーが手札の状況に応じたセリフを表示
                for (var i = 0; i < _this._players.length; i++) {
                    _this._message.handCondition(_this._players[i].strong.handListNumber, i);
                }
            }, 8000);
            setTimeout(function () {
                // ストックの位置にボタンを配置
                _this._tool.createDoubleLineBtn(document.querySelector('.stock'), 'startPokerBtn', 'ポーカー<br>開 始！');
                var startPokerBtn = document.querySelector('.startPokerBtn');
                _this._tool.nullCheck(startPokerBtn);
                startPokerBtn.addEventListener('click', function () {
                    // ボタンを消去
                    var stock_div = document.querySelectorAll('.stock>div');
                    stock_div.forEach(function (div) {
                        div.remove();
                    });
                    // メッセージを非表示
                    _this._message.hideMessage();
                    // メインプレイヤー・サブプレイヤーの手札の横に交換ボタンを表示
                    // 最初はサブプレイヤー 1 の手札の横に交換ボタンを表示
                    _this.createExchangeBtn();
                    // サブプレイヤーが思考して意思決定を行う
                    console.log("\u30D7\u30EC\u30A4\u30E4\u30FC ".concat(_this.playerTurn, " \u306E\u30BF\u30FC\u30F3\uFF01"));
                    _this.subPlayerThought();
                });
                _this._tool.createDoubleLineBtn(document.querySelector('.stock'), 'backToStartBtn', 'カードを<br>配り直す');
                var backToStartBtn = document.querySelector('.backToStartBtn');
                _this._tool.nullCheck(backToStartBtn);
                backToStartBtn.addEventListener('click', function () {
                    _this.click_backToStartBtn();
                });
            }, 11000);
        }
        Poker.prototype.createTrump = function () {
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
            var _this = this;
            // 注意！
            // 「１」のカードは基本的に最も強い。だけど、唯一 例外がある。
            // ストレートフラッシュとストレートの手札「1, 2, 3, 4, 5」のときだけ「1」は最弱になる。
            // 手札をチェックしたときに「1, 2, 3, 4, 5」となっていた場合は
            // 「1」の strongNumber を 1 に修正する必要がある。
            var carsCount = 1;
            this._suits.forEach(function (suit, index) {
                for (var i = 1; i <= 13; i++) {
                    if (i === 1) {
                        _this._trump[i - 1 + (13 * index)] =
                            {
                                suit: suit,
                                number: i,
                                strongNumber: 14,
                                uniqueNumber: carsCount,
                                url: "img/cards/".concat(String(carsCount).padStart(2, '0'), ".png"),
                                isFront: true,
                                selected: false,
                            };
                    }
                    else {
                        _this._trump[i - 1 + (13 * index)] =
                            {
                                suit: suit,
                                number: i,
                                strongNumber: i,
                                uniqueNumber: carsCount,
                                url: "img/cards/".concat(String(carsCount).padStart(2, '0'), ".png"),
                                isFront: true,
                                selected: false,
                            };
                    }
                    carsCount++;
                }
            });
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
        };
        Poker.prototype.createPlayers = function () {
            var playersName = ['You', 'player1', 'player2', 'player3'];
            for (var i = 0; i <= 3; i++) {
                this._players[i] = {
                    name: playersName[i],
                    image: 'img/cards/01.png',
                    hand: [],
                    discard: [],
                    strong: {
                        handList: '',
                        handListNumber: 0,
                        compareNumberLists: [] // 役の種類に応じて、比較対象となる数字の数が異なる
                    },
                    rank: 0,
                    handStartPosition: [],
                    discardStartPosition: [],
                };
            }
            // プレイヤー手札・捨て札領域の 左座標 上座標
            var player0_HandNext_LeftPoint = 112.5; // card width 100px + margin right 12.5px
            var player0_HandNext_TopPoint = 0; // すべて同じ座標
            var player0_DiscardNext_LeftPoint = 112.5; // card width 100px + margin right 12.5px
            var player0_DiscardNext_TopPoint = 0; // すべて同じ座標
            var player1_HandNext_LeftPoint = 0; // すべて同じ座標
            var player1_HandNext_TopPoint = 110.0; // card height 100px + margin bottom 10px
            var player1_DiscardNext_LeftPoint = 0; // すべて同じ座標
            var player1_DiscardNext_TopPoint = 110; // card height 100px + margin bottom 10px
            var player2_HandNext_LeftPoint = 112.5; // card width 100px + margin right 12.5px
            var player2_HandNext_TopPoint = 0; // すべて同じ座標
            var player2_DiscardNext_LeftPoint = 112.5; // card width 100px + margin right 12.5px
            var player2_DiscardNext_TopPoint = 0; // すべて同じ座標
            var player3_HandNext_LeftPoint = 0; // すべて同じ座標
            var player3_HandNext_TopPoint = 110; // card height 100px + margin bottom 10px
            var player3_DiscardNext_LeftPoint = 0; // すべて同じ座標
            var player3_DiscardNext_TopPoint = 110; // card height 100px + margin bottom 10px
            var players_HandNext_LeftPoint = [
                player0_HandNext_LeftPoint,
                player1_HandNext_LeftPoint,
                player2_HandNext_LeftPoint,
                player3_HandNext_LeftPoint
            ];
            var players_HandNext_TopPoint = [
                player0_HandNext_TopPoint,
                player1_HandNext_TopPoint,
                player2_HandNext_TopPoint,
                player3_HandNext_TopPoint
            ];
            var players_DiscardNext_LeftPoint = [
                player0_DiscardNext_LeftPoint,
                player1_DiscardNext_LeftPoint,
                player2_DiscardNext_LeftPoint,
                player3_DiscardNext_LeftPoint
            ];
            var players_DiscardNext_TopPoint = [
                player0_DiscardNext_TopPoint,
                player1_DiscardNext_TopPoint,
                player2_DiscardNext_TopPoint,
                player3_DiscardNext_TopPoint
            ];
            // 手札のカードの座標を取得
            for (var i = 0; i < this._players.length; i++) {
                this._tool.nullCheck(this.handAreas[i]);
                this._tool.nullCheck(this.discardAreas[i]);
            }
            for (var i = 0; i < this._players.length; i++) {
                this.getPoint(this.handAreas[i], i, players_HandNext_LeftPoint[i], players_HandNext_TopPoint[i]);
                this.getPoint(this.discardAreas[i], i, players_DiscardNext_LeftPoint[i], players_DiscardNext_TopPoint[i]);
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
        };
        // 要素の「ページ全体」における位置座標を取得する
        // 座標は要素の配置に利用するのではなくて、移動量を把握するために利用する。
        Poker.prototype.getPoint = function (area, playerNumber, nextLeft, nextTop) {
            // 注意　座標取得が適正ではない。コードの修正が必要。 => 一応 解決済み。
            // topPoint => top でも bottom でも同じ値が取得されてしまう。カードの底の座標が取得されてしまう。
            // => player0_hand (ul) に height: 150px; を設定したら top bottom どちらも適正値が取得できた。
            // なぜかは不明。子要素の幅や高さがそのまま親要素の領域の値になると思っていたけど、
            // 親要素に幅や高さを入れておく必要があるらしい。
            // ※このコードを実行する前に手札・捨て札を生成・配置しておかないと、
            // 領域が生成される前の段階の座標を取得してしまう。
            // また領域に幅や高さを指定する際は相対値（ 100 % など）を指定すると、適切な座標が取得できなくなる。
            // デベロッパーで領域の範囲が適切に設定されてるかどうか確認することも必要。
            var leftPoint = window.pageXOffset + area.getBoundingClientRect().left;
            var topPoint = window.pageYOffset + area.getBoundingClientRect().top;
            console.log("\u958B\u59CB\u5EA7\u6A19 player".concat(playerNumber, ":"), 'leftPoint:', leftPoint, 'topPoint:', topPoint);
            for (var n = 0; n < 5; n++) {
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
                    console.log("  \u624B\u672D\u306E\u5EA7\u6A19 ".concat(n + 1, " this._players").concat(playerNumber, ".left:"), "".concat(this._players[playerNumber].handStartPosition[n].left));
                    console.log("  \u624B\u672D\u306E\u5EA7\u6A19 ".concat(n + 1, " this._players").concat(playerNumber, ".top:"), "".concat(this._players[playerNumber].handStartPosition[n].top));
                }
                else if (area === this.discardAreas[0] || area === this.discardAreas[1] || area === this.discardAreas[2] || area === this.discardAreas[3]) {
                    this._players[playerNumber].discardStartPosition[n] = {
                        left: leftPoint + nextLeft * n,
                        top: topPoint + nextTop * n,
                    };
                    console.log("  \u6368\u3066\u672D\u306E\u5EA7\u6A19 ".concat(n + 1, " this._players").concat(playerNumber, ".left:"), "".concat(this._players[playerNumber].discardStartPosition[n].left));
                    console.log("  \u6368\u3066\u672D\u306E\u5EA7\u6A19 ".concat(n + 1, " this._players").concat(playerNumber, ".top:"), "".concat(this._players[playerNumber].discardStartPosition[n].top));
                }
            }
        };
        Poker.prototype.renderPlayerName = function (area, index) {
            var nameArea = document.querySelector(area);
            this._tool.nullCheck(nameArea);
            nameArea.textContent = this._players[index].name;
        };
        Poker.prototype.stockAnimation = function () {
            // プレイヤー手札からストックの位置へ瞬時に移動
            // 移動量 = ストック座標 - 該当する手札の座標
            // const translateX = ストックの座標 - this._players[0].handStartPosition[0]?.left
            var stockArea = document.querySelector('.stock');
            this._tool.nullCheck(stockArea);
            // ストックから手札へ移動する際に捨て札の上を移動するように調整
            var zIndexCount = 30;
            // アニメーションを一度ずつ実行する際の間隔
            var animationGap = 0;
            // ストックの座標の把握
            var stock_leftPoint = 0;
            var stock_topPoint = 0;
            var _loop_1 = function (listNum) {
                var _loop_2 = function (playerNum) {
                    var handLists = document.querySelectorAll(".player".concat(playerNum, "_hand>li"));
                    this_1._tool.nullCheck(handLists);
                    stock_leftPoint = window.pageXOffset + stockArea.getBoundingClientRect().left;
                    stock_topPoint = window.pageYOffset + stockArea.getBoundingClientRect().top;
                    // 移動量 = ストック座標 - 該当する手札の座標
                    var translateX_toStock = String(stock_leftPoint - this_1._players[playerNum].handStartPosition[listNum].left) + 'px';
                    var translateY_toStock = String(stock_topPoint - this_1._players[playerNum].handStartPosition[listNum].top) + 'px';
                    handLists[listNum].style.zIndex = String(zIndexCount);
                    handLists[listNum].style.transition = 'transform';
                    handLists[listNum].style.transform = "translate(".concat(translateX_toStock, ", ").concat(translateY_toStock, ")");
                    // （選択済みのカード） => 補充するカードの透明化を解除する。
                    handLists[listNum].classList.remove('hide');
                    // ストックから手札へ移動する。 1 秒かかる。
                    setTimeout(function () {
                        // 元の位置に戻るため、座標は (0, 0)
                        handLists[listNum].style.transition = 'transform 1s';
                        handLists[listNum].style.transform = "translate(0, 0)";
                    }, 500 + 100 * animationGap);
                    animationGap++;
                    // ストックから手札へカードが移動する際に、手札の左側から順番にカードがストックから配られる。
                    // 先に配られるカード（左側）が後から配られるカード（右側）より上に配置されてる必要がある。
                    // そのため zIndexCount をデクリメントして順番を調整する。左側より右側のほうが下に配置される。
                    zIndexCount--;
                };
                for (var playerNum = 0; playerNum < this_1._players.length; playerNum++) {
                    _loop_2(playerNum);
                }
            };
            var this_1 = this;
            // player 0 => player 1 => player 2 => player 3 => player 0 => の順番で 1 枚ずつ配る
            for (var listNum = 0; listNum < 5; listNum++) {
                _loop_1(listNum);
            }
        };
        // 内部的にカードを配る
        Poker.prototype.dealCards = function () {
            // 10 種類の役で強弱が決まる
            // 同じ役同士の場合は有利な数で勝敗が決まる
            // トランプのナンバーが 1 13 12 11 10 ... の順に有利
            var _this = this;
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
            for (var i = 0; i < 5; i++) {
                this._players.forEach(function (player) {
                    player.hand.push(_this._stock.splice(Math.floor(Math.random() * _this._stock.length), 1)[0]);
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
            for (var i = 0; i < this._players.length; i++) {
                if (i !== 0) {
                    this._players[i].hand.map(function (hand) {
                        hand.isFront = false;
                        // hand.url = 'img/back.png'; とすると本来の画像URLが分からなくなるため、
                        // 条件分岐を使って hand.isFront = true ならば hand.url のイメージパスを適用する、
                        // hand.isFront = false ならば'img/back.png';をイメージパスに適用する、といった形式にする。
                    });
                }
            }
        };
        // プレイヤー 手札 捨て札を初期化する（透明）
        Poker.prototype.initializationPlayerArea = function (playerArea) {
            while (playerArea.firstChild) {
                playerArea.firstChild.remove();
            }
            for (var i = 0; i < 5; i++) {
                var li = document.createElement('li');
                var img = document.createElement('img');
                img.src = 'img/cards/back.png';
                li.classList.add('hide');
                li.appendChild(img);
                playerArea.appendChild(li);
            }
        };
        // 捨て札を描画
        Poker.prototype.renderDiscard = function (discardArea, index) {
            var _this = this;
            while (discardArea.firstChild) {
                discardArea.firstChild.remove();
            }
            this._players[index].discard.forEach(function (discard) {
                var li = document.createElement('li');
                var img = document.createElement('img');
                // 捨て札は全員 表示してもよいと思うけど、
                // player1 player3 の表示は rotate() を使う必要が出てくるため、とりあえずサブプレイヤーは非表示
                if (discardArea === _this._player0_discardArea) {
                    img.src = discard.url;
                }
                else {
                    img.src = 'img/cards/back.png';
                }
                li.classList.add('hide');
                if (discard.selected) {
                    li.classList.remove('hide');
                }
                li.appendChild(img);
                discardArea.appendChild(li);
            });
        };
        // 手札を描画
        Poker.prototype.renderHand = function (handArea, index) {
            var _this = this;
            while (handArea.firstChild) {
                handArea.firstChild.remove();
            }
            this._players[index].hand.forEach(function (hand) {
                var li = document.createElement('li');
                var img = document.createElement('img');
                if (handArea === _this._player0_handArea) {
                    img.src = hand.url;
                }
                else {
                    img.src = 'img/cards/back.png';
                }
                li.addEventListener('click', function () {
                    // 選択状態 selected: true にする。
                    // 選択解除 selected: false にする。
                    hand.selected = !hand.selected;
                    // 選択枚数を把握する。
                    // 次のプレイヤーのターンになったら初期化する必要がある。
                    if (hand.selected) {
                        _this._selectedCardsCount++;
                    }
                    else {
                        _this._selectedCardsCount--;
                    }
                    _this.player_selectCard(li);
                });
                // 選択済みのカードを透明にする。
                if (hand.selected) {
                    li.classList.add('hide');
                }
                li.appendChild(img);
                handArea.appendChild(li);
            });
        };
        Poker.prototype.click_backToStartBtn = function () {
            var _this = this;
            // ボタンを消去
            var stock_div = document.querySelectorAll('.stock>div');
            stock_div.forEach(function (div) {
                div.remove();
            });
            // 結果リストを画面外に移動
            var resultList = document.querySelector('.result_list');
            resultList.style.top = '-1300px';
            // 手札 捨て札を非表示
            for (var i = 0; i < this._players.length; i++) {
                this.handAreas[i].classList.add('hide');
                this.discardAreas[i].classList.add('hide');
            }
            // メッセージを非表示
            this._message.hideMessage();
            // 1 秒後にゲームを初期化して、カードを配り直す。
            setTimeout(function () {
                // 手札 捨て札を表示
                for (var i = 0; i < _this._players.length; i++) {
                    _this.handAreas[i].classList.remove('hide');
                    _this.discardAreas[i].classList.remove('hide');
                }
                new Poker();
            }, 1000);
        };
        // プレイヤーが手札のカードをクリックしたときの処理
        // メインプレイヤー（this._player0）のみ
        // 選択状態 クリックしたらカードが少し上に移動する。
        // 選択解除 もう一度クリックしたらカードを元の位置に移動する。
        // ボタンのテキストは、カードを１枚でも選択した場合は「'カードを<br>交換する'」にする。
        // 再度クリックしてカードを非選択にして選択枚数が０枚なら「'この手札で<br>勝負する'」にする。
        Poker.prototype.player_selectCard = function (li) {
            console.log('カードを選択した！ player_selectCard method execution!');
            console.log('  現在のカードの選択枚数 _selectedCardsCount:', this._selectedCardsCount);
            // メインプレイヤー（this._player0）のみ
            if (this.playerTurn === 0) {
                li.classList.toggle('selected');
            }
            var exchangeBtn = document.querySelector('.exchangeBtn');
            this._tool.nullCheck(exchangeBtn);
            if (this._selectedCardsCount) {
                exchangeBtn.innerHTML = 'カードを<br>交換する';
            }
            else {
                exchangeBtn.innerHTML = 'この手札で<br>勝負する';
            }
        };
        // ドロー いらないカードを捨てて、捨てたカードと同じ枚数のカードを山札から補充すること。
        // 選択した複数枚のカードが捨て札に移動する
        // 山札から手札に 捨てた枚数分カードを補充する
        // 「カードを交換する」「この手札で勝負する」ボタンをクリックしたときの処理
        Poker.prototype.createExchangeBtn = function () {
            var _this = this;
            this._tool.nullCheck(this.handAreas[this.playerTurn]);
            // 選択したカードを捨て札に出すためのボタンを表示
            this._tool.createDoubleLineBtn(this.handAreas[this.playerTurn], 'exchangeBtn', 'この手札で<br>勝負する');
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
            var exchangeBtn = document.querySelector('.exchangeBtn');
            this._tool.nullCheck(exchangeBtn);
            exchangeBtn.addEventListener('click', function () {
                console.log('交換ボタンをクリック！ exchangeBtn pushed!');
                // 疑問　プロパティ 'style' は型 'Element' に存在しません。ts(2339) 要検索！
                // 原因 対処法 上記 記載と同じ
                // 自分のターンになったらクリック操作が可能になるようにするべき。 => nextTurn() 参照
                // 交換ボタンをクリックした後はボタンもカードもすべての操作をクリックできないようにするべき。
                // というより消去すべき
                // 交換ボタンを消去
                exchangeBtn.remove();
                // exchangeBtn!.classList.add('hide'); // 透明化
                // exchangeBtn!.style.pointerEvents = 'none'; // クリックイベント禁止 ドラッグ＆ドロップ禁止
                // カードのクリックを禁止する。
                var selectedCards = document.querySelectorAll(".player".concat(_this.playerTurn, "_hand>li"));
                selectedCards.forEach(function (card) {
                    card.style.pointerEvents = 'none';
                    card.style.cursor = 'auto';
                });
                if (_this._selectedCardsCount === 0) {
                    console.log('カードを選択していない。');
                    // 交換ボタンを消去しないと次のプレイヤー手札に交換ボタンが作成される際、
                    // 複数存在するために交換ボタンの範囲取得がうまくいかなくなる。
                    // exchangeBtn!.remove();
                    if (_this.playerTurn === 0) {
                        // メインプレイヤーは交換ボタンをクリックしたタイミングでセリフを表示するため、
                        // 少し間をおいてから次のターンへ
                        _this._message.playerDecide(_this.playerTurn, _this._selectedCardsCount);
                        setTimeout(function () {
                            _this._message.hideMessage();
                            _this.before_Click_OpenBtn();
                        }, 3000);
                    }
                    else {
                        // サブプレイヤーは交換ボタンをクリックする手前の段階でセリフを表示するため、
                        // あまり間をおく必要はない
                        setTimeout(function () {
                            // 次のターンへ。
                            _this.nextTurn();
                        }, 1000);
                    }
                }
                else {
                    console.log('選択したカードを捨て札に出す');
                    // メインプレイヤーは交換ボタンをクリックしたタイミングでセリフを表示するため、ここに記載
                    // サブプレイヤーは交換ボタンをクリックする手前 subPlayerThought() でセリフを表示する
                    if (_this.playerTurn === 0) {
                        _this._message.playerDecide(_this.playerTurn, _this._selectedCardsCount);
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
                    _this._players[_this.playerTurn].discard = __spreadArray([], _this._players[_this.playerTurn].hand, true);
                    console.log('捨て札の中身 = 補充前の手札', "this._players[".concat(_this.playerTurn, "].discard:"), _this._players[_this.playerTurn].discard);
                    // 選択したカードを捨て札に出すアニメーション（ 1 秒かかる。）
                    // 選択したカードを手札から捨て札へ移動する
                    _this.discard_SelectedCards_Animation();
                    // 捨て札を描画する。（非選択のカードは透明にする。）
                    setTimeout(function () {
                        _this._tool.nullCheck(_this.discardAreas[_this.playerTurn]);
                        _this.renderDiscard(_this.discardAreas[_this.playerTurn], _this.playerTurn);
                    }, 1500);
                    // 手札をストックから内部的に補充する。
                    // ストックからそのまま補充すると selected false が代入されてしまう。
                    // そのため、代入後に selected true に更新する必要がある。
                    // 手札のカードの内部情報を削除して、非選択のカードの内部情報を代入する。
                    // ただし、非選択の手札のカードの位置はそのままにしたい。
                    // そのため選択したカードを補充後の値で上書きする。
                    setTimeout(function () {
                        _this._players[_this.playerTurn].hand.forEach(function (hand, index) {
                            if (hand.selected) {
                                _this._players[_this.playerTurn].hand[index] = _this._stock.splice(Math.floor(Math.random() * _this._stock.length), 1)[0];
                                _this._players[_this.playerTurn].hand[index].selected = true;
                            }
                        });
                    }, 1800);
                    // 手札（見た目）を更新する。
                    // その際、選択したカードは透明にしておく。
                    // this.renderHand(this.handAreas[this.playerTurn]!, this.playerTurn); を実行することで
                    // 手札内の情報が初期化されるため、
                    // 捨て札の上に移動・配置されていた選択済みのカードは削除される。
                    setTimeout(function () {
                        _this._tool.nullCheck(_this.handAreas[_this.playerTurn]);
                        _this.renderHand(_this.handAreas[_this.playerTurn], _this.playerTurn);
                    }, 2000);
                    // 選択したカード（透明化されてる）を瞬時にストックに移動する。
                    // 選択したカードの透明化を解除する。
                    // ストックから該当する手札へ補充後のカードを移動する。 1 秒かかる。
                    setTimeout(function () {
                        _this.refill_Cards_Animation();
                        // メインプレイヤーが交換ボタンをクリックしたときのセリフを非表示
                        _this._message.hideMessage();
                    }, 2100);
                    // 手札を並べ替える前に一時的に手札を非表示にする。
                    // 一瞬で並べ替えるのではなくて、ほんの少し間を置いたほうが並べ替えられたことが分かりやすくなる。
                    setTimeout(function () {
                        var hand_Lists = document.querySelectorAll(".player".concat(_this.playerTurn, "_hand>li"));
                        hand_Lists.forEach(function (card) {
                            card.classList.add('hide');
                        });
                    }, 6000);
                    setTimeout(function () {
                        // 手札の選択済み状態を解除する = 手札のすべてのカードを表示する
                        _this._players[_this.playerTurn].hand.forEach(function (card) {
                            card.selected = false;
                        });
                        // 現在の手札と役が一致しているかどうかチェックおよび内部的に役に対応した並び替えを行う
                        _this._hand_list.checkHand_And_rearrangesCards(_this.playerTurn);
                        // 手札を再描画する
                        _this._tool.nullCheck(_this._player0_handArea);
                        _this.renderHand(_this.handAreas[_this.playerTurn], _this.playerTurn);
                        console.log("\u88DC\u5145\u5F8C\u306E\u624B\u672D this._players[".concat(_this.playerTurn, "].hand:"), _this._players[_this.playerTurn].hand);
                    }, 6500);
                    // 補充後の手札から適切なセリフを表示
                    setTimeout(function () {
                        _this._message.openMessage(_this.playerTurn);
                        // 手札の状況に応じたセリフを表示 ブラフあり
                        _this._message.handCondition(_this._players[_this.playerTurn].strong.handListNumber, _this.playerTurn, true);
                    }, 8000);
                    // 次のターンへ
                    setTimeout(function () {
                        _this._message.hideMessage();
                        if (_this.playerTurn !== 0) {
                            _this.nextTurn();
                        }
                        // メインプレイヤーが最後のターンであることを前提とする
                        else if (_this.playerTurn === 0) {
                            _this.before_Click_OpenBtn();
                        }
                    }, 11000);
                }
            });
        };
        Poker.prototype.before_Click_OpenBtn = function () {
            var _this = this;
            // メインプレイヤーが最後のターンであることを前提とする
            // ストックの位置にボタンを配置
            // クリックしたら全員の手札をオープンするメソッドを実行
            this._tool.createDoubleLineBtn(document.querySelector('.stock'), 'openBtn', '手札を<br>公開する');
            var openBtn = document.querySelector('.openBtn');
            this._tool.nullCheck(openBtn);
            // 手札を公開する前のセリフを表示
            this._message.openMessage('all');
            this._message.before_Open_PlayersHand();
            openBtn.addEventListener('click', function () {
                // 手札公開ボタンを消去
                openBtn.remove();
                // 全員の手札をオープンするメソッドを実行
                _this.open_PlayersHand();
            });
        };
        // 選択したカードを捨て札に出すアニメーション
        Poker.prototype.discard_SelectedCards_Animation = function () {
            // 疑問　適切な型の指定が分からない。 NodeListOf<Element> などで要検索！仕方がないから any で対応。
            // const playerLists: any = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);
            var _this = this;
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
            var playerLists = document.querySelectorAll(".player".concat(this.playerTurn, "_hand>li"));
            // querySelectorAll メソッドも同様に型引数を指定できます。
            // 型引数を指定することで、配列に変換したり forEach メソッドを使ったりしたときに、
            // 適切な型が推論されるようになります。
            // 要素と型との対応
            // a 要素は HTMLAnchorElement 型であるといった対応は、MDN の HTML 要素リファレンスから調べられます。
            // https://developer.mozilla.org/ja/docs/Web/HTML/Element
            // 調べたい要素のページに飛び、「DOM インターフェイス」という項目を探してください。
            this._tool.nullCheck(playerLists);
            // 選択したカードが捨て札の上に配置されるように調整
            var zIndexCount = 10;
            // 選択したカードを手札から捨て札へ移動する
            // 移動量はプレイヤーによって異なる
            // 移動量 = 該当する捨て札の座標 - 該当する手札の座標
            this._players[this.playerTurn].hand.forEach(function (card, index) {
                if (card.selected) {
                    var translateX = String(_this._players[_this.playerTurn].discardStartPosition[index].left - _this._players[_this.playerTurn].handStartPosition[index].left) + 'px';
                    var translateY = String(_this._players[_this.playerTurn].discardStartPosition[index].top - _this._players[_this.playerTurn].handStartPosition[index].top) + 'px';
                    playerLists[index].style.zIndex = String(zIndexCount);
                    playerLists[index].style.transition = 'transform 1s';
                    playerLists[index].style.transform = "translate(".concat(translateX, ", ").concat(translateY, ")");
                }
            });
        };
        // 積み札（ストック）から手札へカードが移動するアニメーション
        // 見た目はストックから手札へ移動するように見せるけど、
        // 実際は手札のカードをストックの位置に表示 => 手札の位置へ戻る という流れ
        Poker.prototype.refill_Cards_Animation = function () {
            // 疑問　適切な型の指定が分からない。 NodeListOf<Element> などで要検索！仕方がないから any で対応。
            // const handLists: any = document.querySelectorAll(`.player${this.playerTurn}_hand>li`);
            // 対処法 上記 discard_SelectedCards_Animation() と同じ
            var _this = this;
            var stockArea = document.querySelector('.stock');
            var handLists = document.querySelectorAll(".player".concat(this.playerTurn, "_hand>li"));
            this._tool.nullCheck(stockArea);
            this._tool.nullCheck(handLists);
            // ストックから手札へ移動する際に捨て札の上を移動するように調整
            var zIndexCount = 20;
            // ストックの座標の把握
            var stock_leftPoint = 0;
            var stock_topPoint = 0;
            stock_leftPoint = window.pageXOffset + stockArea.getBoundingClientRect().left;
            stock_topPoint = window.pageYOffset + stockArea.getBoundingClientRect().top;
            // アニメーションを一度ずつ実行する際の間隔
            var animationGap = 0;
            // ストックから手札へ１枚ずつカードが移動するアニメーション
            this._players[this.playerTurn].hand.forEach(function (card, index) {
                // 補充するカード（手札にある）をストックの位置に瞬時に移動する
                if (card.selected) {
                    // 移動量 = ストック座標 - 該当する手札の座標
                    var translateX_toStock = String(stock_leftPoint - _this._players[_this.playerTurn].handStartPosition[index].left) + 'px';
                    var translateY_toStock = String(stock_topPoint - _this._players[_this.playerTurn].handStartPosition[index].top) + 'px';
                    handLists[index].style.zIndex = String(zIndexCount);
                    handLists[index].style.transition = 'transform';
                    handLists[index].style.transform = "translate(".concat(translateX_toStock, ", ").concat(translateY_toStock, ")");
                    // （選択済みのカード） => 補充するカードの透明化を解除する。
                    handLists[index].classList.remove('hide');
                }
                // ストックから手札へ移動する。 1 秒かかる。
                setTimeout(function () {
                    if (card.selected) {
                        // 元の位置に戻るため、座標は (0, 0)
                        handLists[index].style.transition = 'transform 1s';
                        handLists[index].style.transform = "translate(0, 0)";
                    }
                }, 1000 + 100 * animationGap);
                animationGap++;
                // ストックから手札へカードが移動する際に、手札の左側から順番にカードがストックから配られる。
                // 先に配られるカード（左側）が後から配られるカード（右側）より上に配置されてる必要がある。
                // そのため zIndexCount をデクリメントして順番を調整する。左側より右側のほうが下に配置される。
                zIndexCount--;
            });
        };
        // サブプレイヤーが思考して意思決定を行う
        Poker.prototype.subPlayerThought = function () {
            // 具体的な思考方法は冒頭のメモを参照
            // クリックメソッドを実行という流れで簡単に実装してみる。
            var _this = this;
            // サブプレイヤー思考中のセリフ
            this._message.openMessage(this.playerTurn);
            this._message.playerThought(this.playerTurn);
            // 3 秒後 どのカードを選択するか意思決定する。カードを選択する
            setTimeout(function () {
                var playerCards = document.querySelectorAll(".player".concat(_this.playerTurn, "_hand>li"));
                // 基本的にワンペア・ノーハンドのときにのみ チェックする
                var bool_common_suit = false; // 絵柄の共通性チェック
                var bool_straight_number = false; // 数字の連続性チェック
                // 現在の手札の役名
                console.log("".concat(_this._players[_this.playerTurn].strong.handList, "!"));
                // ロイヤル ストレート フラッシュ, ストレート フラッシュ, フォーカード, フルハウス, フラッシュ, ストレート
                // 基本的にカード交換は行わない。
                // スリーカード
                // 一致してない 2 枚のカードを捨て札に出して、フォーカード フルハウスを狙うのが定石。
                // 手札 左側の 2 枚のカードを捨て札に出す
                if (_this._players[_this.playerTurn].strong.handListNumber === 3) {
                    playerCards[0].click();
                    playerCards[1].click();
                }
                // ツーペア
                // 一致してない 1 枚のカードを捨て札に出して、フルハウスを狙うのが定石。
                // 手札 左側の 1 枚のカードを捨て札に出す
                else if (_this._players[_this.playerTurn].strong.handListNumber === 2) {
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
                else if (_this._players[_this.playerTurn].strong.handListNumber === 1) {
                    console.log("\u30EF\u30F3\u30DA\u30A2 \u7D75\u67C4\u306E\u5171\u901A\u6027\u30C1\u30A7\u30C3\u30AF this.decisionMaking_common_suit(bool_common_suit) execution!");
                    bool_common_suit = _this.decisionMaking_common_suit(bool_common_suit);
                    console.log("\u30EF\u30F3\u30DA\u30A2 \u7D75\u67C4\u306E\u5171\u901A\u6027\u30C1\u30A7\u30C3\u30AF ".concat(bool_common_suit, " \uFF01"));
                    if (!bool_common_suit) {
                        console.log("\u30EF\u30F3\u30DA\u30A2 \u6570\u5B57\u306E\u9023\u7D9A\u6027\u30C1\u30A7\u30C3\u30AF this.decisionMaking_straight_number(bool_straight_number) execution!");
                        bool_straight_number = _this.decisionMaking_straight_number(bool_straight_number);
                        console.log("\u30EF\u30F3\u30DA\u30A2 \u6570\u5B57\u306E\u9023\u7D9A\u6027\u30C1\u30A7\u30C3\u30AF ".concat(bool_straight_number, " \uFF01"));
                    }
                    if (!bool_common_suit && !bool_straight_number) {
                        // 絵柄が一致・数字が連続してる いずれも条件に合致してない場合、
                        // 手札 左側の 3 枚のカードを捨て札に出す
                        console.log("\u30EF\u30F3\u30DA\u30A2 \u7D75\u67C4\u306E\u5171\u901A\u6027 \u306A\u3057, \u6570\u5B57\u306E\u9023\u7D9A\u6027 \u306A\u3057");
                        playerCards.forEach(function (card, index) {
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
                else if (_this._players[_this.playerTurn].strong.handListNumber === 0) {
                    console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u7D75\u67C4\u306E\u5171\u901A\u6027\u30C1\u30A7\u30C3\u30AF this.decisionMaking_common_suit(bool_common_suit) execution!");
                    bool_common_suit = _this.decisionMaking_common_suit(bool_common_suit);
                    console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u7D75\u67C4\u306E\u5171\u901A\u6027\u30C1\u30A7\u30C3\u30AF ".concat(bool_common_suit, " \uFF01"));
                    if (!bool_common_suit) {
                        console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u6570\u5B57\u306E\u9023\u7D9A\u6027\u30C1\u30A7\u30C3\u30AF this.decisionMaking_straight_number(bool_straight_number) execution!");
                        bool_straight_number = _this.decisionMaking_straight_number(bool_straight_number);
                        console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u6570\u5B57\u306E\u9023\u7D9A\u6027\u30C1\u30A7\u30C3\u30AF ".concat(bool_straight_number, " \uFF01"));
                    }
                    if (!bool_common_suit && !bool_straight_number) {
                        // 絵柄が一致・数字が連続してる いずれも条件に合致してない場合、
                        // 強いカード A K Q J などがあれば 1 枚は捨てないで、ほかのカードをすべて捨てる。
                        // 強いカードもないなら、すべてのカードを捨てる。
                        if (_this._players[_this.playerTurn].hand[4].strongNumber >= 11) {
                            console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u7D75\u67C4\u306E\u5171\u901A\u6027 \u306A\u3057, \u6570\u5B57\u306E\u9023\u7D9A\u6027 \u306A\u3057, \u5F37\u529B\u306A\u30AB\u30FC\u30C9 \u3042\u308A!");
                            playerCards.forEach(function (card, index) {
                                if (index === 0 || index === 1 || index === 2 || index === 3) {
                                    card.click();
                                }
                            });
                        }
                        else {
                            console.log("\u30CE\u30FC\u30CF\u30F3\u30C9 \u7D75\u67C4\u306E\u5171\u901A\u6027 \u306A\u3057, \u6570\u5B57\u306E\u9023\u7D9A\u6027 \u306A\u3057, \u5F37\u529B\u306A\u30AB\u30FC\u30C9 \u306A\u3057!");
                            playerCards.forEach(function (card) {
                                card.click();
                            });
                        }
                    }
                }
                // 意思決定のセリフ
                _this._message.playerDecide(_this.playerTurn, _this._selectedCardsCount);
            }, 3000);
            // 交換ボタンをクリックする
            setTimeout(function () {
                _this._message.hideMessage();
                var exchangeBtn = document.querySelector('.exchangeBtn');
                exchangeBtn.click();
            }, 5000);
        };
        // 絵柄の一致数に基づいて意思決定する
        Poker.prototype.decisionMaking_common_suit = function (bool_common_suit) {
            var playerCards = document.querySelectorAll(".player".concat(this.playerTurn, "_hand>li"));
            // 絵柄ごとの保有枚数の把握
            var spadeCount = 0;
            var heartCount = 0;
            var diamondCount = 0;
            var clubCount = 0;
            this._players[this.playerTurn].hand.forEach(function (playerCard) {
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
                this._players[this.playerTurn].hand.forEach(function (playerCard, index) {
                    if (playerCard.suit !== 'spade') {
                        playerCards[index].click();
                        bool_common_suit = true;
                        return bool_common_suit;
                    }
                });
            }
            else if (heartCount === this._players[this.playerTurn].hand.length - 1) {
                this._players[this.playerTurn].hand.forEach(function (playerCard, index) {
                    if (playerCard.suit !== 'heart') {
                        playerCards[index].click();
                        bool_common_suit = true;
                        return bool_common_suit;
                    }
                });
            }
            else if (diamondCount === this._players[this.playerTurn].hand.length - 1) {
                this._players[this.playerTurn].hand.forEach(function (playerCard, index) {
                    if (playerCard.suit !== 'diamond') {
                        playerCards[index].click();
                        bool_common_suit = true;
                        return bool_common_suit;
                    }
                });
                return bool_common_suit;
            }
            else if (clubCount === this._players[this.playerTurn].hand.length - 1) {
                this._players[this.playerTurn].hand.forEach(function (playerCard, index) {
                    if (playerCard.suit !== 'club') {
                        playerCards[index].click();
                        bool_common_suit = true;
                        return bool_common_suit;
                    }
                });
            }
            return bool_common_suit;
        };
        // 数字の連続性に基づいて意思決定する
        // ストレートを狙うのは、ワンペアかノーハンドのときのみ
        Poker.prototype.decisionMaking_straight_number = function (bool_straight_number) {
            var playerCards = document.querySelectorAll(".player".concat(this.playerTurn, "_hand>li"));
            // this.dealCards() でサブプレイヤーの挙動が適切かどうか確認しながら実装すること。「※サブプレイヤー 意思決定 確認用」で検索！
            // 手札の情報をコピー
            var placeHandCards = __spreadArray([], this._players[this.playerTurn].hand, true);
            // 例外的ケース（手札内に A があり、 A が最弱になる予定のケース）
            // ノーハンドで A が最弱になる予定のケース
            // ex) 3 4 5 6 1 => 2 が抜けてる => 1 または 6 を捨てる
            // ex) 2 4 5 6 1 => 3 が抜けてる => 1 または 6 を捨てる
            // ex) 2 3 5 6 1 => 4 が抜けてる => 1 または 6 を捨てる
            // ex) 2 3 4 6~13 1 => 5 が抜けてる => 1 または 6~13 を捨てる
            // => ストレート不成立の場合を考えると 6 を捨てるほうが上策
            if ((placeHandCards[0].number === 3 &&
                placeHandCards[1].number === 4 &&
                placeHandCards[2].number === 5 &&
                placeHandCards[3].number === 6 &&
                placeHandCards[4].number === 1) || (placeHandCards[0].number === 2 &&
                placeHandCards[1].number === 4 &&
                placeHandCards[2].number === 5 &&
                placeHandCards[3].number === 6 &&
                placeHandCards[4].number === 1) || (placeHandCards[0].number === 2 &&
                placeHandCards[1].number === 3 &&
                placeHandCards[2].number === 5 &&
                placeHandCards[3].number === 6 &&
                placeHandCards[4].number === 1) || (placeHandCards[0].number === 2 &&
                placeHandCards[1].number === 3 &&
                placeHandCards[2].number === 4 &&
                // placeHandCards[3].number === 6 ~ 13 &&
                placeHandCards[4].number === 1)) {
                console.log("\u30CE\u30FC\u30CF\u30F3\u30C9\u3067 A \u304C\u6700\u5F31\u306B\u306A\u308B\u4E88\u5B9A\u306E\u30B1\u30FC\u30B9\u306B\u8A72\u5F53\uFF01 => \u53F3\u5074\uFF08\u4E0B\u5074\uFF1F\uFF09\u304B\u3089 1 \u679A \u96A3\u306E\u30AB\u30FC\u30C9\u3092\u51FA\u3059\uFF01");
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
            else if ((placeHandCards[0].number === 3 &&
                placeHandCards[1].number === 4 &&
                placeHandCards[2].number === 5 &&
                placeHandCards[3].number === 1 &&
                placeHandCards[4].number === 1) || (placeHandCards[0].number === 2 &&
                placeHandCards[1].number === 4 &&
                placeHandCards[2].number === 5 &&
                placeHandCards[3].number === 1 &&
                placeHandCards[4].number === 1) || (placeHandCards[0].number === 2 &&
                placeHandCards[1].number === 3 &&
                placeHandCards[2].number === 5 &&
                placeHandCards[3].number === 1 &&
                placeHandCards[4].number === 1)) {
                console.log("\u30EF\u30F3\u30DA\u30A2\u3067 A \u304C\u6700\u5F31\u306B\u306A\u308B\u4E88\u5B9A\u306E\u30B1\u30FC\u30B9\u306B\u8A72\u5F53\uFF01");
                var firstOrLast = Math.floor(Math.random() * 5);
                if (firstOrLast === 0) { // 20%
                    console.log("\u30EF\u30F3\u30DA\u30A2\u304C A \uFF01 \u3067\u3082 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 => \u30EF\u30F3\u30DA\u30A2\u304B\u3089 1 \u679A\u51FA\u3059\uFF01 bool_straight_number = true;");
                    playerCards[4].click();
                    bool_straight_number = true;
                    return bool_straight_number;
                }
                else { // 80%
                    console.log("\u30EF\u30F3\u30DA\u30A2\u304C A \uFF01 \u30B9\u30C8\u30EC\u30FC\u30C8\u306F\u72D9\u308F\u305A\u3001\u305D\u306E\u4ED6\u306E\u5F79\u3092\u72D9\u3046\uFF01 bool_straight_number = false;");
                    return bool_straight_number;
                }
            }
            // 一般的なケース
            // strongNumber を基準に昇順に並べ替える
            placeHandCards.sort(function (a, b) {
                if (a.strongNumber !== b.strongNumber) {
                    return a.strongNumber - b.strongNumber;
                }
                return 0;
            });
            // 手札内で数字がいくつ隣り合っているかの把握
            var straightCount = 0;
            // 隣り合う数字が 3 つある場合 ストレートを視野に入れる
            // ex) 5 7 8 9 10 => 7 8, 8 9, 9 10, 3 つ隣り合っている。 => ストレートを視野に入れる
            if (placeHandCards[0].strongNumber === placeHandCards[1].strongNumber - 1) {
                straightCount++;
            }
            if (placeHandCards[1].strongNumber === placeHandCards[2].strongNumber - 1) {
                straightCount++;
            }
            if (placeHandCards[2].strongNumber === placeHandCards[3].strongNumber - 1) {
                straightCount++;
            }
            if (placeHandCards[3].strongNumber === placeHandCards[4].strongNumber - 1) {
                straightCount++;
            }
            console.log("straightCount: ".concat(straightCount));
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
                        var firstOrLast = Math.floor(Math.random() * 5);
                        if (firstOrLast === 0) { // 20%
                            console.log("\u30EF\u30F3\u30DA\u30A2\u304C\u5F37\u529B\uFF01 \u3067\u3082 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 => \u30EF\u30F3\u30DA\u30A2\u304B\u3089 1 \u679A\u51FA\u3059\uFF01 bool_straight_number = true;");
                            playerCards[4].click();
                            bool_straight_number = true;
                            return bool_straight_number;
                        }
                        else { // 80%
                            console.log("\u30EF\u30F3\u30DA\u30A2\u304C\u5F37\u529B\uFF01 \u30B9\u30C8\u30EC\u30FC\u30C8\u306F\u72D9\u308F\u305A\u3001\u305D\u306E\u4ED6\u306E\u5F79\u3092\u72D9\u3046\uFF01 bool_straight_number = false;");
                            return bool_straight_number;
                        }
                    }
                    else {
                        console.log("\u901A\u5E38\u306E\u30EF\u30F3\u30DA\u30A2 \u304B\u3089 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 => \u30EF\u30F3\u30DA\u30A2\u304B\u3089 1 \u679A\u51FA\u3059\uFF01 bool_straight_number = true;");
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
                        console.log("\u901A\u5E38\u306E\u30CE\u30FC\u30CF\u30F3\u30C9 \u304B\u3089 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 \u96A3\u308A\u5408\u3063\u3066\u3044\u306A\u3044\u30AB\u30FC\u30C9\u304C\u624B\u672D\u306E \u7AEF\u5074 \u306B\u3042\u308B\u30D1\u30BF\u30FC\u30F3\uFF01 => \u96A3\u308A\u5408\u3063\u3066\u306A\u3044\u30AB\u30FC\u30C9\u3092\u51FA\u3059\uFF01");
                        this._players[this.playerTurn].hand.forEach(function (card, index) {
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
                            console.log("\u901A\u5E38\u306E\u30CE\u30FC\u30CF\u30F3\u30C9 \u304B\u3089 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 \u96A3\u308A\u5408\u3063\u3066\u3044\u306A\u3044\u30AB\u30FC\u30C9\u304C\u624B\u672D\u306E \u4E2D\u5074 \u306B\u3042\u308B\u30D1\u30BF\u30FC\u30F3\uFF01 => \u4E00\u756A\u6700\u521D \u306E\u30AB\u30FC\u30C9\u3092\u6368\u3066\u308B\uFF01");
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
                        console.log("\u901A\u5E38\u306E\u30CE\u30FC\u30CF\u30F3\u30C9 \u304B\u3089 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 \u96A3\u308A\u5408\u3063\u3066\u3044\u306A\u3044\u30AB\u30FC\u30C9\u304C\u624B\u672D\u306E \u4E2D\u5074 \u306B\u3042\u308B\u30D1\u30BF\u30FC\u30F3\uFF01 => \u4E00\u756A\u6700\u521D \u306E\u30AB\u30FC\u30C9\u3092\u6368\u3066\u308B\uFF01");
                        playerCards[0].click();
                        bool_straight_number = true;
                    }
                    return bool_straight_number;
                }
                // [3] が隣り合っていない
                else if (placeHandCards[2].strongNumber !== placeHandCards[3].strongNumber - 1) {
                    // 隣り合ってない同士の数字の差が 2 ならばストレートを狙う。
                    if ((placeHandCards[3].strongNumber - placeHandCards[2].strongNumber) === 2) {
                        console.log("\u901A\u5E38\u306E\u30CE\u30FC\u30CF\u30F3\u30C9 \u304B\u3089 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 \u96A3\u308A\u5408\u3063\u3066\u3044\u306A\u3044\u30AB\u30FC\u30C9\u304C\u624B\u672D\u306E \u4E2D\u5074 \u306B\u3042\u308B\u30D1\u30BF\u30FC\u30F3\uFF01 => \u4E00\u756A\u6700\u521D \u306E\u30AB\u30FC\u30C9\u3092\u6368\u3066\u308B\uFF01");
                        playerCards[0].click();
                        bool_straight_number = true;
                    }
                    return bool_straight_number;
                }
                // [4] が隣り合っていない
                else if (placeHandCards[3].strongNumber !== placeHandCards[4].strongNumber - 1) {
                    // 隣り合ってないカードを出す
                    console.log("\u901A\u5E38\u306E\u30CE\u30FC\u30CF\u30F3\u30C9 \u304B\u3089 \u30B9\u30C8\u30EC\u30FC\u30C8\u3092\u72D9\u3046\uFF01 \u96A3\u308A\u5408\u3063\u3066\u3044\u306A\u3044\u30AB\u30FC\u30C9\u304C\u624B\u672D\u306E \u7AEF\u5074 \u306B\u3042\u308B\u30D1\u30BF\u30FC\u30F3\uFF01 => \u96A3\u308A\u5408\u3063\u3066\u306A\u3044\u30AB\u30FC\u30C9\u3092\u51FA\u3059\uFF01");
                    this._players[this.playerTurn].hand.forEach(function (card, index) {
                        if (card.strongNumber === placeHandCards[4].strongNumber) {
                            playerCards[index].click();
                            bool_straight_number = true;
                            return bool_straight_number;
                        }
                    });
                }
            }
            return bool_straight_number;
        };
        // 次のターンへ
        Poker.prototype.nextTurn = function () {
            // this.playerTurn を更新する
            this.playerTurn++;
            if (this.playerTurn > 3) {
                this.playerTurn = 0;
            }
            // 選択枚数を初期化する。
            this._selectedCardsCount = 0;
            console.log("\u30D7\u30EC\u30A4\u30E4\u30FC ".concat(this.playerTurn, " \u306E\u30BF\u30FC\u30F3\uFF01"));
            // this.playerTurn にもとづき、交換ボタンを生成 this.playerTurn で どの手札に配置すべきかが決まる
            this.createExchangeBtn();
            // サブプレイヤーの挙動
            if (this.playerTurn !== 0) {
                this.subPlayerThought();
            }
            // メインプレイヤーの挙動
            else if (this.playerTurn === 0) {
                // カードをクリックできるようにする。
                var selectedCards = document.querySelectorAll('.player0_hand>li');
                selectedCards.forEach(function (card) {
                    card.style.pointerEvents = 'auto';
                    card.style.cursor = 'pointer';
                });
                // サブプレイヤーたちが役に応じたセリフを表示
                // メインプレイヤーがサブプレイヤーたちの思惑を推察するセリフを表示
                var subPlayerNames = [
                    this._players[1].name,
                    this._players[2].name,
                    this._players[3].name
                ];
                this._message.openMessage('all');
                this._message.predict_subPlayers_handList(subPlayerNames);
                console.log("\u30D7\u30EC\u30A4\u30E4\u30FC 1 \u306E\u5F79: ".concat(this._players[1].strong.handList, " ").concat(this._players[1].strong.compareNumberLists));
                console.log("\u30D7\u30EC\u30A4\u30E4\u30FC 2 \u306E\u5F79: ".concat(this._players[2].strong.handList, " ").concat(this._players[2].strong.compareNumberLists));
                console.log("\u30D7\u30EC\u30A4\u30E4\u30FC 3 \u306E\u5F79: ".concat(this._players[3].strong.handList, " ").concat(this._players[3].strong.compareNumberLists));
            }
        };
        // 全員の手札をオープンするメソッドを実行
        Poker.prototype.open_PlayersHand = function () {
            var _this = this;
            console.log("\u5168\u54E1\u306E\u624B\u672D\u3092\u30AA\u30FC\u30D7\u30F3\u3059\u308B\uFF01 open_PlayersHand method execution!");
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
            var playersHandList = [];
            for (var i = 0; i < this._players.length; i++) {
                playersHandList[i] =
                    {
                        rank: 0,
                        name: this._players[i].name,
                        handListNumber: this._players[i].strong.handListNumber,
                        compareNumberLists: this._players[i].strong.compareNumberLists
                    };
            }
            // 役の強さ (handListNumber) で比較する。
            // 役の強さが同じの場合は比較対象のカードの数字 (compareNumberLists) で比較する。
            // 降順
            playersHandList.sort(function (a, b) {
                if (a.handListNumber !== b.handListNumber) {
                    return b.handListNumber - a.handListNumber;
                }
                else if (a.handListNumber === b.handListNumber) {
                    for (var i = 0; i < a.compareNumberLists.length; i++) {
                        if (a.compareNumberLists[i] !== b.compareNumberLists[i]) {
                            return b.compareNumberLists[i] - a.compareNumberLists[i];
                        }
                    }
                }
                return 0;
            });
            console.log(" 1 \u4F4D\u306E\u5F79\u306E\u60C5\u5831 playersHandList[0]:", playersHandList[0]);
            console.log(" 2 \u4F4D\u306E\u5F79\u306E\u60C5\u5831 playersHandList[1]:", playersHandList[1]);
            console.log(" 3 \u4F4D\u306E\u5F79\u306E\u60C5\u5831 playersHandList[2]:", playersHandList[2]);
            console.log(" 4 \u4F4D\u306E\u5F79\u306E\u60C5\u5831 playersHandList[3]:", playersHandList[3]);
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
            if (JSON.stringify(playersHandList[0].compareNumberLists) ===
                JSON.stringify(playersHandList[1].compareNumberLists)) {
                playersHandList[0].rank = 1;
                playersHandList[1].rank = playersHandList[0].rank;
            }
            else {
                playersHandList[0].rank = 1;
                playersHandList[1].rank = playersHandList[0].rank + 1;
            }
            if (JSON.stringify(playersHandList[1].compareNumberLists) ===
                JSON.stringify(playersHandList[2].compareNumberLists)) {
                playersHandList[2].rank = playersHandList[1].rank;
            }
            else {
                playersHandList[2].rank = playersHandList[1].rank + 1;
            }
            if (JSON.stringify(playersHandList[2].compareNumberLists) ===
                JSON.stringify(playersHandList[3].compareNumberLists)) {
                playersHandList[3].rank = playersHandList[2].rank;
            }
            else {
                playersHandList[3].rank = playersHandList[2].rank + 1;
            }
            this._players.forEach(function (player) {
                for (var i = 0; i < playersHandList.length; i++) {
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
            this._players.forEach(function (player) {
                var _loop_3 = function (i) {
                    if (player.rank === i) {
                        var rank_rank = document.querySelector(".rank".concat(i, ">.rank_rank"));
                        rank_rank.textContent = String(player.rank) + ' 位';
                        var rank_image = document.querySelector(".rank".concat(i, ">.rank_image>img"));
                        rank_image.src = player.image;
                        var rank_name = document.querySelector(".rank".concat(i, ">.rank_name"));
                        rank_name.textContent = player.name;
                        // innerHTML を使うのはロイヤルストレートフラッシュなどの場合、改行が必要になるため。
                        var rank_handlist = document.querySelector(".rank".concat(i, ">.rank_handlist"));
                        rank_handlist.innerHTML = player.strong.handList;
                        // どの役であろうと、最初の比較対象となるカードは一番右のカードになる。
                        var rank_high_number_image = document.querySelector(".rank".concat(i, ">.rank_high_number>img"));
                        rank_high_number_image.src = player.hand[4].url;
                        var rank_compare_number_image_1 = document.querySelector(".rank".concat(i, ">.rank_compare_number"));
                        player.hand.forEach(function (hand) {
                            var compareImage = document.createElement("img");
                            compareImage.src = hand.url;
                            rank_compare_number_image_1.appendChild(compareImage);
                        });
                    }
                };
                for (var i = 1; i < 5; i++) {
                    _loop_3(i);
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
            setTimeout(function () {
                _this._message.hideMessage();
            }, 1500);
            setTimeout(function () {
                var _loop_4 = function (i) {
                    var playerHandCardsImage = document.querySelectorAll(".player".concat(i, "_hand>li>img"));
                    playerHandCardsImage.forEach(function (card, index) {
                        card.src = _this._players[i].hand[index].url;
                    });
                };
                for (var i = 1; i < _this._players.length; i++) {
                    _loop_4(i);
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
            setTimeout(function () {
                _this._message.openMessage(1);
                _this._message.show_playerHand(_this._players[1].strong.handList, _this._players[1].hand[4].number, 1);
            }, 5000);
            // 7 秒後
            setTimeout(function () {
                _this._message.hideMessage();
                _this._message.openMessage(2);
                _this._message.show_playerHand(_this._players[2].strong.handList, _this._players[2].hand[4].number, 2);
            }, 7000);
            // 9 秒後
            setTimeout(function () {
                _this._message.hideMessage();
                _this._message.openMessage(3);
                _this._message.show_playerHand(_this._players[3].strong.handList, _this._players[3].hand[4].number, 3);
            }, 9000);
            // 11 秒後
            setTimeout(function () {
                _this._message.hideMessage();
                _this._message.openMessage(0);
                _this._message.show_playerHand(_this._players[0].strong.handList, _this._players[0].hand[4].number, 0);
            }, 11000);
            // 13 秒後
            // 結果リストを表示する直前のセリフを表示
            setTimeout(function () {
                _this._message.hideMessage();
                _this._message.openMessage('all');
                _this._message.before_resultList();
            }, 13000);
            // 17 秒後
            // 結果リストを上から下へ移動
            setTimeout(function () {
                _this._message.hideMessage();
                var resultList = document.querySelector('.result_list');
                // 画面解像度に応じて条件分岐
                resultList.style.top = '19%'; // 画面解像度 1920 * 1080 を前提とする
            }, 17000);
            // 20 秒後
            // 順位に応じたセリフを表示
            setTimeout(function () {
                _this._message.openMessage('all');
                for (var i = 0; i < _this._players.length; i++) {
                    _this._message.playerRank(_this._players[i].rank, i);
                }
            }, 20000);
            // 23 秒後
            // カードを配り直すボタンを表示
            setTimeout(function () {
                _this._tool.createDoubleLineBtn(_this.handAreas[0], 'backToStartBtn', 'カードを<br>配り直す');
                var backToStartBtn = document.querySelector('.backToStartBtn');
                _this._tool.nullCheck(backToStartBtn);
                backToStartBtn.addEventListener('click', function () {
                    _this.click_backToStartBtn();
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
                });
            }, 23000);
        };
        Object.defineProperty(Poker.prototype, "trump", {
            get: function () {
                return this._trump;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Poker.prototype, "players", {
            get: function () {
                return this._players;
            },
            enumerable: false,
            configurable: true
        });
        return Poker;
    }());
    // スタートボタンを生成
    function createStartBtn() {
        var stock = document.querySelector('.stock');
        if (stock === null) {
            return;
        }
        var startBtn = document.createElement('div');
        startBtn.classList.add('btn', 'singleLineBtn', 'startBtn');
        startBtn.textContent = 'カードを配る';
        startBtn.addEventListener('click', function () {
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

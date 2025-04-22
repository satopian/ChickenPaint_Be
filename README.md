# ChickenPaint Be

## サポートが終了したBootstrap4からBootstrap5へ移行
｢ChickenPaint｣は、Nicholas Sherlock氏が開発したペイントソフトです。  

[thenickdude/chickenpaint: An HTML5 Port of the ChibiPaint multi-layer Oekaki painting tool](https://github.com/thenickdude/chickenpaint)  
    
そして、このリポジトリにあるのは、その｢ChickenPaint｣を改造したものです。  
IEのサポートが完全に終了したため、互換性のための古いJavaScriptが必要なくなりました。  
そして、古い非推奨のJavaScriptを推奨されるものに置き換える作業が必要になりました。  
その作業の過程で、キーボードインベントの処理の書き直しを行いました。  
しかし、Bootstrap4にも非推奨になったキーボードイベントのコードが残っていました。  
Bootstrap4のコードを含む｢ChickenPaint｣のビルドを行ったあと手作業で該当箇所を置換してGoogleのクロージャーコンパイラーでminifyするとても無駄な作業が発生しました。  
これらの問題を解決するためBootstrap5対応版を作りました。    
改造したバージョンの｢ChickenPaint｣の名称は｢ChickenPaint Be｣です。  
追加された機能と廃止された機能があり、またこの改造版に固有の問題が存在する可能性もあるため名称を変更しました。  

noteにも、概要をまとめましたのでご一読いただければ幸いです。

[ChickenPaintを改良したChickenPaint Beの新機能｜さとぴあ](https://note.com/satopian/n/ne3958c47464d)

### Bootstrap4にXSSの脆弱性  

2024年7月、Bootstrap 4.0.0 - 4.6.2 にXSSの脆弱性がある事が明らかになりました。  
Bootstrap4はサポートが終了しているため、セキュリティパッチが提供される事はありません。  
つまり、Bootstrap5に移行する必要があるという事です。  

[npm audit reports moderate XSS vulnerability with bootstrap 4.6.2 · Issue #40685 · twbs/bootstrap](https://github.com/twbs/bootstrap/issues/40685)  

｢ChickenPaint Be｣は、Bootstrap5に移行しました。    
Bootstrap5は現行サポートバージョンであるため、あらたな問題が発見されてたとしても、問題が修正される事を期待できます。

### 脱jQuery
Bootstrap4はjQueryを必要としていましたが、Bootstrap5はJavaScriptのみで動作します。  
もはや必須ではなくなったjQueryとJavaScriptが混在したコードになり保守しがたいものになっていました。  
そのため、jQueryで記述されていた箇所をすべてJavaScriptに置き換えました。  
ChickenPaint Beは仮にjQueryの開発が終了したとしても、影響を受けません。  

## デモ

[https://paintbbs.sakura.ne.jp/localPaintBBS/chickenpaint/](https://paintbbs.sakura.ne.jp/localPaintBBS/chickenpaint/)

## ChickenPaint Beが使えるお絵かき掲示板PHPスクリプトと交流サイト

[お絵かき掲示板PHPスクリプトPetit Note](https://github.com/satopian/Petit_Note)を開発しています。  
このPetit Noteを使った[お絵かき掲示板交流サイトPetit Note](https://paintbbs.sakura.ne.jp/)でChickenPaint Beを使う事もできます。  

## 変更点

#### ChickenPaintのダイヤログ、ポップオーバーの日本語未翻訳箇所を翻訳して実装しました

![Screen-2024-01-06_14-51-15](https://github.com/satopian/Petit_Note/assets/44894014/4a81d9b1-e146-4f59-8ed1-39ddd4e82b1f)

![Screen-2024-01-06_15-15-24](https://github.com/satopian/Petit_Note/assets/44894014/e6e98ef2-9ccd-48a3-bee8-552a24e6615d)

#### 変形確定前に別のレイヤーを選択、または新規レイヤーを追加しようとした時に表示されるダイヤログの動作を改良

- 変形確定前にレイヤーを追加しようとすると変形を確定する取り消すなどの操作を促すダイヤログが表示されますが、従来の動作では、変形確定のエンターキーの押下で変形は確定されるものの、ダイヤログはすぐには消えず、レイヤーの追加も行われませんでした。  
修正後は、エンターキーによる変形の確定と同時にダイヤログは閉じられ、かつ、レイヤーも追加されます。
一連のダイヤログの日本語訳も追加しました。

### 描画時にも円カーソルが表示されるようになりました。
[PaintBBS NEOとChickenPaintの円カーソルの表示を変更しました｜さとぴあ](https://note.com/satopian/n/ne102c07b8adf)

https://github.com/satopian/Petit_Note/assets/44894014/a79c6e5d-1a9d-4520-8a83-fe68ea8d3e6a

### レイヤー2枚で起動するようになりました

![image](https://github.com/user-attachments/assets/9a55fd0c-bc90-416d-a869-7ed897addf9d)
  
これまでは白い背景レイヤー1枚で起動していましたが、透明なレイヤーが1枚追加されレイヤー2枚で起動するようになりました。  
間違って白い背景レイヤーに線画を描く事故を減らす事ができます。

### ショートカットキーの変更と拡張
[ChickenPaintのショートカットキーを拡張しました｜さとぴあ](https://note.com/satopian/n/n79fee71aa102)
- R+左クリックでキャンバスの回転
- Hでレイヤーの左右反転  
- Wで水彩
- Aでエアブラシ  
- Sで薄消しゴム
- Uでぼかしツール
- Dで指先ツール  
- Cで混色ツール
- SHIFT+CTRL+Eで全レイヤー結合
- SHIFT+CTRL+Gでグループ結合
- CTRL+Mでマスク適用
- SHIFT+Mでマスク削除
- CTRL+Iでネガポジ反転
- SHIFT+左クリックでブラシサイズと不透明度のスライダーを緩やかに調整

### レイヤーパレット固有のショートカットキー
レイヤーパレットの右クリックメニューが動作しなくなってしまったので、埋め合わせとして、ショートカットキーを追加しました。
以下はレイヤーマスクのサムネイルの上をクリックした時に動作するショートカットキーです。

- shift+クリックでマスク表示/非表示切り替え(ドキュメントには記載がなかったものの元から存在していたショートカット)
- alt+クリックでマスクの内容を表示/非表示(ドキュメントには記載がなかったものの元から存在していたショートカット)
- ctrl+クリックでマスク適用(追加)
- shift+crtl+クリックでマスク削除(追加)

![2024_01_16_レイヤーマスクのショートカットキーを追加](https://github.com/satopian/Petit_Note/assets/44894014/80361d7d-acf8-4256-98fa-27f7bf09d2e9)


### レイヤーパレットにアイコンを追加
![ChickenPaintのレイヤーパレットに複製iconを追加](https://github.com/user-attachments/assets/75543a04-3e51-4960-9c97-571cf8e007a0)

#### 下のレイヤーと結合アイコンを追加
- ｢下のレイヤーと結合｣をペンによる操作で簡単に実現できるようにするため、レイヤーパレットに｢下のレイヤーと結合｣アイコンを追加しました。

#### グループ結合アイコンを追加
- グループ結合アイコンを追加しました。    
また、たくさんレイヤーがある時はグループ化して閉じればレイヤーパレットの場所を取らず便利です。  
しかし、これまではグループレイヤーを結合するには右クリックメニューから選ぶか上段のメニューからグループ結合を選択する必要がありました。   
そして、レイヤーの右クリックメニュー機能を再実装できなかったので、実質上のメニューか、ショートカットキーでしか操作できなくなっていました。  
そこで、レイヤーパレットに｢グループ結合｣アイコンを追加しました。 
1タップで、グループフォルダ内のレイヤーを結合して1つにします。  
グループフォルダを選択すると下のレイヤーと結合アイコンがグループ結合アイコンに入れ代わります。  

#### 複製アイコンを追加
- 複製アイコンを追加しました。
これまでは、ショートカットキーを使うか、上段のメニューから複製を選択するしかありませんでした。
複製アイコンを1タップするだけでレイヤーやレイヤーグループが複製できるようになりました。

#### レイヤーパレットのマスクアイコンの動作を変更
- レイヤーパレットのマスクアイコンの動作を変更しました。
選択しているレイヤーにマスクが無い時は｢マスク追加｣になり、マスクが存在している時は｢マスク適用｣に変わります。    
これによりペン操作で簡単にレイヤーマスクを適用できようになります。    
これまでの、マスクアイコンには｢マスク追加｣機能しかありませんでした。  

### レイヤーマスクのサムネイル選択時はゴミ箱アイコンでレイヤーマスクを削除
- レイヤーパレットのゴミ箱アイコンをタップするとレイヤー全体が削除されていましたが、レイヤーマスクを選択している時は、レイヤーマスクだけ削除できるようになりました。
一般的なペイントツールと同じ動作になりました。    

### 操作パレットに左右反転アイコンを追加しました。
- キーボードショートカットキー｢Hでレイヤーの左右反転｣に続き、アイコンも追加しました。  
これまではキーボードがないデバイスはメニューから左右反転を選択する必要がありました。  
左右反転アイコンの追加により、ワンタップで左右反転できるようになりました。  

 [ChickenPaint Beの操作パレットに左右反転アイコンを追加｜さとぴあ](https://note.com/satopian/n/nb14b357f5ccd)
 
### クリッピングの結果を維持したまま下のレイヤーと結合
- これまでは、下のレイヤーと結合するとクリッピングマスクが無効になっていました。
- これまでも問題なく動作していたレイヤーグループの結合と同じ挙動になるようにしました。  

### ぼかしフィルタやグリッド等数値を入力する箇所は数値のみに
#### 数値を入力する箇所は input type="number" に変更しました
- これまでは、数値を入力する項目にアルファベットやひらがなの入力が可能でした。
### グリッド設定でエンターキーを押下すると描画画面から移動してしまう問題
- エンターキーのデフォルトの動作をキャンセルして、画面が移動しないようにしました。
### Firefoxで、Altキーを押すとメニューが開閉する問題
- Alt押下でキャンバスの色をスポイトできますが、この時にFirefoxのメニューバーが開閉する問題がありました。
Altキーのブラウザのデフォルトの動作をキャンセルしてこの問題を修正しました。

### 変形操作をレイヤー非表示、不透明度0%の時に行おうとした時のポップオーバーによるメッセージを追加
- レイヤーの不透明度が0%の時や非表示の時にも、変形操作ができない理由を説明するポップオーバーが表示されるようになりました。

### 拡大縮小ボタン使用時の拡大縮小率の変更
- 拡大で2倍、縮小で0.5倍だった拡縮率を拡大で 1.41倍、縮小で0.7092になるように変更しました。  
また縮小率0.7092倍時に描線がきれいに表示されないため、初期状態ではオフだったズーム時のアンチエイリアス処理を初期値でOnになるように変更しました。  
アンチエイリアスがかかると困る場合はメニューの｢表示｣の中にある、｢ズームをなめらかに表示する｣のチェックを外して使います。

### テクスチャパレットにノイズテクスチャを追加
  
![image](https://github.com/user-attachments/assets/7799d25c-2783-44a5-bae0-9185a3c628b2)

- ｢テクスチャパレット｣に｢ノイズテクスチャ｣を追加しました。    
これまでも、｢効果メニュー｣の｢単色ノイズ｣とレイヤー効果でノイズをのせる事ができましたが、それとも少し違うノイズを出す事ができます。    
ペンや鉛筆と組み合わせて使う事で、より鉛筆らしい線を描写できます。      
また水彩ブラシなどの厚塗りの時にも効果を発揮します。  

### 消しゴム使用時はテクスチャを無効化
- 消しゴム使用時はテクスチャを無効化する処理を追加しました。  
テクスチャを選択している時にも、消しゴムで消去できるようになりました。  
これまでは、テクスチャを選択したまま消しゴムをかけると、薄くはなるものの、消す事ができませんでした。  
- 薄消しゴム使用時はテクスチャが適用されます。消しゴムを使ったテクスチャのかけ合わせによる模様の作成をする時は薄消しゴムをご利用ください。

### ブラシプレビューの円をドラッグしてブラシサイズを変更する機能をペン対応に
  
![2024-10-26-ブラシパレット](https://github.com/user-attachments/assets/aa5747a9-6102-45fd-8fcd-05139e8894b4)
  
- ブラシプレビューのプレビュー画面の円をドラッグしてブラシサイズを変更する操作がペンでもできるようになりました。  
ペンでも操作できるようにするため、マウスに最適化されていた処理をPointerEventに書き直しました。    
また、各パレットとメインメニューのtouchmoveEventのデフォルトの動作をキャンセルし、誤動作が発生しないようにしました。    
ペンが画面から離れているにもかかわらず、ドラッグしている対象が動いたままになる問題を解決しました。   

### ｢輝度を透明度に変換｣機能を追加
- 白いキャンバス上の線画を透明な背景の線画に変換する｢輝度を透明度に変換｣機能を実装しました。   
  
[Feature request/proposal: converting brightness to opacity · Issue #4 · satopian/ChickenPaint_Be](https://github.com/satopian/ChickenPaint_Be/issues/4)

[@SuzuSuzu-HaruHaru](https://github.com/SuzuSuzu-HaruHaru)さんが作成した原型をもとに不透明度の計算方法を調整し、一般的なペイントソフトと比較しても遜色のない機能として実装しました。  

### モバイル端末に最適化されたUI
#### スマホ･タブレットの縦横の向きが変った時は自動的にパレットの配置を初期化
- スマホの縦横の画面の切り換えの時に使いにくいパレットの位置になってしまう事がありました。  
画面の向きの変化を検出して自動的にパレットの配置を初期化する事でこの問題を解決しました。  

![Screenshot_20240612-222002](https://github.com/satopian/ChickenPaint_Be/assets/44894014/227efa64-6746-452e-9575-6c2976c78792)  
縦表示から  
![Screenshot_20240612-222022](https://github.com/satopian/ChickenPaint_Be/assets/44894014/1ba843fa-4dfc-4e20-b14e-bfaa05dd9161)  
横表示へ。  
#### iPad Air以下の画面サイズの端末の時はパレット折りたたみ式のモバイルUIで起動

- デバイスの幅または高さが820px以下でタッチデバイスの時は、パレット折りたたみ式のモバイル用UIで起動します。  
  
![localhost_221021_59_Petit_Note_petitnote_(iPad Mini)](https://github.com/satopian/ChickenPaint_Be/assets/44894014/61584688-cbba-4a30-9837-c1fb86dd637f) ![paintbbs sakura ne jp_oeb_cgi_petit_(iPad Mini)](https://github.com/satopian/ChickenPaint_Be/assets/44894014/f9b1a2a8-ab0c-4d3a-8f39-1ccbbba64fe9)

600px x 600pxのキャンバスを開いた時の画面の比較。
左、旧UI。右、モバイル端末に最適化された新UI。

### より安全な機密データの受け渡し
パスワード等の機密データをGETパラメータにセットして送信する事がありました。  
```
postUrl: "./?pwd=パスワード",
```
これをより安全なPOSTに変更する事ができるようになりました。 
投稿が完了して画面が移動する直前に、`handleExit`関数を実行します。  
この関数でFetch APIを使ったPOSTを行えばパスワードなどの機密データをより安全に送信する事ができます。  
```
const handleExit = ()=>{
	const formData = new FormData();
	formData.append("pwd", "パスワード"); // 画像差し換え
fetch("./", {
	method: 'POST',
	mode: 'same-origin',
	headers: {
		'X-Requested-With': 'chickenpaint'
		,
	},
	body: formData
})
.then(response => {
	if (response.ok) {
		if (response.redirected) {
			return window.location.href = response.url;
		}
		response.text().then((text) => {
			if (text.startsWith("error\n")) {
					return window.location.href = "./?mode=paintcom";
				}
		})
	}
})
.catch(error => {
	console.error('There was a problem with the fetch operation:', error);
	return window.location.href = "./?mode=paintcom";
});
}
```
`chickenpaint.min.js`から参照可能なスコープの中で`const handleExit`を定義します。  
`handleExit`という名前の関数が定義されていない時は、`handleExit`は実行されず、従来と同じ動作になります。  
`handleExit`関数で何を行うのかは掲示板の作者が決定します。 
 
### ファイルサイズを劇的に削減
- ビルドツールをParcelに変更しました。  
それだけで、100kb以上のファイルサイズの削減を実現できました。  
さらに、Pointer Events のポリフィルのためのPEP、Promise対応のためのcore-jsを削除しました。  
IE11は完全にサポートが終了しているため、これらのポリフィルは必要なくなりました。  
これらのポリフィルを整理した結果、743KBから594KBになり、約20%のファイルサイズ削減になりました。  
さらに、jQueryからバニラJavaScriptへのコードの書き直しによりさらにファイルサイズを削減することができました。  
ファイルサイズは743KBから496KBになり、約33%のファイルサイズ削減になりました。    

### 依存関係を整理
- 使用していたnpmのパッケージの多くを整理しました。  
パッケージの脆弱性によって開発の続行が困難にならないようにするためパッケージの多くを整理しました。    

### このバージョンにはオリジナルの｢ChickenPaint｣には存在しない固有の問題があるかもしれません  

- もしも動作に問題がある場合は、このリポジトリのIssueを開いてください。
- GitHubにアカウントが無い場合は、[サポート掲示板](https://paintbbs.sakura.ne.jp/cgi/neosample/support/)をご利用ください。
- かなりの箇所に手を加えているため、オリジナルの｢ChickenPaint｣には無い固有の問題が存在している可能性があります。
- オリジナル版の｢ChickenPaint｣で発生していない問題をオリジナルの｢ChickenPaint｣のリポジトリに問い合わせないようお願いします。

## ビルド
`npm i`でパッケージをインストールすると`make all`も実行され、`chickenpaint/js/`に本番環境で使用するための`chickenpaint.js`と`chickenpaint.min.js'`がビルドされます。  
`example/index.html`を開くとChickenPaint Beが起動します。  
再度ビルドしたい時は`make all`と入力します。  

### テスト用の開発サーバを起動
`make dev`でParcelの開発サーバが起動します。   
ブラウザで開発サーバのURLを開くと動作確認用のChickenPaint Beが起動します。  
`dist/`ディレクトリに開発サーバで使用するファイル一式が入ります。      
`dist/`ディレクトリに入るのは開発サーバを使った動作確認のためのファイルです。  
`dist/`ディレクトリ内のファイルは配布に適していません。  

### 掲示板などで利用する本番環境用のビルドずみファイル
掲示板などで使用する時に必要になるのは、`chickenpaint/`ディレクトリ内のファイルだけです。  

`chickenpaint/`ディレクトリのminifyされた`chickenpaint.js`と`chickenpaint.min.js`をご利用ください。  
ビルドずみファイルを含む必要なファイル一式はリポジトリの`chickenpaint/`ディレクトリにあります。  
ビルドされたファイルは、すべてminifyされており、`chickenpaint.js`と`chickenpaint.min.js`は同じものです。



# ChickenPaint Be
｢ChickenPaint｣は、Nicholas Sherlock氏が開発したペイントソフトです。  
[thenickdude/chickenpaint: An HTML5 Port of the ChibiPaint multi-layer Oekaki painting tool](https://github.com/thenickdude/chickenpaint)  
  
そして、このリポジトリにあるのは、その｢ChickenPaint｣を改造したものです。  
IEのサポートが完全に終了したため、互換性のための古いJavaScriptが必要なくなりました。  
そして、古い非推奨のJavaScriptを推奨されるものに置き換える作業が必要になりました。  
その作業の過程で、キーボードインベントの処理の書き直しを行いました。  
しかし、Bootstrap4にも非推奨になったキーボードイベントのコードが残っていました。  
Bootstrap4のコードを含む｢ChickenPaint｣のビルドを行ったあと手作業で該当箇所を置換してGoogleのクロージャーコンパイラーでminifyするとても無駄な作業が発生しました。  
それらの問題を解決するためにBootstrap5対応版を作りました。  
改造したバージョンの｢ChickenPaint｣の名称は｢ChickenPaint Be｣です。  
追加された機能と廃止された機能があり、またこの改造版に固有の問題が存在する可能性もあるため名称を変更しました。  

noteにも、概要をまとめましたのでご一読いただければ幸いです。

[ChickenPaintを改良したChickenPaint Beの新機能｜さとぴあ](https://note.com/satopian/n/ne3958c47464d)

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

### ショートカットキーの変更と拡張
[ChickenPaintのショートカットキーを拡張しました｜さとぴあ](https://note.com/satopian/n/n79fee71aa102)
- R+左クリックでキャンバスの回転
- Hでレイヤーの左右反転  
- Wで水彩
- Aでエアブラシ  
- Sで薄消しゴム
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


### レイヤーパレットに｢下のレイヤーと結合｣アイコンを追加
- ｢下のレイヤーと結合｣をペンによる操作で簡単に実現できるようにするため、レイヤーパレットに｢下のレイヤーと結合｣アイコンを追加しました。

![image](https://github.com/satopian/ChickenPaint_Be/assets/44894014/019fbe39-9382-4639-95c6-bfbe8ed47af8)

#### レイヤーパレットにグループ結合アイコンを追加しました。
- グループ結合アイコンを追加しました。  
通常の下のレイヤーと結合で結合するとクリッピングが解除されてしまいますが、レイヤーグループ内で下のレイヤーとクリッピングしていれば、グループ結合でレイヤーを結合しても、クリッピングが維持できます。   
また、たくさんレイヤーがある時はグループ化して閉じればレイヤーパレットの場所を取らず便利です。  
しかし、これまではグループレイヤーを結合するには右クリックメニューから選ぶか上段のメニューからグループ結合を選択する必要がありました。   
そして、レイヤーの右クリックメニュー機能を再実装できなかったので、実質上のメニューか、ショートカットキーでしか操作できなくなっていました。  
そこで、レイヤーパレットに｢グループ結合｣アイコンを追加しました。 
1タップで、グループフォルダ内のレイヤーを結合して1つにします。  

![2024_01_14_レイヤーパレットにグループ結合アイコンを追加](https://github.com/satopian/Petit_Note/assets/44894014/db8d88a3-6bc8-4d3f-a612-1a2e000d9aaa)

#### レイヤーパレットのマスクアイコンの動作を変更
- レイヤーパレットのマスクアイコンの動作を変更しました。
選択しているレイヤーにマスクが無い時は｢マスク追加｣になり、マスクが存在している時は｢マスク適用｣に変わります。    
これによりペン操作で簡単にレイヤーマスクを適用できようになります。    
これまでの、マスクアイコンには｢マスク追加｣機能しかありませんでした。  
 
### ぼかしフィルタやグリッド等数値を入力する箇所は数値のみに
#### 数値を入力する箇所は input type="number" に変更しました
- これまでは、数値を入力する項目にアルファベットやひらがなの入力が可能でした。
### グリッド設定でエンターキーを押下すると描画画面から移動してしまう問題
- エンターキーのデフォルトの動作をキャンセルして、画面が移動しないようにしました。
### Firefoxで、Altキーを押すとメニューが開閉する問題
- Alt押下でキャンバスの色をスポイトできますが、この時にFirefoxのメニューバーが開閉する問題がありました。
Altキーのブラウザのデフォルトの動作をキャンセルしてこの問題を修正しました。

### 変形操作をレイヤーが非表示、不透明度0%の時に行おうとした時のポップオーバーによるメッセージを追加
- レイヤーの不透明度が0%の時や非表示の時にも、変形操作ができない理由を説明するポップオーバーが表示されるようになりました。

### 拡大縮小ボタン使用時の拡大縮小率の変更
- 拡大で2倍、縮小で0.5倍だった拡縮率を拡大で 1.41倍、縮小で0.7092になるように変更しました。  
また縮小率0.7092倍時に描線がきれいに表示されないため、初期状態ではオフだったズーム時のアンチエイリアス処理を初期値でOnになるように変更しました。  
アンチエイリアスがかかると困る場合はメニューの｢表示｣の中にある、｢ズームをなめらかに表示する｣のチェックを外して使います。

### より安全な機密データの受け渡し
パスワード等の機密データをGETパラメータにセットして送信する事がありました。  
```
postUrl: "./?pwd=パスワード",
```
これをより安全なPOSTに変更する事ができるようになりました。 
投稿が完了して画面が移動する直前に、`handleExit`関数を実行します。  
この関数でFetch APIを使ったPOSTを行えばパスワードなどの機密データをより安全に送信する事ができます。  
```
handleExit = ()=>{
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
`handleExit`という名前の関数が定義されていない時は、`handleExit`は実行されず、従来と同じ動作になります。  
`handleExit`関数で何を行うのかは掲示板の作者が決定します。 

### このバージョンのchickenpaint.jsにはBootstrapのコードが入っていません
- Bootstrapのコードは従来のバージョンの｢ChickenPaint｣には入っていましたが、このBootstrap5対応版には入っていません。

そのため、chickenpaint.jsを読み込む前に、Popperを含むBundle版のBootstrapを読み込む必要があります。

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
<script src="chickenpaint/js/chickenpaint.min.js"></script>
<link rel="stylesheet" href="chickenpaint/css/chickenpaint.css">
```
Bootstrapを含んだ`chickenpaint.js`と`chickenpaint.min.js`が必要な場合は以下のコマンドでファイルを結合します。    

```
npm i
```
このコマンドでパッケージのインストールと`make`によるビルドを実行します。  
ビルドに成功したら、次のコマンドを入力します。  
```
bash cat.sh
```  
このコマンドで`bootstrap.bundle.min.js`と`chickenpaint.js`を結合します。
```  
bash min.sh
```
このコマンドでminifyされた`chickenpaint.min.js`を作ります。  
  
この2つのファイルは、`dest`ディレクトリに出力されます。  
minifyには、Google クロージャーコンパイラーをを使用しています。  
Google クロージャーコンパイラーのグローバルインストールが必要です。      
```
npm i -g google-closure-compiler
```

### このバージョンにはオリジナルの｢ChickenPaint｣には存在しない固有の問題があるかもしれません  

- もしも動作に問題がある場合は、このリポジトリのIssueを開いてください。
- GitHubにアカウントが無い場合は、[サポート掲示板](https://paintbbs.sakura.ne.jp/cgi/neosample/support/)をご利用ください。
- かなりの箇所に手を加えているため、オリジナルの｢ChickenPaint｣には無い固有の問題が存在している可能性があります。
- オリジナル版の｢ChickenPaint｣で発生していない問題をオリジナルの｢ChickenPaint｣のリポジトリに問い合わせないようお願いします。
 

## Building

In the root of ChickenPaint, run `npm install` to install required dependencies. 
Then run `make all` to build ChickenPaint.


Prevent zooming on mobile devices by adding this to your head:

```html
<meta name="viewport" content="width=device-width,user-scalable=no">
```

For iOS Safari support, you also need to add this to the head to block the long-press text
selection popup from appearing on your body elements (when not in ChickenPaint full-screen mode):

```html
<style>
body {
	-webkit-user-select: none; /* For iOS Safari: Prevent long-press from popping up a selection dialog on body text */
}
</style>
```

Add an element to serve as the container for ChickenPaint:

```html
<div id="chickenpaint-parent"></div>
```

Then construct ChickenPaint and tell it which DOM element to add to:

```js
new ChickenPaint({
    uiElem: document.getElementById("chickenpaint-parent"),
    saveUrl: "save.php",
    postUrl: "complete.php",
    exitUrl: "index.php",
    resourcesRoot: "chickenpaint/"
});
```

The possible options, including additional options for loading saved .chi or .png files for editing, are described
in the typedef comment for the ChickenPaintOptions object in `/js/ChickenPaint.js`.

See `/example/index.html` for a complete example of a page that hosts ChickenPaint.

Your `saveUrl` will receive the uploaded .chi layer file (if the drawing had multiple layers), flat PNG image (always)
and .aco color palette (if the user edited it), which would arrive in PHP as `$_FILES["picture"]`, `$_FILES["chibifile"]`
and `$_FILES["swatches"]`. For an example of an upload script, see `/example/save.php`.

ChickenPaint's saving workflow has been customised for use on Chicken Smoothie by setting `allowMultipleSends` to `true`
in the options in the constructor. On CS, the user can save their drawing, and then either continue editing the drawing, 
publish their completed drawing to the forum, or exit their drawing session and come back and finish it later. The 
ability to create a new drawing and then save it multiple times before publishing it to the forum effectively requires 
that the saveUrl contains a unique session ID in it. This way each `POST` to the saveUrl can be associated with the same
drawing session.

By default, `allowMultipleSends` is disabled, and the user will only have the option to post their drawing immediately.
This allows a simpler image upload script.

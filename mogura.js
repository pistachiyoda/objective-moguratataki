"use strict";

// スコア
let score = 0;

// ゲーム全体を制御するクラス
class GameController {
  constructor() {
    this.moguras = [];
  }
  start() {
    // 穴の用意とモグラオブジェクトの初期化
    for (let i = 1; i <= 3; i++) {
      const container = document.createElement("div");
      container.classList.add("container");
      document.body.appendChild(container);
      for (let j = 1; j <= 3; j++) {
        const relative = document.createElement("div");
        let elementId = 0;
        relative.classList.add("relative");
        if (i === 1) {
          elementId = j;
        } else if (i === 2) {
          elementId = j + 3;
        } else {
          elementId = j + 6;
        }
        relative.id = elementId;
        const anaImg = document.createElement("img");
        anaImg.classList.add("ana");
        // 要素->プロパティへは.つなぎでアクセスできる
        anaImg.src = "images/穴.png";
        const moguraImg = document.createElement("img");
        moguraImg.classList.add("mogura", "uwagaki");
        relative.appendChild(anaImg);
        relative.appendChild(moguraImg);
        container.appendChild(relative);
        const mogura = new Mogura(elementId);
        this.moguras.push(mogura);
        mogura.hide();
      }
    }
    setTimeout(() => {
      this.end();
    }, 10000);
  }
  end() {
    this.moguras.forEach(mogura => mogura.stop());
    alert(`ゲーム終了 スコア${score}`);
  }
}

// モグラ1匹を制御するクラス
class Mogura {
  STATUS = {
    HIDE: 0,
    SHOW: 1,
    HIT: 2
  };
  TYPES = ["normal", "abnormal"];
  HIT_MOGURAS = {
    normal: "images/モグ1.png",
    abnormal: "images/モグ4.png"
  };
  NORMAL_MOGRAS = {
    normal: "images/モグ2.png",
    abnormal: "images/モグ3.png"
  };
  ANA = "images/穴.png";

  constructor(areaId) {
    // モグラオブジェクトのステート、モグラタイプを持つ
    this.areaId = areaId;
    this.status = this.STATUS.HIDE;
    this.type = this.TYPES[Math.floor(Math.random() * 2)];
    this.currentTimeoutId = null;
    let element = document.getElementById(this.areaId);
    element.addEventListener("click", () => this.hit());
  }
  renderToHtml(img) {
    // モグラオブジェクトのステートとタイプに応じたイメージをレンダリングする
    // イベントハンドラー付きの要素を作成する
    let parentElement = document.getElementById(this.areaId);
    let imgElement = parentElement.firstElementChild;
    imgElement.src = img;
  }
  show() {
    if (this.status != this.STATUS.HIDE) {
      //モグラが隠れていない状態（＝もぐらが出現している状態の場合は）何もしない
      return false;
    }
    this.status = this.STATUS.SHOW;
    this.type = this.TYPES[Math.floor(Math.random() * 2)];
    let img =
      this.type === "normal"
        ? this.NORMAL_MOGRAS.normal
        : this.NORMAL_MOGRAS.abnormal;
    this.renderToHtml(img);
    // コールバック関数のなかのthisはそのコールバック関数自身（ここでいうとhide)を表してしまうので、bind関数でthisを束縛する
    this.currentTimeoutId = setTimeout(
      this.hide.bind(this),
      1000 + 2000 * Math.random()
    );
  }
  hide() {
    this.status = this.STATUS.HIDE;
    let img = this.ANA;
    this.renderToHtml(img);
    this.currentTimeoutId = setTimeout(
      this.show.bind(this),
      1000 + 2000 * Math.random()
    );
  }
  hit() {
    //モグラが隠れてる状態（＝もぐらが出現していない状態の場合は）何もしない
    if (this.status === this.STATUS.HIDE) {
      return false;
    }
    score++;
    this.status = this.STATUS.HIT;
    let img =
      this.type === "normal"
        ? this.HIT_MOGURAS.normal
        : this.HIT_MOGURAS.abnormal;
    this.renderToHtml(img);
  }
  stop() {
    clearTimeout(this.currentTimeoutId);
  }
}

const startButton = document.getElementById("start");
startButton.addEventListener("click", () => {
  const gameController = new GameController();
  gameController.start();
});

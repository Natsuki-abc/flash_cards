# フラッシュカード
---

## ローカル環境構築

### 0. 前提

windows: docker for windowsを使用する。  
mac: docker for macを使用する。（Intel ChipとApple Chipでダウンロードするファイルが異なる）  
[入手先](https://www.docker.com/products/docker-desktop/)

### 1. git クローン

    git clone https://github.com/[ユーザー名]/flash_cards.git

### 2. コンテナ起動

※dockerが起動されていること

    # 初回
    make init

    # 2回目以降起動時
    make up

    # 停止時
    make down

### 3. アクセス確認

http://localhost:8000/

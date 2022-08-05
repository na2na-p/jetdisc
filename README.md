# 使い方

## 共通

`fetch()`を使う関係で Node.js v17.5.0 以降が必要になります。
`.config`にある、`example.yml`をコピーして、`default.yml`にリネームします。  
`default.yml`の中身をいい感じにします。

## Docker を利用する場合

### 導入手順

1. `docker`と`docker-compose`をインストールする
1. `git clone`する
1. `cp .config/example.yml .config/default.yml`して、`default.yml`を編集する
1. `docker-compose pull`する
1. `docker-compose up -d`する`

### アップデート手順

1. `git pull`する
1. `docker-compose pull`する
1. `docker-compose down && docker-compose up -d`する

## Docker を利用しない場合

### 導入手順

1. `git clone`する
1. `cp .config/example.yml .config/default.yml`して、`default.yml`を編集する
1. `yarn install`する
1. `yarn build`する
1. `yarn start`する

### アップデート手順

1. `git pull`する
1. `yarn install`する
1. `yarn build`する
1. `yarn start`する

# 開発者向け

devcontainer を用いて開発することを前提に`yarn dev`コマンドを準備しています。  
devcontainer を使用しない場合でも、`nodemon`をグローバルインストールしてあれば使えます。

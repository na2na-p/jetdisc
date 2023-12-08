# Discord Bot

## 必要なもの

基本的には`.tool-versions`を参照してください。
asdfを使っている場合はそのまま入ります。

- Node.js
- pnpm
- Python

Pythonは、`@discordjs/opus`の入れるのに必要です。
ただし、ランタイムで`ffmpeg`が必要になります。

## 登場するドメイン

- Actor
  - Userの子概念で、interactしたUserを指す。

## Helmを利用してデプロイする

### ArgoCDを使わない場合

#### リソースの作成

1. `kubectl create namespace jetdisc`でNamespaceを作成する
2. `infra/k8s/manifests/secret.example.yml`を参考に、同ディレクトリに`secret.yml`を作成する
   1. SecretはBase64エンコードすること
3. `kubectl apply -f infra/k8s/manifests/secret.yml -n jetdisc`でSecretの適用をする
4. `helm install -n jetdisc {任意の名前/バージョン名など} ./infra/k8s/helm`

#### リソースの削除

1. `helm uninstall {任意の名前/バージョン名など}`
2. `kubectl delete -f infra/k8s/manifests/secret.yml`でSecretの削除をする
3. `kubectl delete namespace jetdisc`でNamespaceの削除をする

### ArgoCDを使う場合

#### リソースの作成

1. ArgoCDと同じクラスターにログインする
2. `kubectl create namespace jetdisc`でNamespaceを作成する
3. `infra/k8s/manifests/secret.example.yml`を参考に、同ディレクトリに`secret.yml`を作成する
   1. SecretはBase64エンコードすること
4. `kubectl apply -f infra/k8s/manifests/secret.yml -n jetdisc`でSecretの適用をする
5. `kubectl apply -f infra/k8s/argocd/jetdisc.yaml`でArgoCDの適用をする

#### リソースの削除

1. `kubectl delete -f infra/k8s/argocd/jetdisc.yaml`
2. `kubectl delete -f infra/k8s/manifests/secret.yml`でSecretの削除をする
3. `kubectl delete namespace jetdisc`でNamespaceの削除をする

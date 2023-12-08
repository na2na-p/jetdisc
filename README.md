# Discord Bot

## 必要なもの

.tool-versionsを参照してください。
asdfを使っている場合はそのまま入ります。

- Node.js
- pnpm
- Python

Pythonは、`@discordjs/opus`の入れるのに必要です。

## 登場するドメイン

- Actor
  - Userの子概念で、interactしたUserを指す。

## Helmを利用してデプロイする

### リソースの作成

1. `infra/k8s/manifests/secret.example.yml`を参考に、同ディレクトリに`secret.yml`を作成する
   1. SecretはBase64エンコードすること
2. `kubectl apply -f infra/k8s/manifests/secret.yml`でSecretの適用をする
3. `helm install {任意の名前/バージョン名など} ./infra/k8s/helm`

### リソースの削除

1. `helm uninstall {任意の名前/バージョン名など}`
2. `kubectl delete -f infra/k8s/manifests/secret.yml`

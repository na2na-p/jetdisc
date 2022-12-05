// Handler構造体．取得したいイベントを実装する
struct Handler;

#[async_trait]
impl EventHandler for Handler {
    // Botが起動したときに走る処理
    async fn ready(&self, _: Context, ready: Ready) {
        // デフォルトでC言語のprintfのようなことができる
        println!("{} is connected!", ready.user.name);
    }
}

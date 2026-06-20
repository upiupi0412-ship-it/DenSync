const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// データベースファイルのパス
const dbFile = path.join(__dirname, 'db.json');

// db.json の初期化
function initDB() {
  if (!fs.existsSync(dbFile)) {
    const initialData = {
      servers: [{ id: '1', name: 'メインサーバー' }],
      channels: [
        { id: '1', name: 'general', serverId: '1' },
        { id: '2', name: 'random', serverId: '1' }
      ],
      messages: [
        { id: '1', username: 'システム', text: 'サーバーを起動しました', channelId: '1', timestamp: Date.now() }
      ]
    };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
  }
}

// DB 読み込み関数
function readDB() {
  const data = fs.readFileSync(dbFile, 'utf-8');
  return JSON.parse(data);
}

// DB 保存関数
function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// API エンドポイント

// サーバー一覧取得
app.get('/api/servers', (req, res) => {
  const db = readDB();
  res.json(db.servers);
});

// サーバー作成
app.post('/api/servers', (req, res) => {
  const { name } = req.body;
  const db = readDB();
  const newServer = {
    id: Date.now().toString(),
    name
  };
  db.servers.push(newServer);
  
  // デフォルトチャンネルを作成
  db.channels.push({
    id: Date.now().toString(),
    name: 'general',
    serverId: newServer.id
  });
  
  writeDB(db);
  res.json(newServer);
});

// チャンネル一覧取得
app.get('/api/channels/:serverId', (req, res) => {
  const { serverId } = req.params;
  const db = readDB();
  const channels = db.channels.filter(ch => ch.serverId === serverId);
  res.json(channels);
});

// チャンネル作成
app.post('/api/channels', (req, res) => {
  const { name, serverId } = req.body;
  const db = readDB();
  const newChannel = {
    id: Date.now().toString(),
    name,
    serverId
  };
  db.channels.push(newChannel);
  writeDB(db);
  res.json(newChannel);
});

// メッセージ一覧取得
app.get('/api/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const db = readDB();
  const messages = db.messages.filter(msg => msg.channelId === channelId);
  res.json(messages);
});

// メッセージ送信
app.post('/api/messages', (req, res) => {
  const { username, text, channelId } = req.body;
  const db = readDB();
  const newMessage = {
    id: Date.now().toString(),
    username,
    text,
    channelId,
    timestamp: Date.now()
  };
  db.messages.push(newMessage);
  writeDB(db);
  res.json(newMessage);
});

// サーバー起動
initDB();
app.listen(PORT, () => {
  console.log(`DenSync Server running at http://localhost:${PORT}`);
});

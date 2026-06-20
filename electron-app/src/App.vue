<template>
  <div class="app-container">
    <div class="sidebar">
      <div class="servers-list">
        <h3>サーバー</h3>
        <button 
          v-for="server in servers" 
          :key="server.id"
          @click="selectServer(server.id)"
          :class="{ active: selectedServer === server.id }"
          class="server-btn"
        >
          {{ server.name }}
        </button>
        <button @click="createNewServer" class="create-btn">+ 新規</button>
      </div>
    </div>

    <div class="main-content">
      <div class="channels">
        <h3>チャンネル</h3>
        <div 
          v-for="channel in currentServerChannels" 
          :key="channel.id"
          @click="selectChannel(channel.id)"
          :class="{ active: selectedChannel === channel.id }"
          class="channel-item"
        >
          # {{ channel.name }}
        </div>
      </div>

      <div class="chat-area">
        <div class="messages">
          <div v-for="msg in messages" :key="msg.id" class="message">
            <strong>{{ msg.username }}:</strong> {{ msg.text }}
          </div>
        </div>

        <div class="message-input">
          <input 
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="メッセージを入力..."
            type="text"
          >
          <button @click="sendMessage">送信</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Server {
  id: string
  name: string
}

interface Channel {
  id: string
  name: string
  serverId: string
}

interface Message {
  id: string
  username: string
  text: string
  channelId: string
}

const servers = ref<Server[]>([
  { id: '1', name: 'メインサーバー' }
])

const channels = ref<Channel[]>([
  { id: '1', name: 'general', serverId: '1' },
  { id: '2', name: 'random', serverId: '1' }
])

const messages = ref<Message[]>([
  { id: '1', username: 'ユーザー1', text: 'こんにちは！', channelId: '1' },
  { id: '2', username: 'ユーザー2', text: 'やあ！', channelId: '1' }
])

const selectedServer = ref('1')
const selectedChannel = ref('1')
const newMessage = ref('')

const currentServerChannels = computed(() => {
  return channels.value.filter(ch => ch.serverId === selectedServer.value)
})

const selectServer = (serverId: string) => {
  selectedServer.value = serverId
  selectedChannel.value = channels.value.find(ch => ch.serverId === serverId)?.id || ''
}

const selectChannel = (channelId: string) => {
  selectedChannel.value = channelId
}

const createNewServer = () => {
  const name = prompt('新しいサーバー名を入力してください:')
  if (name) {
    const newServer = { id: Date.now().toString(), name }
    servers.value.push(newServer)
    selectedServer.value = newServer.id
    
    channels.value.push({
      id: Date.now().toString(),
      name: 'general',
      serverId: newServer.id
    })
  }
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now().toString(),
      username: 'あなた',
      text: newMessage.value,
      channelId: selectedChannel.value
    })
    newMessage.value = ''
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background: #36393f;
}

.sidebar {
  width: 250px;
  background: #2f3136;
  border-right: 1px solid #202225;
  padding: 20px;
  overflow-y: auto;
}

.servers-list h3 {
  color: #72767d;
  font-size: 12px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.server-btn, .create-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  background: #2f3136;
  color: #dcddde;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.server-btn:hover, .create-btn:hover {
  background: #36393f;
}

.server-btn.active {
  background: #5865f2;
  color: white;
}

.main-content {
  display: flex;
  flex: 1;
}

.channels {
  width: 200px;
  background: #2f3136;
  padding: 20px;
  overflow-y: auto;
}

.channels h3 {
  color: #72767d;
  font-size: 12px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.channel-item {
  padding: 8px;
  margin-bottom: 5px;
  color: #72767d;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.channel-item:hover, .channel-item.active {
  background: #3c3f45;
  color: #dcddde;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #36393f;
}

.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  color: #dcddde;
}

.message strong {
  color: #7289da;
}

.message-input {
  display: flex;
  padding: 20px;
  gap: 10px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  background: #40444b;
  color: #dcddde;
  border: 1px solid #202225;
  border-radius: 4px;
}

.message-input button {
  padding: 10px 20px;
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-input button:hover {
  background: #4752c4;
}
</style>

import {io} from "socket.io-client";
import {Message, SubmitMessage} from "../model/messagesSlice";

export const socketApi = {
  // socket: io('ws://websocket-chat-back-theta.vercel.app'),

  socket: io('ws://localhost:3009'),

  connection(getInitDataCallback: DataCallback<Message[]>, getMessageCallback: DataCallback<Message>) {
    this.socket.on('get-data', getInitDataCallback)
    this.socket.on('get-message', getMessageCallback)
  },
  setName(userName: string) {
    this.socket.emit('set-name', {userName})
  },
  onUserStatusUpdate(callback: (message: string) => DataCallback<{ userName: string, userId: string }>) {
    this.socket.on('user-go-in', callback('Вступил в наш чат :)'))

    this.socket.on('user-go-out', callback('Покинул наш чат...'))
  },
  sendMessage(data: SubmitMessage) {
    this.socket.emit('send-message', data)
  },
  startTypeMessage(){
    this.socket.emit('start-typing-message')
  },
  onUserTypeMessage(callback: DataCallback<{userName: string, id: string}>){
    this.socket.on('user-start-typing-message', callback)
  },
  disconnect() {
    this.socket.emit('disconnect')
  }
}

type DataCallback<T> = (data: T) => void
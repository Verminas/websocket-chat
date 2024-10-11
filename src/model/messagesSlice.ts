import {asyncThunkCreator, buildCreateSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {socketApi} from "../api/socketApi";


export type Message = {
  id: number
  message: string
  userName: string
  userId: string
}

type TypingUser = { userName: string, id: string }

export type SubmitMessage = Omit<Message, 'id' | 'userId'>

const createAppSlice = buildCreateSlice({
  creators: {asyncThunk: asyncThunkCreator},
})

const slice = createAppSlice({
  name: 'messages',
  initialState: {
    messages: [] as Message[],
    typingUsers: [] as TypingUser[]
  },
  reducers: (create) => {
    const createAThunk = create.asyncThunk.withTypes<{
      rejectValue: { error: string }
    }>()
    return {
      setInitMessages: create.reducer((state, action: PayloadAction<{ messages: Message[] }>) => {
        state.messages = action.payload.messages
      }),
      addMessage: create.reducer((state, action: PayloadAction<{ message: Message }>) => {
        const indexTypingUser = state.typingUsers.findIndex(u => u.id === action.payload.message.userId)
        if (indexTypingUser > -1) {
          state.typingUsers.splice(indexTypingUser, 1)
        }
        state.messages.push(action.payload.message)
      }),
      setTypingUser: create.reducer((state, action: PayloadAction<{user: { userName: string, id: string }}>) => {
        if (!state.typingUsers.find(u => u.id === action.payload.user.id)) {
          state.typingUsers.push(action.payload.user)
        }
      }),
      deleteTypingUser: create.reducer((state, action: PayloadAction<{user: { userName: string, id: string }}>) => {
        const index = state.typingUsers.findIndex(u => u.id === action.payload.user.id)
        if(index > -1) {
          state.typingUsers.splice(index, 1)
        }
      }),
      setConnection: createAThunk<void, undefined>((_, thunkAPI) => {
        const {dispatch} = thunkAPI

        const getInitData = (data: Message[]) => {
          dispatch(messagesActions.setInitMessages({messages: data}))
        }

        const getMessage = (message: Message) => {
          dispatch(messagesActions.addMessage({message}))
        }

        socketApi.connection(getInitData, getMessage)
      }),
      addMessageOnChangeUserStatus: createAThunk<void, { currentUserName: string }>((arg, thunkAPI) => {
        const {dispatch} = thunkAPI

        const onChangeUserStatus = (message: string) => (data: { userName: string, userId: string }) => {
          const messageStatus = {
            userName: data.userName,
            id: Date.now(),
            userId: data.userId,
            message,
          }
          dispatch(messagesActions.addMessage({message: messageStatus}))
        }

        socketApi.onUserStatusUpdate(onChangeUserStatus)
      }),
      sendMessage: createAThunk<void, SubmitMessage>((arg, thunkAPI) => {
        socketApi.sendMessage(arg)
      }),
      typeMessage: createAThunk<void>((_, thunkAPI) => {
        console.log('i m type something')
        socketApi.startTypeMessage()
      }),
      userTypeMessage: createAThunk<void>((_, thunkAPI) => {
        const {dispatch} = thunkAPI

        const callback = (data: { userName: string, id: string }) => {
          dispatch(messagesActions.setTypingUser({user:data}))

          setTimeout(() => {
            dispatch(messagesActions.deleteTypingUser({user:data}))
          }, 4000)
        }

        socketApi.onUserTypeMessage(callback)
      }),
      setDisconnect: createAThunk<void>((_, thunkAPI) => {
        socketApi.disconnect()
      })
    }
  },
  selectors: {
    selectMessages: sliceState => sliceState.messages,
    selectTypingUsers: sliceState => sliceState.typingUsers
  }
})

export const messagesReducer = slice.reducer
export const messagesActions = slice.actions
export const {selectMessages, selectTypingUsers} = slice.selectors
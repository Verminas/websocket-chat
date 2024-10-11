import {asyncThunkCreator, buildCreateSlice} from '@reduxjs/toolkit'
import {socketApi} from "../api/socketApi";


type User = {
  userName: Nullable<string>
  userId: Nullable<string>
}
export type Nullable<T> = null | T

const createAppSlice = buildCreateSlice({
  creators: {asyncThunk: asyncThunkCreator},
})

const slice = createAppSlice({
  name: 'user',
  initialState: {
    user: {
      userName: null,
      userId: null
    } as User
  },
  reducers: (create) => {
    const createAThunk = create.asyncThunk.withTypes<{
      rejectValue: { error: string }
    }>()

    return {
      setUserName: createAThunk<{ userName: string }, { userName: string }>((arg, thunkAPI) => {
        socketApi.setName(arg.userName)
        return arg
      }, {
        fulfilled: (state, action) => {
          state.user.userName = action.payload.userName
        }
      })
    }
  },
  selectors: {
    selectUserName: sliceState => sliceState.user.userName
  }
})

export const userReducer = slice.reducer
export const userActions = slice.actions
export const {selectUserName} = slice.selectors
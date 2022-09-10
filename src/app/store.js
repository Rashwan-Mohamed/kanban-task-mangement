import { configureStore } from '@reduxjs/toolkit'
import boardsReducer from '../features/board/boardSlice'

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
})

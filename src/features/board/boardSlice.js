import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import data from '../../data.json'
import useCloseEscape from './components/useCloseEscape'
const initialState = [...data.boards]

export const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addNewBoard: {
      reducer: (state, action) => {
        state.push(action.payload)
      },
      prepare: ({ name, columns }) => {
        let newColumns = []
        columns.forEach((col) => {
          let mutObj = {}
          mutObj.id = nanoid()
          mutObj.name = col.name
          mutObj.tasks = []
          newColumns.push(mutObj)
        })
        return {
          payload: {
            id: nanoid(),
            name,
            columns: newColumns,
          },
        }
      },
    },
    editBoard: {
      reducer: (state, action) => {
        const { id } = action.payload
        let inded
        state.forEach((item, ind) => {
          if (item.id === id) {
            inded = ind
          }
        })

        return [
          ...state.slice(0, inded),
          action.payload,
          ...state.slice(inded + 1),
        ]
      },
      prepare: ({ id, name, columns }) => {
        let newColumns = []
        columns.forEach((col) => {
          let mutObj = {}
          if (col.id === undefined) {
            col.id = nanoid()
          }
          if (!col.tasks) {
            col.tasks = []
          }
          mutObj.id = col.id
          mutObj.name = col.name
          mutObj.tasks = []
          col.tasks.forEach((cert) => {
            mutObj.tasks.push({ ...cert })
          })

          if (mutObj.tasks.length > 0) {
            mutObj.tasks.forEach((item) => {
              item.status = col.name
            })
          }
          newColumns.push(mutObj)
        })
        return {
          payload: {
            id,
            name,
            columns: newColumns,
          },
        }
      },
    },
    deleteBoard: (state, action) => {
      const { name } = action.payload

      return (state = state.filter((item) => item.name !== name))
    },
    addTask: {
      reducer: (state, action) => {
        const { selected, status, task } = action.payload
        let one = state.find((item) => item.name === selected)

        one.columns.forEach((item) => {
          if (item.name === status) {
            item.tasks.push(task)
          }
        })

        return state
      },
      prepare: ({ selected, status, statusId, title, desc, tasks }) => {
        return {
          payload: {
            selected,
            status,
            task: {
              id: nanoid(),
              title,
              description: desc,
              status,
              statusId,
              subtasks: tasks,
            },
          },
        }
      },
    },
    editTask: {
      reducer: (state, action) => {
        const { prevStatus, id, selected, status, task } = action.payload
        let one = state.find((item) => item.name === selected)
        let indeed
        let column
        column = one.columns.find((item) => item.name === prevStatus)
        column.tasks.forEach((item, index) => {
          if (item.id === id) {
            indeed = index
          }
        })
        if (prevStatus === status) {
          column.tasks = [
            ...column.tasks.slice(0, indeed),
            task,
            ...column.tasks.slice(indeed + 1),
          ]
        } else {
          let Newcolumn = one.columns.find((item) => item.name === status)
          column.tasks = [
            ...column.tasks.slice(0, indeed),
            ...column.tasks.slice(indeed + 1),
          ]
          Newcolumn.tasks.push(task)
        }
        return state
      },
      prepare: ({
        prevStatus,
        id,
        selected,
        status,
        statusId,
        title,
        desc,
        tasks,
      }) => {
        return {
          payload: {
            prevStatus,
            id,
            selected,
            status,
            task: {
              id,
              title,
              description: desc,
              status,
              statusId,
              subtasks: tasks,
            },
          },
        }
      },
    },
    deleteTask: (state, action) => {
      const { selected, status, id } = action.payload
      let one = state.find((item) => item.name === selected)
      let indeed
      let column
      column = one.columns.find((item) => item.name === status)

      column.tasks.forEach((item, index) => {
        if (item.id === id) {
          indeed = index
        }
      })
      column.tasks = [
        ...column.tasks.slice(0, indeed),
        ...column.tasks.slice(indeed + 1),
      ]
      return state
    },
  },
})

export const {
  addNewBoard,
  editBoard,
  deleteBoard,
  addTask,
  editTask,
  deleteTask,
} = boardSlice.actions

export default boardSlice.reducer

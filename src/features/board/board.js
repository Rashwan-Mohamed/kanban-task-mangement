import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NewBoard from './newBoard'
import NewColumn from './components/newColumn'
import { UseAppContext } from '../../context'
import EditTask from './components/editTask'
import Task from './components/task'
const Board = () => {
  const { selected, dark, hideSide, setHideSide } = UseAppContext()
  const [column, setColumn] = useState(false) // to display new column creation
  const [boardShow, setBoardShow] = useState(false) // to display new board creation when there is no boards
  const [taskShow, setTaskShow] = useState(false) // to display task
  const [editTask, setEditTask] = useState(false) // to display task editing
  const [selectedTask, setSelectedTask] = useState()

  const boards = useSelector((state) => {
    return state.boards
  })
  let board = boards.find((item) => item.name === selected)

  if (board === 'noBoard' || board === undefined) {
    return (
      <>
        {boardShow && <NewBoard setBoardShow={setBoardShow} />}
        <section className='board-container emptyBoards'>
          <p>there is no boards, click below to create one</p>
          <button
            onClick={() => {
              setBoardShow(true)
            }}
            className='addNewTask'
          >
            + create new board
          </button>
        </section>
      </>
    )
  }
  const { columns, id } = board
  console.log('updated')
  return (
    <>
      <section
        style={{
          backgroundColor: !dark ? 'var(--whiteFirst)' : '',
          left: hideSide ? '-300px' : '0',
        }}
        className='board-container'
      >
        {column && <NewColumn setColumn={setColumn} />}
        {taskShow && (
          <Task
            selectedTask={selectedTask}
            setTaskShow={setTaskShow}
            setEditTask={setEditTask}
          />
        )}
        {editTask && (
          <EditTask setEditTask={setEditTask} selectedTask={selectedTask} />
        )}
        {hideSide && (
          <div className='reverseHide' onClick={() => setHideSide(false)}>
            <svg width='16' height='11' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z'
                fill='#FFF'
              />
            </svg>
          </div>
        )}
        {columns.map((item, index) => {
          const { id, name, tasks } = item
          return (
            <article className='boardColumn' key={id}>
              <span>
                <div style={{ backgroundColor: `var(--circle${index})` }}></div>
                <p>
                  {name} ({tasks.length})
                </p>
              </span>
              <ul
                className={`${tasks.length < 1 ? 'emptyColumn' : 'undefined'}`}
              >
                {tasks.map((task) => {
                  const { id, title, subtasks } = task
                  let len = subtasks.length

                  let com = 0
                  subtasks.forEach((sub) => {
                    const { isCompleted } = sub
                    if (isCompleted) com++
                  })
                  return (
                    <li
                      style={{
                        backgroundColor: !dark ? 'white' : '',
                        color: !dark ? 'black' : '',
                        border: !dark ? '1px solid var(--second)' : '',
                      }}
                      onClick={() => {
                        setTaskShow(true)
                        setSelectedTask(task)
                      }}
                      key={id}
                    >
                      {title}
                      <p>{`${com} of ${len} subtasks`}</p>
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
        <article className='boardColumn' key={id}>
          <span></span>
          <ul onClick={() => setColumn(true)} className='addNewColumn'>
            + New Column
          </ul>
        </article>
      </section>
    </>
  )
}

export default Board

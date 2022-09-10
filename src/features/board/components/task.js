import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editTask, deleteTask } from '../boardSlice'
import { UseAppContext } from '../../../context'
import useCloseEscape from './useCloseEscape'
import CustomDrop from './customDrop'
function Task({ selectedTask, setTaskShow, setEditTask }) {
  const { selected, dark } = UseAppContext()
  const boards = useSelector((state) => state.boards)
  let theOne
  boards.forEach((item) => {
    if (item.name === selected) {
      theOne = { ...item }
    }
  })
  const form = useRef(null)
  const ddelete = useRef(null)
  const dioper = useRef()
  const drop = useRef()
  const [toggle, setToggle] = useState(false)
  const [status, setStatus] = useState({
    status: selectedTask.status,
    statusId: selectedTask.statusId,
  })
  const [prevStatus, setPrevStatus] = useState(selectedTask.status)
  const [subtasks, setSubTasks] = useState(selectedTask.subtasks)
  const [sure, setSure] = useState(false)
  const { id, title, description } = selectedTask
  let com = 0
  let len = subtasks.length
  const dispatch = useDispatch()
  subtasks.forEach((item) => {
    if (item.isCompleted) {
      com++
    }
  })
  let close = useCloseEscape()

  useEffect(() => {
    if (close) {
      setTaskShow(false)
    }
  }, [close])
  const handleDelete = () => {
    // to delete task, we need {selected,status,id}
    dispatch(deleteTask({ selected, status: status.status, id }))
    setTaskShow(false)
    // if (len === 1) {
    //   setSelected('NO BOARD FOUND')
    // } else if ((indeed === 0) & (len > 1)) {
    //   setSelected(boards[1].name)
    // } else {
    //   setSelected(boards[0].name)
    // }
  }
  const unShow = (e) => {
    if (!form.current.contains(e.target)) {
      setTaskShow(false)
    }
  }

  const checkIt = (e) => {
    if (toggle) {
      if (
        !drop.current.contains(e.target) &&
        !dioper.current.contains(e.target)
      ) {
        setToggle(false)
      }
    }
  }
  useEffect(() => {
    window.addEventListener('click', checkIt)
    return () => window.removeEventListener('click', checkIt)
  }, [toggle])

  useEffect(() => {
    callDispatch()
    setPrevStatus(status.status)
  }, [subtasks, status])
  //// to dispatch and action, edit task and delete task
  //edit board, when edit board is initiated, give it the specific board to edit, then give it an order to appear, then disappear
  // thus edit board should be in board, yes
  //prevStatus
  const callDispatch = () => {
    dispatch(
      editTask({
        prevStatus,
        id,
        selected,
        ...status,
        title,
        description,
        tasks: subtasks,
      })
    )
  }
  return (
    <>
      {sure && (
        <div
          onClick={(e) => {
            if (!ddelete.current.contains(e.target)) {
              setSure(false)
            }
          }}
          className='confirmDelete'
        >
          <article ref={ddelete}>
            <h3>Delete this task?</h3>
            <p>
              Are you sure you want to delete the '{`${title}`}' task? This
              action will remove all columns and tasks and cannot be reversed.
            </p>
            <div>
              <button
                onClick={() => {
                  setSure(false)
                  handleDelete()
                }}
              >
                delete
              </button>
              <button
                onClick={() => {
                  setSure(false)
                }}
              >
                cancel
              </button>
            </div>
          </article>
        </div>
      )}
      <div
        style={{ display: sure ? 'none' : '' }}
        onClick={unShow}
        className='modalOverlay'
      >
        <section ref={form} className='selectedTask'>
          <div>
            <h3>{title}</h3>
            <button
              ref={dioper}
              onClick={() => setToggle(!toggle)}
              className={!dark ? 'editDelet editDeletWhite' : 'editDelet'}
            >
              <svg width='5' height='20' xmlns='http://www.w3.org/2000/svg'>
                <g fill='#828FA3' fillRule='evenodd'>
                  <circle cx='2.308' cy='2.308' r='2.308' />
                  <circle cx='2.308' cy='10' r='2.308' />
                  <circle cx='2.308' cy='17.692' r='2.308' />
                </g>
              </svg>
            </button>
            {toggle && (
              <span
                style={{ backgroundColor: !dark ? 'white' : '' }}
                className='spanishBtns'
                ref={drop}
              >
                <button
                  onClick={() => {
                    setEditTask(true)
                    setTaskShow(false)
                    setToggle(false)
                  }}
                >
                  edit task
                </button>
                <button
                  onClick={() => {
                    setSure(true)
                    setToggle(false)
                  }}
                >
                  delete task
                </button>
              </span>
            )}
          </div>
          <p> {description ? description : 'No description'}</p>
          <ul>
            <h5>
              Subtasks ({com || 0} of {len})
            </h5>
            {subtasks.map((sub, index) => {
              let { title, isCompleted } = sub
              return (
                <li
                  onClick={() => {
                    setSubTasks((old) => {
                      let newRr = old.map((item) => {
                        return { ...item }
                      })

                      newRr[index].isCompleted = !newRr[index].isCompleted
                      return newRr
                    })
                  }}
                  key={index}
                >
                  <label htmlFor='checkTask'>
                    <input
                      type='checkbox'
                      checked={isCompleted}
                      onChange={() => {}}
                      name='checkTask'
                      id='checkTask'
                    />
                  </label>
                  <span className={isCompleted ? 'completedSubT' : ''}>
                    {title}
                  </span>
                </li>
              )
            })}
          </ul>
          <CustomDrop
            arrcat={theOne.columns}
            varia={status}
            setVaria={setStatus}
            label={'Current Status'}
          />
        </section>
      </div>
    </>
  )
}

export default Task

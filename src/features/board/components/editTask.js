import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editTask } from '../boardSlice'

import { UseAppContext } from '../../../context'
import CustomDrop from './customDrop'
import { useEffect } from 'react'
function EditTask({ setEditTask, selectedTask }) {
  const { selected } = UseAppContext()
  const boards = useSelector((state) => state.boards)
  let theOne
  boards.forEach((item) => {
    if (item.name === selected) {
      theOne = { ...item }
    }
  })
  const [currnent, setCurrent] = useState(() => {
    let nner
    theOne.columns.forEach((item) => {
      item.tasks.find((task) => {
        if (task.id === selectedTask.id) {
          return (nner = task)
        }
      })
    })
    return nner
  })
  const { id, subtasks } = currnent

  const form = useRef(null)
  const [tasks, setTasks] = useState(subtasks)
  const [entries, setEntries] = useState({
    title: currnent.title,
    desc: currnent.description,
  })
  const [usedBoard, setUsedBoard] = useState('trial')

  const [used, setUsed] = useState(() => {
    let alig = []
    subtasks.forEach((item) => {
      alig.push('trial')
    })
    return alig
  })
  const [status, setStatus] = useState({
    status: currnent.status,
    statusId: currnent.statusId,
  })
  const unShow = (e) => {
    if (!form.current.contains(e.target)) {
      setEditTask(false)
    }
  }

  const dispatch = useDispatch()
  useEffect(() => {
    theOne.columns.forEach((item) => {
      item.tasks.find((task) => {
        if (task.id === id) {
          setCurrent(task)
        }
      })
    })
  }, [theOne])
  const handleSubmit = (e) => {
    e.preventDefault()
    let proceed = true
    let repeatedBoard = false

    if (!entries.title) {
      proceed = false
      setUsedBoard('required')
    }

    let selStatus = theOne.columns.find((col) => col.name === status.status)
    selStatus.tasks.forEach((bord) => {
      if (bord.title === entries.title && id !== bord.id) {
        proceed = false
        repeatedBoard = true
        setUsedBoard('used')
      }
    })

    if (entries.title && usedBoard !== 'trial' && !repeatedBoard) {
      setUsedBoard('trial')
    }
    for (let i = 0; i < tasks.length; i++) {
      let required = false
      if (!tasks[i].title) {
        proceed = false
        required = true
        setUsed((old) => {
          let useds = [...old]
          useds[i] = 'required'
          return useds
        })
      }

      if (!required && used[i] !== 'trial') {
        setUsed((old) => {
          let useds = [...old]
          useds[i] = 'trial'
          return useds
        })
      }
    }

    if (proceed) {
      dispatch(
        editTask({
          prevStatus: currnent.status,
          id,
          selected,
          ...status,
          ...entries,
          tasks,
        })
      )
      setTasks([{ name: '' }])
      setEntries({ title: '', desc: '' })
      setEditTask(false)
    }
  }
  return (
    <div onClick={unShow} className='modalOverlay'>
      <form onSubmit={handleSubmit} ref={form} className='newBoard'>
        <h3>Edit Task</h3>
        <div>
          <label htmlFor='title'>title</label>
          <input
            style={{
              border: usedBoard !== 'trial' ? '2px solid #EA5555' : '',
            }}
            onChange={(e) =>
              setEntries((old) => {
                return { ...old, title: e.target.value }
              })
            }
            value={entries.title}
            type='text'
            id='title'
          />
          {usedBoard !== 'trial' && (
            <span className='dangerSpan'>{usedBoard}</span>
          )}
        </div>
        <div>
          <label htmlFor='Description'>Description</label>
          <textarea
            onChange={(e) =>
              setEntries((old) => {
                return { ...old, desc: e.target.value }
              })
            }
            value={entries.desc}
            type='text'
            id='Description'
          />
        </div>
        <div className='subtasksContainer'>
          <label htmlFor='Subtasks'>Subtasks</label>
          {tasks.map((item, term) => {
            return (
              <div key={term}>
                <label className='spanerContainer'>
                  {' '}
                  <input
                    style={{
                      border: used[term] !== 'trial' ? '2px solid #EA5555' : '',
                    }}
                    onChange={(e) => {
                      setTasks((old) => {
                        let newCol = old.map((item) => {
                          return { ...item }
                        })
                        newCol.forEach((rero, ind) => {
                          if (ind === term) {
                            rero.title = e.target.value
                          }
                        })
                        return newCol
                      })
                    }}
                    value={item.title}
                    type='text'
                    id='Columns'
                  />
                  {used[term] !== 'trial' && (
                    <span className='dangerSpan'>{used[term]}</span>
                  )}
                </label>

                {term !== 0 && (
                  <span
                    onClick={() => {
                      setTasks(() => {
                        return tasks.filter((cul, ind) => ind !== term)
                      })
                      setUsed((sero) => {
                        return used.filter((cul, ind) => ind !== term)
                      })
                    }}
                    className='deleteColIn'
                  >
                    <svg
                      width='15'
                      height='15'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g fill='#828FA3' fillRule='evenodd'>
                        <path d='m12.728 0 2.122 2.122L2.122 14.85 0 12.728z' />
                        <path d='M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z' />
                      </g>
                    </svg>
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {tasks.length < 6 && (
          <button
            onClick={(e) => {
              e.preventDefault()
              if (tasks.length <= 5) {
                setTasks(() => {
                  return [...tasks, { title: '', isCompleted: false }]
                })
                setUsed((old) => {
                  return [...old, 'trial']
                })
              }
            }}
          >
            +add new Subtask
          </button>
        )}
        <CustomDrop
          varia={status}
          setVaria={setStatus}
          arrcat={theOne.columns}
          label={'status'}
        />
        <button className='submitTask' type='submit'>
          edit task
        </button>
      </form>
    </div>
  )
}

export default EditTask

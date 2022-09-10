import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editBoard } from './boardSlice'
import { UseAppContext } from '../../context'
import useCloseEscape from './components/useCloseEscape'
function EditBoard({ setBoardShow }) {
  const { setSelected, selected } = UseAppContext()
  const boards = useSelector((state) => state.boards)

  let theOne
  boards.forEach((item) => {
    if (item.name === selected) {
      theOne = { ...item }
    }
  })
  const form = useRef(null)
  const [name, setName] = useState(theOne.name)
  const [columns, setCloumns] = useState(theOne.columns)
  const [used, setUsed] = useState(() => {
    let alig = []
    theOne.columns.forEach((item) => {
      alig.push('trial')
    })
    return alig
  })
  const [usedBoard, setUsedBoard] = useState('trial')
  let close = useCloseEscape()

  useEffect(() => {
    if (close) {
      setBoardShow(false)
    }
  }, [close])
  const handleSubmit = (e) => {
    e.preventDefault()
    let proceed = true
    let repeatedBoard = false

    if (!name) {
      proceed = false
      setUsedBoard('required')
    }
    boards.forEach((bord) => {
      if (bord.name === name && bord.id !== theOne.id) {
        proceed = false
        repeatedBoard = true
        setUsedBoard('used')
      }
    })

    if (name && usedBoard !== 'trial' && !repeatedBoard) {
      setUsedBoard('trial')
    }
    for (let i = 0; i < columns.length; i++) {
      let repeated = false
      let required = false
      if (!columns[i].name) {
        proceed = false
        required = true
        setUsed((old) => {
          let useds = [...old]
          useds[i] = 'required'
          return useds
        })
      }

      if (!required) {
        for (let y = 0; y < i; y++) {
          if (columns[i].name === columns[y].name && i !== y) {
            proceed = false
            repeated = true
            setUsed((old) => {
              let useds = [...old]
              useds[i] = 'used'
              return useds
            })
          }
        }
      }

      if (!repeated && !required && used[i] !== 'trial') {
        setUsed((old) => {
          let useds = [...old]
          useds[i] = 'trial'
          return useds
        })
      }
    }

    if (proceed) {
      setSelected(name)
      dispatch(editBoard({ id: theOne.id, name, columns }))
      setCloumns([{ name: '' }])
      setName('')
      setBoardShow(false)
    }
  }
  const dispatch = useDispatch()

  const unShow = (e) => {
    if (!form.current.contains(e.target)) {
      setBoardShow(false)
    }
  }
  return (
    <div onClick={unShow} className='modalOverlay'>
      <form onSubmit={handleSubmit} ref={form} className='newBoard'>
        <h3>Add New Board</h3>
        <div>
          <label htmlFor='name'>name</label>
          <input
            style={{
              border: usedBoard !== 'trial' ? '2px solid #EA5555' : '',
            }}
            onChange={(e) => setName(e.target.value)}
            value={name}
            type='text'
            id='name'
          />
          {usedBoard !== 'trial' && (
            <span className='dangerSpan'>{usedBoard}</span>
          )}
        </div>
        <div>
          <label htmlFor='Columns'>Columns</label>
          {columns.map((item, term) => {
            return (
              <div key={term}>
                <label className='spanerContainer'>
                  {' '}
                  <input
                    style={{
                      border: used[term] !== 'trial' ? '2px solid #EA5555' : '',
                    }}
                    onChange={(e) => {
                      setCloumns((old) => {
                        let newCol = old.map((item) => {
                          return { ...item }
                        })
                        newCol.forEach((rero, ind) => {
                          if (ind === term) {
                            rero.name = e.target.value
                          }
                        })
                        return newCol
                      })
                    }}
                    value={item.name}
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
                      setCloumns(() => {
                        return columns.filter((cul, ind) => {
                          if (ind !== term) {
                            return cul
                          }
                        })
                      })
                      setUsed((sero) => {
                        return used.filter((cul, ind) => {
                          if (ind !== term) {
                            return cul
                          }
                        })
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

        {columns.length < 6 && (
          <button
            onClick={(e) => {
              e.preventDefault()
              if (columns.length <= 5) {
                setCloumns(() => {
                  return [...columns, { name: '' }]
                })
                setUsed((old) => {
                  return [...old, 'trial']
                })
              }
            }}
          >
            +add new column
          </button>
        )}
        <button type='submit'>save changes</button>
      </form>
    </div>
  )
}

export default EditBoard

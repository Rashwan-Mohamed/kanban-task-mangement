import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditBoard from './editBoard'
import NewTask from './components/newTask'
import { deleteBoard } from './boardSlice'
import { UseAppContext } from '../../context'

const Header = ({ selectBord, setSelectBord }) => {
  const { selected, setSelected, dark, tab } = UseAppContext()
  const [toggle, setToggle] = useState(false)
  const [boardShow, setBoardShow] = useState(false)
  const [taskShow, setTaskShow] = useState(false)
  const [sure, setSure] = useState(false)
  const drop = useRef()
  const dioper = useRef()
  const ddelete = useRef(null)

  const dispatch = useDispatch()
  const boards = useSelector((state) => {
    return state.boards
  })
  let len = boards.length
  let indeed

  boards.forEach((item, index) => {
    if (item.name === selected) {
      return (indeed = index)
    }
  })
  const handleDelete = () => {
    dispatch(deleteBoard({ name: selected }))
    setToggle(false)
    if (len === 1) {
      setSelected('NO BOARD FOUND')
    } else if ((indeed === 0) & (len > 1)) {
      setSelected(boards[1].name)
    } else {
      setSelected(boards[0].name)
    }
  }

  const unShow = (e) => {
    if (!ddelete.current.contains(e.target)) {
      setSure(false)
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
  return (
    <>
      <header
        style={{
          backgroundColor: !dark ? 'white' : '',
          borderBottom: !dark ? '1px solid var(--second)' : '',
        }}
        className='header'
      >
        {sure && (
          <div onClick={unShow} className='confirmDelete'>
            <article ref={ddelete}>
              <h3>Delete this board?</h3>
              <p>
                Are you sure you want to delete the '{`${selected}`}' board?
                This action will remove all columns and tasks and cannot be
                reversed.
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
        {boardShow && <EditBoard setBoardShow={setBoardShow} />}{' '}
        {taskShow && <NewTask setTaskShow={setTaskShow} />}{' '}
        {!tab && (
          <picture
            style={{
              backgroundColor: !dark ? 'white' : '',
              borderRight: !dark ? '1px solid var(--second)' : '',
            }}
            className='logo-container'
          >
            {dark ? (
              <img src='assets/logo-light.svg' alt='' />
            ) : (
              <img src='assets/logo-dark.svg' alt='' />
            )}
          </picture>
        )}
        <div className='header-body'>
          <h1
            style={{
              color: !dark ? 'black ' : '',
            }}
            onClick={() => {
              setSelectBord(!selectBord)
            }}
          >
            {tab && <img src='assets/logo-mobile.svg' alt='' />}{' '}
            {selected || 'no boards'}
            <span>
              <svg
                style={{ transform: selectBord ? 'rotate(180deg)' : '' }}
                width='10'
                height='7'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  stroke='#635FC7'
                  stroke-width='2'
                  fill='none'
                  d='m1 1 4 4 4-4'
                />
              </svg>
            </span>
          </h1>
          {boards.length > 0 && (
            <div className='header-btns'>
              <button onClick={() => setTaskShow(true)} className='addNewTask'>
                {tab ? (
                  <svg
                    width='12'
                    height='12'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fill='#FFF'
                      d='M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z'
                    />
                  </svg>
                ) : (
                  '+ add new task'
                )}
              </button>
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
                  ref={drop}
                >
                  <button
                    onClick={() => {
                      setBoardShow(true)
                      setToggle(false)
                    }}
                  >
                    edit board
                  </button>
                  <button
                    onClick={() => {
                      setSure(true)
                      setToggle(false)
                    }}
                  >
                    delete board
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header

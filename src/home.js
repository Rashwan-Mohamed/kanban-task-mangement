import Board from './features/board/board'
import Header from './features/board/header'
import Aside from './features/board/aside'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UseAppContext } from './context'
import useCloseEscape from './features/board/components/useCloseEscape'
function Home() {
  const { dark, tab } = UseAppContext()
  const [selectBord, setSelectBord] = useState(false)
  const form = useRef(null)
  let close = useCloseEscape()

  useEffect(() => {
    if (close) {
      setSelectBord(false)
    }
  }, [close])
  const unShow = (e) => {
    if (!form.current.contains(e.target)) {
      setSelectBord(false)
    }
  }
  return (
    <main className={!dark ? 'whiteMain' : ''}>
      <Header selectBord={selectBord} setSelectBord={setSelectBord} />
      {!tab && <Aside />}
      {tab && selectBord ? (
        <div onClick={unShow} className='modalOverlay'>
          {<Aside setSelectBord={setSelectBord} erre={form} />}
        </div>
      ) : (
        ''
      )}
      <Board />
    </main>
  )
}

export default Home

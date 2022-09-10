import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const AppContext = createContext(undefined)

function AppContextProvider({ children }) {
  const [dark, setDark] = useState(true)
  const [tab, setTab] = useState()
  const boards = useSelector((state) => {
    return state.boards
  })
  const [selected, setSelected] = useState(() => {
    if (boards[0].name) return boards[0].name
    else return 'noBoard'
  })

  const checkTab = () => {
    if (window.innerWidth <= 768) {
      setTab(true)
    } else {
      setTab(false)
    }
  }
  useEffect(() => {
    checkTab()
    window.addEventListener('resize', checkTab)

    return () => window.removeEventListener('resize', checkTab)
  }, [])
  const [hideSide, setHideSide] = useState(false)
  let board = boards.find((item) => item.name === selected)
  return (
    <AppContext.Provider
      value={{
        selected,
        setSelected,
        dark,
        setDark,
        board,
        hideSide,
        setHideSide,
        tab,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const UseAppContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppContextProvider }

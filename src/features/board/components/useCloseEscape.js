import React, { useEffect, useState } from 'react'


function useCloseEscape() {
  const [close, setClose] = useState(false)
  const checkEscape = (event) => {
    let code = event.key
    if (code === 'Escape') {
        setClose(true)
    } else {
      setClose(false)
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', checkEscape)

    return () => window.removeEventListener('keydown', checkEscape)
  }, [])
  return close
}

export default useCloseEscape

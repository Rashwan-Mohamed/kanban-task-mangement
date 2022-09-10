import React, { useState, useEffect, useRef } from 'react'

function CustomDrop({ arrcat, varia, setVaria,label }) {
  const [show, setShow] = useState(false)
  const select = useRef(null)
  useEffect(() => {
    const closeIt = (e) => {
      if (!select.current.contains(e.target) && show === true) {
        setShow(false)
      }
    }
    window.addEventListener('click', closeIt)

    return () => {
      window.removeEventListener('click', closeIt)
    }
  }, [show])
  return (
    <div className='choosecat'>
      <h5>{label}</h5>
      <section
        ref={select}
        onClick={(e) => {
          setShow(!show)
        }}
        className='select-option'
        name=''
        id=''
      >
        <input value={varia.status} readOnly type='text' />
        <span>
          {' '}
          <svg
            style={{ transform: show ? 'rotate(180deg)' : '' }}
            width='10'
            height='7'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              stroke='#635FC7'
              strokeWidth='2'
              fill='none'
              d='m1 1 4 4 4-4'
            />
          </svg>
        </span>

        {show && (
          <div>
            {' '}
            {arrcat.map((item, index) => {
              const { name, id } = item
              return (
                <div
                  onClick={() => {
                    setVaria({ status: name, statusId: id })
                    setShow(false)
                  }}
                  key={index}
                >
                  {name}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default CustomDrop

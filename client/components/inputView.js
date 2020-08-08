import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'
import { history } from '../redux'

const InputView = () => {
  const [searchUser, setSearchUser] = useState('')
  const [searchable, setSearchable] = useState(false)
  const [projList, setProjList] = useState([])
  const onChange = (e) => {
    setSearchUser(e.target.value)
  }

  useEffect(() => {
    if (searchUser.length > 0 && searchUser.length < 39) {
      axios.get(`https://api.github.com/users/${searchUser}`).then((it) => {
        const response = it.data
        if (response.message !== 'Not Found') {
          setSearchable(true)
          axios.get(`https://api.github.com/users/${searchUser}/repos`).then((res) => {
            setProjList(res.data)
          })
        } else {
          setSearchable(false)
        }
      })
    }
    return () => {}
  })

  return (
    <div className="rounded-md p-4 mt-6 bg-blue-100 max-w-screen-sm mx-auto mb-6">
      <div className="font-bold">Please type or paste a valid github username</div>
      <input
        className="w-56 border-gray-400 border-2 p-1 rounded-l-md"
        type="text"
        id="input-field"
        value={searchUser}
        onChange={onChange}
      />

      {searchable && (
        <button
          className="border-gray-600 hover:border-green-700 bg-green-200 hover:bg-gray-900 hover:text-white text-gray-700 rounded-r-md border-2 py-1 px-4"
          type="button"
          onClick={() => {
            history.push(`/${searchUser}`)
          }}
        >
          Search User
        </button>
      )}
      <div className={searchable ? 'text-green-500' : 'text-red-500'}>
        User <b>{searchUser} </b>
        is a valid username: {searchable ? 'YES' : 'NO'}
      </div>
      <div className={projList.length > 0 ? 'text-green-500' : 'text-red-500'}>
        Repositories available: {projList.length}
      </div>
    </div>
  )
}

InputView.propTypes = {}

export default React.memo(InputView)

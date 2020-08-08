import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMardown from 'react-markdown'
import axios from 'axios'
import Header from './header'

const RepositoryView = () => {
  const { userName, repositoryName } = useParams()
  const [description, setDescription] = useState('')

  const url = `https://raw.githubusercontent.com/${userName}/${repositoryName}/master/README.md`

  useEffect(() => {
    axios.get(url).then((it) => {
      setDescription(it.data)
    })
    return () => {}
  })

  return (
    <div>
      <Header />
      <div className="rounded-md p-4 mt-6 bg-blue-100 max-w-screen-sm mx-auto mb-6">
        <div id="description">
          <ReactMardown source={description} escapeHtml={false} />
        </div>
      </div>
    </div>
  )
}

RepositoryView.propTypes = {}

export default React.memo(RepositoryView)

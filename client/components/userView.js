import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const ProjectList = (props) => {
  useEffect(() => {
    return () => {}
  }, [])
  return (
    <div className="rounded-md p-4 mt-6 bg-blue-100 max-w-screen-sm mx-auto mb-6">
      <div className="bg-white rounded-t-md border border-gray-200 p-2">
        Username: {props.userName}
      </div>
      <div className="bg-white rounded-b-md border border-gray-200 p-2 mb-4">
        Repositories found: {props.projectList.length}
      </div>

      {props.projectList.map((sortedProj, idx) => {
        const point = idx + 1
        return (
          <div className="p-1 bg-white flex" key={sortedProj.name}>
            <div className="text-white bg-blue-500 text-center w-6 rounded">{point}</div>
            <div className="ml-2">
              <Link
                id="go-back"
                className="border-2 border-blue-500 test-blue-500 py-1 px-2 rounded-md text-blue-500 bg-white hover:bg-blue-500 hover:text-white"
                to={{ pathname: `/${props.userName}/${sortedProj.name}` }}
              >
                {sortedProj.name}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const UserView = () => {
  const { userName } = useParams()
  const [projectList, setprojectList] = useState([])
  useEffect(() => {
    axios.get(`https://api.github.com/users/${userName}/repos`).then((it) => {
      setprojectList(it.data)
    })
    return () => {}
  })

  return (
    <div>
      <ProjectList projectList={projectList} userName={userName} />
    </div>
  )
}

UserView.propTypes = {}

export default React.memo(UserView)

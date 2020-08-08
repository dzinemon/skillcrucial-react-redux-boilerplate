import React from 'react'
import { Link, useParams } from 'react-router-dom'

// import { history } from '../redux'

const Header = () => {
  const { userName, repositoryName } = useParams()
  const backLink = userName && repositoryName ? `/${userName}` : `/`

  // const handleGoBack = () => history.push(`/${backLink}`)

  return (
    <div className="rounded-md p-4 mt-6 bg-blue-100 max-w-screen-sm mx-auto mb-6">
      <u className="text-xl text-blue-500">Header</u>
      <div>URL Parameters:</div>
      <div>
        userName: <u id="repository-name">{userName}</u> is a <i>{typeof userName}</i>
      </div>
      <div>
        repositoryName: <u id="repository-name">{repositoryName}</u> is a
        <i> {typeof repositoryName} </i>
      </div>
      {/* <button
        id="go-back"
        className="border-2 border-blue-500 test-blue-500 py-1 px-2 rounded-md text-blue-500 bg-white hover:bg-blue-500 hover:text-white"
        onClick={handleGoBack()}
        type="button"
      >
        ⬅ Go Back
      </button> */}
      <hr />
      <Link
        id="go-back"
        className="border-2 border-blue-500 test-blue-500 py-1 px-2 rounded-md text-blue-500 bg-white hover:bg-blue-500 hover:text-white"
        to={`${backLink}`}
      >
        ⬅ Go Back
      </Link>
    </div>
  )
}

Header.propTypes = {}

export default React.memo(Header)

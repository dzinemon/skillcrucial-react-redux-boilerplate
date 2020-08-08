import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Head from './head'
import RepositoryView from './repositoryView'
import UserView from './userView'
import InputView from './inputView'
import Header from './header'

const Home = () => {

  return (
    <div>
      <Head title="Hello" />
      <Switch>
        <Route path="/:userName/:repositoryName">
          <RepositoryView />
        </Route>
        <Route path="/:userName">
          <Header />
          <UserView />
        </Route>
        <Route path="/">
          <InputView />
        </Route>
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home

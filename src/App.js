import React from "react";
import Layout from "./components/Layout/Layout";
import InnerLayout from "./components/Layout/InnerLayout";
import { Route, Switch, Redirect } from "react-router-dom";
import ProfilePage from "./components/Profile/ProfilePage";
import Home from "./components/home/Home";
import style from "./index.css"
import Animals from "./components/Animals/Animals"
import Swipe from "./components/Swipe/Swipe"
import AddAnimal from "./components/Animals/AddAnimal/AddAnimal";

const App = () => {
  return (
      <div id="App" className={style.lighttheme}>
        <Layout>
          <Switch>
            <Route path={["/add", "/profile", "/other", "/animals"]}>
              <InnerLayout>
                <Route path="/choose" component={Swipe} animalType={"dogs"}/>
                <Route path="/choose" component={Swipe} />
                <Route path="/choose" component={Swipe} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/animals" component={Animals} />
                <Route path="/add" component={AddAnimal} />
              </InnerLayout>
            </Route>
            <Route path="/home" component={Home} />
            <Redirect from="/" exact to="/home" />
          </Switch>
        </Layout>
      </div>
  );
}

export default App;

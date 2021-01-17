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
            <Route path={["/add", "/profile", "/others", "/animals", "/dogs", "/cats"]}>
              <InnerLayout>
                <Route path="/dogs" render={(props) => <Swipe animalType="dogs" {...props} /> }/>
                <Route path="/cats" render={(props) => <Swipe animalType="cats" {...props} /> }/>
                <Route path="/others" render={(props) => <Swipe animalType="others" {...props} /> }/>
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

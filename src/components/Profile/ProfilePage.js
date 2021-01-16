import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Profile from "./Profile";
import ProfileInfo from "./ProfileInfo";
import profileImage from "../../assets/images/babyface.jpg";
import Grid from "./grid/Grid";

function ProfilePage() {
  return (
    <Profile>
      <Switch>
        <Redirect from="/profile" exact to="/profile/zakladni" />
        <Route
          path="/profile/zakladni"
          component={(props) => (
            <ProfileInfo
              user={{
                image: profileImage,
                name: "Jan Novak",
                street: "Humpolecka 11",
                city: "Liberec",
              }}
              {...props}
            />
          )}
        />
        <Route path="/profile/2" component={Grid} />
      </Switch>
    </Profile>
  );
}

export default ProfilePage;

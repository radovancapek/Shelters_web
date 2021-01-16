import React from "react";
import Contacts from "./Contacts";
import { Route, Switch, Redirect } from "react-router-dom";
import Employees from "./Employees/Employees";
import BasicContacts from "./BasicContacts";

function ContactsPage() {
  return (
    <Contacts>
      <Switch>
        <Redirect from="/kontakty" exact to="/kontakty/zakladni" />
        <Route path="/kontakty/zakladni" component={BasicContacts} />
        <Route path="/kontakty/zamestnanci" component={Employees} />
      </Switch>
    </Contacts>
  );
}

export default ContactsPage;

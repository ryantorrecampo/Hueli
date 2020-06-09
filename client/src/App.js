import React, { useEffect } from "react";
import { setGlobal, useGlobal } from "reactn";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "style.css";
import "tailwindcss/dist/base.css";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import Signup from "components/forms/Signup";
import Signin from "components/forms/Signin";
import Test from "components/blogs/GridWithFeaturedPost";
import jwt from "jwt-decode";

const AuthenticatedRoute = ({ component: C, appProps, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

function App() {
  const [userID, setUserID] = useGlobal("userID");

  useEffect(() => {
    const token = jwt(localStorage.getItem("token"));
    setUserID(token.user.id);
    console.log("ID: " + userID);
  }, [userID]);

  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <AnimationRevealPage>
            <Signup />
          </AnimationRevealPage>
        </Route>
        <Route path="/signin">
          <AnimationRevealPage>
            <Signin />
          </AnimationRevealPage>
        </Route>
        <AuthenticatedRoute path="/test" component={Test} />
      </Switch>
    </Router>
  );
}

export default App;

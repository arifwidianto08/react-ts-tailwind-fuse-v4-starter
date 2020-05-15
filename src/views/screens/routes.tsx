import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { BottomNavigation } from "../components";

const SignIn = React.lazy(() =>
  import("./public").then(({ SignInScreen }) => ({
    default: SignInScreen,
  }))
);

const Home = React.lazy(() =>
  import("./private").then(({ HomeScreen }) => ({
    default: HomeScreen,
  }))
);

const Transaction = React.lazy(() =>
  import("./private").then(({ Transaction }) => ({
    default: Transaction,
  }))
);

const PublicRoutes = () => (
  <Switch>
    <Route path="/" component={SignIn} exact />
  </Switch>
);

const PrivateRoutes = () => (
  <React.Fragment>
    <Switch>
      <Route path="/" component={() => <Redirect to="/home" />} exact />
      <Route path="/home" component={Home} exact />
      <Route path="/transaction" component={Transaction} exact />
    </Switch>
    <BottomNavigation />
  </React.Fragment>
);

export function Routes() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const creds = localStorage.getItem("creds");
    if (creds) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center box-border">
          <p>Loading...</p>
        </div>
      }
    >
      <BrowserRouter>
        {authorized ? <PrivateRoutes /> : <PublicRoutes />}
      </BrowserRouter>
    </Suspense>
  );
}

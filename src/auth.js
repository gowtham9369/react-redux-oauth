import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as LoginAction from "./action/loginAction";

const GoogleAuth = ({ dispatch, isSignedIn, userId }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const params = {
      clientId:
        "826472186849-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
      scope: "email",
    };
    // created new branch on local but on origin i will push to master
    // created new branch on local and push to same branch
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init(params).then(() => {
        setAuth(window.gapi.auth2.getAuthInstance());
        onAuthChange(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(onAuthChange);
      });
    });
  });

  // now will create a new branch on origin and push to that branch and merge in github

  const onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      dispatch(
        LoginAction.signIn(
          window.gapi.auth2.getAuthInstance().currentUser.get().getId()
        )
      );
    } else {
      dispatch(LoginAction.signOut());
    }
  };

  const onSignInClick = () => {
    auth.signIn();
  };

  const onSignOutClick = () => {
    auth.signOut();
  };

  const renderAuthButton = () => {
    if (isSignedIn === null) {
      return null;
    } else if (isSignedIn) {
      return (
        <div>
          <span>{userId}</span>
          <button onClick={onSignOutClick}>Signout</button>
        </div>
      );
    } else {
      return <button onClick={onSignInClick}>Sign In with Google</button>;
    }
  };

  return <div>{renderAuthButton()}</div>;
};

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn, userId: state.auth.userId };
};

export default connect(mapStateToProps)(GoogleAuth);

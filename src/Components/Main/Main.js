import React from "react";
import axios from "axios";

import styles from "./Main.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { isLogin } from "../../redux/actions/isLogin";
import {
  emailChangeClear,
  emailChangeHandler
} from "../../redux/actions/emailChangeAction";
import {
  passChangeClear,
  passChangeHandler
} from "../../redux/actions/passChangeAction";
import {
  successfulRegistration,
  successfulRegistrationClear
} from "../../redux/actions/registrationSuccessfulActions";

const Main = props => {
  const credentials = {
    email: props.emailChange,
    password: props.passChange,
    withCredentials: true
  };

  const proceedToTests = () => {
    axios
      .post("https://student-tests.goit.co.ua/api/users/login", credentials)
      .then(result => result.status === 200 && result.data)
      .then(result => localStorage.setItem("token", result.token))
      .then(() => props.loginHandler())
      .then(() => props.emailChangeClearFunc())
      .then(() => props.passChangeClearFunc())
      .then(() => props.successfulRegistrationClearFunc())
      .catch(err => console.log(err));
  };

  return (
    <div className={styles.background}>
      <div className={styles.main__container}>
        <section className={styles.section}>
          <h1 className={styles.title}>Проверь свои знания Front End</h1>
          <p className={styles.sub__title}>
            Здравствуйте, дорогие студенты, надеемся что, тесты GoIT не только
            принесут вам пользу и знания, но и множество эмоций, и удовольствия
            от их прохождения!
          </p>
        </section>
      </div>
      {props.successfulRegistration && proceedToTests() && (
        <Redirect to="/tests" />
      )}
    </div>
  );
};

function MSTP(state) {
  return {
    emailChange: state.emailChange,
    passChange: state.passChange,
    successfulRegistration: state.successfulRegistration
  };
}

function MDTP(dispatch) {
  return {
    emailChangeHandler: function(value) {
      dispatch(emailChangeHandler(value));
    },
    passChangeHandler: function(value) {
      dispatch(passChangeHandler(value));
    },

    emailChangeClearFunc: function() {
      dispatch(emailChangeClear());
    },
    passChangeClearFunc: function() {
      dispatch(passChangeClear());
    },
    successfulRegistrationFunc: () => dispatch(successfulRegistration()),
    successfulRegistrationClearFunc: () =>
      dispatch(successfulRegistrationClear()),
    loginHandler: () => dispatch(isLogin())
  };
}

export default connect(
  MSTP,
  MDTP
)(Main);

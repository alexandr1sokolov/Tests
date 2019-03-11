import React,{Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import axios from 'axios';

import Result from '../../Components/Result/Result';
import TestCard from '../TestCard/TestCard';
import MessageBox from "../MessageBox/MessageBox";

import {setTestIsReady, unsetTestIsReady} from '../../redux/actions/testIsReadyActions';
import {dataResult} from '../../redux/actions/actionDataResults';
import {checkUser, getUserAuthHeader, getUserId} from '../../helpers/userValidation';
import {addCurrentAnswers} from "../../redux/actions/currentAnswerActions";
import {setSelectedTest, unSelectedTest} from "../../redux/actions/selectedTestAction";
import styles from './Test.css';
import {clearMessageText, setMessageText} from "../../redux/actions/messageTextActions";
import {addCurrentCorrectResult} from "../../redux/actions/currentCorrectResultActions";
import {fetchModulesDataAsync} from "../../redux/actions/modulesAction";
import {fetchAllTestsDataAsync} from "../../redux/actions/testsAction";
import {isLogin} from "../../redux/actions/isLogin";


class Test extends Component {

    componentDidMount() {
        console.log("TEST did mount");
        localStorage.getItem('token') !== null && checkUser()
          .then(authResult => authResult === 200 && this.props.isLoginFunc() && true)
          .then(data => data === true && axios.get(`/users/${getUserId()}`, getUserAuthHeader())
            .then(data => this.props.dataResultFunc(data.data.results)))
          .catch(err => console.log(err));

        this.props.loadModulesDataAsync();
        this.props.loadAllTestsDataAsync();
        this.selectTest()

    };

    componentDidUpdate() {
        console.log(" TEST did Update");
        const testIsSelected = Object.keys(this.props.selectedTest).length > 0;
        if (testIsSelected) {
            let correctAnswerData = this.props.selectedTest.questions.map(el => el.rightAnswer);
            this.props.addCurrentCorrectResult(correctAnswerData)
        }
    };

    saveUserTestResultToServer = (persRes) => {
        const dataResults = this.props.dataResults;
        axios.put(`/users/${getUserId()}`, {results: [...dataResults.filter(el => el.testid !== this.persRes.testid), this.persRes]}, getUserAuthHeader())
          .then(user => this.props.dataResult(user.data.results))
          // .then(user => console.log(user))
          .catch(err => console.log(err) )
    };

    offTestIsReady = () => {
        this.props.unsetTestIsReadyFunc();
        this.props.currentAnswer.map((el, i) => addCurrentAnswers(undefined, i));
        this.props.unSelectedTest();
    };

    persRes = {};

    onTestIsReady = () => {
        const testResult = this.props.currentResult.filter(el => el === true).length;
        this.persRes = {
            testid: this.props.selectedTest._id,
            title: this.props.selectedTest.testname,
            totalQuest: 10,
            corAnswers: testResult,
            success: testResult /10  * 100 +'%',
        };

        this.props.setTestIsReadyFunc();
        // dataResult(persRes);
        console.log(this.persRes);
        this.saveUserTestResultToServer(this.persRes)
    };

    checkAnswers = () => {
        const currentAnswer = this.props.currentAnswer;
        currentAnswer.includes(undefined) || currentAnswer.length !== 10
          ? this.props.setMessageTextFunc('Вы не ответили на все вопросы!')
          : this.onTestIsReady();
    };

    selectTest = () => {
        console.log("select test func");
        const selectedTest = this.props.allTests.find(el => el._id === this.props.match.url.split("/")[2]);

        const selectedTestObj = Object.keys(selectedTest).length ? {...selectedTest} : {};
        console.log('selectedTestObj', selectedTestObj);
        this.props.loadSelectedTestFunc(selectedTestObj);
    };

    render() {
        console.log("render test");
        // console.log("location", this.props.location);
        // console.log("history", this.props.history);
        console.log("selected tests check",this.props.selectedTest);
        return (
          <div>
              <div className={styles.test__wrapper}>
                  <div className={styles.test__container}>
                      <header>
                          <h1 className={styles.test__module}>{this.props.selectedTest.module}</h1>
                          <h2 className={styles.test__testname}>{this.props.selectedTest.testname}</h2>
                      </header>
                      <div className={styles.test__content}>
                          {this.props.testIsReady && <Result/>}
                          <div className={styles.test__cards}>
                              {console.log(this.props.selectedTest)}
                              {this.props.selectedTest.questions.map((q, index) =>
                                {
                                    return (
                                      <TestCard
                                        clas={this.props.testIsReady ?
                                          (this.props.currentResult[index]? 2 : 3):
                                          (1)
                                        }
                                        testname={this.props.selectedTest.testname}
                                        index={index}
                                        question={q.question}
                                        answers={q.answers}
                                        key={`${this.props.selectedTest.testname}${index}`}
                                      />)
                                })
                              }
                          </div>
                      </div>
                      {!this.props.testIsReady && (
                        <div className={styles.test__buttons}>
                            <NavLink to="/tests" className={styles.test__btn} onClick={this.offTestIsReady}>ОТМЕНА</NavLink>
                            <button className={styles.test__btn} onClick={this.checkAnswers}>ГОТОВО</button>
                        </div>)
                      }
                      {this.props.messageText && <MessageBox/>}
                  </div>
              </div>
          </div>
        )
    }
}

function MSTP(state) {
    return {
        allTests: state.tests,
        selectedTest: state.selectedTest,
        testIsReady: state.testIsReady,
        currentAnswer: state.currentAnswer,
        currentResult: state.currentResult,
        dataResults: state.dataResults,
        messageText: state.messageText,
    }
}

function MDTP(dispatch) {
    return {
        loadModulesDataAsync: () => dispatch(fetchModulesDataAsync()),
        loadAllTestsDataAsync: () => dispatch(fetchAllTestsDataAsync()),
        isLoginFunc: () => {
            dispatch(isLogin());
            return true
        },
        dataResultFunc: (data)=> dispatch(dataResult(data)),
        loadSelectedTestFunc: (selectedTestObj) => dispatch(setSelectedTest(selectedTestObj)),

        setTestIsReadyFunc: () => dispatch(setTestIsReady()),
        unsetTestIsReadyFunc: () => dispatch(unsetTestIsReady()),
        dataResult: (data) => dispatch(dataResult(data)),
        addCurrentAnswers: (data, index) => dispatch(addCurrentAnswers(data, index)),
        addCurrentCorrectResult: (data) => dispatch(addCurrentCorrectResult(data)),
        unSelectedTest: ()=> dispatch(unSelectedTest()),
        setMessageTextFunc: (message) => dispatch(setMessageText(message)),
        clearMessageTextFunc: () => dispatch(clearMessageText()),
    }
}

export default connect(MSTP, MDTP)(Test);
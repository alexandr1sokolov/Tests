import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Route, Switch, Redirect} from 'react-router-dom';
import axios from 'axios';

import MessageBox from './Components/MessageBox/MessageBox';
import Header from './Components/Header/Header';
import Registration from './Components/Registration/Registration';
import Main from './Components/Main/Main';
import Test from './Components/Test/Test';
import Tests from './Components/Tests/Tests';
import Enter from './Components/Enter/Enter';
import PersonalResults from './Components/PersonalResults/PersonalResults';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import NotFound from './Components/NotFound/NotFound'

import {fetchModulesDataAsync} from './redux/actions/modulesAction';
import {fetchAllTestsDataAsync} from './redux/actions/testsAction';
import {addCurrentCorrectResult} from './redux/actions/currentCorrectResultActions';
import {showEnter} from './redux/actions/enterAction';
import {showRegistration} from './redux/actions/registrationAction';
import {isLogin} from './redux/actions/isLogin';
import {getUserAuthHeader, getUserId, checkUser} from './helpers/userValidation';
import {dataResult} from './redux/actions/actionDataResults';
import {LocationPathnameSave,LocationPathnameClear} from './redux/actions/locationPathnameAction'

import styles from './App.css';


class App extends Component {

    componentDidMount() {
        console.log("did mount");
        localStorage.getItem('token') !== null && checkUser()
          .then(authResult => authResult === 200 && this.props.isLoginFunc() && true)
          .then(data => data === true && axios.get(`/users/${getUserId()}`, getUserAuthHeader())
            .then(data => this.props.dataResultFunc(data.data.results)))
          .catch(err => console.log(err));

        this.props.loadModulesDataAsync();
        this.props.loadAllTestsDataAsync();
        this.props.location.pathname !== "/" && this.props.location.pathname !== "/tests" && this.props.locationPathnameSaveFunc(this.props.location.pathname);
    };

    render() {
        console.log("location",this.props.location);
        console.log("match", this.props.match);
        console.log("history",this.props.history);
        // debugger;
            return (
                <div className={styles.App}>
                    <Header/>
                    {/*{this.props.savedLocationPathname && this.props.isLogin &&  <Route render={() => ( <Redirect to={this.props.savedLocationPathname}/> )}/>}*/}
                      <Switch>
                        <Route exact path="/" render={() => ( this.props.isLogin ? <Redirect to="/tests"/> : <Main/> )}/>
                        <Route exact path="/" component={Main} />
                        <ProtectedRoute exact path='/tests' component={Tests}/>
                        <ProtectedRoute exact path="/tests/:id" component={Test} />
                        <Route path="*" component={NotFound}/>
                      </Switch>
                    {/*{this.props.savedLocationPathname && <Redirect to={this.props.savedLocationPathname}/>}*/}
                    {this.props.enter && <Enter/>}
                    {this.props.registration && <Registration/>}
                    {this.props.messageText && <MessageBox/>}
                    {this.props.resultIsActive &&  <PersonalResults/>}
                </div>
            )
    }
}

function MSTP(state) {
    return {
        tests: state.tests,
        enter: state.enter,
        registration: state.registration,
        resultIsActive: state.resultIsActive,
        messageText: state.messageText,
        router: state.router,
        isLogin: state.isLogin,
        savedLocationPathname: state.locationPathname
    }
}

function MDTP(dispatch) {
    return {
        loadModulesDataAsync: ()=> dispatch(fetchModulesDataAsync()),
        loadAllTestsDataAsync: () => dispatch(fetchAllTestsDataAsync()),
        addCurrentCorrectResult: (data) => dispatch(addCurrentCorrectResult(data)),
        showEnter: () => dispatch(showEnter()),
        showRegistration: () => dispatch(showRegistration()),
        isLoginFunc: () => {
            dispatch(isLogin());
            return true
        },
        dataResultFunc:(data) => dispatch(dataResult(data)),
        locationPathnameSaveFunc: (pathname) => dispatch(LocationPathnameSave(pathname))
    }
}

export default connect(MSTP, MDTP)(App);

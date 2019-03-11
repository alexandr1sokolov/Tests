import React from 'react';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
import {addCurrentResult} from '../../redux/actions/currentResultActions';
import {addCurrentAnswers} from '../../redux/actions/currentAnswerActions';
import styles from './TestCard.css';


let checkedInd = [];

const TestCard = ({testname, index, question, answers, clas, addCurrentAnswers, correctResult, addCurrentResult}) => {

console.log("test card");

    const addCurrentAnswersFunc = (e) => {
        addCurrentAnswers(e.target.value, e.target.dataset.index);

        let data;
        (e.target.value === correctResult[e.target.dataset.index]) ? data = true : data = false;
        addCurrentResult(data, e.target.dataset.index);

        checkedInd[+e.target.dataset.index] = +e.target.dataset.chind;
    };

    switch (clas) {
        default:
            return (
                <div className={styles.testcard}>
                    <ol start={+index + 1}>
                        <li className={styles.testcard__question}>{question}</li>
                    </ol>

                    <form method='post' onChange={(addCurrentAnswersFunc)}>
                        {answers.map((answ, i) =>
                            <label
                                className={styles.testcard__answer}
                                id={`${answ}${i}`}
                                key={`${testname}${i}`}
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    id={`${answ}${i}`}
                                    data-index={index}
                                    className={styles.testcard__answers}
                                    value={answ}
                                    data-chind={i}
                                />
                                {answ}
                            </label>
                        )}
                    </form>
                </div>
            );
        case 2:
            return (
                <div className={`${styles.testcard} ${styles.testcardCor}`}>
                    <p className={styles.testcard__question}>{+index + 1}. {question}</p>
                    <form method='post' onChange={(addCurrentAnswersFunc)}>
                        {answers.map((answ, i) =>
                            <label
                                className={styles.testcard__answer}
                                id={`${answ}${i}`}
                                key={`${testname}${i}`}
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    id={`${answ}${i}`}
                                    data-index={index}
                                    className={styles.testcard__answers}
                                    value={answ}
                                    checked={checkedInd[index] === i}
                                    readOnly
                                />
                                {answ}
                            </label>
                        )}
                    </form>
                </div>
            );
        case 3:
            return (
                <div className={`${styles.testcard} ${styles.testcardInc}`}>
                    <p className={styles.testcard__question}>{+index + 1}. {question}</p>
                    <form method='post' onChange={(addCurrentAnswersFunc)}>
                        {answers.map((answ, i) =>
                            <label
                                className={styles.testcard__answer}
                                id={`${answ}${i}`}
                                key={`${testname}${i}`}
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    id={`${answ}${i}`}
                                    data-index={index}
                                    className={styles.testcard__answers}
                                    value={answ}
                                    checked={(checkedInd[index] === i)}
                                    readOnly
                                />
                                {answ}
                            </label>
                        )}
                    </form>
                </div>
            );
    }
};

    // TestCard.propTypes = {};
    // TestCard.defaultProps = {};


    function MSTP(state) {
        return {
            currentResult: state.currentResult,
            currentAnswer: state.currentAnswer,
            correctResult: state.correctResult,
        }
    }

    function MDTP(dispatch) {
        return {
            addCurrentResult: function (data, index) {
                dispatch(addCurrentResult(data, index))
            },
            addCurrentAnswers: function (data, index) {
                dispatch(addCurrentAnswers(data, index))
            },
        }
    }


export default connect(MSTP, MDTP)(TestCard);
import React, { useState, useEffect } from 'react';
import './App.css';
import Heading from './Components/Heading';
import { fetchTriviaQuestions } from './Components/TriviaService';

const decodeHtmlEntities = (text) => {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.body.textContent;
};

const App = () => {
    const [triviaQuestions, setTriviaQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [submittedAnswer, setSubmittedAnswer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function playTriviaGame() {
            try {
                const questions = await fetchTriviaQuestions();

                if (questions.length === 0) {
                    console.log('No trivia questions available.');
                    return;
                }

                const decodedQuestions = questions.map((question) => ({
                    ...question,
                    question: decodeHtmlEntities(question.question),
                }))

                setTriviaQuestions(decodedQuestions);
            } catch (error) {
                setError('Error fetching trivia questions.');
            } finally {
                setIsLoading(false);
            }
        }

        playTriviaGame();
    }, []);

    const handleNextQuestion = () => {
        // Increment the current question index
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setUserAnswer('');
    };

    const handleUserAnswer =() => {
        console.log(`User's answer: ${userAnswer}`);

        const isCorrect = userAnswer.toLowerCase() === triviaQuestions[currentQuestionIndex].correct_answer.toLowerCase(); 
        console.log(isCorrect ? "Correct!": "Oops! Wrong answer");

        if (userAnswer !== '') {
        setSubmittedAnswer(`${userAnswer} (Your Submitted answer)`);
        }        
    };

    return (
        <div>
            <Heading />
            {isLoading && <p>Loading trivia questions...</p>}
            {error && <p>{error}</p>}
            {triviaQuestions.length > 0 && currentQuestionIndex < triviaQuestions.length && (
                <div>
                    <p>{`Question ${currentQuestionIndex + 1}: ${triviaQuestions[currentQuestionIndex].question}`}</p>
                    <p>{`Options: ${triviaQuestions[currentQuestionIndex].incorrect_answers.concat(triviaQuestions[currentQuestionIndex].correct_answer).join(', ')}`}</p>
                    <p>{`Your Answer:`} <input type = 'text' value = {userAnswer} onChange = {(e) => setUserAnswer(e.target.value)} /> </p>
                    <button className = "Submit-button" onClick = {handleUserAnswer}>submit</button>
                    {submittedAnswer && (
                        <p>{`Your submitted answer: ${submittedAnswer}`}</p>
                    )}
                    {userAnswer !== '' && (
                        <p>{`Correct Answer: ${triviaQuestions[currentQuestionIndex].correct_answer}`}</p>
                    )}
                    
                    <hr />
                    <button className = "Next-button" onClick={handleNextQuestion}>Next Question</button>
                </div>
            )}
        </div>
    );
};

export default App;


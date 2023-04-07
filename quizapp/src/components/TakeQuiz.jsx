import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import db from "../db/firebase";

const TakeQuiz = ({ setIsLoading, isLoading, navigate }) => {

  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [grading, setGrading] = useState(null)


  // Onloads questions for specific quiz
  useEffect(() => {
    const quizRef = doc(db, "quizes", id);
    const questionsRef = collection(quizRef, "questions");

    const unsubscribe = onSnapshot(questionsRef, (querySnapshot) => {
      const getQuestions = querySnapshot.docs.map((doc) => doc.data());

      // Destructering timing and grading form getQuestions array 
      const { timing, grading } = getQuestions[0];

      // Updating the state for grading
      setGrading(parseInt(grading))

      // Check if length of getQuestions greater than 0, if so update questions state
      if (getQuestions.length > 0) {
        setIsLoading(false);
        setQuestions(getQuestions[0].questions);

        // Calculate the duration of the quiz in milliseconds
        const hours = parseInt(timing.split(":")[0]);
        const minutes = parseInt(timing.split(":")[1]);
        const seconds = parseInt(timing.split(":")[2]);
        const duration = hours * 3600000 + minutes * 60000 + seconds * 1000;

        // Set the initial time left
        setTimeLeft(duration);

      } else {
        setCurrentQuestion(true);
      }
    });

    return unsubscribe;
  }, [id]);


  // Handles selected option and updates the state
  const handleAnswerOptionClick = (option) => {
    if (option === questions[currentQuestion].answers[0]) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };


  // Passes through next question
  const handleNextQuestion = () => {

    setCurrentQuestion(currentQuestion + 1);

    // Check if there are any more questions left, and update the showScore state
    if (currentQuestion === questions.length - 1) {
      setShowScore(true);
    }
  };


  // Starts the quiz
  const handleStartQuiz = () => {

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    setQuizStarted(true)

    // Start the countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1000);
    }, 1000);

    // Stop the timer when time runs out
    setTimeout(() => {
      clearInterval(interval);
      setShowScore(true);
    }, timeLeft);
  };


  // Formats the time left as a string in HH:MM:SS format
  const formatTimeLeft = () => {

    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  };

  return (
    <Container className="mt-5">
      {isLoading ? (
        <Spinner animation="border" variant="success" className="text-center" />
      ) : showScore ? (
        <div>
          <h2 className="mb-4">Quiz Results</h2>
          <h3 className="text-info">
            You scored {score} out of {questions.length} and Your grade is {score * grading}
          </h3>
          <Button
            variant="outline-success"
            onClick={() => navigate("/quizlist")}
          >
            Try again
          </Button>
        </div>
      ) : (
        <>
          <Row>
            <Col md={8}>
              <div className="mb-4">
                <div className="d-flex gap-5">
                  <h2>Question {currentQuestion + 1} of {questions.length}</h2>
                  <p> <span className="text-danger">Time Remaining: </span> <br /> {formatTimeLeft()}</p>
                </div>
                <p className="mt-4">{questions[currentQuestion]?.prompt}</p>
              </div>
              <div>
                {questions[currentQuestion]?.multipleChoiceOptions.map(
                  (option) => (
                    <Button
                      variant="outline-success"
                      className="m-2"
                      key={option}
                      onClick={() => quizStarted ? handleAnswerOptionClick(option) : null}
                    >
                      {option}
                    </Button>
                  )
                )}
              </div>

            </Col>
          </Row>
          <Row >
            <Col md={8}>
              {quizStarted ? (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-success"
                    size="lg"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </Button>
                </div>
              ) : (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-success"
                    size="lg"
                    onClick={handleStartQuiz}
                  >
                    Start Quiz
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>

  )
}
export default TakeQuiz
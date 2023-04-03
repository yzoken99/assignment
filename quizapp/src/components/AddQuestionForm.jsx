import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { addDoc, collection } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import db from '../db/firebase';

const AddQuestionForm = ({ formData, setFormData }) => {
  const { quizId } = useParams()
  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          prompt: "",
          options: ["", "", "", ""],
          correctAnswer: null
        }
      ]
    })
  }

  const submitQuestion = async (e) => {
    e.preventDefault();
    const newQuestion = {
      prompt: "",
      options: ["", "", "", ""],
      correctAnswer: null
    };

    // Add the new question to the questions subcollection of the quiz with quizId
    try {
      const docRef = await addDoc(collection(db, `quizes/${quizId}/questions`), formData);
      console.log("Question added with ID: ", docRef.id);
      setFormData({
        questions: [{ prompt: '', answers: [''] }],
      });
    } catch (error) {
      console.error("Error adding question: ", error);
    }

    // Update the state of the form data to include the new question
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        newQuestion
      ]
    })
  }
  const handleMultipleChoiceOptionChange = (questionIndex, optionIndex, value) => {
    setFormData(prevState => {
      const questions = [...prevState.questions];
      const options = [...questions[questionIndex].multipleChoiceOptions];
      options[optionIndex] = value;
      questions[questionIndex].multipleChoiceOptions = options;
      return { ...prevState, questions };
    });
  };


  const handleDeleteMultipleChoiceOption = (questionIndex, optionIndex) => {
    setFormData((prevFormData) => {
      const newQuestions = [...prevFormData.questions];
      newQuestions[questionIndex].multipleChoiceOptions.splice(optionIndex, 1);
      return { ...prevFormData, questions: newQuestions };
    });
  };

  const handleAddMultipleChoiceOption = (questionIndex) => {
    const newFormData = { ...formData };
    if (!newFormData.questions[questionIndex].multipleChoiceOptions) {
      newFormData.questions[questionIndex].multipleChoiceOptions = [];
    }
    newFormData.questions[questionIndex].multipleChoiceOptions.push('');
    setFormData(newFormData);
  };


  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(questionIndex, 1);
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const handleAddAnswerOption = (questionIndex) => {
    setFormData((prevFormData) => {
      const updatedQuestions = [...prevFormData.questions];
      const currentAnswers = updatedQuestions[questionIndex].answers;
      if (currentAnswers) {
        currentAnswers.push("");
      } else {
        updatedQuestions[questionIndex].answers = [""];
      }
      return {
        ...prevFormData,
        questions: updatedQuestions,
      };
    });
  };


  const handleDeleteAnswerOption = (questionIndex, answerIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const handleQuestionPromptChange = (questionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].prompt = value;
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  const handleAnswerOptionChange = (questionIndex, answerIndex, value, type = "answer") => {
    const newFormData = { ...formData };
    const newQuestion = { ...newFormData.questions[questionIndex] };
    if (type === "answer") {
      newQuestion.answers[answerIndex] = value;
    } else if (type === "multipleChoice") {
      newFormData.multipleChoiceOptions[answerIndex] = value;
    }
    newFormData.questions[questionIndex] = newQuestion;
    setFormData(newFormData);
  };

  return (
    <Row className='d-flex justify-content-center'>
      <Col md={6}>
        <Form>
          <h2>Add Question</h2>
          {formData.questions?.map((question, questionIndex) => (
            <div key={`question-${questionIndex}`}>
              <Form.Group className="mb-3">
                <Form.Label>Prompt</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter prompt"
                  value={question.prompt}
                  onChange={(e) => handleQuestionPromptChange(questionIndex, e.target.value)}
                />
              </Form.Group>
              {question.answers?.map((answer, answerIndex) => (
                <Form.Group className="mb-3" key={`answer-${questionIndex}-${answerIndex}`}>
                  <Form.Label>Answer Option {answerIndex + 1}</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Enter answer option"
                      value={answer}
                      onChange={(e) => handleAnswerOptionChange(questionIndex, answerIndex, e.target.value)}
                    />
                    <Button
                      variant="danger"
                      className="ml-2"
                      onClick={() => handleDeleteAnswerOption(questionIndex, answerIndex)}
                    >
                      Delete
                    </Button>
                  </div>
                </Form.Group>
              ))}
              <Form.Group className="mb-3" key={`multiple-choice-options-${questionIndex}`}>
                <Form.Label>Multiple Choice Options</Form.Label>
                {question.multipleChoiceOptions?.map((option, optionIndex) => (
                  <div className="d-flex mb-2 gap-2" key={`option-${optionIndex}`}>
                    <Form.Control
                      type="text"
                      placeholder="Enter option"
                      value={option}
                      onChange={(e) => handleMultipleChoiceOptionChange(questionIndex, optionIndex, e.target.value)}
                    />
                    <Button
                      variant="danger"
                      className="ml-2"
                      onClick={() => handleDeleteMultipleChoiceOption(questionIndex, optionIndex)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <div className='d-flex justify-content-between'>
                  <Button
                    variant="success"
                    className="mb-3"
                    onClick={() => handleAddMultipleChoiceOption(questionIndex)}
                  >
                    Add Option
                  </Button>
                  <Button
                    variant="success"
                    className="mb-3"
                    onClick={() => handleAddAnswerOption(questionIndex)}
                  >
                    Add Answer Option
                  </Button>

                </div>
              </Form.Group>
              <Button
                variant="danger"
                className="mb-3"
                onClick={() => handleDeleteQuestion(questionIndex)}
              >
                Delete Question
              </Button>

            </div>

          ))}
          <div className='d-flex justify-content-between'>
            <Button
              variant="success"
              onClick={() => handleAddQuestion()}
            >
              Add Question
            </Button>
            <Button
              variant="success"
              onClick={submitQuestion}
            >
              Submit
            </Button>

          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default AddQuestionForm;

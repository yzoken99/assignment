import { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { addDoc, collection } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import db from '../db/firebase';

const AddQuestionForm = ({ formData, setFormData, isLoading, setIsLoading, navigate }) => {
  const { quizId } = useParams()


  // Adds question form 
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


  // Submits question to the specific quiz
  const submitQuestion = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const newQuestion = {
      prompt: "",
      options: ["", "", "", ""],
      correctAnswer: null
    };


    // Add the new question to the questions subcollection of the quiz with quizId
    try {
      await addDoc(collection(db, `quizes/${quizId}/questions`), formData);
      setIsLoading(false)
      setFormData({
        questions: [{ prompt: '', answers: [''] }],
      });
      navigate("/quizlist")
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


  // Handles multiple choice option value when it changes
  const handleMultipleChoiceOptionChange = (questionIndex, optionIndex, value) => {
    setFormData(prevState => {
      const questions = [...prevState.questions];
      const options = [...questions[questionIndex].multipleChoiceOptions];
      options[optionIndex] = value;
      questions[questionIndex].multipleChoiceOptions = options;
      return { ...prevState, questions };
    });
  };


  // Deletes selected multiple choice option for prompt
  const handleDeleteMultipleChoiceOption = (questionIndex, optionIndex) => {
    setFormData((prevFormData) => {
      const newQuestions = [...prevFormData.questions];
      newQuestions[questionIndex].multipleChoiceOptions.splice(optionIndex, 1);
      return { ...prevFormData, questions: newQuestions };
    });
  };


  // Adds multiple choice option for prompt
  const handleAddMultipleChoiceOption = (questionIndex) => {
    const newFormData = { ...formData };
    if (!newFormData.questions[questionIndex].multipleChoiceOptions) {
      newFormData.questions[questionIndex].multipleChoiceOptions = [];
    }
    newFormData.questions[questionIndex].multipleChoiceOptions.push('');
    setFormData(newFormData);
  };


  // Deletes question form while creating only !!!
  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(questionIndex, 1);
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }


  // Adds answer option for specific prompt
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


  // Deletes answer option for specific prompt
  const handleDeleteAnswerOption = (questionIndex, answerIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  // Handles value of prompt and udates the current state
  const handleQuestionPromptChange = (questionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].prompt = value;
    setFormData({
      ...formData,
      questions: updatedQuestions
    })
  }

  // Handles the value of input when it changes and updates the formData
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
        {
          isLoading ? <Alert variant="success" className="p-3 rounded-pill">
            Questions successfully added!
          </Alert> :
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
                  Create
                </Button>

              </div>
            </Form>
        }
      </Col>
    </Row>
  );
};

export default AddQuestionForm;

import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { addDoc, collection } from 'firebase/firestore';

const AddQuestionForm = ({ quizId, formData, setFormData }) => {
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
              <div className="d-flex">
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
              <div className="d-flex mb-2" key={`option-${optionIndex}`}>
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
            <Button
              variant="secondary"
              className="mb-3"
              onClick={() => handleAddMultipleChoiceOption(questionIndex)}
            >
              Add Option
            </Button>
          </Form.Group>
          <Button
            variant="danger"
            className="mb-3"
            onClick={() => handleDeleteQuestion(questionIndex)}
          >
            Delete Question
          </Button>
          <Button
            variant="secondary"
            className="mb-3"
            onClick={() => handleAddAnswerOption(questionIndex)}
          >
            Add Answer Option
          </Button>
        </div>

      ))}
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => handleAddQuestion()}
      >
        Add Question
      </Button>
    </Form>
  );
};

export default AddQuestionForm;

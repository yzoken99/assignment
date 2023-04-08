import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import { Container } from 'react-bootstrap';
import QuizList from './components/QuizList';
import { Route, Routes, useNavigate } from 'react-router-dom'
import AddQuestionForm from './components/AddQuestionForm';
import { useState } from 'react';
import TakeQuiz from './components/TakeQuiz';

function App() {

  // Navigates to a given path
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    grading: 0,
    timing: "",
    questions: [
      {
        prompt: "",
        answers: []
      }
    ],
    multipleChoiceOptions: []
  })


  return (
    <div className="App">
      <Container>
        <Routes>
          <Route path="/" element={<Home formData={formData} setFormData={setFormData} navigate={navigate}/>} />
          <Route path="/quizlist" element={<QuizList setIsLoading={setIsLoading} isLoading={isLoading} navigate={navigate}/>} />
          <Route path="/add/:quizId" element={<AddQuestionForm formData={formData} setFormData={setFormData} isLoading={isLoading} setIsLoading={setIsLoading} navigate={navigate}/>} />
          <Route path="/takequiz/:id" element={<TakeQuiz setIsLoading={setIsLoading} isLoading={isLoading} navigate={navigate}/>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

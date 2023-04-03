import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import { Container } from 'react-bootstrap';
import QuizList from './components/QuizList';
import { Route, Routes } from 'react-router-dom'
import AddQuestionForm from './components/AddQuestionForm';
import { useState } from 'react';

function App() {
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
          <Route path="/" element={<Home formData={formData} setFormData={setFormData}/>} />
          <Route path="/quizlist" element={<QuizList />} />
          <Route path="/add/:quizId" element={<AddQuestionForm formData={formData} setFormData={setFormData}/>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

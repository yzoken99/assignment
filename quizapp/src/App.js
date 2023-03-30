import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import { Container } from 'react-bootstrap';
import QuizList from './components/QuizList';
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizlist" element={<QuizList />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

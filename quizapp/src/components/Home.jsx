import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom'
const Home = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        grading: "",
        timing: ""
    })

    const handleInputs = (field, value) => {
        setFormData({
            ...formData,
            [field]:value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <Row className='d-flex justify-content-center app'>
            <Col md={4}>
                <Form>
                    <h1 className='text-info text-center my-2'>Create Quiz</h1>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter name" 
                            value={formData.name}
                            onChange={(e)=> handleInputs("name", e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={formData.description}
                            onChange={(e)=> handleInputs("description", e.target.value)}    
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Grading Point</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter grading" 
                            value={formData.grading}
                            onChange={(e)=> handleInputs("grading", e.target.value)}    
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Timing</Form.Label>
                        <Form.Control 
                            type="time" 
                            placeholder="Select time" 
                            value={formData.timing}
                            onChange={(e)=> handleInputs("timing", e.target.value)}    
                        />
                    </Form.Group>
                    <Button 
                        variant="success" 
                        type="submit" 
                        className='mr-auto'
                        onClick={()=> navigate("/quizlist")}
                        >
                        Create
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}
export default Home;
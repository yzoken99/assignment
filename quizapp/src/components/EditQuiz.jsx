import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import db from "../db/firebase.config";

const EditQuiz = ({ show, handleClose, singleQuiz, setSingleQuiz , getData}) => {
    const [isUpdated, setIsUpdated] = useState(false)

    // Handles input values when they change and updates the state
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSingleQuiz({ ...singleQuiz, [name]: value });
    }

    // Updates the form values of selected quiz here in db as well! 
    const handleUpdate = (e) => {
        e.preventDefault();
        setIsUpdated(true)
        const quizColRef = doc(db, 'quizes', singleQuiz.id)
        updateDoc(quizColRef, singleQuiz)
            .then(() => {
                setTimeout(() => {
                    setIsUpdated(false)
                    handleClose();
                    getData()
                }, 2000)
            })
            .catch((error) => {
                console.error("Error updating quiz: ", error);
            });
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                {
                    isUpdated ? <Alert variant="success" className="p-3">
                        Successfully updated !
                    </Alert> :
                        <Modal.Header closeButton>
                            <Modal.Title className='text-info'>Edit quiz</Modal.Title>
                        </Modal.Header>
                }
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                value={singleQuiz?.name || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={singleQuiz?.description || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Grading Point</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter grading"
                                name="grading"
                                value={singleQuiz?.grading || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Timing</Form.Label>
                            <Form.Control
                                type="time"
                                step="1"
                                placeholder="Select time"
                                name="timing"
                                value={singleQuiz?.timing || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button 
                        variant="danger" 
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    <Button 
                        variant="success" 
                        type="submit" 
                        onClick={handleUpdate}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EditQuiz;
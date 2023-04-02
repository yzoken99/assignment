import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import db from "../db/firebase";

const EditQuiz = ({ show, handleClose, singleQuiz, setSingleQuiz , getData}) => {
    const [isUpdated, setIsUpdated] = useState(false)

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSingleQuiz({ ...singleQuiz, [name]: value });
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsUpdated(true)
        const examcollref = doc(db, 'quizes', singleQuiz.id)
        updateDoc(examcollref, singleQuiz)
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
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                }
                <Modal.Body>
                    <Form>
                        <h1 className='text-info text-center my-2'>Edit quiz</h1>
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
                                placeholder="Select time"
                                name="timing"
                                value={singleQuiz?.timing || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EditQuiz;
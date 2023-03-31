import { Button, Form, Modal } from "react-bootstrap";

const EditQuiz = ({show, handleClose, item}) => {
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <h1 className='text-info text-center my-2'>Edit quiz</h1>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={item.name}
                            // onChange={(e) => handleInputs("name", e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={item.desformDatacription}
                            // onChange={(e) => handleInputs("description", e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Grading Point</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter grading"
                            value={item.grading}
                            // onChange={(e) => handleInputs("grading", e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Timing</Form.Label>
                        <Form.Control
                            type="time"
                            placeholder="Select time"
                            value={item.timing}
                            // onChange={(e) => handleInputs("timing", e.target.value)}
                        />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EditQuiz;
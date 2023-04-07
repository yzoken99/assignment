import { useEffect, useState } from 'react';
import { Button, Row, Spinner, Table } from 'react-bootstrap'
import { RiEdit2Fill } from 'react-icons/ri';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdOutlineNotStarted } from 'react-icons/md';
import { Link } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import db from '../db/firebase';
import EditQuiz from './EditQuiz';

const QuizList = ({setIsLoading, isLoading, navigate}) => {

    const [data, setData] = useState();
    const [show, setShow] = useState(false);
    const [singleQuiz, setSingleQuiz] = useState()

    // Handles Modal for editing selected quiz 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    //  Fetches all quiz data from db
    const getData = async () => {
        setIsLoading(true)
        const quizesCol = collection(db, 'quizes');
        const quizSnapshot = await getDocs(quizesCol);
        setData(quizSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setIsLoading(false)
    }


    // Retrieves quiz data when page loads
    useEffect(() => {
        getData()
    }, [])

    // Deletes single document by an id
    const deleteData = async(id) => {
        await deleteDoc(doc(db, "quizes", id))
          .then(() => {
            setData((prevData) => prevData.filter((quiz) => quiz.id !== id));
          })
          .catch((error) => {
            console.log(error);
          });
      };

    // Retrieves single document by an id
    const getSingleDocument = async (selectedQuizId) => {
        const docRef = doc(db, "quizes", selectedQuizId)
        const docSnap = await getDoc(docRef)
        setSingleQuiz({ ...docSnap.data(), id: selectedQuizId })
    };

    return (
        <>
            <Row className='d-flex justify-content-end'>
                <Button
                    variant="success"
                    className='mb-3'
                    style={{ width: "150px" }}
                    onClick={() => navigate("/")}
                >Add a quiz
                </Button>
            </Row>
            <h3 className='text-center text-info mb-4'>Quiz List</h3>
            <Row>
                {isLoading ? <Spinner animation="border" variant="success" className="text-center" />
                    :
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr className='text-center'>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Grade</th>
                                <th>Timing</th>
                                <th>Add question</th>
                                <th>Edit</th>
                                <th>Delete</th>
                                <th>Take a quiz</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map(quiz => (
                                <>
                                    <tr key={quiz.id} style={{ cursor: "pointer", textAlign:"center"}}>
                                        <td>{quiz.name}</td>
                                        <td>{quiz.description}</td>
                                        <td>{quiz.grading}</td>
                                        <td>{quiz.timing}</td>
                                        <td><Link to={`/add/${quiz.id}`} style={{display:"-webkit-box"}}><IoMdAddCircleOutline className="text-success" style={{ cursor: "pointer", fontSize:"25px" }} /></Link></td>
                                        <td><RiEdit2Fill className="text-primary" style={{ cursor: "pointer", fontSize:"25px" }} onClick={() => { getSingleDocument(quiz.id); handleShow() }} /></td>
                                        <td><RiDeleteBin5Line className="text-danger" style={{ cursor: "pointer", fontSize:"25px" }} onClick={() => { deleteData(quiz.id) }} /></td>
                                        <td><Link to={`/takequiz/${quiz.id}`} style={{display:"-webkit-box"}}><MdOutlineNotStarted className="text-success" style={{ cursor: "pointer", fontSize:"25px" }}/></Link></td>
                                    </tr>
                                </>
                            ))}

                            <EditQuiz 
                                show={show} 
                                handleClose={handleClose} 
                                singleQuiz={singleQuiz} 
                                setSingleQuiz={setSingleQuiz} 
                                getData={getData}
                            />
                        </tbody>
                    </Table>
                }
            </Row>
        </>
    )
}
export default QuizList;                        
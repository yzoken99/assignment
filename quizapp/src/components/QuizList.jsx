import { useEffect, useState } from 'react';
import { Button, Row, Spinner, Table } from 'react-bootstrap'
import { RiEdit2Fill } from 'react-icons/ri';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc, getDoc, getFirestore } from 'firebase/firestore';
import db from '../db/firebase';
import EditQuiz from './EditQuiz';

const QuizList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [singleQuiz, setSingleQuiz] = useState()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //  Fetches all data from db
    const getData = async () => {
        setLoading(true)
        const quizesCol = collection(db, 'quizes');
        const quizSnapshot = await getDocs(quizesCol);
        setData(quizSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])

    // Deletes single document by an id
    const deleteData = async (id) => {
        await deleteDoc(doc(db, "quizes", id))
        const filteredData = data.filter((item) => item.id !== id);
        setData(filteredData);
    }

    const getSingleDocument = async (selectedQuizId) => {
        const db = getFirestore()
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
                {loading ? <Spinner animation="border" variant="success" className='text-center' />
                    :
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Grade</th>
                                <th>Timing</th>
                                <th>Add question</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map(item => (
                                <>
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.grading}</td>
                                        <td>{item.timing}</td>
                                        <td><Link to={`/add/${item.id}`} style={{display:"-webkit-box"}}><IoMdAddCircleOutline className='text-success' style={{ cursor: "pointer" }} /></Link></td>
                                        <td><RiEdit2Fill className='text-primary' style={{ cursor: "pointer" }} onClick={() => { getSingleDocument(item.id); handleShow() }} /></td>
                                        <td><RiDeleteBin5Line className='text-danger' style={{ cursor: "pointer" }} onClick={() => { deleteData(item.id) }} /></td>
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
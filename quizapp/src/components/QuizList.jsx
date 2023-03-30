import { Button, Row, Table } from 'react-bootstrap'
import { RiEdit2Fill } from 'react-icons/ri';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore';
import db from '../db/firebase';
import { useEffect, useState } from 'react';
const QuizList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState();
    
    async function getData() {
        const citiesCol = collection(db, 'quizes');
        const citySnapshot = await getDocs(citiesCol);
        const cityList = citySnapshot.docs.map(doc => doc.data());
        console.log(cityList);
    }

    useEffect(() => {
        getData()
    }, [])

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
                <Table striped bordered hover variant="dark">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Grade</th>
                            <th>Timing</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {data?.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.grade}</td>
                                <td>{item.timing.seconds.toHHMMSS()}</td>
                                <td><RiEdit2Fill className='text-primary' style={{ cursor: "pointer" }} /></td>
                                <td><RiDeleteBin5Line className='text-danger' style={{ cursor: "pointer" }} /></td>
                            </tr>
                        ))
                        } */}
                    </tbody>
                </Table>
            </Row>
        </>
    )
}
export default QuizList;                        
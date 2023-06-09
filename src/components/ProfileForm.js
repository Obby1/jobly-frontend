import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import JoblyApi from '../api';
import JobCard from './JobCard';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../css/ProfileForm.css'


function ProfileForm() {

    const { currentUser, updateCurrentUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
    });
    const [appliedJobs, setAppliedJobs] = useState([]);

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        async function fetchAppliedJobs() {
            const jobIds = await JoblyApi.getAppliedJobs(currentUser.username);
            const jobPromises = jobIds.map(jobId => JoblyApi.getJob(jobId));
            const fetchedJobs = await Promise.all(jobPromises);
            setAppliedJobs(fetchedJobs);
        }

        fetchAppliedJobs();
    }, [currentUser])

    async function handleSubmit(evt) {
        evt.preventDefault();
        const updatedUser = await JoblyApi.updateUser(currentUser.username, formData);
        // updateCurrentUser(updatedUser);
        // below works but leads to an extra API call
        const jobIds = await JoblyApi.getAppliedJobs(currentUser.username);
        updateCurrentUser({ ...updatedUser, applications: jobIds });
        setShowAlert(true);
    }


    function handleAlertDismiss() {
        setShowAlert(false);
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }
    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <Card className='edit-form-card' style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                        <Card.Body >
                            {/*  */}
                            {showAlert && (
                                <Alert variant="success" onClose={handleAlertDismiss} dismissible>
                                    Saved!
                                </Alert>
                            )}
                            <Form onSubmit={handleSubmit} >
                                <Form.Group controlId="firstName">
                                    <Form.Label>First Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="lastName">
                                    <Form.Label>Last Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className='profile-submit-btn'>
                                    Save Changes
                                </Button>
                            </Form>
                        </Card.Body>


                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div>
                        <h2>Applied Jobs: </h2>
                        {appliedJobs.length === 0 ? (
                            <div>
                                <h2>No Results</h2>
                                <LinkContainer to="/jobs">
                                    <Button variant="primary">Click here for jobs</Button>
                                </LinkContainer>
                            </div>
                        ) : (
                            appliedJobs.map((job) => <JobCard key={job.id} job={job} />)

                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProfileForm;

// Further study - implement useRef or another hook to avoid API call being made in handleSubmit
// when I update the user form data. 
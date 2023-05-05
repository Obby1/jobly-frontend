import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JobCard from './JobCard';
import JoblyApi from '../api';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

function CompanyDetail() {
    const [company, setCompany] = useState(null);
    const { handle } = useParams();

    useEffect(() => {
        async function fetchCompany() {
            const fetchedCompany = await JoblyApi.getCompany(handle);
            setCompany(fetchedCompany);
        }

        fetchCompany();
    }, [handle]);

    if (!company) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h2>{company.name}</h2>
                    <p>{company.description}</p>
                    <h3>Jobs</h3>
                    <ListGroup>
                        {company.jobs.map(job => (
                            <JobCard job={job} />
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default CompanyDetail;


// return (
//     <Container>
//         <Row>
//             <Col>
//                 <div>
//                     <h2>Jobs</h2>
//                     <input
//                         type="text"
//                         placeholder="Search jobs"
//                         value={searchTerm}
//                         onChange={handleSearch}
//                         className="search-input"
//                     />
//                     {
//                         jobs.length === 0 ? (
//                             <div>
//                                 <h2>No Results</h2>
//                             </div>
//                         ) : (
//                             <ListGroup>
//                                 {jobs.map(job => (
//                                     <JobCard key={job.id} job={job} />
//                                 ))}
//                             </ListGroup>
//                         )
//                     }
//                 </div>
//             </Col>
//         </Row>
//     </Container>
// );
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { Card, Button } from 'react-bootstrap';

function JobCard({ job }) {
    const { currentUser, applyForJob, unapplyForJob } = useContext(UserContext);
    const isApplied = currentUser?.applications?.includes(job.id);

    return (
        <Card className="JobCard mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
            <Card.Body>
                <Card.Title>
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </Card.Title>
                <Card.Text>Salary: {job.salary}</Card.Text>
                <Card.Text>Equity: {job.equity}</Card.Text>
                {isApplied ? (
                    <Button variant="danger" onClick={() => unapplyForJob(job.id)}>
                        Un-apply
                    </Button>
                ) : (
                    <Button variant="primary" onClick={() => applyForJob(job.id)}>
                        Apply
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default JobCard;
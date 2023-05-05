import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JoblyApi from '../api';
import JobCard from './JobCard';

function JobDetail() {
    const [job, setJob] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchJob() {
            const fetchedJob = await JoblyApi.getJob(id);
            setJob(fetchedJob);
        }

        fetchJob();
    }, [id]);

    if (!job) return <div>Loading...</div>;

    return (
        <div>
            <JobCard key={job.id} job={job} />
        </div>
    );
}

export default JobDetail;
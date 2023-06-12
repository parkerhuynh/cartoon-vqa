import React from 'react';
import { Link } from 'react-router-dom';

const workers = [
  { id: 1, name: 'John Doe', profile: 'john-doe-profile' },
  { id: 2, name: 'Jane Smith', profile: 'jane-smith-profile' },
  // Add more worker data as needed
];

const WorkersTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Worker ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {workers.map(worker => (
          <tr key={worker.id}>
            <td>
              <Link to={`/profile/${worker.profile}`}>{worker.id}</Link>
            </td>
            <td>{worker.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkersTable;
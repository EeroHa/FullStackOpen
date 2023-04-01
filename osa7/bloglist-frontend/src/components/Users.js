import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import userService from '../services/users';

const User = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    userService.getAll().then((res) => {
      setUsers(res);
      console.log(res);
    });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Blogs</th>
          </tr>
        </thead>
        <tbody>
          {users
            .sort((a, b) => {
              return b.blogs - a.likes;
            })
            .map((user) => (
              <tr key={user.id}>
                <td>
                  <a href={`/users/${user.id}`}>{user.username}</a>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default User;

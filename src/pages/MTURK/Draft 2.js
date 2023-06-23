{workers ? (null) : (
  <div class="row">
    <table className="table">
      <thead>
        <tr>
          <th>id</th>
          <th>Worker ID</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(workers).map(([key, row]) => (
          <tr key={key}>
            <td>{key}</td>
            <td ><Link to={`/profile/${row.worker_id}`} style={{ textDecoration: 'inherit' }} >{row.worker_id}</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

)}
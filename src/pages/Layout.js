import { Outlet, Link } from "react-router-dom";


const Layout = () => {
  return (
    <>
      <div class="header p-5">
        <h1>CARTOON-VQA</h1>
      </div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark custom-nav">
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <Link class="nav-link " to="/">Home</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/cleaningprocess">Cleaning Process</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/invalidimages">Invalid Images</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/validimages">Valid Images</Link>
            </li>

            <li class="nav-item">
              <Link class="nav-link" to="/download">Download</Link>
            </li >
            
          </ul>
        </div>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
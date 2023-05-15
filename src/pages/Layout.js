import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const Layout = () => {
  return (
    <>
      <div class="header p-5 bg-dark">
        <h1>CARTOON-VQA</h1>
      </div>

      <Navbar variant="dark" bg="dark" expand="lg" className="justify-content-center">
        <Container fluid >
          
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className='m-auto'>
            <Navbar.Brand href="/">Home</Navbar.Brand>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Data Processing"
                menuVariant="dark"
              >
                <NavDropdown.Item href="/cleaningprocess">Image Cleaning Process</NavDropdown.Item>
                <NavDropdown.Item href="/validimages">Valid Images</NavDropdown.Item>
                <NavDropdown.Item href="/invalidimages">Invalid Images</NavDropdown.Item>
                <NavDropdown.Item href="dupimages">Duplicate image Process</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Caption Processing</NavDropdown.Item>
              </NavDropdown>

              <Navbar.Brand href="/download">Download</Navbar.Brand>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  )
};

export default Layout;
import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const Layout = () => {
  return (
    <>
      <div class="row p-1 bg-dark">
        <a href="/" className="header"> CARTOON-VQA</a>
      </div>
      <div class="row">
      <Navbar variant="dark" bg="dark" expand="lg" className="justify-content-center">
        <Container fluid >
          
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className='m-auto'>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            {/*
            <NavDropdown
                id="nav-dropdown-dark-example"
                title="Data"
                menuVariant="dark"
              ><NavDropdown.Item href="/preprocess">Preprocess</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/assignment_checking">Assignment Checking</NavDropdown.Item>
                <NavDropdown.Item href="/assignment_tracking">Assignment Tracking</NavDropdown.Item>
              <NavDropdown.Divider />
                <NavDropdown.Item href="/worker_checking">Worker Checking</NavDropdown.Item>
                <NavDropdown.Item href="/worker_tracking">Workers Tracking</NavDropdown.Item>
              </NavDropdown>
              */}
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="MTURK"
                menuVariant="dark"
              ><NavDropdown.Divider />
                <NavDropdown.Item href="/working_analysis">Working Time Analysis</NavDropdown.Item>
                <NavDropdown.Item href="/workers">Workers</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/mturk_uploading">Upload</NavDropdown.Item>
              
              </NavDropdown>
            
            <NavDropdown
                id="nav-dropdown-dark-example"
                title="Analysis"
                menuVariant="dark"
              >
                <NavDropdown.Item href="/status">Data Status</NavDropdown.Item>
                <NavDropdown.Item href="/analysis1">Caption Analysis</NavDropdown.Item>
                <NavDropdown.Item href="/prompt">Prompt Analysis</NavDropdown.Item>
                <NavDropdown.Divider />
              </NavDropdown>
              {/*
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Data Processing"
                menuVariant="dark"
              >
                <NavDropdown.Item href="/cleaningprocess">Image Cleaning Process</NavDropdown.Item>
                <NavDropdown.Item href="/validimages">Valid Images</NavDropdown.Item>
                <NavDropdown.Item href="/invalidimages">Invalid Images</NavDropdown.Item>
                <NavDropdown.Item href="/dupimages">Duplicate image Process</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/captioning">Caption Processing</NavDropdown.Item>
                
                <NavDropdown.Item href="/qa">QA Generator</NavDropdown.Item>
                
                
              </NavDropdown>
              */}
              
              <Navbar.Brand href="/download">Download</Navbar.Brand>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
      </div>
    </>
  )
};

export default Layout;
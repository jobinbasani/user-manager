import EventDashboard
  from "../../features/events/eventDashboard/EventDashboard";
import NavBar from '../../features/nav/NavBar';
import { Container } from 'semantic-ui-react';
import React,{ useState } from 'react';

function App() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <NavBar setFormOpen={setFormOpen} />
      <Container className='main'>
        <EventDashboard formOpen={formOpen} setFormOpen={setFormOpen} />
      </Container>
    </>
  );
}

export default App;

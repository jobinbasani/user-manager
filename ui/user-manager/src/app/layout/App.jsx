import EventDashboard
  from "../../features/events/eventDashboard/EventDashboard";
import NavBar from '../../features/nav/NavBar';
import { Container } from 'semantic-ui-react';
import { useState } from 'react';
import { Route } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import EventDetailedPage from '../../features/events/eventsDetailed/EventDetailedPage';
import EventForm from '../../features/events/eventForm/EventForm';

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  function handleSelectEvent(event){
    setSelectedEvent(event);
    setFormOpen(true);
  }

  function handleCreateFormOpen(){
    setSelectedEvent(null);
    setFormOpen(true);
  }

  return (
    <>
      <NavBar setFormOpen={handleCreateFormOpen} />
      <Container className='main'>
        <Route path='/' exact component={HomePage} />
        <Route path='/events' exact component={EventDashboard} />
        <Route path='/events/:id' component={EventDetailedPage} />
        <Route path='/createEvent' component={EventForm} />
      </Container>
    </>
  );
}

export default App;

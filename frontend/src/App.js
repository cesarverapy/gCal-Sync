import React, { useState, useEffect } from 'react';
import './App.css';
import { Calendar } from './components/ui/calendar';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { CalendarDays, Search, Clock, MapPin, Users, Plus } from 'lucide-react';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// Mock data for calendar events
const mockEvents = [
  {
    id: 1,
    title: "Team Standup",
    description: "Daily standup meeting with the development team",
    start: "2025-08-19T09:00:00Z",
    end: "2025-08-19T09:30:00Z",
    location: "Conference Room A",
    attendees: ["john@example.com", "jane@example.com"],
    type: "meeting",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Client Presentation",
    description: "Quarterly review presentation for ABC Corp",
    start: "2025-08-19T14:00:00Z",
    end: "2025-08-19T15:30:00Z",
    location: "Zoom Meeting",
    attendees: ["client@abccorp.com", "sales@example.com"],
    type: "presentation",
    status: "confirmed"
  },
  {
    id: 3,
    title: "Product Demo",
    description: "Demo of new features to stakeholders",
    start: "2025-08-19T11:00:00Z",
    end: "2025-08-19T12:00:00Z",
    location: "Main Office",
    attendees: ["ceo@example.com", "product@example.com"],
    type: "demo",
    status: "tentative"
  },
  {
    id: 4,
    title: "Code Review",
    description: "Review pull requests and discuss architecture",
    start: "2025-08-19T16:00:00Z",
    end: "2025-08-19T17:00:00Z",
    location: "Dev Room",
    attendees: ["dev1@example.com", "dev2@example.com"],
    type: "review",
    status: "confirmed"
  },
  {
    id: 5,
    title: "Project Planning",
    description: "Weekly project planning and milestone review",
    start: "2025-08-20T10:00:00Z",
    end: "2025-08-20T11:30:00Z",
    location: "Conference Room B",
    attendees: ["pm@example.com", "team@example.com"],
    type: "planning",
    status: "confirmed"
  }
];

function App() {
  const [events, setEvents] = useState(mockEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  // Filter events based on search term, date, and type
  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(event => {
        const eventDate = parseISO(event.start);
        return isWithinInterval(eventDate, {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate)
        });
      });
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterType, selectedDate]);

  const getTypeColor = (type) => {
    const colors = {
      meeting: '#ef4444',
      presentation: '#8b5cf6', 
      demo: '#10b981',
      review: '#f59e0b',
      planning: '#06b6d4'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="title">
            <CalendarDays size={24} />
            <span>Calendar Events</span>
          </div>
          <div className="count">
            {filteredEvents.length} events
          </div>
        </div>

        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="add-btn">
            <Plus size={20} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button 
            className={`tab ${filterType === 'meeting' ? 'active' : ''}`}
            onClick={() => setFilterType('meeting')}
          >
            Meetings
          </button>
          <button 
            className={`tab ${filterType === 'presentation' ? 'active' : ''}`}
            onClick={() => setFilterType('presentation')}
          >
            Presentations
          </button>
          <button 
            className={`tab ${filterType === 'demo' ? 'active' : ''}`}
            onClick={() => setFilterType('demo')}
          >
            Demos
          </button>
        </div>

        {/* Event List */}
        <div className="event-list">
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={48} />
              <p>No events found</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-dot" style={{ backgroundColor: getTypeColor(event.type) }}></div>
                <div className="event-content">
                  <div className="event-title">
                    {event.title}
                    {event.status === 'tentative' && (
                      <span className="tentative-badge">tentative</span>
                    )}
                  </div>
                  <div className="event-details">
                    <span className="event-time">
                      {format(parseISO(event.start), 'HH:mm')} - {format(parseISO(event.end), 'HH:mm')}
                    </span>
                    <span className="event-location">
                      {event.location}
                    </span>
                    <span className="event-attendees">
                      {event.attendees.length} attendees
                    </span>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="view-details-btn" onClick={() => setSelectedEvent(event)}>
                      View
                    </button>
                  </DialogTrigger>
                  <DialogContent className="dialog-content">
                    <DialogHeader>
                      <DialogTitle>{event.title}</DialogTitle>
                      <DialogDescription>
                        {format(parseISO(event.start), 'EEEE, MMMM d, yyyy')} • {format(parseISO(event.start), 'HH:mm')} - {format(parseISO(event.end), 'HH:mm')}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="dialog-body">
                      <div className="dialog-section">
                        <h4>Description</h4>
                        <p>{event.description}</p>
                      </div>
                      
                      <div className="dialog-section">
                        <h4>Location</h4>
                        <p>{event.location}</p>
                      </div>
                      
                      <div className="dialog-section">
                        <h4>Attendees</h4>
                        <div className="attendee-list">
                          {event.attendees.map((attendee, index) => (
                            <div key={index} className="attendee">{attendee}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))
          )}
        </div>

        {/* Calendar */}
        <div className="calendar-section">
          <h3>Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="calendar"
          />
        </div>

        {/* Footer */}
        <div className="footer">
          <span>Double-click event to edit</span>
          <span>Calendar App v1.0</span>
        </div>
      </div>
    </div>
  );
}

export default App;
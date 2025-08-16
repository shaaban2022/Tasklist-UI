import { useState } from "react";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import "./Calendar.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  
  const handleGoogleCalendarConnect = () => {
    alert("Google Calendar connect clicked!");
  };

  const handleOutlookCalendarConnect = () => {
    alert("Outlook Calendar connect clicked!");
  };

  const handleSlackConnect = () => {
    alert("Slack connect clicked!");
  };

  return (
    <div className="calendar-page">
    <SideNavbar className="sidebar" />
    
    <div className="main-content">
      <div className="calendar-integration-buttons">
        <button className="google-btn">Connect Google Calendar</button>
        <button className="outlook-btn">Connect Outlook Calendar</button>
        <button className="slack-btn">Connect Slack Calendar</button>
      </div>

      <div className="events-list">
        <h3>Scheduled Tasks & Events</h3>
        <ul>
        </ul>
      </div>
    </div>
  </div>

  );
};

export default Calendar;

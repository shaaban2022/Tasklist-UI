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
          <li>1 Aug 2025 - Project Proposal documentation 1</li>
          <li>2 Aug 2025 - Project Proposal documentation 2nd version</li>
          <li>3 Nov 2025 - Project Proposal documentation 3rd version</li>
          <li>4 Nov 2025 - Project Proposal documentation 4th version</li>
          <li>7 Nov 2025 - Task allotment</li>
        </ul>
      </div>
    </div>
  </div>

  );
};

export default Calendar;

import { useState } from "react";
import "./SupportForm.css";

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);  
  const [feedback, setFeedback] = useState({ message: '', type: '' });  

  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL; 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {  
    e.preventDefault();
    setLoading(true);  
    setFeedback({ message: '', type: '' });  

    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/api/send-support-email`, {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();  

      if (response.ok) {  
        setFeedback({ message: data.message || "Your message has been sent successfully!", type: 'success' });
        setFormData({ name: "", email: "", message: "" }); 
      } else {
        setFeedback({ message: data.message || "Failed to send message. Please try again.", type: 'error' });
      }
    } catch (error) { 
      console.error("Error sending support form:", error);
      setFeedback({ message: "Network error. Could not connect to the server.", type: 'error' });
    } finally {
      setLoading(false);  
    }
  };

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      {feedback.message && (  
        <div className={`form-feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={loading}  
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={loading}  
      />
      <textarea
        name="message"
        placeholder="Describe your issue..."
        rows="4"
        value={formData.message}
        onChange={handleChange}
        required
        disabled={loading}  
      ></textarea>
      <button type="submit" disabled={loading}>  
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default SupportForm;

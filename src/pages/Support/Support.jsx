import './Support.css';
import NavBarLogin from '../../components/NavBarLogin/NavBarLogin';
import SupportForm from '../../components/SupportForm/SupportForm';
import { useState } from 'react';

const faqs = [
  {
    question: "💬 How do I reset my password?",
    answer: "We are soon adding a 'Forgot Password' feature in the Login screen. After that you can easily reset your password."
  },
  {
    question: "💬 How to create a new task or team?",
    answer: "Navigate to the Dashboard, click 'Add Task', fill in the details and save."
  },
  {
    question: "💬 How to delete my account?",
    answer: "We are soon adding a 'Delete Account' feature in the Account Settings. After that you can easily delete your account."
  }
];

const Support = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <NavBarLogin />
      <div className="support-container">
        <h1>📞 Need Help? We're Here!</h1>
        <p>If you’re experiencing issues or have any questions, feel free to reach out.  
        Our support team is available to assist you quickly.</p>

        <div className="support-section">
          <h2>Contact Us</h2>
          <ul>
            <li>📧 Email: <a href="mailto:gyanthakurthakur@gmail.com">gyanthakurthakur@gmail.com</a></li>
            <li>📞 Phone: <a href="tel:+917016184175">+91 70161 84175</a></li>
            <li>💬 Live Chat: Available 9AM - 6PM</li>
          </ul>
        </div>

        <div className="support-section">
          <h2>Submit a Support Request</h2>
          <SupportForm />
        </div>

        <div className="support-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">{faq.question}</div>
                {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;

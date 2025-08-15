import { motion } from 'framer-motion';
import NavBarLogin from '../../components/NavBarLogin/NavBarLogin';
import './Features.css';

const features = [
  {
    icon: '📝',
    title: 'Task Management',
    tagline: 'Stay organized, stay productive',
    description: 'Create, update, and manage your daily tasks with ease. Prioritize and organize your workflow seamlessly.',
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    tagline: 'Work better together',
    description: 'Assign tasks, communicate updates, and manage teams all in one place to boost productivity.',
  },
  {
    icon: '📅',
    title: 'Smart Calendar',
    tagline: 'Plan smarter, not harder',
    description: 'Plan your weeks efficiently with the built-in calendar that integrates tasks and meetings.',
  },
  {
    icon: '🔐',
    title: 'Secure Authentication',
    tagline: 'Your data, your control',
    description: 'Signup/Login with a secure and user-friendly interface that protects your data.',
  },
  {
    icon: '⚙️',
    title: 'Personal Dashboard',
    tagline: 'All-in-one view',
    description: 'Get a bird’s eye view of your work and progress with the customizable dashboard.',
  },
  {
    icon: '📊',
    title: 'Analytics & Insights',
    tagline: 'Make data-driven decisions',
    description: 'Track productivity, view trends, and make informed decisions with real-time analytics.',
  },
];

const Features = () => {
  return (
    <>
      <NavBarLogin />
      <div className="features-section">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="features-heading"
        >
          🚀 Project Features
        </motion.h1>
        <p className="features-subtitle">
          Discover all the powerful features designed to make your workflow smoother, faster, and more efficient.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-tagline">{feature.tagline}</p>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="cta-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3>Ready to boost your productivity?</h3>
          <p>Sign up today and experience seamless task management like never before.</p>
          <a href="/signup" className="cta-button">
            Get Started
          </a>
        </motion.div>
      </div>
    </>
  );
};

export default Features;

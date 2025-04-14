import React from 'react';
import { motion } from "framer-motion";
import './Dashboard.css';

const Dashboard = () => {
  return (
    <section className="dashboard-content">
      {/* Welcome Text with Continuous Horizontal Floating Animation */}
      <motion.h2
        animate={{ x: ["0%", "100%"] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="welcome-text"
      >
        Welcome to the Dashboard
      </motion.h2>

      <div className="stats">
        {/* Animated Cards */}
        <motion.div
          className="card"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <h4>Today's Revenue</h4>
          <p>$15,500</p>
        </motion.div>

        <motion.div
          className="card"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <h4>Active Users</h4>
          <p>1,200</p>
        </motion.div>

        <motion.div
          className="card"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <h4>Orders Completed</h4>
          <p>320</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Dashboard;

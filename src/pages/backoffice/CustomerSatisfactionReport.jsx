import React from "react";

const CustomerSatisfactionReport = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
        Rapport : Satisfaction des Clients
      </h2>
      <div style={{ height: "90vh", width: "100%" }}>
        <iframe
          src="http://localhost:3000/public/dashboard/f41e7785-50ff-426b-8dbb-d0f61b2b4e25"
          frameBorder="0"
          style={{ width: "50%", height: "50%" }}
          allowFullScreen
          title="Rapport : Satisfaction des Clients"
        />
      </div>
    </div>
  );
};

export default CustomerSatisfactionReport;

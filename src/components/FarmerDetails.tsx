import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FarmerDetails = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      const token = localStorage.getItem("keycloak-token");
      if (!token) {
        setError("Missing authentication token.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://dev-api.farmeasytechnologies.com/api/farmers/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFarmer(response.data);
      } catch (err) {
        setError("Failed to fetch farmer data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFarmerDetails();
  }, [id]);

  const tabs = ["Profile", "KYC", "Farm Info", "Land Info", "Score Card", "Credit Report"];

  const renderTabContent = () => {
    if (!farmer) return null;

    switch (activeTab) {
      case "Profile":
        return (
          <div className="space-y-2">
            <div><strong>Name:</strong> {farmer.name}</div>
            <div><strong>Gender:</strong> {farmer.gender}</div>
            <div><strong>Phone:</strong> {farmer.phone}</div>
            <div><strong>City:</strong> {farmer.city || "N/A"}</div>
            <div><strong>Created On:</strong> {farmer.created_on}</div>
          </div>
        );
      case "KYC":
        return (
          <div className="space-y-2">
            <div><strong>Aadhaar:</strong> {farmer.kyc?.aadhaar_number}</div>
            {farmer.kyc?.aadhaar_image && (
              <img src={farmer.kyc.aadhaar_image} alt="Aadhaar" className="w-64 rounded shadow" />
            )}
            <div><strong>PAN:</strong> {farmer.kyc?.pan_number}</div>
            {farmer.kyc?.pan_image && (
              <img src={farmer.kyc.pan_image} alt="PAN" className="w-64 rounded shadow" />
            )}
          </div>
        );
      case "Farm Info":
        return (
          <div className="space-y-2">
            <div><strong>Farm Type:</strong> {farmer.farm_info?.farm_type}</div>
            <div><strong>Crops:</strong> {farmer.farm_info?.crops?.join(", ")}</div>
          </div>
        );
      case "Land Info":
        return (
          <div className="space-y-2">
            <div><strong>Land Area:</strong> {farmer.land_info?.area} acres</div>
            <div><strong>Location:</strong> {farmer.land_info?.location}</div>
          </div>
        );
      case "Score Card":
        return (
          <div>
            <strong>Risk Score:</strong> {farmer.score_card?.risk_score}
          </div>
        );
      case "Credit Report":
        return (
          <div>
            <strong>Credit History:</strong> {farmer.credit_report?.summary}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading farmer details...</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  if (!farmer) return <div className="p-6">Farmer not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        👨‍🌾 Farmer Details - {farmer.name}
      </h1>

      <div className="flex flex-wrap gap-2 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-md border-b-2 transition ${
              activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FarmerDetails;

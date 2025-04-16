import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Define interfaces to match the structure of your API response
interface KYCData {
  aadhaar_number?: string; // Use optional properties because they might be null/undefined
  aadhaar_image?: string;
  pan_number?: string;
  pan_image?: string;
}

interface FarmInfoData {
  farm_type?: string;
  crops?: string[];
}

interface LandInfoData {
  area?: string;
  location?: string;
}

interface ScoreCardData {
  risk_score?: number;
}

interface CreditReportData {
  summary?: string;
}

interface FarmerDetailsData {
  id: string;
  farmer_id: string;
  phone_no: string;
  referral_id: string | null;
  name: string | null;
  village: string | null;
  status: number | null;
  created_at: string;
  updated_at: string;
  kyc?: KYCData; // Make these optional as the API might not always return them
  farm_info?: FarmInfoData;
  land_info?: LandInfoData;
  score_card?: ScoreCardData;
  credit_report?: CreditReportData;
}

const FarmerDetails = () => {
  const { id } = useParams<{ id: string }>(); // Ensure id is explicitly typed as string
  const [farmer, setFarmer] = useState<FarmerDetailsData | null>(null); // Use the interface
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
        const response = await axios.get<FarmerDetailsData>( // Specify the expected response type
          `https://dev-api.farmeasytechnologies.com/api/farmers/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFarmer(response.data);
      } catch (err: any) { // Type err as any or AxiosError
        setError("Failed to fetch farmer data: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFarmerDetails();
  }, [id]);

  const tabs = ["Profile", "KYC", "Farm Info", "Land Info", "Score Card", "Credit Report"];

    // Helper function to render "N/A"
    const renderNA = (value: any) : string => {
        return value !== undefined && value !== null ? value.toString() : "N/A";
    }

  const renderTabContent = () => {
    if (!farmer) return null;

    switch (activeTab) {
      case "Profile":
        return (
          <div className="space-y-2">
            <div><strong>Name:</strong> {renderNA(farmer.name)}</div>
             <div><strong>Phone:</strong> {renderNA(farmer.phone_no)}</div>
            <div><strong>City:</strong> {renderNA(farmer.village)}</div>
            <div><strong>Created On:</strong> {renderNA(new Date(farmer.created_at).toLocaleDateString())}</div>
          </div>
        );
      case "KYC":
        return (
          <div className="space-y-2">
            <div><strong>Aadhaar:</strong> {renderNA(farmer.kyc?.aadhaar_number)}</div>
            {farmer.kyc?.aadhaar_image && (
              <img src={farmer.kyc.aadhaar_image} alt="Aadhaar" className="w-64 rounded shadow" />
            )}
            <div><strong>PAN:</strong> {renderNA(farmer.kyc?.pan_number)}</div>
            {farmer.kyc?.pan_image && (
              <img src={farmer.kyc.pan_image} alt="PAN" className="w-64 rounded shadow" />
            )}
          </div>
        );
      case "Farm Info":
          const crops = farmer.farm_info?.crops?.join(", ") || "N/A";
        return (
          <div className="space-y-2">
            <div><strong>Farm Type:</strong> {renderNA(farmer.farm_info?.farm_type)}</div>
            <div><strong>Crops:</strong> {crops}</div>
          </div>
        );
      case "Land Info":
        return (
          <div className="space-y-2">
            <div><strong>Land Area:</strong> {renderNA(farmer.land_info?.area)} acres</div>
            <div><strong>Location:</strong> {renderNA(farmer.land_info?.location)}</div>
          </div>
        );
      case "Score Card":
        return (
          <div>
            <strong>Risk Score:</strong> {renderNA(farmer.score_card?.risk_score)}
          </div>
        );
      case "Credit Report":
        return (
          <div>
            <strong>Credit History:</strong> {renderNA(farmer.credit_report?.summary)}
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

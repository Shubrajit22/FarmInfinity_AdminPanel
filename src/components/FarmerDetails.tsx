import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

// Define interfaces to match the API response structures
interface FarmerDetailsData {
  id: string;
  farmer_id: string;
  phone_no: string;
  referral_id: string | null;
  name: string | null;
  village: string | null;
  status: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface POIData {
  id: string;
  poi_type: string;
  poi_number: string;
  name: string;
  dob: string;
  father: string;
  gender: string;
  husband: string;
  mother: string;
  yob: number;
  address_full: string;
  pin: string;
  building: string;
  city: string;
  district: string;
  floor: string;
  house: string;
  locality: string;
  state: string;
  street: string;
  complex: string;
  landmark: string;
  relation: string;
  number_cs: number;
  name_cs: number;
  dob_cs: number;
  father_cs: number;
  gender_cs: number;
  husband_cs: number;
  mother_cs: number;
  yob_cs: number;
  address_cs: number;
  pin_cs: number;
  poi_image_front_url: string;
  poi_image_back_url: string;
  is_verified: boolean;
  verification_id: string;
  created_at: string;
  updated_at: string;
}

interface POAData {
  id: string;
  poa_type: string;
  name: string;
  poa_number: string;
  dob: string;
  father: string;
  gender: string;
  husband: string;
  mother: string;
  yob: number;
  address_full: string;
  pin: string;
  building: string;
  city: string;
  district: string;
  floor: string;
  house: string;
  locality: string;
  state: string;
  street: string;
  complex: string;
  landmark: string;
  relation: string;
  number_cs: number;
  name_cs: number;
  dob_cs: number;
  father_cs: number;
  gender_cs: number;
  husband_cs: number;
  mother_cs: number;
  yob_cs: number;
  address_cs: number;
  pin_cs: number;
  poa_image_front_url: string;
  poa_image_back_url: string;
  is_verified: boolean;
  verification_id: string;
  created_at: string;
  updated_at: string;
}

interface KYCData {
  id: string;
  farmer_id: string;
  poi_version_id: string;
  poa_version_id: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

const FarmerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [farmer, setFarmer] = useState<FarmerDetailsData | null>(null);
  const [kyc, setKyc] = useState<KYCData | null>(null);
  const [poi, setPoi] = useState<POIData | null>(null);
  const [poa, setPoa] = useState<POAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Profile");
  const tabs = ["Profile", "KYC"];


  useEffect(() => {
    const fetchFarmerDetails = async () => {
      const token = localStorage.getItem("keycloak-token");
      if (!token) {
        setError("Missing authentication token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch farmer details
        const farmerResponse: AxiosResponse<FarmerDetailsData> = await axios.get(
          `https://dev-api.farmeasytechnologies.com/api/farmer/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFarmer(farmerResponse.data);

        // Fetch KYC
        const kycResponse = await axios.get<KYCData>(`https://dev-api.farmeasytechnologies.com/api/kyc-histories/${farmerResponse.data.farmer_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKyc(kycResponse.data);

        // Fetch POI and POA.  These are dependent on KYC
        if (kycResponse.data.poi_version_id) {
            const poiResponse = await axios.get<POIData>(`https://dev-api.farmeasytechnologies.com/api/poi/${kycResponse.data.poi_version_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setPoi(poiResponse.data);
        }

        if (kycResponse.data.poa_version_id) {
            const poaResponse = await axios.get<POAData>(`https://dev-api.farmeasytechnologies.com/api/poa/${kycResponse.data.poa_version_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setPoa(poaResponse.data);
        }

      } catch (err: any) {
        setError("Failed to fetch data: " + err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFarmerDetails();
  }, [id]);



  const renderNA = (value: any): string => {
    return value !== undefined && value !== null ? value.toString() : "N/A";
  };

    const renderTabContent = () => {
    if (!farmer) {
      return null;
    }

    switch (activeTab) {
      case "Profile":
        return (
          <div className="space-y-2">
            <div>
              <strong>Name:</strong> {renderNA(farmer.name)}
            </div>
            <div>
              <strong>Farmer Id:</strong> {renderNA(farmer.farmer_id)}
            </div>
            <div>
              <strong>Phone:</strong> {renderNA(farmer.phone_no)}
            </div>
            <div>
              <strong>Referral Id:</strong> {renderNA(farmer.referral_id)}
            </div>
            <div>
              <strong>Village:</strong> {renderNA(farmer.village)}
            </div>
            <div>
              <strong>Status:</strong> {renderNA(farmer.status)}
            </div>
            <div>
              <strong>Created On:</strong>{" "}
              {farmer.created_at
                ? renderNA(new Date(farmer.created_at).toLocaleDateString())
                : "N/A"}
            </div>
          </div>
        );
      case "KYC":
        if (!kyc) {
          return <div>No KYC information available.</div>;
        }
        return (
          <div className="space-y-4">
            <div className="font-bold text-lg">KYC Information</div>
            <div>
              <strong>KYC ID:</strong> {renderNA(kyc.id)}
            </div>
            <div>
              <strong>Farmer ID:</strong> {renderNA(kyc.farmer_id)}
            </div>
            <div>
              <strong>POI Version ID:</strong> {renderNA(kyc.poi_version_id)}
            </div>
            <div>
              <strong>POA Version ID:</strong> {renderNA(kyc.poa_version_id)}
            </div>
             <div>
              <strong>Timestamp:</strong> {renderNA(kyc.timestamp)}
            </div>
            <div>
              <strong>Created At:</strong> {renderNA(kyc.created_at)}
            </div>
            <div>
              <strong>Updated At:</strong> {renderNA(kyc.updated_at)}
            </div>

            <div className="font-bold text-lg">Proof of Identity (POI)</div>
            {poi ? (
              <div className="space-y-2">
                <div><strong>POI Type:</strong> {renderNA(poi.poi_type)}</div>
                <div><strong>POI Number:</strong> {renderNA(poi.poi_number)}</div>
                <div><strong>Name:</strong> {renderNA(poi.name)}</div>
                <div><strong>Date of Birth:</strong> {renderNA(poi.dob)}</div>
                <div><strong>Father's Name:</strong> {renderNA(poi.father)}</div>
                <div><strong>Gender:</strong> {renderNA(poi.gender)}</div>
                <div><strong>Husband's Name:</strong> {renderNA(poi.husband)}</div>
                <div><strong>Mother's Name:</strong> {renderNA(poi.mother)}</div>
                <div><strong>Year of Birth:</strong> {renderNA(poi.yob)}</div>
                <div><strong>Full Address:</strong> {renderNA(poi.address_full)}</div>
                <div><strong>PIN Code:</strong> {renderNA(poi.pin)}</div>
                 <div><strong>Building:</strong> {renderNA(poi.building)}</div>
                <div><strong>City:</strong> {renderNA(poi.city)}</div>
                <div><strong>District:</strong> {renderNA(poi.district)}</div>
                <div><strong>Floor:</strong> {renderNA(poi.floor)}</div>
                <div><strong>House:</strong> {renderNA(poi.house)}</div>
                <div><strong>Locality:</strong> {renderNA(poi.locality)}</div>
                <div><strong>State:</strong> {renderNA(poi.state)}</div>
                <div><strong>Street:</strong> {renderNA(poi.street)}</div>
                <div><strong>Complex:</strong> {renderNA(poi.complex)}</div>
                <div><strong>Landmark:</strong> {renderNA(poi.landmark)}</div>
                <div><strong>Relation:</strong> {renderNA(poi.relation)}</div>
                <div><strong>Number CS:</strong> {renderNA(poi.number_cs)}</div>
                <div><strong>Name CS:</strong> {renderNA(poi.name_cs)}</div>
                <div><strong>DOB CS:</strong> {renderNA(poi.dob_cs)}</div>
                <div><strong>Father CS:</strong> {renderNA(poi.father_cs)}</div>
                 <div><strong>Gender CS:</strong> {renderNA(poi.gender_cs)}</div>
                <div><strong>Husband CS:</strong> {renderNA(poi.husband_cs)}</div>
                <div><strong>Mother CS:</strong> {renderNA(poi.mother_cs)}</div>
                <div><strong>YOB CS:</strong> {renderNA(poi.yob_cs)}</div>
                 <div><strong>Address CS:</strong> {renderNA(poi.address_cs)}</div>
                  <div><strong>PIN CS:</strong> {renderNA(poi.pin_cs)}</div>
                <div>
                  <img src={poi.poi_image_front_url} alt="POI Front" className="w-64 rounded shadow" />
                </div>
                <div>
                  <img src={poi.poi_image_back_url} alt="POI Back" className="w-64 rounded shadow" />
                </div>
                <div><strong>Is Verified:</strong> {renderNA(poi.is_verified)}</div>
                <div><strong>Verification ID:</strong> {renderNA(poi.verification_id)}</div>
                <div><strong>Created At:</strong> {renderNA(poi.created_at)}</div>
                <div><strong>Updated At:</strong> {renderNA(poi.updated_at)}</div>
              </div>
            ) : (
              <div>No POI available for this KYC.</div>
            )}

            <div className="font-bold text-lg">Proof of Address (POA)</div>
            {poa ? (
              <div className="space-y-2">
                <div><strong>POA Type:</strong> {renderNA(poa.poa_type)}</div>
                <div><strong>POA Number:</strong> {renderNA(poa.poa_number)}</div>
                 <div><strong>Name:</strong> {renderNA(poa.name)}</div>
                <div><strong>Date of Birth:</strong> {renderNA(poa.dob)}</div>
                <div><strong>Father's Name:</strong> {renderNA(poa.father)}</div>
                <div><strong>Gender:</strong> {renderNA(poa.gender)}</div>
                <div><strong>Husband's Name:</strong> {renderNA(poa.husband)}</div>
                <div><strong>Mother's Name:</strong> {renderNA(poa.mother)}</div>
                <div><strong>Year of Birth:</strong> {renderNA(poa.yob)}</div>
                <div><strong>Full Address:</strong> {renderNA(poa.address_full)}</div>
                <div><strong>PIN Code:</strong> {renderNA(poa.pin)}</div>
                 <div><strong>Building:</strong> {renderNA(poa.building)}</div>
                <div><strong>City:</strong> {renderNA(poa.city)}</div>
                <div><strong>District:</strong> {renderNA(poa.district)}</div>
                <div><strong>Floor:</strong> {renderNA(poa.floor)}</div>
                <div><strong>House:</strong> {renderNA(poa.house)}</div>
                <div><strong>Locality:</strong> {renderNA(poa.locality)}</div>
                <div><strong>State:</strong> {renderNA(poa.state)}</div>
                <div><strong>Street:</strong> {renderNA(poa.street)}</div>
                 <div><strong>Complex:</strong> {renderNA(poa.complex)}</div>
                <div><strong>Landmark:</strong> {renderNA(poa.landmark)}</div>
                <div><strong>Relation:</strong> {renderNA(poa.relation)}</div>
                <div><strong>Number CS:</strong> {renderNA(poa.number_cs)}</div>
                <div><strong>Name CS:</strong> {renderNA(poa.name_cs)}</div>
                <div><strong>DOB CS:</strong> {renderNA(poa.dob_cs)}</div>
                <div><strong>Father CS:</strong> {renderNA(poa.father_cs)}</div>
                 <div><strong>Gender CS:</strong> {renderNA(poa.gender_cs)}</div>
                <div><strong>Husband CS:</strong> {renderNA(poa.husband_cs)}</div>
                <div><strong>Mother CS:</strong> {renderNA(poa.mother_cs)}</div>
                <div><strong>YOB CS:</strong> {renderNA(poa.yob_cs)}</div>
                 <div><strong>Address CS:</strong> {renderNA(poa.address_cs)}</div>
                  <div><strong>PIN CS:</strong> {renderNA(poa.pin_cs)}</div>
                <div>
                  <img src={poa.poa_image_front_url} alt="POA Front" className="w-64 rounded shadow" />
                </div>
                <div>
                  <img src={poa.poa_image_back_url} alt="POA Back" className="w-64 rounded shadow" />
                </div>
                <div><strong>Is Verified:</strong> {renderNA(poa.is_verified)}</div>
                <div><strong>Verification ID:</strong> {renderNA(poa.verification_id)}</div>
                <div><strong>Created At:</strong> {renderNA(poa.created_at)}</div>
                <div><strong>Updated At:</strong> {renderNA(poa.updated_at)}</div>
              </div>
            ) : (
              <div>No POA available for this KYC.</div>
            )}
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
        Farmer Details - {renderNA(farmer.name)}
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

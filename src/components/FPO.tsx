import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

interface FPOData {
  id: string;
  fpo_id: string;
  constitution: string;
  entity_name: string;
  no_of_farmers: number;
  address: string;
  state: string;
  district: string;
  area_of_operation: number;
  establishment_year: string;
  major_crop_produced: string[];
  previous_year_turnover: number;
  contact_person_name: string;
  contact_person_phone: string;
  pan_no: string;
  is_pan_copy_collected: boolean;
  pan_image: string;
  is_incorporation_doc_collected: boolean;
  incorporation_doc_img: string;
  is_registration_no_collected: boolean;
  registration_no: string;
  registration_no_img: string;
  is_director_shareholder_list_collected: boolean;
  director_shareholder_list_image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const FPO = () => {
  const [fpos, setFpos] = useState<FPOData[]>([]);
  const [selectedFPO, setSelectedFPO] = useState<FPOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFPOs = async () => {
      try {
        const response: AxiosResponse<FPOData[]> = await axios.get(
          'https://dev-api.farmeasytechnologies.com/api/fpos/?skip=0&limit=100'
        );
        setFpos(response.data);
      } catch (err: any) {
        setError(`Error fetching FPO list: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFPOs();
  }, []);

  if (loading) return <div className="p-4">Loading FPOs...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All FPOs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fpos.map((fpo) => (
          <div
            key={fpo.id}
            className="border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition cursor-pointer"
            onClick={() => setSelectedFPO(fpo)}
          >
            <h2 className="text-lg font-semibold text-blue-800">{fpo.entity_name}</h2>
            <p><strong>FPO ID:</strong> {fpo.fpo_id}</p>
            <p><strong>State:</strong> {fpo.state}</p>
            <p><strong>District:</strong> {fpo.district}</p>
            <p><strong>Contact:</strong> {fpo.contact_person_name} ({fpo.contact_person_phone})</p>
            <p><strong>Status:</strong> {fpo.active ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFPO && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto p-6">
          <div className="bg-white max-w-5xl w-full rounded-lg p-6 relative shadow-lg">
            <button
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold"
              onClick={() => setSelectedFPO(null)}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-blue-900">{selectedFPO.entity_name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>FPO ID:</strong> {selectedFPO.fpo_id}</div>
              <div><strong>Constitution:</strong> {selectedFPO.constitution}</div>
              <div><strong>Farmers:</strong> {selectedFPO.no_of_farmers}</div>
              <div><strong>Address:</strong> {selectedFPO.address}</div>
              <div><strong>State:</strong> {selectedFPO.state}</div>
              <div><strong>District:</strong> {selectedFPO.district}</div>
              <div><strong>Area of Operation:</strong> {selectedFPO.area_of_operation}</div>
              <div><strong>Establishment Year:</strong> {selectedFPO.establishment_year}</div>
              <div><strong>Major Crops:</strong> {selectedFPO.major_crop_produced.join(', ')}</div>
              <div><strong>Turnover:</strong> ₹{selectedFPO.previous_year_turnover}</div>
              <div><strong>Contact Name:</strong> {selectedFPO.contact_person_name}</div>
              <div><strong>Contact Phone:</strong> {selectedFPO.contact_person_phone}</div>
              <div><strong>PAN No:</strong> {selectedFPO.pan_no}</div>
              <div><strong>PAN Copy Collected:</strong> {selectedFPO.is_pan_copy_collected ? 'Yes' : 'No'}</div>
              <div><strong>Registration No:</strong> {selectedFPO.registration_no}</div>
              <div><strong>Director List Collected:</strong> {selectedFPO.is_director_shareholder_list_collected ? 'Yes' : 'No'}</div>
              <div><strong>Active:</strong> {selectedFPO.active ? 'Yes' : 'No'}</div>
              <div><strong>Created:</strong> {new Date(selectedFPO.created_at).toLocaleString()}</div>
              <div><strong>Updated:</strong> {new Date(selectedFPO.updated_at).toLocaleString()}</div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {selectedFPO.pan_image && (
                <div>
                  <img src={selectedFPO.pan_image} alt="PAN Document" className="rounded shadow w-full" />
                  <p className="text-xs mt-1 text-center">PAN Image</p>
                </div>
              )}
              {selectedFPO.incorporation_doc_img && (
                <div>
                  <img src={selectedFPO.incorporation_doc_img} alt="Incorporation Doc" className="rounded shadow w-full" />
                  <p className="text-xs mt-1 text-center">Incorporation Document</p>
                </div>
              )}
              {selectedFPO.registration_no_img && (
                <div>
                  <img src={selectedFPO.registration_no_img} alt="Registration No" className="rounded shadow w-full" />
                  <p className="text-xs mt-1 text-center">Registration Document</p>
                </div>
              )}
              {selectedFPO.director_shareholder_list_image && (
                <div>
                  <img src={selectedFPO.director_shareholder_list_image} alt="Shareholder List" className="rounded shadow w-full" />
                  <p className="text-xs mt-1 text-center">Director/Shareholder List</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FPO;

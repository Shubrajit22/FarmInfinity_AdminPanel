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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fpos.map((fpo) => (
          <div
            key={fpo.id}
            className="border p-4 rounded shadow hover:shadow-md cursor-pointer"
            onClick={() => setSelectedFPO(fpo)}
          >
            <h2 className="text-lg font-semibold">{fpo.entity_name}</h2>
            <p><strong>FPO ID:</strong> {fpo.fpo_id}</p>
            <p><strong>State:</strong> {fpo.state}</p>
            <p><strong>District:</strong> {fpo.district}</p>
            <p><strong>Contact:</strong> {fpo.contact_person_name} ({fpo.contact_person_phone})</p>
            <p><strong>Active:</strong> {fpo.active ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-8 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setSelectedFPO(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedFPO.entity_name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>FPO ID:</strong> {selectedFPO.fpo_id}</div>
              <div><strong>Constitution:</strong> {selectedFPO.constitution}</div>
              <div><strong>Farmers:</strong> {selectedFPO.no_of_farmers}</div>
              <div><strong>Address:</strong> {selectedFPO.address}</div>
              <div><strong>State:</strong> {selectedFPO.state}</div>
              <div><strong>District:</strong> {selectedFPO.district}</div>
              <div><strong>Area:</strong> {selectedFPO.area_of_operation}</div>
              <div><strong>Est. Year:</strong> {selectedFPO.establishment_year}</div>
              <div><strong>Crops:</strong> {selectedFPO.major_crop_produced.join(', ')}</div>
              <div><strong>Turnover:</strong> ₹{selectedFPO.previous_year_turnover}</div>
              <div><strong>Contact:</strong> {selectedFPO.contact_person_name}</div>
              <div><strong>Phone:</strong> {selectedFPO.contact_person_phone}</div>
              <div><strong>PAN:</strong> {selectedFPO.pan_no}</div>
              <div><strong>PAN Collected:</strong> {selectedFPO.is_pan_copy_collected ? 'Yes' : 'No'}</div>
              <div><strong>Registration No:</strong> {selectedFPO.registration_no}</div>
              <div><strong>Active:</strong> {selectedFPO.active ? 'Yes' : 'No'}</div>
              <div><strong>Created:</strong> {new Date(selectedFPO.created_at).toLocaleString()}</div>
              <div><strong>Updated:</strong> {new Date(selectedFPO.updated_at).toLocaleString()}</div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedFPO.pan_image && (
                <img src={selectedFPO.pan_image} alt="PAN" className="rounded shadow" />
              )}
              {selectedFPO.incorporation_doc_img && (
                <img src={selectedFPO.incorporation_doc_img} alt="Incorp Doc" className="rounded shadow" />
              )}
              {selectedFPO.registration_no_img && (
                <img src={selectedFPO.registration_no_img} alt="Reg No" className="rounded shadow" />
              )}
              {selectedFPO.director_shareholder_list_image && (
                <img src={selectedFPO.director_shareholder_list_image} alt="Shareholder List" className="rounded shadow" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FPO;

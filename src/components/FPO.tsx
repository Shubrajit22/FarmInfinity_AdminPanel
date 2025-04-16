import  { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';

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
  const { id } = useParams<{ id: string }>();  // Get the FPO ID from the route
  const [fpo, setFpo] = useState<FPOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFPOData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<FPOData[]> = await axios.get(
          `https://dev-api.farmeasytechnologies.com/api/fpos/?skip=0&limit=10`
        );

        // Find the FPO with the matching ID
        const foundFPO = response.data.find((item) => item.id === id);

        if (foundFPO) {
          setFpo(foundFPO);
        } else {
          setError(`FPO with ID ${id} not found.`);
        }
      } catch (err: any) {
        setError(`Error fetching FPO data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchFPOData();
    }
    else{
        setError("FPO ID not provided")
        setLoading(false)
    }
  }, [id]);

  const renderFPOData = () => {
    if (!fpo) {
      return <div className="text-gray-500">No FPO data to display.</div>;
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">FPO Details</h2>
        <div><strong>FPO ID:</strong> {fpo.fpo_id}</div>
        <div><strong>Constitution:</strong> {fpo.constitution}</div>
        <div><strong>Entity Name:</strong> {fpo.entity_name}</div>
        <div><strong>Number of Farmers:</strong> {fpo.no_of_farmers}</div>
        <div><strong>Address:</strong> {fpo.address}</div>
        <div><strong>State:</strong> {fpo.state}</div>
        <div><strong>District:</strong> {fpo.district}</div>
        <div><strong>Area of Operation:</strong> {fpo.area_of_operation}</div>
        <div><strong>Establishment Year:</strong> {fpo.establishment_year}</div>
        <div><strong>Major Crops Produced:</strong> {fpo.major_crop_produced.join(', ')}</div>
        <div><strong>Previous Year Turnover:</strong> {fpo.previous_year_turnover}</div>
        <div><strong>Contact Person Name:</strong> {fpo.contact_person_name}</div>
        <div><strong>Contact Person Phone:</strong> {fpo.contact_person_phone}</div>
        <div><strong>PAN Number:</strong> {fpo.pan_no}</div>
        <div><strong>PAN Copy Collected:</strong> {fpo.is_pan_copy_collected ? 'Yes' : 'No'}</div>
        {fpo.pan_image && <img src={fpo.pan_image} alt="PAN" className="w-64 rounded shadow" />}
        <div><strong>Incorporation Doc Collected:</strong> {fpo.is_incorporation_doc_collected ? 'Yes' : 'No'}</div>
        {fpo.incorporation_doc_img && <img src={fpo.incorporation_doc_img} alt="Incorporation Doc" className="w-64 rounded shadow" />}
        <div><strong>Registration Number Collected:</strong> {fpo.is_registration_no_collected ? 'Yes' : 'No'}</div>
        <div><strong>Registration Number:</strong> {fpo.registration_no}</div>
        {fpo.registration_no_img && <img src={fpo.registration_no_img} alt="Registration Number" className="w-64 rounded shadow" />}
        <div><strong>Director Shareholder List Collected:</strong> {fpo.is_director_shareholder_list_collected ? 'Yes' : 'No'}</div>
        {fpo.director_shareholder_list_image && <img src={fpo.director_shareholder_list_image} alt="Director Shareholder List" className="w-64 rounded shadow" />}
        <div><strong>Active:</strong> {fpo.active ? 'Yes' : 'No'}</div>
        <div><strong>Created At:</strong> {fpo.created_at}</div>
        <div><strong>Updated At:</strong> {fpo.updated_at}</div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading FPO details...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">FPO Details Page</h1>
      {renderFPOData()}
    </div>
  );
};

export default FPO;

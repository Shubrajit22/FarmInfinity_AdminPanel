import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Application {
  _id: string;
  createdAt: string;
  status: string;
  
}

const FarmerApplication: React.FC = () => {
  const { id: farmerId } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://dev-api.farmeasytechnologies.com/api/applications/${farmerId}?skip=0&limit=10`
        );
        setApplications(response.data?.data || []);
      } catch (err) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };

    if (farmerId) {
      fetchApplications();
    }
  }, [farmerId]);

  const handleRowClick = (appId: string) => {
    navigate(`/farmers_details/${appId}`);
  };

  if (loading) return <div className="p-4">Loading applications...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Applications by Farmer ID: <span className="text-indigo-600">{farmerId}</span>
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found for this farmer.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                <th className="p-4 text-left">Application ID</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  onClick={() => handleRowClick(app._id)}
                  className="cursor-pointer hover:bg-gray-50 transition"
                >
                  <td className="p-4 border-t">{app._id}</td>
                  <td className="p-4 border-t">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 border-t">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmerApplication;

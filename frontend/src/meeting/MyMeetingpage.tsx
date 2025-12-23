import { useNavigate } from 'react-router-dom';
import { useGetMeetingsQuery, useUpdateMeetingStatusMutation } from "../store/meeting/meetingApi";
import { Button } from '../components/ui/Button';

export default function MyMeetings() {
  
  const navigate = useNavigate();
  const { data: meetings, isLoading, refetch } = useGetMeetingsQuery();
  const [updateStatus] = useUpdateMeetingStatusMutation();

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

 const handleStatusUpdate = async (
  id: string,
  status: 'accepted' | 'rejected'
) => {
  try {
    await updateStatus({
      id,
      status, // 🔥 force lowercase
    }).unwrap();
    refetch();
  } catch (err) {
    console.error(err);
    alert('Error updating status');
  }
};


  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Meetings</h2>
        <Button onClick={() => navigate('/createmeeting')}>+ Create Meeting</Button>
      </div>

      {!meetings?.length && <p className="text-center">No meetings found</p>}


     {meetings?.map((m) => {
  const status = m.status.toLowerCase();

  return (
    <div key={m._id} className="border p-4 rounded shadow bg-white">
      <h4 className="text-lg font-medium">{m.title}</h4>

      <p>
        Status:{" "}
        <span
          className={`font-semibold ${
            status === 'pending'
              ? 'text-yellow-600'
              : status === 'accepted'
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {status.toUpperCase()}
        </span>
      </p>

      <p>
        {new Date(m.startTime).toLocaleString()} → {new Date(m.endTime).toLocaleString()}
      </p>

      <p>
        Participants: {Array.isArray(m.participants)
          ? m.participants.map((p: { name: string }) => p.name).join(', ')
          : m.participants?.name || 'N/A'}
      </p>

      {status === 'pending' && (
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleStatusUpdate(m._id, 'accepted')}
          >
            Accept
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleStatusUpdate(m._id, 'rejected')}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
})}

    </div>
  );
}

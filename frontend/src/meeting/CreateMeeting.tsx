import { useState } from 'react';
import { useCreateMeetingMutation } from '../store/meeting/meetingApi';
import { useGetAllUsersQuery } from '../store/user/userApi';
import { Button } from '../components/ui/Button';

export default function CreateMeeting() {
  const [createMeeting, { isLoading }] = useCreateMeetingMutation();
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const [form, setForm] = useState({
    participantId: '',
    title: '',
    startTime: '',
    endTime: '',
  });

  const submit = async () => {
    // ✅ Validate fields
    if (!form.participantId || !form.title || !form.startTime || !form.endTime) {
      alert('Please fill all fields');
      return;
    }

    // ✅ Validate participantId is a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(form.participantId)) {
      alert('Invalid participant selected');
      return;
    }

    // ✅ Validate start/end time
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    if (start >= end) {
      alert('Start time must be before end time');
      return;
    }

    try {
      await createMeeting({
        ...form,
        participantId: form.participantId, // string (_id)
      }).unwrap();

      alert('Meeting created successfully');
      setForm({ participantId: '', title: '', startTime: '', endTime: '' });
    } catch (err: any) {
      console.error('Error creating meeting:', err);
      alert(err.data?.message || 'Error creating meeting');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Create Meeting
      </h2>

      {/* Participant Dropdown */}
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.participantId}
        onChange={(e) => setForm({ ...form, participantId: e.target.value })}
      >
        <option value="">Select Participant</option>
        {users?.map((user: any) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      {/* Title */}
      <input
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Start Time */}
      <input
        type="datetime-local"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />

      {/* End Time */}
      <input
        type="datetime-local"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
      />

      <Button
        onClick={submit}
        disabled={isLoading || usersLoading}
        className="w-full py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        {isLoading ? 'Creating...' : 'Create Meeting'}
      </Button>
    </div>
  );
}

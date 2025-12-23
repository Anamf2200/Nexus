import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useGetMeetingsQuery } from '../store/meeting/meetingApi';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
});

export default function CalendarView() {
  const { data } = useGetMeetingsQuery();

  const events = data?.map((m) => ({
    title: m.title,
    start: new Date(m.startTime),
    end: new Date(m.endTime),
  }));

  return <Calendar localizer={localizer} events={events} />;
}

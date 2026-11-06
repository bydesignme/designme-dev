'use client';
// The preview from designme.dev, rebuilt from the React component: signup to paid, for everyone, teams or solo users.
import { FunnelChart } from '../components/funnel-chart/FunnelChart';

export default function FunnelChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <FunnelChart title="Signup to paid" shareLabel="of signups"
        stages={['Signed up', 'Opened a file', 'Ran the agent', 'Invited a teammate', 'Paid']}
        views={[
          { key: 'all', label: 'All', values: [12400, 9180, 6420, 2310, 1490], insight: 'The biggest drop is after the first agent run. 64% never invite a teammate.' },
          { key: 'team', label: 'Teams', values: [4100, 3570, 2980, 1890, 1210], insight: 'Teams convert well. Most drop off at payment, so the plan page matters most here.' },
          { key: 'solo', label: 'Solo', values: [8300, 5610, 3440, 420, 280], insight: 'Solo users rarely invite anyone. Try a paid plan that does not need a team.' }
        ]} />
    </div>
  );
}

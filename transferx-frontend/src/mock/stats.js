export const mockStats = {
  totalPlayers:         850,
  totalClubs:            45,
  totalLeagues:           5,
  totalAgents:           85,
  activeContracts:      620,
  transfersThisSeason:  142,
  totalTransferValue: 8500000,
};

export const mockTransferHistory = [
  { history_id: 1, transfer_id: 1, player_name: 'Jamal Bhuyan',   event_type: 'Initiated',  event_date: '2023-01-01', notes: 'Medical scheduled in Dhaka',     recorded_by: 'admin@transferx.com' },
  { history_id: 2, transfer_id: 1, player_name: 'Jamal Bhuyan',   event_type: 'Completed',  event_date: '2023-01-15', notes: 'Contract signed',                 recorded_by: 'admin@transferx.com' },
  { history_id: 3, transfer_id: 2, player_name: 'Rakib Hossain',  event_type: 'Rumoured',   event_date: '2024-01-10', notes: 'Reports in local media',          recorded_by: 'admin@transferx.com' },
  { history_id: 4, transfer_id: 2, player_name: 'Rakib Hossain',  event_type: 'Confirmed',  event_date: '2024-02-05', notes: 'Club confirms interest',          recorded_by: 'admin@transferx.com' },
  { history_id: 5, transfer_id: 2, player_name: 'Rakib Hossain',  event_type: 'Completed',  event_date: '2024-02-20', notes: 'Player joined Kings training',    recorded_by: 'admin@transferx.com' },
  { history_id: 6, transfer_id: 4, player_name: 'Nabib Newaz',    event_type: 'Announced',  event_date: '2023-06-15', notes: 'Free transfer announcement',      recorded_by: 'admin@transferx.com' },
  { history_id: 7, transfer_id: 4, player_name: 'Nabib Newaz',    event_type: 'Completed',  event_date: '2023-07-01', notes: 'Contract signed with Mohammedan', recorded_by: 'admin@transferx.com' },
];

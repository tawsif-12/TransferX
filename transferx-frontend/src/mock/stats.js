export const mockStats = {
  totalPlayers:         4247,
  totalClubs:            384,
  totalLeagues:           32,
  totalAgents:           891,
  activeContracts:      3102,
  transfersThisSeason:  1456,
  totalTransferValue: 12400000000,
};

export const mockTransferHistory = [
  { history_id: 1, transfer_id: 1, player_name: 'Erling Haaland',  event_type: 'Initiated',  event_date: '2022-06-01', notes: 'Medical scheduled',      recorded_by: 'admin@transferx.com' },
  { history_id: 2, transfer_id: 1, player_name: 'Erling Haaland',  event_type: 'Completed',  event_date: '2022-07-01', notes: 'All paperwork signed',    recorded_by: 'admin@transferx.com' },
  { history_id: 3, transfer_id: 3, player_name: 'Lionel Messi',    event_type: 'Announced',  event_date: '2023-06-07', notes: 'Official club statement', recorded_by: 'admin@transferx.com' },
  { history_id: 4, transfer_id: 3, player_name: 'Lionel Messi',    event_type: 'Completed',  event_date: '2023-07-15', notes: 'Player arrived in Miami', recorded_by: 'admin@transferx.com' },
  { history_id: 5, transfer_id: 2, player_name: 'Kylian Mbappé',   event_type: 'Rumoured',   event_date: '2024-01-15', notes: 'Reports in Spanish press', recorded_by: 'admin@transferx.com' },
  { history_id: 6, transfer_id: 2, player_name: 'Kylian Mbappé',   event_type: 'Confirmed',  event_date: '2024-05-22', notes: 'Player confirms on SNS',  recorded_by: 'admin@transferx.com' },
  { history_id: 7, transfer_id: 2, player_name: 'Kylian Mbappé',   event_type: 'Completed',  event_date: '2024-07-01', notes: 'Contract signed in Madrid', recorded_by: 'admin@transferx.com' },
];

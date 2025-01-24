import axios from 'axios';

export async function getEarningsStats() {
  const response = await axios.get('/api/billing/reporting/earnings_stats/');
  return response.data;
}

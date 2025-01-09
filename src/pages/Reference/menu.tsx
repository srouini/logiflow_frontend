import { MenuProps } from 'antd';
import { Link } from 'react-router-dom';

export const referenceMenu: MenuProps['items'] = [
  {
    key: 'agent-douane',
    label: <Link to="/references/agent-douane">Agents Douane</Link>,
  },
  // Add other reference menu items here
];

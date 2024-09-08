import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


interface DetailsButtonProps {
    text:string,
    navigate_to: string
}

const DetailsButton = ({text,navigate_to}:DetailsButtonProps) => {
    const navigate = useNavigate();
  return (
    <Button onClick={() =>  navigate(navigate_to)}>{text}</Button>   )
}

export default DetailsButton
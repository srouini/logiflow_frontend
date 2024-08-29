import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


interface DetailsButtonProps {
    text:string,
    id:number | string
}
const DetailsButton = ({text,id}:DetailsButtonProps) => {
    const navigate = useNavigate();
  return (
    <Button onClick={() =>  navigate(`/rotations/containers/${id}`)}>{text}</Button>   )
}

export default DetailsButton
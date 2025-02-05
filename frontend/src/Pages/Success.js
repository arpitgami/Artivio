import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => navigate("/home"), 2000);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <FontAwesomeIcon icon={faCircleCheck} className="text-green-700 h-40 " />
      <div className="text-3xl font-bold text-green-700">Success</div>
    </div>
  );
};

export default Success;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const Failed = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => navigate("/home"), 2000);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <FontAwesomeIcon
        icon={faCircleExclamation}
        className="text-red-700 h-40 "
      />
      <div className="text-3xl font-bold text-red-700">Payment Failed</div>
    </div>
  );
};

export default Failed;

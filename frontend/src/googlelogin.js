import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Googlelogin() {
  // console.log("check");
  const navigate = useNavigate();
  async function handlegooglelogin(credentialResponse) {
    try {
      console.log(credentialResponse);
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/google`,
        {
          credential: credentialResponse.credential,
        }
      );
      console.log("google res: ", res.data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("loggedInUser", res.data.username);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        handlegooglelogin(credentialResponse);
      }}
      onError={(err) => {
        console.log(err);
      }}
    />
  );
}

export default Googlelogin;

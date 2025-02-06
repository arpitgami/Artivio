import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyEditsCard = ({ edit }) => {
  const [posterdata, setPosterData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("data:", edit);
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/posters/${edit.posterid}`)
      .then((res) => {
        console.log("Poster data:", res.data[0]);
        setPosterData(res.data[0]);
      })
      .catch((err) => {
        console.error("Error fetching poster data:", err);
      });
  }, []);

  async function handleaddtocart() {
    try {
      const user = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/cart`,
        {
          posterid: posterdata._id,
          userid: user.data._id,
          customized: true,
          quantity: 1,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      // console.log(res.data);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {!posterdata && null}
      {posterdata && (
        <div className="hero bg-base-100 flex-col justify-items-start ml-48 ">
          <div className="hero-content flex-col lg:flex-row">
            <img
              src={edit.imageURL}
              className="max-w-sm rounded-lg shadow-2xl w-48 h-60"
            />
            <div>
              <h1 className="text-5xl font-bold mb-8 ">
                {posterdata.posterName}
              </h1>
              <div>
                <div
                  className="btn"
                  onClick={() => {
                    navigate(`/editor/${posterdata._id}?loaduseredit=true`);
                  }}
                >
                  Customize
                </div>
                <button className="btn ml-4" onClick={handleaddtocart}>
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyEditsCard;

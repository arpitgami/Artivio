import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PosterCard } from "../PosterCard";
import { NavigationPannel } from "../NavigationPannel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";

export function YourDesignsPage() {
  const [posterData, setPosterData] = useState([]);
  const [designerId, setDesignerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setDesignerId(res.data._id);
      });
  }, []);

  useEffect(() => {
    if (!designerId) return;
    axios(`${process.env.REACT_APP_API_BASE_URL}/posters/designs/${designerId}`)
      .then((res) => {
        setPosterData(res.data);
        // console.log(res.data);
      })
      .catch((err) => console.log("Didnt get posters"));
  }, [designerId]);

  async function handleposterdelete(id) {
    console.log("posterid : ", id);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posters/delete`,
        { posterid: id, designerid: designerId },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      document.getElementById(`modal-${id}`).close();
      navigate("/home/yourdesign");
      // console.log("res : ", res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <NavigationPannel />
        <div className="flex flex-wrap gap-10 m-8 justify-center">
          {posterData.length > 0 ? (
            <>
              {posterData.map((poster) => (
                <>
                  <div className="relative inline-block">
                    <PosterCard key={poster._id} poster={poster} />
                    <FontAwesomeIcon
                      className="absolute top-2 right-2  cursor-pointer rounded-full bg-base-100 p-2"
                      icon={faTrashCan}
                      onClick={() =>
                        document
                          .getElementById(`modal-${poster._id}`)
                          .showModal()
                      }
                    />
                    <FontAwesomeIcon
                      className="absolute top-2 right-11  cursor-pointer rounded-full bg-base-100 p-2"
                      icon={faPenToSquare}
                      onClick={() =>
                        navigate(
                          `/home/yourdesign/upload?posterid=${poster._id}`
                        )
                      }
                    />
                  </div>
                  {/* Modal  */}
                  <dialog id={`modal-${poster._id}`} className="modal">
                    <div className="modal-box flex flex-col items-center justify-center w-2/4">
                      <h3 className="font-bold text-xl mb-4">
                        Are you sure you want to delete this poster!!
                      </h3>
                      <div className="flex flex-row gap-4">
                        <div
                          className="btn"
                          onClick={() => {
                            document
                              .getElementById(`modal-${poster._id}`)
                              .close();
                          }}
                        >
                          Cancel
                        </div>
                        <div
                          className="btn bg-red-500 hover:bg-red-400"
                          onClick={() => handleposterdelete(poster._id)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </dialog>
                </>
              ))}
            </>
          ) : (
            <div className="text-gray-500 text-center mt-8">
              No posters found
            </div>
          )}
        </div>
      </div>
    </>
  );
}

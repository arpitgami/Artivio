import MyEditsCard from "./MyEditsCard";
import { NavigationPannel } from "../NavigationPannel";
import { useEffect, useState } from "react";
import axios from "axios";

const MyEdits = () => {
  const [editsData, setEditsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEdits = async () => {
      try {
        setLoading(true);
        setError("");

        const userRes = await axios.get("http://localhost:8080/user", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        const userid = userRes.data._id;
        console.log("User data:", userRes.data);

        const editsRes = await axios.get(
          `http://localhost:8080/posters/uploadimage?userid=${userid}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );

        console.log("Edits data:", editsRes.data);
        setEditsData(editsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load your edits.");
      } finally {
        setLoading(false);
      }
    };

    fetchEdits();
  }, []);

  return (
    <>
      <NavigationPannel />
      <div className="p-4">
        {loading && <p className="text-center">Loading your edits...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && editsData.length === 0 && (
          <p className="text-center">No edits found!</p>
        )}

        {!loading && editsData.length > 0 && (
          <div className="flex flex-col ">
            {editsData.map((edit) => (
              <MyEditsCard key={edit._id} edit={edit} />
            ))}
          </div>
        )}
      </div>
      <div className="flex w-3/12 mx-auto flex-col mb-4 ">
        <div className="divider " />
      </div>
    </>
  );
};

export default MyEdits;

"use client";

import { useEffect, useState } from "react";
import "./globals.css"; // Import the CSS file
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default function Home() {
  const [show, setshow] = useState(true);
  const [showDetailIndex, setShowDetailIndex] = useState<number | null>(null);
  const [complete, setcomplete] = useState(false);
  const [tasks, settasks] = useState<any>([]);
  const [description, setdescription] = useState("");
  const [loading, setloading] = useState(false);
  const [setcom, setsetcom] = useState<any>([]);
  const [modal, setmodal] = useState(false);
  const [updatedid, setupdatedid] = useState("");
  const [updatedesc, setupdatedesc] = useState("");

  const router = useRouter();

  const handleshow = (option: any) => {
    setshow(option);
  };
  const handleShowDetail = (index: number) => {
    setShowDetailIndex(index === showDetailIndex ? null : index);
  };
  const handlecomplete = (option: any) => {
    setcomplete(option);
  };
  const handleDescriptionChange = (event: any) => {
    setdescription(event.target.value);
  };
  const handleupdatedec = (event: any) => {
    setupdatedesc(event.target.value);
  };

  const showmodal = (id: any) => {
    setmodal(true);
    setupdatedid(id);
  };
  const hidemodal = () => {
    setmodal(false);
  };

  const getAllTask = async () => {
    try {
      const response = await axios.get(
        `https://cheetah-production.up.railway.app/api/v1/tasks`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        settasks(response.data.tasks);
      } else {
      }
    } catch (error: any) {}
  };
  const logOut = async () => {
    try {
      const response = await axios.get(
        `https://cheetah-production.up.railway.app/api/v1/logout`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        toast.success("User logout ");
        Cookies.set("token", "", { expires: new Date(Date.now()) });
        setTimeout(() => {
          router.push("/login"); // Redirect to home page after displaying the toast
        }, 1000);
      } else {
      }
    } catch (error: any) {}
  };

  const completetask = async (id: any) => {
    try {
      setloading(true);
      const response = await axios.get(
        `https://cheetah-production.up.railway.app/api/v1/complete/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        console.log(JSON.stringify(response.data)); // Redirect to home page after displaying the toast
        await getAllTask();
      } else {
        console.log("yhhyhhyhhy " + response.data);
      }
    } catch (error: any) {
      console.log("Error: " + error);
    } finally {
      setloading(false); // Set loading back to false after task creation process completes
    }
  };

  const createTask = async () => {
    try {
      setloading(true);
      const response = await axios.post(
        `https://cheetah-production.up.railway.app/api/v1/createtasks`,
        {
          description,
        },
        {
          withCredentials: true,
        }
      );

      console.log(JSON.stringify(response.data.result)); // Redirect to home page after displaying the toast
      if (response.data.success) {
        toast.success("New Task generated successfully");
        setdescription(""); // Clear input field after successful task creation
        await getAllTask();
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error: any) {
      console.log("Error: " + error);
      toast.error("An unexpected error occurred");
    } finally {
      setloading(false); // Set loading back to false after task creation process completes
    }
  };

  const updateTask = async (id: any) => {
    try {
      setloading(true);
      const response = await axios.put(
        `https://cheetah-production.up.railway.app/api/v1/updatetask/${id}`,
        {
          description: updatedesc,
        },
        {
          withCredentials: true,
        }
      );

      console.log(JSON.stringify(response.data)); // Redirect to home page after displaying the toast
      if (response.data.success) {
        toast.success("Task updated successfully");
        setmodal(false);
        setupdatedesc(""); // Clear input field after successful task creation
        await getAllTask();
        setloading(false);
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error: any) {
      console.log("Error: " + error);
      toast.error("An unexpected error occurred");
    } finally {
      setloading(false); // Set loading back to false after task creation process completes
    }
  };

  const deleteTask = async (id: any) => {
    try {
      setloading(true);
      const response = await axios.delete(
        `https://cheetah-production.up.railway.app/api/v1/deletetask/${id}`,
        {
          withCredentials: true,
        }
      );

      console.log(response.data); // Redirect to home page after displaying the toast
      if (response.data.success) {
        toast.success("Task deleted successfully");
        await getAllTask();
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error: any) {
      console.log("Error: " + error);
      toast.error("An unexpected error occurred");
    } finally {
      setloading(false); // Set loading back to false after task creation process completes
    }
  };
  const authToken = Cookies.get("token");
  useEffect(() => {
    // if (!authToken) {
    //   router.push("/login");
    // } else {
      getAllTask();
    // }
  }, []);

  // if (!authToken) {
  //   return null;
  // }

  return (
    <main>
      <ToastContainer />
      {!loading ? (
        <div className="imagecomtainer">
          <img className="banner" src="/image.webp" alt="Background Image" />
          <div className="maindiv2">
            <button onClick={logOut}>
              {" "}
              <img src="/logout.png" alt="close image " />
            </button>
            <div>Logout</div>
          </div>

          <div className="maindiv">
            <div className="profilediv">
              <img
                className="profile"
                src="/profile.jpg"
                alt="Background Image"
              />
            </div>
            <div className="addmain">
              <div className="addtask">
                <input
                  type="text"
                  placeholder="Add new task's description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <button onClick={createTask}>
                  <img src="/plus.png" alt="" />
                </button>
              </div>
            </div>
            <div className="addmain2">
              <div className="taskheading">
                <div className="todoimage">
                  <img src="/todo.png" alt="" />
                  <p> Your todos </p>
                </div>
                <button onClick={() => handleshow(!show)}>
                  {show ? (
                    <img src="/arrowdown.png" alt="close image " />
                  ) : (
                    <img src="/greaterthan.png" alt="close image " />
                  )}
                </button>
              </div>
            </div>
            {show ? (
              <div className="mainactivity">
                {tasks.length > 0 ? (
                  <div className="mainstart">
                    {tasks &&
                      tasks.map((item: any, index: any) => (
                        <div key={index}>
                          <div className="addmain2">
                            <div className="taskheading3">
                              <div className="todoimage">
                                <button onClick={() => completetask(item._id)}>
                                  {!item.completed ? (
                                    <img src="/tick.png" alt="" />
                                  ) : (
                                    <img src="/greentick.png" alt="" />
                                  )}
                                </button>
                                <p> Task {index + 1} </p>
                              </div>
                              <button onClick={() => handleShowDetail(index)}>
                                <img src="/dots.png" alt="close image " />
                              </button>
                            </div>
                          </div>
                          {showDetailIndex === index ? (
                            <div>
                              <div className="complete">
                                <div className="cotext">Descrption : </div>
                                <div className="cotextg">
                                  {item.description}
                                </div>
                                <button
                                  className="btnedit"
                                  onClick={() => showmodal(item._id)}
                                >
                                  <img
                                    className="imgedit"
                                    src="/edit.png"
                                    alt="close image "
                                  />
                                </button>
                              </div>
                              <div className="complete">
                                <div className="cotext">Completed : </div>

                                <div className="cotextg">
                                  {item.completed ? (
                                    <div>Completed</div>
                                  ) : (
                                    <div>Not complete</div>
                                  )}
                                </div>
                              </div>
                              <div className="complete">
                                <div className="cotext">Created At : </div>
                                <div className="cotextg">
                                  {new Date(item.createAt).toLocaleString()}
                                </div>
                              </div>
                              <div className="dltbtn">
                                <button onClick={() => deleteTask(item._id)}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="mainstart">
                    <div className="emptymain">
                      <div>No task today</div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          {modal && (
            <div className="modalmain">
              <div className="modalinput">
                <input
                  className="addtask"
                  type="text"
                  placeholder="Update task description"
                  value={updatedesc}
                  onChange={handleupdatedec}
                />
              </div>
              <div className="modalmainbtndiv">
                <div className="updiv">
                  <button
                    className="modalbtn"
                    onClick={() => updateTask(updatedid)}
                  >
                    Update
                  </button>
                </div>
                <div className="updiv">
                  <button className=" cancel" onClick={hidemodal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="loading-container">
          {loading && <div className="loading">Loading...</div>}
        </div>
      )}
    </main>
  );
}

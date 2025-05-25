import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import EditModal from "./components/EditModal";

const AddEarning = () => {
  const [percents, setPercents] = useState({ percent: 0, type: "red" });
  const [selectedPost, setSelectedPost] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState("");
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  useEffect(() => {
    fetchPosts();
    fetchPercents();
  }, []);
  const fetchPercents = () => {
    axios.get("/get_percents").then((res) => {
      setPercents({ type: res.data?.type, percent: res.data?.percent });
    });
  };

  const fetchPosts = () => {
    axios.get("/earnings").then((res) => {
      setPosts(res.data);
    });
  };

  const handleDelete = (id) => {
    axios.delete(`/earnings/${id}`).then((res) => {
      fetchPosts();
    });
  };

  useEffect(() => {
    axios.get("/profile").then((res) => {
      if (res?.data?.name) {
        setName(res.data?.name);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/earnings", {
        title: e.target[0].value,
        monitization_earning: e.target[1].value,
        ad_earning: e.target[2].value,
        datePublished: e.target[3].value,
        image: e.target[4].value,
        type: e.target[5].value,
      })
      .then((res) => {
        alert("New post earning added");
        // clear the form
        e.target[0].value = "";
        e.target[1].value = "";
        e.target[2].value = "";
        e.target[3].value = "";
        e.target[4].value = "";
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPercents({ ...percents, [name]: value });
  };

  const updatePercent = (e) => {
    e.preventDefault();
    axios.put("/update_percents", percents).then((res) => {
      alert("Updated");
    });
  };

  const handleUploadImage = (e) => {
    e.preventDefault();
    let fd = new FormData();
    fd.append("image", file);
    axios.put("/update_image", fd).then((res) => {
      alert("Image Updated");
      setFile(null);
      e.target[0].value = "";
    });
  };

  const updateName = (e) => {
    e.preventDefault();
    axios.put("/update_name", { name }).then((res) => {
      alert("Name Updated");
    });
  };

  return (
    <div className="container">
      <div className="">
        <h3>Update Percents</h3>
        <form
          onSubmit={updatePercent}
          className="d-flex gap-2 align-items-end mb-2"
        >
          <div class="">
            <label class="form-label">Percent</label>
            <input
              type="text"
              value={percents.percent}
              onChange={handleChange}
              name="percent"
              class="form-control"
              required
            />
          </div>
          <div class="">
            <label class="form-label">Type</label>
            <select
              class="form-select"
              aria-label="Default select example"
              required
              defaultValue={percents.type}
              onChange={handleChange}
              name="type"
            >
              <option value={"red"} selected={percents.type === "red"}>
                Red
              </option>
              <option value="green" selected={percents.type === "green"}>
                Green
              </option>
            </select>
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
      <div className="my-5 d-flex justify-content-between">
        <form onSubmit={handleUploadImage}>
          <h5>Update Image</h5>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit" className="btn btn-primary">
            Upload
          </button>
        </form>
        <form onSubmit={updateName}>
          <h5>Update Name</h5>
          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
      <div className="form">
        <h3>Add New Post Earning</h3>
        <form onSubmit={handleSubmit}>
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Monitization Earning</label>
            <input type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Ad Earning</label>
            <input type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Publish Date</label>
            <input type="date" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Image Url</label>
            <input type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Post Type</label>
            <select
              class="form-select"
              aria-label="Default select example"
              required
            >
              <option value={"video"} selected>
                Video
              </option>
              <option value="reel">Reel</option>
              <option value="photo_text">Photo or text</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div className="mt-3">
        <h3>View Added Earning</h3>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Monitization Earning</th>
              <th scope="col">Ad Earning</th>
              <th scope="col">Publish Date</th>
              <th scope="col">Image URL</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <tr>
                <th scope="row">{++i}</th>
                <td>{post.title}</td>
                <td>{post.monitization_earning}</td>
                <td>{post.ad_earning}</td>
                <td>{moment(post.datePublished).format("Do MMMM YYYY")}</td>
                <td>{post.image}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditModal(true);
                      setSelectedPost(post);
                    }}
                    type="button"
                    class="btn btn-primary me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    type="button"
                    class="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editModal && (
        <EditModal
          show={editModal}
          onHide={() => {
            setEditModal(false);
            fetchPosts();
          }}
          post={selectedPost}
        />
      )}
    </div>
  );
};

export default AddEarning;

import axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const EditModal = ({ show, onHide, post }) => {
  const [data, setData] = useState({
    title: post?.title || "",
    monitization_earning: post?.monitization_earning || "",
    ad_earning: post?.ad_earning || "",
    datePublished: post?.datePublished || "",
    image: post?.image || "",
    type: post?.type || "video",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/earnings/${post?._id}`, data).then((res) => {
      alert("Post updated");
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input
              name="title"
              value={data.title}
              onChange={handleChange}
              type="text"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Monitization Earning</label>
            <input
              name="monitization_earning"
              value={data.monitization_earning}
              onChange={handleChange}
              type="text"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Ad Earning</label>
            <input
              name="ad_earning"
              value={data.ad_earning}
              onChange={handleChange}
              type="text"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Publish Date</label>
            <input
              name="datePublished"
              value={data.datePublished}
              onChange={handleChange}
              type="date"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Image Url</label>
            <input
              name="image"
              value={data.image}
              onChange={handleChange}
              type="text"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Post Type</label>
            <select
              name="type"
              value={data.type}
              onChange={handleChange}
              class="form-select"
              aria-label="Default select example"
            >
              <option value={"video"} selected>
                Video
              </option>
              <option value="reel">Reel</option>
              <option value="photo_text">Photo or text</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary">
            Update
          </button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, CheckCircle } from 'lucide-react';

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token"); // Admin JWT token

  const fetchTestimonials = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/admin/testimonials?page=${currentPage}&limit=2`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const responseData = response.data;
      let fetchedTestimonials = [];
      let fetchedTotalCount = 0;

      if (Array.isArray(responseData)) {
        fetchedTestimonials = responseData;
        fetchedTotalCount = responseData.length;
      } else if (responseData && Array.isArray(responseData.testimonials)) {
        fetchedTestimonials = responseData.testimonials;
        fetchedTotalCount = responseData.totalCount;
      } else {
        setError("Invalid data received from the backend. Please check the API response format.");
        setLoading(false);
        return;
      }

      setTestimonials(fetchedTestimonials);
      setTotalPages(Math.ceil(fetchedTotalCount / 2));
    } catch (err) {
      console.error("Error fetching testimonials:", err.response?.data || err.message);
      setError("Failed to fetch testimonials. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(page);
  }, [page]);

  const handleAction = async (id, action) => {
    try {
      if (action === "delete") {
        await axios.delete(
          `http://localhost:3001/api/admin/testimonials/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (action === "approve") {
        const testimonial = testimonials.find((t) => t.id === id);
        if (!testimonial) throw new Error("Testimonial not found");

        await axios.put(
          `http://localhost:3001/api/admin/testimonials/${id}`,
          {
            customer_name: testimonial.customer_name,
            profession: testimonial.profession,
            quote: testimonial.quote,
            image_url: testimonial.image_url,
            status: "approved", // only update status
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchTestimonials(page);
    } catch (err) {
      console.error(`Error performing ${action} on testimonial ${id}:`, err.response?.data || err.message);
      setError(`Failed to ${action} testimonial. See console for details.`);
    }
  };

  const handleApprove = (id) => handleAction(id, "approve");
  const handleDelete = (id) => handleAction(id, "delete");
  const handleEdit = (id) => console.log(`Editing testimonial with ID: ${id}`);

  if (loading) return <div className="loading-message">Loading admin panel...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="content-card-container">
      {testimonials.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No testimonials found.</p>
        </div>
      ) : (
        <div className="item-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="item-card">
              <div>
                <img
                  src={testimonial.image_url}
                  alt={`${testimonial.customer_name}'s profile`}
                  className="testimonial-image"
                />
                <h4 className="customer-name">{testimonial.customer_name}</h4>
                <p className="profession">{testimonial.profession}</p>
                <p className="quote">"{testimonial.quote}"</p>
                <span
                  className={`status-badge ${
                    testimonial.status === "approved" ? "badge-approved" : "badge-pending"
                  }`}
                >
                  {testimonial.status}
                </span>
              </div>

              <div className="card-footer">
                {testimonial.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(testimonial.id)}
                    className="action-button btn-primary"
                    aria-label="Approve Testimonial"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(testimonial.id)}
                  className="action-button btn-edit"
                  aria-label="Edit Testimonial"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="action-button btn-delete"
                  aria-label="Delete Testimonial"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination-controls">
        <button
          onClick={() => setPage((page) => Math.max(1, page - 1))}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="page-info">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestimonialsAdmin;

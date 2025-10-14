import React from "react";

interface LearningAreaFormProps {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  courses: Array<{ id: number; name: string }>;
}

const LearningAreaForm: React.FC<LearningAreaFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  courses,
}) => (
  <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
    <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Learning Area</h3>
    <label style={{ display: "grid", gap: 6 }}>
      <span>Course *</span>
      <select
        required
        value={formData.courseId || ""}
        onChange={(e) => handleInputChange("courseId", e.target.value)}
        style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
      >
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
    </label>
    <label style={{ display: "grid", gap: 6 }}>
      <span>Learning Area Name *</span>
      <input
        type="text"
        required
        placeholder="e.g., Algebra, Information and Ideas"
        value={formData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
      />
    </label>
    <label style={{ display: "grid", gap: 6 }}>
      <span>Description</span>
      <textarea
        placeholder="Learning area description..."
        rows={3}
        value={formData.description || ""}
        onChange={(e) => handleInputChange("description", e.target.value)}
        style={{
          padding: 8,
          border: "1px solid #d1d5db",
          borderRadius: 6,
          resize: "vertical",
        }}
      />
    </label>
    <button
      type="submit"
      style={{
        padding: "10px 16px",
        background: "#111827",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Create Learning Area
    </button>
  </form>
);

export default LearningAreaForm;

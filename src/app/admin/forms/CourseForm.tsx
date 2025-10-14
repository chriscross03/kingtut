import React from "react";

interface CourseFormProps {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
    <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Course</h3>

    <label style={{ display: "grid", gap: 6 }}>
      <span>Course Name *</span>
      <input
        type="text"
        required
        placeholder="e.g., SAT Math, SAT English"
        value={formData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
      />
    </label>

    <label style={{ display: "grid", gap: 6 }}>
      <span>Description</span>
      <textarea
        placeholder="Course description..."
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

    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="checkbox"
        checked={formData.isActive !== false}
        onChange={(e) => handleInputChange("isActive", e.target.checked)}
      />
      <span>Active (available to users)</span>
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
      Create Course
    </button>
  </form>
);

export default CourseForm;

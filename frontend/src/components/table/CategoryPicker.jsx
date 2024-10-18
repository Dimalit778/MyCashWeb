import { useGetCategoriesQuery } from "api/slicesApi/userApiSlice";
import Loader from "components/custom/Loader";

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

function CategoryPicker({ type, value, onChange }) {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(type === "Income" ? data.incomes : data.expenses);
  }, [type, data]);

  if (isLoading) return <Loader />;

  if (error) return <div className="text-danger">Error loading categories!</div>;

  return (
    <div className="form">
      <Form.Select value={value} onChange={onChange} className="bg-secondary text-black border-dark">
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}

export default CategoryPicker;

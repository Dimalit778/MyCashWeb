import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "components/ui/icon";
import MyButton from "components/ui/button";
import "./categoriesStyle.css";
import { THEME } from "constants/Theme";
import { useCategories } from "hooks/useCategories";
import { useGetCategoriesQuery } from "services/api/categoriesApi";
import { useParams } from "react-router-dom";

const Categories = () => {
  const { type } = useParams();
  const { data, isLoading, isError } = useGetCategoriesQuery();

  const { newCategory, setNewCategory, handleAdd, handleDelete } = useCategories();

  const categories = data?.categories?.filter((category) => category.type === type);

  if (isLoading || !categories) return null;
  if (isError) return <div>Error</div>;

  return (
    <div className="row g-3 mt-3">
      <div className="col-12">
        <div className="my-card">
          <div className="d-flex justify-content-between">
            <div className="my-card-header">{type.charAt(0).toUpperCase() + type.slice(1)} Categories</div>
            <p className="my-card-header">
              {categories?.length} / {data?.maxCategories}
            </p>
          </div>

          <div className="my-card-body">
            <div className="my-card-list">
              {categories?.map((category) => (
                <div key={category._id} className="my-card-item">
                  <span>{category.label}</span>
                  <IconButton
                    icon={<FontAwesomeIcon icon={faXmark} />}
                    color="white"
                    bgColor="red"
                    onClick={() => handleDelete(category._id)}
                  />
                </div>
              ))}
            </div>

            {categories?.length < data?.maxCategories && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd(newCategory, type);
                }}
                className="mt-3 d-flex align-items-center"
              >
                <input
                  type="text"
                  placeholder={`Add new ${type} category`}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-input"
                />
                <MyButton type="submit" bgColor={THEME.orange} color="white">
                  Add
                </MyButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

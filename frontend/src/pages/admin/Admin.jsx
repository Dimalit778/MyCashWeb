import { Delete } from "@mui/icons-material";
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAdminDeleteUserMutation, useAllUsersQuery } from "api/slicesApi/adminApiSlice";

import { Image, Transformation } from "cloudinary-react";
import Loader from "components/custom/Loader";
import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Row = ({ item, index }) => {
  const { createdAt, email, name, imageUrl, isVerified } = item;
  const createDate = createdAt.slice(0, 10);
  const [adminDeleteUser] = useAdminDeleteUserMutation();

  const handleDelete = async (id) => {
    try {
      const res = await adminDeleteUser({ id }).unwrap();

      if (res) return toast.success("User deleted successfully");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      {/* //? Display each item in row */}
      <TableRow style={{ backgroundColor: "LightGrey" }}>
        <TableCell component="th" scope="row">
          {index++}
        </TableCell>
        <TableCell>
          <Image cloudName="dx6oxmki4" publicId={imageUrl} className="cloudImage">
            <Transformation width="50" height="50" gravity="auto" crop="fill" radius="max" />
          </Image>
        </TableCell>
        <TableCell> {name}</TableCell>
        <TableCell> {email}</TableCell>

        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
          {isVerified ? "Verified" : "Unverified"}
        </TableCell>
        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{createDate}</TableCell>
        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
          <button className="bg-danger" onClick={() => handleDelete(item._id)}>
            <Delete />
          </button>
        </TableCell>
      </TableRow>
    </>
  );
};

const Admin = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: allUsers, isLoading } = useAllUsersQuery();

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!userInfo.isAdmin) navigate("/dashboard");
  // }, []);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="container vh-100 ">
        <h1 className="text-center p-3 ">Users</h1>
        <TableContainer component={Paper}>
          <Table aria-label=" table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Verified</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Created At</TableCell>
                <TableCell
                  sx={{
                    display: { xs: "none", sm: "table-cell" },
                  }}
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ scrollBehavior: "auto", height: "200", width: "100px" }}>
              {allUsers?.map((item, index) => (
                <Row key={item._id} item={item} index={index + 1} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};
export default Admin;

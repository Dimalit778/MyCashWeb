import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ContactUs = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // const [name, setName] = useState('');
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    const serviceId = process.env.REACT_APP_SERVICE_ID;
    const templateId = process.env.REACT_APP_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;

    const templateParams = {
      from_name: userInfo.name,
      from_email: userInfo.email,
      to_name: "MyCash Support",
      subject: subject,
      message: message,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey).then(
      (result) => {
        console.log("email sent successfully", result);
        setSubject("");
        setMessage("");
        toast.success("Email Sent successfully");
      },
      (error) => {
        toast.error("Email wan not sent ");
        console.log(error.text);
      }
    );
  };
  return (
    <div style={{ backgroundColor: "rgb(252, 242, 229)" }}>
      <h1 className="header text-center p-4 ">Contact Us</h1>
      <div className="row p-5 g-5 ">
        <div className=" col-md-6 ">
          <div
            className=" d-flex flex-column justify-content-evenly    "
            style={{
              backgroundColor: "#FFF5EE",
              padding: 20,
              border: "1px solid black",
              height: "100%",
            }}
          >
            <h1 className="text-capitalize ">Hello, {userInfo.name}</h1>
            <h5 className="lh-base">
              Our support team can help you with every question you have, You can contact us and our team will response
              you within 24 hours.
            </h5>
            <h4>Waiting to hear from you.</h4>
          </div>
        </div>
        {/* Right Div - Content Form */}
        <div className="col-md-6">
          <form
            style={{
              backgroundColor: "blueviolet",
              padding: 20,
              border: "3px solid black",
              borderRadius: 10,
            }}
            onSubmit={sendEmail}
          >
            <div>
              <input
                type="text"
                placeholder="Subject ..."
                value={subject}
                required
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <textarea
                style={{
                  width: "90%",
                  height: 150,
                  marginTop: 30,
                  border: "2px solid black",
                  borderRadius: 5,
                }}
                placeholder="You Message ..."
                required
                cols="20"
                rows="10"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button className="bn3637 bn36 fs-6  " type="submit">
              SEND EMAIL
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

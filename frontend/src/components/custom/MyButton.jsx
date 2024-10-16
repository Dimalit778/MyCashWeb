import React from "react";
import { Button } from "react-bootstrap";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to { transform: rotate(.5turn) }
`;

const LoaderSpinner = styled.div`
  width: 20px;
  height: 20px;
  --_c: no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000);
  background: var(--_c) top, var(--_c) left, var(--_c) right, var(--_c) bottom;
  background-size: 5px 5px;
  animation: ${rotate} 1s infinite;
`;

const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.5em;
  visibility: ${(props) => (props.isLoading ? "hidden" : "visible")};
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MyButton = ({ children, isLoading, disabled, onClick, bgColor, color, ...props }) => {
  return (
    <Button
      disabled={disabled || isLoading}
      onClick={onClick}
      style={{
        color: color,
        border: "1px solid ",
        fontFamily: "sans-serif",

        borderColor: color,
        borderRadius: "4px",
        padding: "5px 10px",
        position: "relative",
        backgroundColor: bgColor,
        ...props.style,
      }}
      {...props}
    >
      <ButtonContent isLoading={isLoading}>{children}</ButtonContent>
      {isLoading && (
        <SpinnerWrapper>
          <LoaderSpinner />
        </SpinnerWrapper>
      )}
    </Button>
  );
};

export default MyButton;

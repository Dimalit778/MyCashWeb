import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to { transform: rotate(.5turn) }
`;

const StyledButton = styled.button`
  font-family: "Roboto", sans-serif;
  min-width: 60px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
  padding: 6px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: ${(props) => props.bgColor || "#3498db"};
  color: ${(props) => props.color || "#ffffff"};
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: 0.6s;
  }

  &:hover::before {
    transform: translateX(100%);
  }
`;

const LoaderSpinner = styled.div`
  width: 20px;
  height: 20px;
  --_c: no-repeat radial-gradient(farthest-side, #ffffff 92%, #0000);
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
    <StyledButton disabled={disabled || isLoading} onClick={onClick} bgColor={bgColor} color={color} {...props}>
      <ButtonContent isLoading={isLoading}>{children}</ButtonContent>
      {isLoading && (
        <SpinnerWrapper>
          <LoaderSpinner />
        </SpinnerWrapper>
      )}
    </StyledButton>
  );
};

export default MyButton;

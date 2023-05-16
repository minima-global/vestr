import styled from "@emotion/styled";

const Select = styled("select")`
  // hide default arrow
  // -webkit-appearance: none;
  // appearance: none;

  height: 41px;
  width: 100%;
  background-color: #fff;
  background: #fff;
  border: 1px solid #585f63;
  color: #16181c;
  font-weight: 500;
  padding-left: 8px;
  font-size: 1rem;
  font-family: Manrope-regular;
  > option {
    color: #16181c;
  }

  > ::after {
    content: "▼";
    font-size: 1rem;
    top: 6px;
    right: 10px;
    position: absolute;
  }
`;

export default Select;

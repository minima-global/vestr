import styled from "@emotion/styled";

const Select = styled("select")`
  // hide default arrow
  -webkit-appearance: none;
  appearance: none;

  height: 58px;
  width: 100%;
  background-color: #fff;
  background: #fff;
  border: 1px solid #585f63;
  color: #000;
  font-weight: 800;
  padding: 16.5px 16px;
  font-size: 1rem;
  font-family: Manrope-bold;
  > option {
    color: #fff;
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

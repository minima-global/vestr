import styled from "@emotion/styled";

const OngoingTransaction = styled("div")`
  border-radius: 4px;
  background-color: #fff;
  margin: 16px;
  min-width: 360px;
  max-width: auto;
  padding: 16px;
  overflow: overlay;
  outline: none;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  position: relative;
  height: 50vh;
  * {
    font-family: Manrope-regular;
    font-size: 1rem;
  }
  > h5 {
    border-bottom: 1px solid #d3d3d3;
    padding-bottom: 8px;
    margin: 0;
    padding: 0;
  }
  #list {
    padding: 0;
    margin: 0;
    list-style: none;
    row-gap: 8px;
    display: grid;
    margin: 4px;
  }
  #list * {
    padding: 0;
    margin: 0;
  }
  #list h6 {
    font-size: 0.975rem;
  }
  #list p {
    font-size: 0.875rem;
  }

  #content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  button {
    padding: 4px 16px;
    border: none;
    background-color: #16181c;
    color: #fff;
    font-family: Manrope-regular;
    font-size: 0.975rem;
  }
`;

export default OngoingTransaction;

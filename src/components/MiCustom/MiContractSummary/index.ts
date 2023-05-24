import styled from "@emotion/styled";

export const MiContractSummary = styled("div")`
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  width: 100%;

  @media only screen and (max-width: 600px) {
    display: grid;
    grid-template-columns: repeat(3fr);
    gap: 8px;
  }
  margin-top: 16px;

  > div {
    border: 1px solid #f2f2f2;
    padding: 16px;
    width: 100%;
    margin: 0 8px;
    background-color: #f2f2f2;
  }

  > div * {
    text-align: center;
  }
  > div p {
    font-weight: 600;
    font-variant: tabular-nums;
  }
  > div h6 {
    font-weight: 800;
    font-size: 0.775rem !important;
  }
`;

export default MiContractSummary;

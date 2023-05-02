import styled from "@emotion/styled";

const InputWrapper = styled("div")`
  display: flex;
  flex-direction: column;
`;
const InputWrapperRadio = styled("div")`
  display: flex;
  flex-direction: column;
  border: 1px solid #16181c;
  padding: 13px 0;
  border-radius: 8px;

  > #radio-group {
    gap: 8px;
    padding: 2px 16px;
  }
  > #radio-group label {
    border: 1px solid #16181c;
    border-radius: 8px;
    margin: 0;
  }
  > p {
    text-align: left;
    margin: 0px 16px;
    margin-top: 13px;
    font-family: Manrope-regular;
    font-size: 0.975rem;
  }
`;
const InputLabel = styled("label")`
  font-family: Manrope-regular;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 21px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #ff7358;
  margin-left: 16px;
  margin-bottom: 4px;
`;
const InputHelper = styled("div")`
  text-align: left;
  margin: 0px 16px;
  margin-top: 13px;
  font-family: Manrope-regular;
  font-size: 0.975rem;
  word-break: break-word;
`;

const InputPercentage = styled("div")`
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
  > p {
    padding: 0;
    margin: 0;
    text-align: center;
    font-weight: 700;
    font-family: Manrope-regular;
  }
`;
export {
  InputWrapper,
  InputLabel,
  InputHelper,
  InputWrapperRadio,
  InputPercentage,
};

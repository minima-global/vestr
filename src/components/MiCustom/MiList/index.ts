import styled from "@emotion/styled";

export const MiList = styled("ul")`
  list-style: none;
  margin: 16px 0px;
  padding: 0;
  gap: 4px;
  display: grid;

  * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > p {
    font-family: Manrope-regular;
    font-size: 0.875rem;
    text-align: center;
    text-overflow: hidden;
    white-space: nowrap;
  }

  > li {
    padding: 8px;
    display: grid;
    border-radius: 8px;
    grid-template-columns: 3fr 3fr;
    background-color: #ffede9;
  }
  > li:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  > li div:first-of-type {
    display: flex;
    flex-direction: row;
    gap: 8px;
    text-align: left;
  }
  > li div:first-of-type div *,
  li div:last-of-type * {
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
  }
  > li div:first-of-type div {
    display: flex;
    flex-direction: column;
    gap: 0;
    text-align: left !important;
  }

  > li div:first-of-type img {
    font-size: 0.5rem;
    min-width: 32px;
    width: 32px;
  }
  > li div:first-of-type div h6 {
    font-size: 0.975rem;
    text-overflow: ellipsis;
  }
  > li div:first-of-type div p {
    font-size: 0.875rem;
  }

  > li div:last-of-type {
    text-align: right;
  }
  > li div:last-of-type p {
    font-size: 0.775rem;
    font-family: Manrope-regular;
  }
  > li div:last-of-type img {
    width: 16px;
  }
  > li div:last-of-type svg {
    font-size: 0.975rem;
  }
`;

export default MiList;

import styled from "@emotion/styled";

export const MiCoinDetails = styled("div")`
  background-color: #f2f2f2;
  margin-top: 16px;
  padding: 4px;
  ul#iterator > li#list-subheader {
    font-family: Manrope-regular;
    font-size: 1rem;
    color: #16181c;
    padding-bottom: 8px;
    font-weight: 800;
  }
  ul#iterator {
    margin-bottom: 8px;
  }

  ul#iterator > li {
    background-color: #fff;
  }
  ul#iterator > li#list-subheader {
    background-color: transparent;
    padding: 0;
    margin-bottom: 16px;
  }
  ul#iterator:last-of-type {
    margin-bottom: 0px;
    border-bottom: none;
  }

  h6 {
    margin: 0;
    font-family: Manrope-regular;
    font-size: 1.25rem;
    color: #16181c;
    // border-bottom: 1px solid #d3d3d3;
    // margin-bottom: 16px;
  }
  svg {
    fill: #317aff;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    display: grid;
    grid-template-columns: 4fr;
    row-gap: 4px;
  }
  * {
    font-size: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #363a3f;
  }
  li > p:last-of-type {
    font-weight: 800;
    text-align: right;
  }

  li {
    background-color: #fff;
    padding: 16px;
    overflow: hidden;
    display: grid;
    grid-template-columns: max-content 3fr;
    grid-gap: 8px;
    text-overflow: ellipsis;
  }
  li > p {
    margin: 0 !important;
  }

  @media only screen and (max-width: 733px) {
    li {
      grid-template-columns: 4fr;
      grid-gap: 8px;
    }
    li > p {
      margin: 0 !important;
    }
    li > p:first-of-type {
      margin-bottom: 0;
    }
    li > p:last-of-type {
      margin-top: 0;
    }
  }
`;

export default MiCoinDetails;
